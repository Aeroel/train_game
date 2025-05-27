**General**

Okay, so I will describe the general idea of the project itself:
there are train tracks. Trains move on them like a metro basically. They stop at train stations and so on, you get the idea.
There are fences around train tracks so players can't get on the tracks, 
and each station has sliding doors and wall barriers next to tracks to prevent people from "falling"on /waling on train tracks for safety.
The trains sync their stopping positions so a train cars' doors are aligned to a station's platform's doors
so the people can safely enter the train cars without ever being able to jump down to the rails.
The doors of the train and the platform then close back and train goes to its next station. You get the idea, I guess...


**Implementation**

So, this full functionality described isn't quite implemented yet.
It is quite close.
I guess what's left is 
1. actually turning walls/doors into solids a players can't move through and 
2. Implementing trains and stations (this is mostly a matter of assembling all existing components in a specific way, as far as I can tell. The basic components themselves are implemented.
So, this is almost done, I suppose)
3. Implementing timers on each station showing approximate time of arrival of trains. Also quite simple, I suppose.

Once these three are done, I suppose the basic idea will be fully complete, yay!

**Player control**

On mobile, there is a joystick, on PC movement is accomplished using WASD and/or arrow keys.

** Installation **
First of all, you need NODEJS installed, of course... Also, I am using PNPM.

1. Install typescript and http-server globally using "pnpm install -g typescript http-server"
"-g" means "globally"
2. This step is done...

** Running client **
1. CD into client folder.
2. Run "pnpm install"
3. Run "pnpm run build" to generate the Webpack bundle consisting of compressed JS (which was converted from TS in client/src folder).
4. Run (from within client folder) "http-server public/. -c -1".
Description:
"public/." means "serve files from the public folder.
"-c -1" means "Do not cache contents of public folder (otherwise, an annoying situation can occur whereby when you edit code or html and reload the webpage to see any changes, the content is cached by browser, causing confusion)

5. Done... The client is now started. You can go on 127.0.0.1:8080.

**Running Server**

1. CD into server folder.
2. Run "pnpm install" 
3. Run "tsc" (Runs typescript compiler to convert TS in server's src folder into JS which will be placed in the server's build folder)
4. Run "node build/startThisToStartTheGameServer.js"
5. The server is now running...

** Development **

Install nodemon "pnpm install -g nodemon"

When working on the server I open two terminal tabs, in first I cd into the server dir and type "tsc --watch". 
In the second tab run "nodemon --watch build/. build/startThisToStartTheGameServer.js"
"
So this will make tsc  watch all .ts files in the server folder. 
When I, for example, write new code in some ts file, tsc will automatically place updated js files in build folder. Then, nodemon, monitoring the build folder for changes, will restart the server seeing new/modified js content inside it.

Using tsc --watch seems to be faster than manually running tsc each time (I mean, I am not only talking about convenience here but about the speed with which tsc compiles. For some reason,
--watch'ing seems to exhibit much faster ts-to-js operations than just running tsc. Running tsc by itself is annoyingly slow, by the way, as far as I can tell, 
also the incremental flag in tsconfig seems to make it quicker.



**Stuff I find odd**:
When I press left or right, the movement seems responsive, but if I press up or down, sometimes it seems like the request to move is ignored, feels kinda unresponsive and bad/meh. Why this happens, I am not sure since I do not fully understand the movement system I put in place.
