import type { Socket } from "socket.io";

export { SocketStorage }
class SocketStorage {
    static sockets = new Array();
    static add(socket: Socket) {
        SocketStorage.sockets.push(socket);
    }
    static remove(socket: Socket) {
        const socketIndexInArray = SocketStorage.sockets.indexOf(socket);
        const sockets = SocketStorage.getAll();
        sockets.splice(socketIndexInArray, 1);
    }
    static getAll() {
        return SocketStorage.sockets;
    }
    static find(searchCondition: (socket: Socket) => boolean) {
        return SocketStorage.getAll().find(searchCondition);
    }
}