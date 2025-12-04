**General**

It is a train/metro game. Trains are moving from station to station. 
There are walls around the rails for safety reasons (that is to say, for make-believe safety reasons, since this is not the real world, but the point is it is a toy model based on real life). Each station has walls separating the railway and the platforms. Inside the walls there are sliding doors. The passengers do not have access to the rails since the doors open only when the train arrives, allowing the passengers to enter.
Generally, it was a good practice project. I had an idea of making an RTS game but was not sure how to implement it. Here, I started frol small steps of just having two object to this impressive train world. So, now I can imagine concrete steps for a 2d RTS or other games which is cool.

**Implementation State**

I am quite close to implementing this general idea described above.

I guess what's left out of what I originally was planning to implement is:

1. Fully furnishing each station. It is a bit tricky manually placing the small objects like doors and sensors and so on. Tricky in a sense of being messy and tedious. I may consider automating this (I think it should be posaible and not too difficult). Anyway, even if I will feel too lazy to think about the automation logic, I guess I can just plough through the tedious manual placement in the worst case scenario.
2. I also want to implement the timers. So, each station has two timers for both directions, they inform the passengers when the train will arrive. Relatively straightforward, feels a bit tricky and requires some thinking.

I am planning on doing at least the minimum of some little code improvements before embarking on completing this. The reason for this is that I feel a lot of mental strain while working on this. Perhaps going over the code and making small improvements might help me here? Or are there other reasons for the mental difficulties? How do I address this issue in general? Do I need to type less and sit still and think more?

Another concern is the collision detection. I have spent many hours mindlessly trying to figure it out and some hours trying to think. Eventually I figured out a way to implement 2d swept detection, which I like, it works well. But the resolution of collisions is tricky. I have decided to just use the simplest logic, which allows for various glitches, since the time spent without much solutions and the intense anxiety did not seem worth it. I did not think it is a good use of my time. So, currently, the collision resolution (when players touch walls or trains) is far from how I would prefer it to be, but it works to some extent. I am satisfied, on the other hand, about the collision detection.

**Player character control**

On mobile, there is a joystick.
On PC, movement is accomplished using the typical set of WASD and arrow keys. I mainly did the testing on the phone. I am not 100% sure if I have fully implemented all currently existing actions like enabling/disabling intangibility and speeding up and opening/closing console as keyboard keys, but at any rate all of these are available for the touchscreen, which means I can just click on them using mouse. Although if I were to add touchscreen specific actions like dragging or something, I would perhaps have to create a keyboard equivalent that might look different?

**Preliminary Installation**

First of all, you need NODEJS installed, of course... Next step is install packages for client and server.

1. Go to server folder and run "pnpm install".
2. Go to client folder and run "pnpm install".

**Running client**

1. Go into client folder.
2. Run "pnpm run dev:webpack".
3. Run "pnpm run dev:http-server"
4. Done... The client is now started. You can go on 127.0.0.1:8080 to see the result. You will see a field asking you to enter the ip address of a server to connect to, etc. By default, it would be 127.0.0.1:3000.

**Running Server**

1. Go into server folder.
2. Run "npm run dev:tsc"
3. Run "npm run dev:server"
4. The server is now running on localhost:3000...

**Connecting to server**


![ip_field](https://github.com/user-attachments/assets/0f5a1518-683f-4f93-8304-534a3f5ed50a)

If you just started the server on the same local machine, then you can enter "127.0.0.1:3000" in the client's ip field. 
(3000 is the default port of the server.)

You can also connect to a server on another device on your local network. For example: If you started a server on your phone (using termux, for instance) and want to connect from another device like your PC, you could have both (or more) devices either be connected to the same WI-FI or to the same hotspot. So, then, you simply find the local IP of the device where the server is running. It could, for example, look something like "192.168.1.243". So, in that case, you could enter "192.168.1.243:3000" to connect. You can google how to find what your server's local IP actually is.

And, of course, it is possible to connect to servers running on remote devices. For example, you have started the server on a remote machine, like, for example, a random VPS; you would get the machine's global (public) IP address and enter it in the IP field.
For example, "1.2.3.4:3000" (instead of 1.2.3.4 you would enter your remote machine's public IP address).

I have noticed that if my phone has a VPN on while I am using the Hotspot method, then there is no connection between the devices. So, disabling vpn or maybe fiddling with IP range exceptions in some VPN apps, I dunno.