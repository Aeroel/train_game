export { Socket} 
import { io } from "./externalScripts/socket.io.esm.min.js";
class Socket {
    static socket = null;
    static establishConnection() {
        const serverAddress = `${location.hostname}:3000`
        Socket.socket = io(serverAddress);
    }
    static get() {
        return Socket.socket;
    }
    static on(signalName, callThisCallbackFunctionUponReceivingTheSignal) {
        return this.get().on(signalName, callThisCallbackFunctionUponReceivingTheSignal);
    }
    static emit(signalName, data) {
        return this.get().emit(signalName, data);
    }
}