**General idea**

It is a metro simulator "game". Trains are moving from station to station on parallel tracks.

The tracks, the railway as a whole are fenced out using walls, so people can't get in for safety reasons. Each platform has several doors near both tracks. Trains stop in alignment with doors so train doors and station doors open in sync, allowing people to walk inside train cars.

**Implementation State**

I am quite close to implementing this general idea described above.

I guess what's left is:

0. Collision detection/resolution needs to be improved. Currently it is not working properly. Have been trying to work on this for a while.
1. Implementing trains and stations (this is mostly a matter of assembling all existing components in a specific way, as far as I can tell. The basic foundational components themselves are implemented. So, this is almost done, I suppose)
2. Implementing timers on each station showing approximate time of arrival of trains. Also quite simple, I suppose.

Once these are done, I suppose the basic idea would be fully complete, yay!


**Player character movement control**

On mobile, there is a joystick.
On PC, movement is accomplished using the typical set of WASD and arrow keys.

**Preliminary Installation**

First of all, you need NODEJS installed, of course... Next step is install packages for client and server.

1. Go to server folder and run "npm install".
2. Go to client folder and run "npm install".

**Running client**

1. Go into client folder.
2. Run "npm run devwebpack".
3. Run "npm run devliveserver"
4. Done... The client is now started. You can go on 127.0.0.1:8080 to see the result. You will see a field asking you to enter the ip address of a server to connect to.

**Running Server**

1. Go into server folder.
2. Run "npm run devtsc"
3. Run "npm run devserver"
4. The server is now running...

**Connecting to server**


![ip_field](https://github.com/user-attachments/assets/0f5a1518-683f-4f93-8304-534a3f5ed50a)

If you just started the server on the same local machine, then you can enter "127.0.0.1:3000" in the client's ip field. 
(3000 is the default port of the server.)

You can also connect to a server on another device on your local network. For example: If you started a server on your phone (using termux, for instance) and want to connect from another device like your PC, you could have both (or more) devices either be connected to the same WI-FI or to the same hotspot. So, then, you simply find the local IP of the device where the server is running. It could, for example, look something like "192.168.1.243". So, in that case, you could enter "192.168.1.243:3000" to connect. You can google how to find what your server's local IP actually is.

And, of course, it is possible to connect to servers running on remote devices. For example, you have started the server on a remote machine, like, for example, a random VPS; you would get the machine's global (public) IP address and enter it in the IP field.
For example, "1.2.3.4:3000" (instead of 1.2.3.4 you would enter your remote machine's public IP address).
