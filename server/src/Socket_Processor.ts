export { Socket_Processor }
import * as SocketIO from "socket.io"
import { Socket_Functions } from "./Socket_Functions.js";
import { Player } from "./Entities/Player.js";
import { World } from "./World.js";
import { Helper_Functions } from "./Helper_Functions.js";
import { Typed_Object_Keys, type Direction } from "./Type_Stuff.js";

// I copied this type that vscode showed in popup of socket var from startThis...ts  file
type Undesirable_Hardcode_Socket_Type = SocketIO.Socket<SocketIO.DefaultEventsMap, SocketIO.DefaultEventsMap, SocketIO.DefaultEventsMap, any>;

class Socket_Processor {
    static onNewConnection(socket: Undesirable_Hardcode_Socket_Type) {
        console.log("A socket connected");
        Helper_Functions.Run_This_Function_Upon_Initiation_Of_A_Socket_Connection(socket);
        socket.emit("welcome", "You have successfully connected to the server. Welcome!");
        const newPlayerEntity = new Player();
        newPlayerEntity.setX(350);
        newPlayerEntity.setY(350);
        newPlayerEntity.readSavedXY();
        newPlayerEntity.setWidth(25);
        newPlayerEntity.setHeight(25);
        newPlayerEntity.setVisionRange(5000);
        newPlayerEntity.setSocketId(socket.id);
        World.addEntity(newPlayerEntity);
    }


    static onDisconnect(socket: Undesirable_Hardcode_Socket_Type) {
        socket.on("disconnect", () => {
            Helper_Functions.runThisUponSocketDisconnect(socket);
        })
    }


    static onControl(socket: Undesirable_Hardcode_Socket_Type) {
        type Control_Keys = {
            movement: (Direction)[],
            speedUp: boolean,
        }
        socket.on("controlKeys", (receivedControlKeys: Control_Keys) => {
            const playerAssociatedWithSocket: Player = World.state.entities.find((entity: Player) => entity.socketId === socket.id);
            this.movement(playerAssociatedWithSocket, receivedControlKeys.movement, socket);

            this.speedUp(playerAssociatedWithSocket, receivedControlKeys.speedUp,);

        });
    }
    static speedUp(playerAssociatedWithSocket: Player, speedUp: boolean) {
        if (speedUp !== playerAssociatedWithSocket.speedUp) {
            playerAssociatedWithSocket.swapSpeedUp();
            console.log("speedup swap");
        }
    }
    static movement(playerAssociatedWithSocket: Player, movementKeys: (Direction)[], socket: Undesirable_Hardcode_Socket_Type) {
        // check that receivedMovement is what we expected... If not, ignore it, I guess
        if (!Array.isArray(movementKeys)) {
            return;
        }
        /*
        Presumably, someone spamming movement requests does not receive any advantages. So, this cooldown is implemented mainly for fun.
        The idea is we don't want the server to process too many movement requests from a client in a short time period, that would be pointless. Although neither does this cooldown really affect much, since all that happens if no cooldown is present is flipping control key bits to true... 
        */
        if (Socket_Functions.Is_Movement_Request_Functionality_On_Cooldown(socket)) {
            return;
        }
        Socket_Functions.A_Movement_Request_Happened_Just_Now(socket);


        // const playerPossibleMovementDirections: string[] = Object.keys(playerAssociatedWithSocket.controls);
        const playerPossibleMovementDirections = Typed_Object_Keys(playerAssociatedWithSocket.controls);
        playerPossibleMovementDirections.forEach(direction => {
            playerAssociatedWithSocket.controls[direction] = movementKeys.includes(direction);
        });
    }
}