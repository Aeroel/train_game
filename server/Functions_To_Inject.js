import { Settings } from "./Settings.js";
import { SocketDataStorage } from "./SocketDataStorage.js";

export { Functions_To_Inject }
class Functions_To_Inject {
    static isMovementRequestFunctionalityOnCooldown(socket) {
        const currTimeMs = Date.now()
        const lastMovementRequestTimeMs = SocketDataStorage.get(socket.id, "lastMovementRequestTimeMs");
        const howMuchTimePassedMs = (currTimeMs - lastMovementRequestTimeMs);
        const movementRequestFunctionalityIsOnCooldown = Boolean(
            howMuchTimePassedMs < Settings.movementRequestCooldownDurationMs
        );
        return movementRequestFunctionalityIsOnCooldown;
    }
    static aMovementRequestHappenedJustNow(socket) {
        const currTimeMs = Date.now()
        SocketDataStorage.set(socket.id, "lastMovementRequestTimeMs", currTimeMs);
    }
}