export { SocketWrapper} 
import { io, Socket,} from "socket.io-client";
class SocketWrapper {
    static socket: Socket | null = null;
    static establishConnection(ip: string) {
        const serverAddress = ip;
        SocketWrapper.socket = io(serverAddress);
    }
    static get() {
        if(SocketWrapper.socket === null) {
            throw new Error("Trying to get socket before setting it through establishConnection()");
            
        }
        return SocketWrapper.socket;
    }
    static on(signalName: string, callThisCallbackFunctionUponReceivingTheSignal: (...args: any[]) => void) {
        return this.get().on(signalName, callThisCallbackFunctionUponReceivingTheSignal);
    }
    static emit(signalName: string, data: any) {
        return this.get().emit(signalName, data);
    }
}