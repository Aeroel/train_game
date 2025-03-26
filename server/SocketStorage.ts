export { SocketStorage }
class SocketStorage {
    static sockets = new Array();
    static add(socket) {
        SocketStorage.sockets.push(socket);
    }
    static remove(socket) {
        const socketIndexInArray = SocketStorage.sockets.indexOf(socket);
        const sockets = SocketStorage.getAll();
        sockets.splice(socketIndexInArray, 1);
    }
    static getAll() {
        return SocketStorage.sockets;
    }
    static find(searchCondition) {
        return SocketStorage.getAll().find(searchCondition);
    }
}