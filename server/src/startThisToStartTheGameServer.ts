import { Server_Stuff } from "#root/Server_Stuff.js";

import { Game_Loop } from "#root/Game_Loop.js";

import { Add_Some_Entities_To_The_World } from "#root/Entities/Add_Some_Entities_To_The_World.js";


Server_Stuff.createAndStartServer();

  
// add test entities
Add_Some_Entities_To_The_World.doItNow();
  
     Game_Loop.theLoop();
