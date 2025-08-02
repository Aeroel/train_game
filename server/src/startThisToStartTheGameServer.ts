import { Add_Some_Entities_To_The_World } from "#root/Entities/Add_Some_Entities_To_The_World.js";
import { Game_Loop } from "#root/Game_Loop.js";
import { Server_Creation } from "#root/Server_Creation.js";
import { Helper_Functions } from "./Helper_Functions.js";

const httpServer = Server_Creation.create();
const arbitrary_number = 3000;
const port = arbitrary_number;
      httpServer.listen(port);

const LANIP = Helper_Functions.getLocalIP();
const localhostIP = "127.0.0.1";
console.log(`Started a server on port ${port}.`);
console.log(`LAN IP: ${LANIP}:${port}`);
console.log(`localhost IP: ${localhostIP}:${port}.`);

// add test entities
Add_Some_Entities_To_The_World.doItNow();

// Start the loop
Game_Loop.theLoop();
