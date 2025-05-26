export { SocketWrapper} 
import { io} from "socket.io-client";
class SocketWrapper {
    static socket = io("0");
    static establishConnection() {
        const serverAddress = `${location.hostname}:3000`
        SocketWrapper.socket = io(serverAddress);
    }
    static get() {
        return SocketWrapper.socket;
    }
    static on(signalName: string, callThisCallbackFunctionUponReceivingTheSignal: (...args: any[]) => void) {
        return this.get().on(signalName, callThisCallbackFunctionUponReceivingTheSignal);
    }
    static emit(signalName: string, data: any) {
        return this.get().emit(signalName, data);
    }
}