export { WorldRenderer };
class WorldRenderer {
    static arbitraryNumber = 1;
    static initial_value_for_virtual_canvas_dimensions = WorldRenderer.arbitraryNumber;
    static worldState = {
        entities: new Array(),
        virtualCanvasWidth: WorldRenderer.initial_value_for_virtual_canvas_dimensions,
        virtualCanvasHeight: WorldRenderer.initial_value_for_virtual_canvas_dimensions,
    };
    static receiveWorldState(worldState) {
        WorldRenderer.worldState = worldState;
    }
    static render() {
        // Get canvas and context
        const canvas = document.getElementById("gameCanvas");
        const drawingContext = canvas.getContext("2d");

        // clear to draw on blank slate
        drawingContext.clearRect(0, 0, canvas.width, canvas.height);

        // scale whatever server sent into the canvas to properly fill the whole canvas
        const scaleX = canvas.width / WorldRenderer.worldState.virtualWidth;
        const scaleY = canvas.height / WorldRenderer.worldState.virtualHeight;

        // Render each entity with scaled positions and sizes
        WorldRenderer.worldState.entities.forEach(entity => {

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
                };
            });

            const scaledEntity = {
                ...entity,
                height: scaledHeight,
                width: scaledWidth,
                y: scaledY,
                x: scaledX,
                edges: scaledEdges,
            };
            if (entity.tags?.includes("Forcefield")) {
                this.drawForcefield(scaledEntity, drawingContext);
            } else {
                this.draw_rectangular_entity_and_it_s_outline(scaledEntity, drawingContext);
            }

        });
    }

    // forcefields are just outlines
    static drawForcefield(scaledEntity, drawingContext) {
        drawingContext.strokeStyle = scaledEntity.color;
        drawingContext.lineWidth = 4;
        drawingContext.beginPath();

        scaledEntity.edges.forEach(edge => {
            drawingContext.moveTo(edge.x1, edge.y1);
            drawingContext.lineTo(edge.x2, edge.y2);
        });
        drawingContext.stroke();
    }
    static draw_rectangular_entity_and_it_s_outline(scaledEntity, drawingContext) {
        this.draw_the_rectangular_entity(scaledEntity, drawingContext);
        this.draw_the_outline(scaledEntity.edges, drawingContext);
    }
    static draw_the_rectangular_entity(scaledEntity, drawingContext) {
        drawingContext.fillStyle = scaledEntity.color;
        drawingContext.fillRect(scaledEntity.x, scaledEntity.y, scaledEntity.width, scaledEntity.height);
    }
    static draw_the_outline(scaledEntityEdges, drawingContext) {
        drawingContext.strokeStyle = "black";
        drawingContext.lineWidth = 2;
        drawingContext.beginPath();

        // slight black border for each entity to be able to tell each apart visually
        scaledEntityEdges.forEach(edge => {
            drawingContext.moveTo(edge.x1, edge.y1);
            drawingContext.lineTo(edge.x2, edge.y2);
        });
        drawingContext.stroke();
    }
}


