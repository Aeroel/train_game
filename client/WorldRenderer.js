export { WorldRenderer }
class WorldRenderer {
    static worldState = {
        entities: new Array(),

    };
    static receiveWorldState(worldState) {
        WorldRenderer.worldState = worldState;
    }
    static render() {
        // render whatever is in static prop WorldRenderer.worldState
        const canvas = document.getElementById("gameCanvas");
        const context = canvas.getContext("2d")
        context.clearRect(0, 0,  canvas.width, canvas.height)
        WorldRenderer.worldState.entities.forEach(entity => {
          context.fillStyle = "white";
          context.fillRect(entity.x, entity.y, entity.width, entity.height)
        })
    };
}