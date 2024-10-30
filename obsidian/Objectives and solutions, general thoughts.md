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


2. Objective: There's a wall object/entity and a player entity or other type of agent entity which is non player. For now none of them can pass through walls, it must stop them (I might want to add  special abilities to walk through walls but not for now, for now I simply want the player object and walls to interact pretty much like a person and a normal wall in real life. If I move the player object against the left side of the wall, the player object must stop at the edge of the wall... Well, you get the idea, I suppose)
3. Solution: Если мне нет дела до того, что если стены будут слишком тонкими по сравнению с шагом игрока, что может приводить к телепортации сквозь, то просто проверять на наличие коллизий на х и у по отдельности и если на том или ином обнаружена, то расчитать к какому краю объекта игрок ближе и поставить на край этого края новую позицию игрока, то есть, по идее, вернув игрока назад, что визуально будет расцениваться как столкновение со стеной и невозможность пройти сквозь. Однако, если стена толщиной 4 пикселей, а шаг игрока 2 или 3, например, то он может телепортироваться на другую сторону. В принципе можно не обращать на это внимание и делать стены толще и/или шаг игрока ниже. 
4. А может есть и другие способы. Ну, не может, а точно
5.  Другой способ это сохранять предыдущие, допустим, 3 позиции игрока на х и у ( то есть в итоге сохраняем шесть чисел) (или любого другого движущегося объекта). При обнаружение столкновения со стеной на х или у (они отдельны, по сути, друг от друга, для примера скажем столкновение на х, но и на у точно так же) ставим игрока в предыдущую позицию и убираем эту позицию из массива, и также на следующем тике, например, продолжив симулацию, если есть еще коллизия, то ставим позицию игрока на последную позицию и удаляем её из массива. Конечно, в итоге это все равно идет так, что будет зависеть от шага и толщины стены и количестве сохраненных предыдущих позиций, но, думаю, три-четыре сохранений будет достаточно, что бы предотвратить прохождение сквозь стены. А как в этот массив позиций добавляются новые результаты, то? Ну, во-первых, проверка на столкновение  может осуществляться до любых операций передвижения. А когда игрок движется, то сохраняются предыдущие, точнее, за один тик одно передвижение, предыдущая, позиция. На следующем тике (как и на всех остальных, но представим что на этом столкновение) мы используем предпозицию и возвращаем игрока обратно... Игрок идет в стену опять на третьем тике, мы ставим его предыдущую позицию опять на ту, что была ранее (до того. как он попал в стену). И далее, на четвертом тике мы, как я ранее писал, проверяем сначала на столкновения. Если есть, то мы делаем опять же весь этот процесс. Опять же на этом же тике далее игрок идёт в стену. Сохраняем предыдущую позицию, и на следующем предотвращаем нахождение в стене и так далее... Наверное так будет работать. Конечно, можно проверять два раза за тик на столкновения, то есть сначала и потом после возможного перемещения. Как тогда будет выглядеть тут логика? Ну, удаление позиции из массива по идее будет только если произошло столкновение. А добавление в этот массив только по смене позиций... Ну... И что, хорошо ли эта логика будет работать? Точно не уверен,  надо подумать/ментально симулировать и/или посмотреть/поэкспериментировать. Вообще, по-идее это зависит и от системы перемещения, не так ли? Или нет? Опять же, надо подумать. На данный момент я просто ставлю плюс минус х или у. 

Hm, so regarding collision.
One method I could use is this:
In the player movement method, whenever a player moves, say, arrow left (at first glance seems to work pretty much the same except minor operational differences for all four move commands):
1. I make an array possiblePositions. I fill it with one element which is  player.x + stepDistance.
2. I loop over all entities. For each entity I loop over about stepDistance times each time checking whether player.x + loopIteration causes collision. If yes, I add the detectedX - 1 to possiblePositions.
3. Same for every other entity, because a closer entity might appear later.
4. After I finish this process I have an array of possiblePositions. It will contain a single element stepDist if no collisions occurred, or one/more than one if at least one collision occurred. I select from this array either the only value or if there are multiple, then the value closest to the original player.x. This is what I set the player.x to be.
I think this should work alright?
Solution: Well, I seem to have settled on simply simulating each subStep of a step of the player against every wall entity and setting it to closest encountered entity's edge, so basically now irrespective of the step size, the player will not teleport through any walls


Objective: The player has a forcefield around them. Whenever a projectile makes contact with it, the projectile's direction is reversed. 
Solution: Well, the basic idea is simple enough to implement, I suppose. I mean, all that is really needed is to make an entity called projectile or something. Then, I will add to it a property direction x and direction y or something like direction property... With values like left up down right. So, I spawn the projectile on the same y axis as the player and then add the "left" direction to the projectile's direction property. On every tick of the projectile it will move accordingly, just as with player. (Probably should make the movement code be shared, so maybe put in into movingEntity subclass of Entity and make both projectile and player be subclasses of movingEntity)
When the projectile makes contact with the player's forcefield... Well, the way this will be implemented is the forcefield, on each of it's tick() will check if it collides with anything, that is to say if anything touches it. If yes, then it will switch up it's direction. If, for example, the projectile has direction value of \["left"\], it turns it to \["right"\], if \["up", "right"\] then to \["down", "left"\], etc.


