import {World} from "./World.js"
import {PreEmitStuff} from "./PreEmitStuff.js"
import {SocketStorage} from "./SocketStorage.js"
export { EmitStuff } 

class EmitStuff {
 static emitToAllPlayersWorldStateStuff() {
     const allPlayers = World.filterEntities(entity => entity.hasTag("Player"));
     allPlayers.forEach(player => {
    const playerSocket = SocketStorage.find(socket => socket.id === player.socketId);
     const visibleToPlayerEntitiesAndVirtWH = PreEmitStuff.getVisibleToPlayerEntitiesAndVirtualWidthAndVirtualHeightAndHideAllTheRealWorldXYCoordinatesByReturningVirtualOnesInstead(player)
    playerSocket.emit('newWorldState', {
      entities: visibleToPlayerEntitiesAndVirtWH.entities, 
      virtualHeight: visibleToPlayerEntitiesAndVirtWH.virtualHeight,
      virtualWidth: visibleToPlayerEntitiesAndVirtWH.virtualWidth
    });
  })
 }

} 
