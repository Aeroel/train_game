import type { Socket } from "socket.io";

export { SocketDataStorage }

class SocketDataStorage {
  static data = new Map();
  static newSocketDataSlot(socket: Socket) {
    const emptyObject = new Object();
    this.data.set(socket, emptyObject)
  }
  static removeSocketDataSlot(socket: Socket) {
    this.data.delete(socket);
  }
  static set(socket: Socket, nameForThePieceOfData: string, valueOfThePieceOfData: any) {
    const theSocketDataObject = this.get(socket);
    theSocketDataObject[nameForThePieceOfData] = valueOfThePieceOfData;
  }
  static get(socket: Socket, optionalNameOfThePieceOfData?: string) {
    const socketData = this.data.get(socket)
    if (optionalNameOfThePieceOfData === undefined) {
      return socketData;
    }
    return socketData[optionalNameOfThePieceOfData];
  }
}