General thoughts: 
Later, or in general, I think a different architecture is needed. Well, I don't know about the word "architecture". What I mean is, a different program structure. Currently I have a hodge-podge where player ("client") sending control requests and world simulation and world rendering are all mixed together. Generally, whether I want cleaner code and/or multiplayer support I would need to rewrite or generally write the program structure like this:
1. World simulation. Completely separate from everything else, except it accepts commands and requests from clients and the simulation might choose to alter it's course depending on them.
2. World rendering. The simulation will send to the renderers (for example, if singleplayer game, then to it's single conceptual client or if multiplayer then to multiple clients) data about world state of every tick.
3. The control requests from client(s) to the simulator.
Basically, the 1 is server and 2 are/is clients/client.
What needs to be adjusted to implement this structure?
Well, I need to use some algorithm to display visible parts of entities whose base x and y are outside the client's vision range. for example, if I have a very tall object, say, with height 1000 and the client must be able to see, say, a small part of it, like it's bottom or something. Currently, if I were to simply split the logic into server/client even though collision on all entities would work, they would be invisible if their bases are outside the range (the reason why this problem does not exist now is I think because I simply render all entities at once even if some of them are not within the visible range. Unlike server, which would have to send data to players strictly based on it's current position and vision range). I asked chatGPT about this issue and it seems there is some complex looking but relatively short method to implement this. And I guess this is actually the only mildly challenging part in changing the program structure from mixed to server-client? Seems so. Well, I guess it's not exactly challenging, how it is likely to be solved when I will be solving it is I will just copy-paste GPT code and voila. Anyway... 

For now, though, I will just implement  simple stuff... Or should I? Or should I, rather, restructure the code now?
Question: Is it possible to make the server component completely interchangeable between  being located as an html5 game component or as a nodejs server side component interacting with browser using, say, socket.io? I guess the simulation logic would be identical, but the interfacing (I mean, communication) would still be different? Or can it be made exactly identical? Well, I think that even if it won't be the same, I think I can abstract it away in a communication/interfacing layer and the main part, i.e. the world simulation logic would remain exactly the same irrespective of whether I make it into a singleplayer or a multiplayer game.


Hm, having some trouble with... Collision. How do I implement collision for two moving objects?
I could create arrays based on each object's current direction.
possible movingInDirections: left, right, left-up, left-down, right-up, right-down. entity has {properties x, y, movingInDirections, singleMovementDistance}
six possible movement states... If I make a function which can take in (entity) to output [positions inbetween...]...
for example (500, 5, right) would give [{x: 500, y:100}, {x: 501, y: 100}, {x: 502, y:100}, {x: 503, y: 100}, {x: 504, y: 100},  {x: 505, y: 100}, ] (entity's original position at this point is x 500 y 100)
Well, I guess the logic here is clear enough... If I give the same input but direction is "right down" you can guess the output, y would also be changed in each object 100, 101, 102 etc.
And what can I do with this function?... Well, I also need a function to see if any element in one object is identical to any element in the other object.
Basically the algo would be:
1. generate two object arrays for two moving objects
2. compare them
3. if true, they are colliding while moving, false otherwise

I guess this seems pretty... Bulletproof?

Entities have properties x, y, width, height, type. Moving entities have properties singleMovementDistance and movingInDirections. MovingInDirections is a Set which can contain either: one element "left" or one element "right" or two elements "up", "left" or two elements "up", right" or two elements "down", "right" or two elements "down", "left", or one element "up" or one element "down". On each game tick an entity might be standing (movingInDirections empty) or moving in some direction(s). Whenever a direction is in the set, I add or subtract, depending on what the direction is, from either x or y property singeMovementDistance depending on what the set contains. 
 I have a wall entity. Any other entity that collides with wall entity must be stopped just at the edge of the wall. 
 I have two other entity types: forcefield and projectile. A forcefield might be either standing or moving at any game tick. Same goes for projectile. The fact that any non-wall entity can be either standing or moving at any given time is important for the way collision stuff is implemented.
 To differentiate between entity types, I have a class property type. Walls have type "wall", projectiles type "projectile", forcefields type "forcefield", players type "player". A forcefield basically has the same position as player that attached with minor difference: it is 2 pixels biggers than the player so it's like perimeter of a  square surrounding the player square when I render it. Whenever a player moves, obviously the forcefield moves along with it.
 When a projectile touches forcefield, I want the projectile's direction to be reversed (it's set's elements to be reversed, if any. For example, right becomes left, up becomes down, no element remains no element). 
 Write js code which implements these things. All my entities are stored in a single array.

 Need to update collision expansion function: instead of the lowest positions length array expanding using last element, I want to equally fill each position... I mean, if I have array of entity moving from 1, 2, 3 ,4 5 up to ten and nother 1, 2, I don't want the second entity to be 1, 2  22222222..., I want five ones and five twos.
If entities moving collide I want to get info for each entity where they collide and x y of just before the collision xy were reached. For instance, entity1 collides with entity2 when 1 is on 10, 10. I want the array to contain entity1{collides: true, where: 10, 10, 11, 11, etc, just before: 9,9, 10,10 (two move steps example given)}
This should make projectile/forcefield collisions more watertight, right?
