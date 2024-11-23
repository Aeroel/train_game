import {
  World
} from "./World.js"

export {
  EntitySorter
}
class EntitySorter {
  static sortAllEntitiesInOrderOfAppearanceForTheTopDownCamera() {
    // Sort entities to place ground entities at the bottom layer
    EntitySorter.groundComesFirstThenOtherEntities();
    EntitySorter.makeSureACar_sWallsAreOnTopOfTheCarRatherThanBelowIt();
  }
  static makeSureACar_sWallsAreOnTopOfTheCarRatherThanBelowIt() {
    const allEntities = World.getCurrentEntities()
    allEntities.sort((a, b) => {
        if (a.hasTag("Train_Car") && b.hasTag("Wall")) {
            return -1; // Train_Car comes before wall
        } else if (a.hasTag("Wall") && b.hasTag("Train_Car")) {
            return 1; // Wall comes after Train_Car
        } else {
            return 0; // Keep their relative order if neither condition applies
        }
    });
  }
  static groundComesFirstThenOtherEntities() {
    const allEntities = World.getCurrentEntities()
    allEntities.sort((a, b) => {
      const aHasGroundTag = a.tags?.includes('Ground');
      const bHasGroundTag = b.tags?.includes('Ground');

      // If both are ground or neither are ground, maintain their order
      if (aHasGroundTag === bHasGroundTag) {
        return 0;
      }

      // If 'a' is ground, it should come first
      if (aHasGroundTag) {
        return -1;
      }

      // If 'b' is ground, it should come first
      if (bHasGroundTag) {
        return 1;
      }

      // Default case (should never happen)
      return 0;
    });
  }
}