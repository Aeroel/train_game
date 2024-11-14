export { WorldRenderer }
class WorldRenderer {
    static worldState = {
        entities: new Array(),
        virtualCanvasWidth: 1,
        virtualCanvasHeight: 1,
    };
    static receiveWorldState(worldState) {
        WorldRenderer.worldState = worldState;
    }
static render() {
    // Get canvas and context
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Scaling factors based on virtual and canvas dimensions
    const scaleX = canvas.width / WorldRenderer.worldState.virtualWidth;
    const scaleY = canvas.height / WorldRenderer.worldState.virtualHeight;

    // Render each entity with scaled positions and sizes
    WorldRenderer.worldState.entities.forEach(entity => {
        context.fillStyle = entity.color;
        
        // Scale entity position and size
        const scaledX = entity.x * scaleX;
        const scaledY = entity.y * scaleY;
        const scaledWidth = entity.width * scaleX;
        const scaledHeight = entity.height * scaleY;
        // Draw the entity
        context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
    });
}

}