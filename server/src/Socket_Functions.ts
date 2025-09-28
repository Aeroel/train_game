import { Settings } from "#root/Settings.js";
import { SocketDataStorage } from "#root/SocketDataStorage.js";
import type { Socket } from "socket.io";
import type {Undesirable_Hardcoded_Socket_Type} from "#root/Socket_Type_Stuff.js"

export { Socket_Functions }
class Socket_Functions {
  static pingOnCooldown(socket: Undesirable_Hardcoded_Socket_Type, currTime: number): boolean {
        const lastPingTimeMs = SocketDataStorage.get(socket,'lastPingTimeMs');
        const pingCooldownMs = Settings.pingCooldownMs;
        const pingOnCooldown = currTime < lastPingTimeMs + pingCooldownMs;
        
       return pingOnCooldown;
}
    static Is_Movement_Request_Functionality_On_Cooldown(socket: Socket) {
        const currTimeMs = Date.now()
        const lastMovementRequestTimeMs = SocketDataStorage.get(socket, "lastMovementRequestTimeMs");
        const howMuchTimePassedMs = (currTimeMs - lastMovementRequestTimeMs);
        const movementRequestFunctionalityIsOnCooldown = Boolean(
            howMuchTimePassedMs < Settings.movementRequestCooldownDurationMs
        );
        return movementRequestFunctionalityIsOnCooldown;
    }
    static A_Movement_Request_Happened_Just_Now(socket: Socket) {
        const currTimeMs = Date.now()
        SocketDataStorage.set(socket, "lastMovementRequestTimeMs", currTimeMs);
    }
}