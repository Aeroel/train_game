import { Socket_Functions } from "#root/Functions_To_Inject_Into_Socket_Instance.js";
import { SocketDataStorage } from "#root/SocketDataStorage.js";
import { SocketStorage } from "#root/SocketStorage.js";
import { World } from "#root/World.js";
import type { Socket } from "socket.io";


export { Helper_Functions };
class Helper_Functions {

    static functionsToInjectIntoAndThenToRemoveFromSocket = [Socket_Functions.aMovementRequestHappenedJustNow, Socket_Functions.isMovementRequestFunctionalityOnCooldown];
    /* This does not do much conceptually. I store various pieces of data related to each socket in a separate container located inside SocketDataStorage. I also store the references to each socket inside SocketStorage (as opposed to using io methods to get sockets) mainly because I am not that familiar with io functions and it is kinda confusing using them. Using a separate SocketStorage container seems cleaner.
    // Same goes for the insertion of helper functions, I then use them like socket.helperFunction to do some operation, like to get last move request time, for example or to indicate that such a request just occurred and the value should be set to be now to be recalled later when checking the cooldown time
    */

    static Apply_Mixins(targetClass, mixinClass) {
        // Copy static properties and methods
        Object.getOwnPropertyNames(mixinClass).forEach(name => {
            if (name !== 'prototype' && name !== 'name') {
                Object.defineProperty(targetClass, name, Object.getOwnPropertyDescriptor(mixinClass, name));
            }
        });

        // Copy instance properties and methods
        Object.getOwnPropertyNames(mixinClass.prototype).forEach(name => {
            if (name !== 'constructor') {
                Object.defineProperty(targetClass.prototype, name, Object.getOwnPropertyDescriptor(mixinClass.prototype, name));
            }
        });
    }
    static isNumber(num: number) {
       return (typeof num === 'number' && isFinite(num));
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
    static removeTheInsertedFunctionsFromSocketInstance(socket) {
        this.functionsToInjectIntoAndThenToRemoveFromSocket.forEach(func => {
            delete socket[func.name];
        });
    }
    static insertSomeHelperFunctionsIntoSocketInstance(socket) {
        this.functionsToInjectIntoAndThenToRemoveFromSocket.forEach(func => {
            socket[func.name] = func.bind(null, socket);
        });
    }

}