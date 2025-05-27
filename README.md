**General idea**

The idea is that there are metro trains moving around from station to station on two tracks (one for each direction) in a circular way.
Each station has two platforms, of course, for each track. The tracks and stations are surrounded by walls so people cannot get on the tracks or, like, fall off the platform. 

Each platform has several doors. When a train stops at the station, it aligns its doors with the platform's doors. Both open in sync, creating a safe tunnel for people to pass through without ever gaining access to the ability to fall on the rail tracks.
Outside the stations, the rail tracks are also fenced out.

**Implementation State**

I am quite close to implementing this general idea described above.

I guess what's left is:

1. Implementing trains and stations (this is mostly a matter of assembling all existing components in a specific way, as far as I can tell. The basic foundational components themselves are implemented. So, this is almost done, I suppose)
2. Implementing timers on each station showing approximate time of arrival of trains. Also quite simple, I suppose.

Once these are done, I suppose the basic idea will be fully complete, yay!

**Player character movement control**

On mobile, there is a joystick.
On PC, movement is accomplished using the typical set of WASD and/or arrow keys.

**Preliminary Installation**

First of all, you need NODEJS installed, of course... Also, I am using PNPM.

Install typescript and http-server globally using "pnpm install -g typescript http-server"
"-g" means "globally".
Typescript is used for enabling  the use of Typescript, including in Webpack (I think).
Http-server is used to serve client page.

**Running client**

1. CD into client folder.
2. Run "pnpm install" to install all required packages.
3. Run "pnpm run build" to generate the Webpack bundle consisting (placed into public/build/bundle.js) of compressed JavaScript code (which was converted from Typescript code, which is located in client/src folder).
4. Run (from within client folder) "http-server public/. -c -1" to serve the client page.
Description:
"public/." means "serve files from the public folder.
"-c -1" means "Do not cache contents of public folder (otherwise, an annoying situation can occur whereby when you edit code or html and reload the webpage to see any changes, the content is cached by browser, causing confusion)

5. Done... The client is now started. You can go on 127.0.0.1:8080 to see the result. You will see a field asking you to enter the ip address of a server to connect to. I will describe this below, after we start the server itself.

**Running Server**

1. CD into server folder.
2. Run "pnpm install" 
3. Run "tsc" (Runs typescript compiler to convert TS in server's src folder into JS which will be placed in the server's build folder)
4. Run "node build/startThisToStartTheGameServer.js"
5. The server is now running...

**Connecting to server**
![ip_field](https://github.com/user-attachments/assets/0f5a1518-683f-4f93-8304-534a3f5ed50a)

Regarding this field asking you to enter the IP address of the game server to connect to:
If you just started the server on the same local machine, then you can enter "127.0.0.1:3000" in the client's ip field. 
(3000 is the default port of the server.)

You can also connect to a server on another device on your local network. For example: If you started a server on your phone (using termux, for instance) and want to connect from another device like your PC, you could have both (or more) devices either be connected to the same WI-FI or to the same hotspot. So, then, you simply find the local IP of the device where the server is running. It could, for example, look something like "192.168.1.243".

And, of course, it is possible to connect to servers running on remote devices. For example, you have started the server on a remote machine, like, for example, a random VPS, you would get the machine's global (public) IP address and enter it there.
For example, "1.2.3.4:3000" (where 1.2.3.4 is a placeholder for your remote machine's public IP address).
I think there's a possibility that you would have to open your VPS' ports or something along those lines before this would work, but I am not sure. This is beyond the scope of this text anyways, I suppose...

**Development**

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
