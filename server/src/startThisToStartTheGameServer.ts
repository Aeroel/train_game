import { Server_Stuff } from "#root/Server_Stuff.js";

import { World_Tick } from "#root/World_Tick.js";

import { Add_Some_Entities_To_The_World } from "#root/Entities/Add_Some_Entities_To_The_World.js";


Server_Stuff.createAndStartServer();
World_Tick.beginTicking();

// add test entities
Add_Some_Entities_To_The_World.doItNow();