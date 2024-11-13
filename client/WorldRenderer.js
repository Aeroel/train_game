export { WorldRenderer }
class WorldRenderer {
    static worldState = {
        entities: new Array(),
        virtualCanvasWidth: 0,
        virtualCanvasHeight: 0,
    };
    static receiveWorldState(worldState) {
        WorldRenderer.worldState = worldState;
    }
    static render() {
        // render whatever is in static prop WorldRenderer.worldState
        const canvas = document.getElementById("gameCanvas");
        const context = canvas.getContext("2d")
        context.clearRect(0, 0, canvas.width, canvas.height)
        WorldRenderer.worldState.entities.forEach(entity => {
            context.fillStyle = entity.color;
            context.fillRect(entity.x * canvas.width, entity.y * canvas.height, entity.width * canvas.width, entity.height * canvas.height)
        })
    };
}