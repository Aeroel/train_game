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
}