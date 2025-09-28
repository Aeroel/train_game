import type { Base_Entity } from "#root/Entities/Base_Entity.js"
import type { Player } from "#root/Entities/Player.js";
import {Complicated_Pre_Emission_Functions} from "#root/World_State_Emission_Stuff/Complicated_Pre_Emission_Functions.js";
import type { VisibleEdge,
VisibleEntity,
VirtualizedEntity,
CleanedEntity} from "#root/Type_Stuff.js";


export { PreEmitStuff }



class PreEmitStuff {
  static someArbitraryNumber = 5000;
  static anotherArbitraryNumber = 5000
  static virtualWidth = this.someArbitraryNumber;
  static virtualHeight = this.anotherArbitraryNumber;

  static get_visible_to_player_entities_and_virtual_width_and_virtual_height_and_hide_all_the_real_world_entities_xy_coordinates_by_returning_virtual_ones_instead(player: Player, entities: Base_Entity[]) {
    const visibleEntities = this.getVisibleEntities(player, entities)
    const virtualizedEntities = this.virtualizeXYToAvoidExposingRealWorldXY(visibleEntities, player, PreEmitStuff.virtualWidth, PreEmitStuff.virtualHeight);
    const entitiesWithOnlyProperties = this.onlyIncludeEntityPropertiesThatClientNeeds(virtualizedEntities);
    return {
      visibleEntities:
        entitiesWithOnlyProperties,
      virtualHeight: this.virtualHeight,
      virtualWidth: this.virtualWidth,
    };
  }
  
  
  static onlyIncludeEntityPropertiesThatClientNeeds(entities: VirtualizedEntity[]) : CleanedEntity[] {
    const cleanedEntities: CleanedEntity[] = [];
    entities.forEach(entity => {
      const tagsIAmFineWithExposing = ["Forcefield"];
      const cleanedTags: string[] = [];
      tagsIAmFineWithExposing.forEach(tagIAmFineWithExposing => {
        if (entity.tags.includes(tagIAmFineWithExposing)) {
          cleanedTags.push(tagIAmFineWithExposing);
        }
      }); 
      cleanedEntities.push({
        x: entity.x,
        y: entity.y,
        width: entity.width,
        height: entity.height,
        color: entity.color,
        edges: entity.edges,
        tags: cleanedTags,

      })
    })
    return cleanedEntities;
  }
  static getVisibleEntities(player: Player, entities: Base_Entity[]) {
    const visibleEntities: VisibleEntity[] = new Array();
      entities.forEach((entity: Base_Entity) => {
      const visiblePortion = PreEmitStuff.getVisiblePortion(player, entity);
      const visibleEdges = PreEmitStuff.getVisibleEdges(player, entity);
      
      const entityIsVisible =  visiblePortion;
      if (!entityIsVisible) {
        return;
      }

      visibleEntities.push({
        color: entity.color,
        tags: entity.tags,
        x: visiblePortion.x,
        y: visiblePortion.y,
        width: visiblePortion.width,
        height: visiblePortion.height,
        edges: visibleEdges,
      })
    });
    return visibleEntities;
  }
  static virtualizeXYToAvoidExposingRealWorldXY(visibleEntities: VisibleEntity[], POVEntity: Base_Entity, virtW: typeof PreEmitStuff["virtualWidth"], virtH: typeof PreEmitStuff["virtualHeight"]) : VirtualizedEntity[] {
        return Complicated_Pre_Emission_Functions.virtualizeXYToAvoidExposingRealWorldXY(visibleEntities, POVEntity, virtW, virtH);
  }


  static getVisiblePortion(entityWhichIsLookingAround: Base_Entity,
    possiblyVisibleEntity: Base_Entity) {
          return Complicated_Pre_Emission_Functions.getVisiblePortion(entityWhichIsLookingAround, possiblyVisibleEntity);
  };

static getVisibleEdges(entityWhichIsLookingAround: Base_Entity,
    possiblyVisibleEntity: Base_Entity) : VisibleEdge[] { 
      return Complicated_Pre_Emission_Functions.getVisibleEdges(entityWhichIsLookingAround, possiblyVisibleEntity);
    }
}