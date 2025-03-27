import { PreEmitStuff } from "#root/PreEmitStuff.js";
import { SocketStorage } from "#root/SocketStorage.js";
import { World } from "#root/World.js";
export { EmitStuff };
class EmitStuff {
    static emitToAllPlayersWorldStateStuff() {
        const allPlayers = World.filterEntities(entity => entity.hasTag("Player"));
        allPlayers.forEach(player => {
            const playerSocket = SocketStorage.find(socket => socket.id === player.socketId);
            const entities_that_are_visible_to_player_and_virt_w_and_h = PreEmitStuff.get_visible_to_player_entities_and_virtual_width_and_virtual_height_and_hide_all_the_real_world_xy_coordinates_by_returning_virtual_ones_instead(player);
            playerSocket.emit('newWorldState', {
                entities: entities_that_are_visible_to_player_and_virt_w_and_h.entities,
                virtualHeight: entities_that_are_visible_to_player_and_virt_w_and_h.virtualHeight,
                virtualWidth: entities_that_are_visible_to_player_and_virt_w_and_h.virtualWidth
            });
        });
    }
}
