import { Add_Some_Entities_To_The_World } from "#root/Entities/Add_Some_Entities_To_The_World.js";
import { Game_Loop } from "#root/Game_Loop.js";
import { Server_Creation } from "#root/Server_Creation.js";
import { Socket_Processor } from "#root/Socket_Processor.js";

const { httpServer, io } = Server_Creation.getHttpServerAndIO();

io.on("connection", (socket) => {
  Socket_Processor.onNewConnection(socket);
  Socket_Processor.onDisconnect(socket);
  Socket_Processor.onMovement(socket);
});

const arbitrary_number = 3000;
const port = arbitrary_number;

httpServer.listen(port);
console.log(`Started a server on port ${port}.`);

// add test entities
Add_Some_Entities_To_The_World.doItNow();

// Start the loop
Game_Loop.theLoop();
