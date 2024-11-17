
export { SocketDataStorage }

class SocketDataStorage {
  static data = new Map();
  static addSocketDataSlot(socketId) {
    const emptyObject = new Object();
    this.data.set(socketId, emptyObject)
  }
  static removeSocketDataSlot(socketId) {
    this.data.delete(socketId);
  }
  static set(socketId, nameForThePieceOfData, valueOfThePieceOfData) {
    const theSocketDataObject = this.get(socketId);
    theSocketDataObject[nameForThePieceOfData] = valueOfThePieceOfData;
  }
  static get(socketId, optionalNameOfThePieceOfData = null) {
    const socketData = this.data.get(socketId)
    if (optionalNameOfThePieceOfData === null) {
      return socketData;
    }
    return socketData[optionalNameOfThePieceOfData];
  }
}