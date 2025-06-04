import { SocketDataStorage } from "#root/SocketDataStorage.js";
import { SocketStorage } from "#root/SocketStorage.js";
import { World } from "#root/World.js";
import type { Socket } from "socket.io";
import { networkInterfaces } from "os";


export { Helper_Functions };
class Helper_Functions {


    static isNumber(num: number) {
        return (typeof num === 'number' && isFinite(num));
    }
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
        } else {
            throw new Error('Undefined WIFI');
        }
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
}