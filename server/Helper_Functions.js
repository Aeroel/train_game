import { Functions_To_Inject_Into_Socket_Instance } from "./Functions_To_Inject_Into_Socket_Instance.js";
import { Ground } from "./Ground.js";
import { Movable_Entity } from "./Movable_Entity.js";
import { SocketDataStorage } from "./SocketDataStorage.js";
import { SocketStorage } from "./SocketStorage.js";
import { Railway_Placing_Functionality } from "./train_stuff/Railway_Placing_Functionality.js";
import { World } from "./World.js";

export { Helper_Functions }
class Helper_Functions {
    static functionsToInjectIntoAndThenToRemoveFromSocket = [Functions_To_Inject_Into_Socket_Instance.aMovementRequestHappenedJustNow, Functions_To_Inject_Into_Socket_Instance.isMovementRequestFunctionalityOnCooldown];
    /* This does not do much conceptually. I store various pieces of data related to each socket in a separate container located inside SocketDataStorage. I also store the references to each socket inside SocketStorage (as opposed to using io methods to get sockets) mainly because I am not that familiar with io functions and it is kinda confusing using them. Using a separate SocketStorage container seems cleaner.
    // Same goes for the insertion of helper functions, I then use them like socket.helperFunction to do some operation, like to get last move request time, for example or to indicate that such a request just occurred and the value should be set to be now to be recalled later when checking the cooldown time
    */
    static runThisFunctionUponInitiationOfASocketConnection(socket) {
        Helper_Functions.insertSomeHelperFunctionsIntoSocketInstance(socket)
        SocketStorage.add(socket);
        SocketDataStorage.newSocketDataSlot(socket.id);

        const currTimeMs = Date.now()
        const initialValueForLastMovementRequestTimeMs = currTimeMs;
        SocketDataStorage.set(socket.id, "lastMovementRequestTimeMs", initialValueForLastMovementRequestTimeMs);
    }
    static runThisUponSocketDisconnect(socket) {
        Helper_Functions.removePlayerEntityFromTheWorld(socket);
        Helper_Functions.removeTheInsertedFunctionsFromSocketInstance(socket);
        SocketStorage.remove(socket);
        SocketDataStorage.removeSocketDataSlot(socket.id);
    }
    static removePlayerEntityFromTheWorld(socket) {
        const playerAssociatedWithSocket = World.state.entities.find((entity) => {
            return entity.socketId === socket.id
        })
        const index = World.state.entities.indexOf(playerAssociatedWithSocket);
        World.state.entities.splice(index, 1);
    }
    static removeTheInsertedFunctionsFromSocketInstance(socket) {
        this.functionsToInjectIntoAndThenToRemoveFromSocket.forEach(func => {
            delete socket[func.name]
        })
    }
    static insertSomeHelperFunctionsIntoSocketInstance(socket) {
        this.functionsToInjectIntoAndThenToRemoveFromSocket.forEach(func => {
            socket[func.name] = func.bind(null, socket);
        })
    }
    static spawnSomeEntities() {
        const newEntity = new Movable_Entity();
        newEntity.setX(0);
        newEntity.setY(0);
        newEntity.setWidth(50);
        newEntity.setHeight(40);
        World.addEntity(newEntity);

        const ground = new Ground();
        ground.setX(0);
        ground.setY(0);
        ground.setWidth(10000);
        ground.setHeight(10000);
        World.addEntity(ground);

        const rail1 = Railway_Placing_Functionality.place(10, 10, 250, 'right'); // Top horizontal rail
        const rail2 = Railway_Placing_Functionality.placeNextTo(rail1, 'rightEnd', 'down', 250); // Right vertical rail
        const rail3 = Railway_Placing_Functionality.placeNextTo(rail2, 'bottomEnd', 'left', 250); // Bottom horizontal rail
        const rail4 = Railway_Placing_Functionality.placeNextTo(rail3, 'leftEnd', 'down', 250); // Left vertical rail
        const rail5 = Railway_Placing_Functionality.placeNextTo(rail4, 'bottomEnd', 'right', 250); // 
        const rail6 = Railway_Placing_Functionality.placeNextTo(rail5, 'rightEnd', 'down', 250); 
    }
}