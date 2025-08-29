import type {Direction, Position, 
Collision_Time_And_Normal, Simplified_Enity, Collision_Info, Normal, 
Box} from "#root/Type_Stuff.js";
import{Collision_Stuff} from "#root/Collision_Stuff/Collision_Stuff.js"
import type {Base_Entity} from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import { World_Tick } from "#root/World_Tick.js";
import{My_Assert} from "#root/My_Assert.js"


export { Sweep };


class Sweep {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity): Collision_Info | null {
    const primary = this.implementationCode(a, b);
    if(!primary) return null;
    const info = {...primary, entityA:a, entityB:b} 
    return info;
  }

  private static implementationCode(a: Base_Entity, b: Base_Entity): Collision_Time_And_Normal | null {

     const collision =  this.codeByGPTWrapper(a, b);
     if(collision) {
      /* console.log(collision, {
        a: Collision_Stuff.entityToBoxWithVelocity(a), b: Collision_Stuff.entityToBoxWithVelocity(b)
       })*/
     }
     return collision;
  }
  
  private static codeByGPTWrapper(a: Base_Entity, b: Base_Entity ): Collision_Time_And_Normal | null{
    const rectA= Collision_Stuff.entityToBoxWithVelocity(a);
    const rectB= Collision_Stuff.entityToBoxWithVelocity(b);
    const dt = World_Tick.deltaTime;
     const toLog= myCCD(rectA, rectB);
     return toLog;
  }
  
  

}




interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
}


interface CollRes {
  normal: Normal, time: number
}



function myCCD(a: Rect, b: Rect): null | CollRes {
  My_Assert.that(a.width >0 && a.height > 0 && b.width > 0 && b.height > 0);
  My_Assert.that(
    Number.isFinite(a.width) &&
    Number.isFinite(a.height) &&
    Number.isFinite(b.width) &&
    Number.isFinite(b.height) 
    )
  let time = 0;
  const normal: Normal = {x:0,y:0}
  const result: CollRes = {normal, time}
  const initialCollision = testInitialCollision(a, b)
  if(initialCollision) {
    // if they collide or overlap initially, then let's return time 0 normal 0,0
    return result;
  }
  const bothAreStationary = testIfBothAreStationary(a,b)
  if(bothAreStationary) { 
    // if they passed the initialCollision test yet are stationary then no collision can logically occur.
    return null;
  }
  
  const res = myCCDSweep(a, b);
  return res;
  return null
}


function testInitialCollision(a: Rect, b: Rect) : boolean {
  
  return Collision_Stuff.static_No_Velocity_Collision_Check(a, b);
}
function testIfBothAreStationary(a: Rect, b: Rect) : boolean{
  return a.vx === 0 && a.vy===0 && b.vx===0 && b.vy===0;
}
function myCCDSweep(a: Rect, b: Rect) : null| CollRes{
   const dx = World_Tick.deltaTime * a.vx;
  const dy = World_Tick.deltaTime * a.vy;
  let entryTimeX, exitTimeX, entryTimeY, exitTimeY;
  
  if(dx ===0) {
   if(a.x < b.x + b.width && b.x < a.x + a.width) {
     	entryTimeX = Number.NEGATIVE_INFINITY;
			exitTimeX = Number.POSITIVE_INFINITY;
   } else {
     return null;
   }
   } else {
     let entryDistanceX;
     		if (dx > 0) {
			entryDistanceX = b.x - (a.x + a.width)
		} else{
			entryDistanceX = a.x - (b.x + b.width)
   }
   	entryTimeX = entryDistanceX / Math.abs(dx)
   	let exitDistanceX;
   		if (dx > 0){
			exitDistanceX = b.x + b.width- a.x
		} else {
			exitDistanceX = a.x + a.width- b.x
     		}
     	exitTimeX = exitDistanceX / Math.abs(dx)
   }
   // y
  	if (dy == 0) {
		if (a.y < b.y + b.height && b.y < a.y + a.height) {
			entryTimeY = Number.NEGATIVE_INFINITY
			exitTimeY = Number.POSITIVE_INFINITY;
		} else {
			return null
		}
	} else {
		let entryDistanceY
		if (dy > 0) {
			entryDistanceY = b.y - (a.y + a.height)
		} else {
			entryDistanceY = a.y - (b.y + b.height)
		}
		entryTimeY = entryDistanceY / Math.abs(dy)
		let exitDistanceY
		if (dy > 0) {
			exitDistanceY = b.y + b.height- a.y
		}else{
			exitDistanceY = a.y + a.height- - b.y
		}
		exitTimeY = exitDistanceY / Math.abs(dy)
  }
  
  // now final stretch
  	if(entryTimeX > exitTimeY || entryTimeY > exitTimeX){ 
  	  return null
  	  
  	}
	let entryTime = Math.max(entryTimeX, entryTimeY)
	if (entryTime < 0 || entryTime > 1) {
	  return null
	}
	let normalX=0;
	let normalY = 0;
	if (entryTimeX > entryTimeY) {
		normalX = dx > 0 && -1 || 1
	}else{
		normalY = dy > 0 && -1 || 1
	}
	console.log({
	  entryTimeX, entryTimeY, normalX, normalY, exitTimeX, exitTimeY, entryTime
	})
	return {time: entryTime, normal: {x:normalX, y:normalY}}
  
  return null
}

/*

local function sweep(a, dx, dy, b)
	local entryTimeX, exitTimeX, entryTimeY, exitTimeY
	if dx == 0 then
		if a.x < b.x + b.w and b.x < a.x + a.w then
			entryTimeX = -math.huge
			exitTimeX = math.huge

		else
			return false
		end
	else
		local entryDistanceX
		if dx > 0 then
			entryDistanceX = b.x - (a.x + a.w)
		else
			entryDistanceX = a.x - (b.x + b.w)
		end
		entryTimeX = entryDistanceX / math.abs(dx)

		local exitDistanceX
		if dx > 0 then
			exitDistanceX = b.x + b.w - a.x
		else
			exitDistanceX = a.x + a.w - b.x
		end
	
		-- and the exit time is just distance / speed again
		exitTimeX = exitDistanceX / math.abs(dx)
	end
	-- now we'll do the same for the y-axis.
	if dy == 0 then
		if a.y < b.y + b.h and b.y < a.y + a.h then
			entryTimeY = -math.huge
			exitTimeY = math.huge
		else
			return false
		end
	else
		local entryDistanceY
		if dy > 0 then
			entryDistanceY = b.y - (a.y + a.h)
		else
			entryDistanceY = a.y - (b.y + b.h)
		end
		entryTimeY = entryDistanceY / math.abs(dy)
		local exitDistanceY
		if dy > 0 then
			exitDistanceY = b.y + b.h - a.y
		else
			exitDistanceY = a.y + a.h - b.y
		end
		exitTimeY = exitDistanceY / math.abs(dy)
	end
	--[[
		now we have the separate time ranges when rectangles A and B
		overlap on each axis. the time range when they're actually colliding
		is when both time ranges overlap. if the time ranges never overlap,
		there's no collision. we can check this the same way we check
		for overlapping boxes.
	]]
	if entryTimeX > exitTimeY or entryTimeY > exitTimeX then return false end
	local entryTime = math.max(entryTimeX, entryTimeY)
	if entryTime < 0 or entryTime > 1 then return false end
	local normalX, normalY = 0, 0
	if entryTimeX > entryTimeY then
		normalX = dx > 0 and -1 or 1
	else
		normalY = dy > 0 and -1 or 1
	end
	return entryTime, normalX, normalY
end
*/