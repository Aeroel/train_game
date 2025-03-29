import { Settings } from "#root/Settings.js";
import { SocketDataStorage } from "#root/SocketDataStorage.js";
import type { Socket } from "socket.io";

export { Socket_Functions }
class Socket_Functions {
    static Is_Movement_Request_Functionality_On_Cooldown(socket: Socket) {
        const currTimeMs = Date.now()
        const lastMovementRequestTimeMs = SocketDataStorage.get(socket, "lastMovementRequestTimeMs");
        const howMuchTimePassedMs = (currTimeMs - lastMovementRequestTimeMs);
        const movementRequestFunctionalityIsOnCooldown = Boolean(
            howMuchTimePassedMs < Settings.movementRequestCooldownDurationMs
        );
        return movementRequestFunctionalityIsOnCooldown;
    }
    static Handle_A_Movement_Request_Happening_Just_Now(socket: Socket) {
        const currTimeMs = Date.now()
        SocketDataStorage.set(socket, "lastMovementRequestTimeMs", currTimeMs);
    }
}