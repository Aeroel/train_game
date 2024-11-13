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
        // render whatever is in static prop WorldRenderer.worldState
        const canvas = document.getElementById("gameCanvas");
        const context = canvas.getContext("2d")
        context.clearRect(0, 0, canvas.width, canvas.height);

        
        const scaleX = canvas.width / WorldRenderer.worldState.virtualCanvasWidth;
        const scaleY = canvas.height / WorldRenderer.worldState.virtualCanvasHeight;
        
        WorldRenderer.worldState.entities.forEach(entity => {
            const scaledX = entity.x * scaleX;
            const scaledY = entity.y * scaleY;

            const scaledWidth =  entity.width * scaledX;
            const scaledHeight =  entity.height * scaledY;
            console.log(WorldRenderer.worldState.entities);
            
            context.fillStyle = entity.color;
            context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight)
        })
    };
}