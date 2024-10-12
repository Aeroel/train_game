**Objective**: When I open the game the player character appears in the middle of the canvas. The canvas dimensions are h 1000 w 1000. When I move the player character, it remains in the middle, the environment shifts, though. When I go to edge of map, I still remain in the middle. Let's say I am standing at x 0 y 0. This looks like this: Well,  the PC is middle. Middle represents the x 0 y 0. Negative x and y can be used to represent the non-existed map on negative x and/or y. So, the only half of the map which represents actual map on the canvas in the case of me standing at x 0 y 0 is the bottom right side, which represents x1 y 2 and so on.
**Solution**: Canvas width and height are 1000. Middle of canvas is 500. The PC always stands on the canvas 500, irrespective of it's position in the world. To extract all visible objects I query the server for objects based on the player's current position. I then adjust the position of objects in terms display them on the canvas. How does this work? Say, player is on position 500, 500. This, incidentally is the same position it always has on the canvas. Okay, say player moves now to position 1500. There are objects on around 1700. This is within the vision range of player. The server thus gives an array of objects to client. Now, what needs to happen during display phase is adjustment of sorts to map real positions to canvas positions. Player must always be in center of canvas. On canvas player is always at 500 500 I can do something like this, maybe?: 1500-1700 = neg 200. I flip the sign to be positive. I get 200. I now know the position of the 1700 objects on canvas which is equal to 500+200 = 700. Okay, this seems accurate. Does this work for objects on 1200?  Let's see if this formula will work...
1500-1200 = 300. I flip the 300 and get neg 300. I add 500 + (neg 300) And get 200. Okay, so this does seem to work. 

**So the formula of converting real world pos to canvas pos is: middle of canvas + (flip sign of (player object position \[minus\] object position))**

This works, I mean, this is to be applied to both x and y, and should work the same for both, right?
So, in a 1000 x and 1000 y canvas, and 1500 x and 1200 y position of PC and an object of position 1700 and 1700 I would do this:
canvasWidth = 1000
canvasHeight = 1000
objX = 1700
objY = 1700
middleCanvasX = canvasWidth/2;
middleCanvasY = canvasHeight/2;
playerPosX = 1500;
playerPosY = 1200;
objCanvasX = (middleCanvasX + flipSign(playerPosX - objX)); // 
/\*
so, flipSign(1500 - 1700) = -200 = 200
500 + 200 = 700 = objcanvasx
 and for y
 1200 - 1700 = -500 = 500
 500 + 500 = 1000 = objcanvasy
 Okay, does this make sense? So, on canvas, the position of this object would be x 200 y 1000... So somewhere... Bottom left?
 Wait, how about I look at this from another perspective... If it is another perspective? Well, anyway. 
 My PC on position 1500 and 1200 x y respectively. X is width y is height. So, to the right of the PC x goes like 1501 and so on... To the left 1499... Above it y goes 1199 and below 1201... So, the object 1700 1700... Is to the right of the PC on x lane and below PC on the y lane.
 Okay, visually this is how it should look. Does the formula correspond to that?
 Okay, so x 500 and x 700. To the right, checks out on x lane
		y 500 y 1000 Below PC on y lane.
Okay, I think this seems to checkout, so I guess this is how this would be implemented, then?
\*/

objCanvasX = (middleCanvasY + flipSign(playerPosY - objY)); //


2. Objective: 