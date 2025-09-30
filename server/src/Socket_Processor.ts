export { Socket_Processor }
import type { Undesirable_Hardcoded_Socket_Type } from "#root/Socket_Type_Stuff.js" 
import { Socket_Functions } from "./Socket_Functions.js";
import { My_Assert } from "#root/My_Assert.js";
import { SocketDataStorage } from "#root/SocketDataStorage.js";
import { Settings } from "#root/Settings.js";
import { Player } from "./Entities/Player.js";
import { World } from "./World.js";
import { Helper_Functions } from "./Helper_Functions.js";
import { Typed_Object_Keys, type Direction } from "./Type_Stuff.js";
import { World_Tick } from "#root/World_Tick.js"
import { Command_Console }  from "#root/Console/Simple_Console.js"

 type Control_Keys = {
            movement: (Direction)[],
            speedUp: boolean,
            zoom: "in" | "out" | "no_change",
            intangibility: boolean,
        }


class Socket_Processor {
    static onNewConnection(socket: Undesirable_Hardcoded_Socket_Type) {
        console.log("A socket connected");
        Helper_Functions.Run_This_Function_Upon_Initiation_Of_A_Socket_Connection(socket);
        socket.emit("welcome", "You have successfully connected to the server. Welcome!");
        const newPlayerEntity = new Player();

        newPlayerEntity.setWidth(25);
        newPlayerEntity.setHeight(25);
        newPlayerEntity.setVisionRange(5000);

        newPlayerEntity.setSocketId(socket.id);
         newPlayerEntity.readSavedState();
        World.addEntity(newPlayerEntity);
       this.consoleStuff(socket, newPlayerEntity)

    }

static consoleStuff(socket:Undesirable_Hardcoded_Socket_Type, player: Player){
  socket.emit("consoleMessages",Command_Console.welcomeMessages)
    socket.on("consoleCommand", (cmd: string)=>{

     const result= Command_Console.executeCommand(cmd, socket);
      socket.emit("consoleMessages", 
      [`You sent the command: ${cmd}`,
      `Result:\n ${result.message}`
      
      ])

    })
}
    static onPing(socket: Undesirable_Hardcoded_Socket_Type) {
      socket.on("ping", ()=>{
      const currTime = Date.now();
      if(Socket_Functions.pingOnCooldown(socket, currTime)) {
        return;
      }
      
      SocketDataStorage.set(socket, "lastPingTimeMs", currTime)
        socket.emit("pong","pong")
      })
    }
    
    
    static onDisconnect(socket: Undesirable_Hardcoded_Socket_Type) {
        socket.on("disconnect", () => {
            Helper_Functions.runThisUponSocketDisconnect(socket);
        })
    }


    static onControl(socket: Undesirable_Hardcoded_Socket_Type) {

        socket.on("controlKeys", (receivedControlKeys: Control_Keys) => {
            const playerAssociatedWithSocket: Player = <Player>World.getEntities().find((entity) => {
              if(!(entity.hasTag("Player"))) {
                return false;
              }
              const player = <Player>entity;
              return player.socketId === socket.id});
              My_Assert.that(playerAssociatedWithSocket !== undefined);
            this.movement(playerAssociatedWithSocket, receivedControlKeys.movement, socket);

            this.speedUp(playerAssociatedWithSocket, receivedControlKeys.speedUp);
            this.zoom(playerAssociatedWithSocket,
            receivedControlKeys.zoom);
            this.intangibility(playerAssociatedWithSocket, receivedControlKeys.intangibility);
            
        });
    }
    
    static zoom(playerAssociatedWithSocket: Player, zoom: Control_Keys["zoom"]) {
     const validInput = (["no_change","in","out"].includes(zoom));
     const changeRequested = !(zoom==="no_change");
     if(!validInput || !changeRequested) {
        return;
      }
      const minVisionRangeIWillAllow = 100;
      const maxVisionRangeIWillAllow = 5000;
      const changePerRequest = 500;
      let possibleVal = 100;
      switch(zoom) {
        case "in":
           possibleVal = playerAssociatedWithSocket.visionRange + changePerRequest;
          if(possibleVal > maxVisionRangeIWillAllow) {
            return;
          }
        break;
        case "out":
          possibleVal = playerAssociatedWithSocket.visionRange - changePerRequest;
          if(possibleVal < minVisionRangeIWillAllow) {
            return;
          }
        break;
      }
       playerAssociatedWithSocket.visionRange = possibleVal;
      
    }
    
    
    static speedUp(playerAssociatedWithSocket: Player, speedUp: Control_Keys["speedUp"]) {
        if (speedUp !== playerAssociatedWithSocket.speedUp) {
            playerAssociatedWithSocket.swapSpeedUp();
            console.log("speedup swap");
        }
    }
    
    
    static intangibility(playerAssociatedWithSocket: Player, intangibilityState: Control_Keys["intangibility"]) {
        if (intangibilityState === playerAssociatedWithSocket.intangibility) {
           return;
        }
            playerAssociatedWithSocket.swapIntangibility();
            console.log("intangibility swap");
    }
    
    
    static movement(playerAssociatedWithSocket: Player, movementKeys: (Direction)[], socket: Undesirable_Hardcoded_Socket_Type) {
        // check that receivedMovement is what we expected... If not, ignore it, I guess
        if (!Array.isArray(movementKeys)) {
            return;
        }
        /*
        Presumably, someone spamming movement requests does not receive any advantages. So, this cooldown is implemented mainly for fun.
        The idea is we don't want the server to process too many movement requests from a client in a short time period, that would be pointless. Although neither does this cooldown really affect much, since all that happens if no cooldown is present is flipping control key bits to true... 
        */
        if (Socket_Functions.Is_Movement_Request_Functionality_On_Cooldown(socket)) {
            return;
        }
        Socket_Functions.A_Movement_Request_Happened_Just_Now(socket);


        // const playerPossibleMovementDirections: string[] = Object.keys(playerAssociatedWithSocket.controls);
        const playerPossibleMovementDirections = Typed_Object_Keys(playerAssociatedWithSocket.controls);
        playerPossibleMovementDirections.forEach(direction => {
            playerAssociatedWithSocket.controls[direction] = movementKeys.includes(direction);
        });
    }
}

