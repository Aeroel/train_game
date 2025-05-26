export { SocketWrapper };
import { io, Socket, } from "socket.io-client";
class SocketWrapper {
    static socket = null;
    static establishConnection() {
        const serverAddress = `${location.hostname}:3000`;
        SocketWrapper.socket = io(serverAddress);
    }
    static get() {
        if (SocketWrapper.socket === null) {
            throw new Error("Trying to get socket before setting it through establishConnection()");
        }
        return SocketWrapper.socket;
    }
    static on(signalName, callThisCallbackFunctionUponReceivingTheSignal) {
        return this.get().on(signalName, callThisCallbackFunctionUponReceivingTheSignal);
    }
    static emit(signalName, data) {
        return this.get().emit(signalName, data);
    }
}
