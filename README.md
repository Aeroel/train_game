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


**Running client and server**

How to install on Windows or Android:
First of all, for android I need termux with node installed.
The steps are pretty much identical on windows and android
0. Nodejs needs to be installed... I use pnpm instead of npm, so after installing node, use npm to install pnpm. For dev I use tsc and nodemon.
Example of how to install in termux (on windows I guess you can just manually get nodejs from its website or use a random package manager):
0.1 pkg install nodejs
(installing nodejs will also auto-install npm)
0.2 npm install -g pnpm
(to update pnpm easiest less bothersome thing to do is to type "npm upgrade -g pnpm". If I do pnpm self-update, it makes pnpm create it's own separate folder,
this causes two clones of pnpm, one from npm and another from pnpm. I think it is possible to remove npm's one, leaving only pnpm's, enabling me to do pnpm self-update.
Overall, this is a little troublesome, so maybe easier to stick to updating pnpm through npm? I dunno.)
0.3 pnpm install -g http-server
0.4 pnpm install -g nodemon
0.5 pnpm install -g typescript

1. Clone repo
2. Go inside the repo directory using
something like "cd repoName"
3. Cd into "server" folder and run "pnpm install"
4. Run "tsc" command
5. After tsc finishes (it gives no output, like no errors but build folder gets populated with js files) start node on "build/startThisToStartTheGameServer.js". 
Like this, maybe:
"node build/startThisToStartTheGameServer.js"
6. Then in a new terminal tab cd into repo folder and do something like "http-server client/." This will serve client's html contents on localhost.
Well, these are all the steps so far. Now just go to the localhost where the html http-server started.

For development, to start server I open two terminal tabs, in first cd into server dir and type
"tsc --watch"
In the second tab run "nodemon --watch build/. build/startThisToStartTheGameServer.js"
"
So this will make tsc  watch all .ts files in server. When I, for example, write new code in some file, tsc will automatically place updated js files
(after converting .ts files' contents into js code) in build folder; and nodemon, monitoring the build folder for changes will restart the server seeing new contents.
Using tsc --watch seems to be faster than manually running tsc each time (I mean, I am not talking about convenience here but about the speed with which tsc compiles. For some reason,
--watch'ing seems to exhibit much faster ts-to-js operations than just running tsc. Running tsc by itself is annoyingly slow, by the way, as far as I can tell, 
though the incremental flag in tsconfig seems to make it quicker.)



**Stuff I find odd**:
When I press left or right, the movement seems responsive, but if I press up or down, sometimes it seems like the request to move is ignored, feels kinda unresponsive and bad/meh. Why this happens, I am not sure since I do not fully understand the movement system I put in place.
