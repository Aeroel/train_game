import { PreEmitStuff } from "#root/PreEmitStuff.js";
import { World } from "#root/World.js";
import type { Player } from "./Entities/Player.js";


export { EmitStuff }

class EmitStuff {
  static emitToAllPlayersWorldStateStuff() {
    const allPlayers: Player[] = World.filterEntities(entity => entity.hasTag("Player")) as Player[];
    allPlayers.forEach(player => {
      EmitStuff.Emit_World_State_To_Player(player);
    })
  }

  static Emit_World_State_To_Player(player: Player) {
    const playerSocket = player.getSocket();
    const { visibleEntities, virtualWidth, virtualHeight } = PreEmitStuff.get_visible_to_player_entities_and_virtual_width_and_virtual_height_and_hide_all_the_real_world_entities_xy_coordinates_by_returning_virtual_ones_instead(player)
    playerSocket.emit('newWorldState', {
      entities: visibleEntities,
      virtualHeight: virtualHeight,
      virtualWidth: virtualWidth
    });
  }

} 
