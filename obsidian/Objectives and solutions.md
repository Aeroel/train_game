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