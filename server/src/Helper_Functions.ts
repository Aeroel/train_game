import { SocketDataStorage } from "#root/SocketDataStorage.js";
import { SocketStorage } from "#root/SocketStorage.js";
import { World } from "#root/World.js";
import type { Socket } from "socket.io";
import { networkInterfaces } from "os";
import type { Direction, Position, Face, Normal } from "#root/Type_Stuff.js";


export { Helper_Functions };
class Helper_Functions {


    static getLocalIP(): string {
        const nets = networkInterfaces();
        console.log(nets);
        if (nets['wlan0']) {
            return nets['wlan0'][1].address;
        }
        else if (nets['Wi-Fi']) {
            return nets['Wi-Fi'][0].address;
        } else if (nets['swlan0']) {
            return nets['swlan0'][2].address;
        } else if(nets["rmnet4"]) {
          return nets["rmnet4"][1].address;
         } else {
            return "Couldn't get LAN IP";
        }
    }

  // Helper: squared distance between two positions
  static distSq(a: Position, b: Position): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

    static Run_This_Function_Upon_Initiation_Of_A_Socket_Connection(socket: Socket) {
        SocketStorage.add(socket);
        SocketDataStorage.newSocketDataSlot(socket);

        const currTimeMs = Date.now();
        const initialValueForLastMovementRequestTimeMs = currTimeMs;
        SocketDataStorage.set(socket, "lastMovementRequestTimeMs", initialValueForLastMovementRequestTimeMs);
    }

    static runThisUponSocketDisconnect(socket: Socket) {
        Helper_Functions.removePlayerEntityFromTheWorld(socket);
        SocketStorage.remove(socket);
        SocketDataStorage.removeSocketDataSlot(socket);
    }
    static removePlayerEntityFromTheWorld(socket: Socket) {
        const playerAssociatedWithSocket = World.state.entities.find((entity) => {
            return entity.socketId === socket.id;
        });
        const index = World.state.entities.indexOf(playerAssociatedWithSocket);
        World.state.entities.splice(index, 1);
    }
    static getOppositeDirection(dir: Direction): Direction {
      if(dir==="up") {
         return "down";
      }
      if(dir==="down") {
         return "up";
      }
      if(dir==="left") {
         return "right";
      }
      if(dir==="right") {
         return "left";
        }
        throw new Error(`Invalid dir ${dir}`)
    }
    

}