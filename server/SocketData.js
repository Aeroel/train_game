import { SocketStorage } from "./SocketStorage.js"

export { SocketData }

class SocketData {
  static data = new Map();
  static addSocketDataSlot(socketId) {
    const emptyObject = new Object();
    this.data.add(socketId, emptyObject)
  }
  static add(socketId, pieceOfData) {
    const theSocketDataObject = this.find(socket => socket.id === socketId)
  }
  static find(searchCriteriaFunction) {
      const socket = SocketStorage.find(searchCriteriaFunction);
      if(!socket) {
        return;
      }
      const socketData = this.data.get(socket.id)
      return socketData;
  }
}