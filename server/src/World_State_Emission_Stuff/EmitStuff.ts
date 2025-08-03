import { PreEmitStuff } from "#root/World_State_Emission_Stuff/PreEmitStuff.js";
import { World } from "#root/World.js";
import type { Player } from "#root/Entities/Player.js";
import { EntitySorter } from "#root/EntitySorter.js";


export { EmitStuff }

class EmitStuff {
  static Emit_To_All_Players_World_State_Stuff() {
    EntitySorter.Sort_All_Entities_In_Order_Of_Appearance_For_The_Top_Down_Camera();
    const allPlayers: Player[] = World.filterEntities(entity => entity.hasTag("Player")) as Player[];
    allPlayers.forEach(player => {
      EmitStuff.Emit_World_State_To_Player(player);
    })
  }

  static Emit_World_State_To_Player(player: Player) {
    const playerSocket = player.getSocket();
    const { visibleEntities, virtualWidth, virtualHeight } = PreEmitStuff.get_visible_to_player_entities_and_virtual_width_and_virtual_height_and_hide_all_the_real_world_entities_xy_coordinates_by_returning_virtual_ones_instead(player);
    playerSocket.emit('newWorldState', {
      entities: visibleEntities,
      virtualHeight: virtualHeight,
      virtualWidth: virtualWidth,
      playerX: player.x,
      playerY: player.y,
      playerSpeedUp: player.speedUp,
      playerIntangibility: player.intangibility,
    });
  }

} 
