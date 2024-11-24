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
            const scaledEdges = entity.edges.map(edge => {
                return {
                    x1: edge.x1 * scaleX,
                    y1: edge.y1 * scaleY,
                    x2: edge.x2 * scaleX,
                    y2: edge.y2 * scaleY,
                }
            })

            // forcefields are just outlines
            if (entity.tags?.includes("Forcefield")) {
                context.strokeStyle = entity.color;
                context.lineWidth = 4;
                context.beginPath();

                scaledEdges.forEach(edge => {
                    context.moveTo(edge.x1, edge.y1);
                    context.lineTo(edge.x2, edge.y2);
                })
                context.stroke();
                return;
            } else {
                context.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
                context.strokeStyle = "black";
                context.lineWidth = 2;
                context.beginPath();

                scaledEdges.forEach(edge => {
                    context.moveTo(edge.x1, edge.y1);
                    context.lineTo(edge.x2, edge.y2);
                })
                context.stroke();
            }

        });
    }

}


