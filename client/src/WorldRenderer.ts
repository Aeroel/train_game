export { WorldRenderer };

type WorldState = {
    entities: Entity[],
    virtualCanvasWidth: number
    virtualCanvasHeight: number,
}
type ReceivedWorldState = {
    entities: Entity[],
    virtualWidth: number
    virtualHeight: number,
    playerX: number,
    playerY: number,
    playerSpeedUp: boolean,
    playerIntangibility: boolean,

}
type Edge = {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}
type Tag = string;

type Entity = {
    x: number,
    y: number,
    width: number,
    height: number,
    edges: Edge[],
    color: string,
    tags: Tag[] | undefined
}

class WorldRenderer {
    static arbitraryNumber = 1;
    static initial_value_for_virtual_canvas_dimensions = WorldRenderer.arbitraryNumber;
    static worldState: WorldState = {
        entities: new Array(),
        virtualCanvasWidth: WorldRenderer.initial_value_for_virtual_canvas_dimensions,
        virtualCanvasHeight: WorldRenderer.initial_value_for_virtual_canvas_dimensions,
    };
    static receiveWorldState(worldState: ReceivedWorldState) {
        WorldRenderer.worldState.entities = worldState.entities;
        WorldRenderer.worldState.virtualCanvasHeight = worldState.virtualHeight;
        WorldRenderer.worldState.virtualCanvasWidth = worldState.virtualWidth;

        this.updatePlayerPositionText(worldState.playerX, worldState.playerY);
        this.speedUpHandler(worldState.playerSpeedUp);
        this.intangibilityHandler(worldState.playerIntangibility);

    }
    
    static updatePlayerPositionText(playerX: number, playerY: number) {
              const coordinatesBox = <HTMLDivElement>document.getElementById("coordinatesLocation");
        if (coordinatesBox === null) {
            throw new Error("Could not get coordinates box");
        }
              // Update coordinates box with player position
        coordinatesBox.innerText = `Player Position:\n X: ${playerX},\n Y: ${playerY}`;
    }
    
    static speedUpHandler(speedUp: boolean) {
              const speedup_state_image= document.getElementById("speedupStateImage") as HTMLImageElement;
   if(speedup_state_image === null) {
     throw new Error("speedup_state_image not found");
   }
        const baseImg = "./images/Speedup_State";
      let image = "False.jpg";
     if(speedUp) {
       image = "True.jpg";
     }
    speedup_state_image.src = `${baseImg}_${image}`;
    }
    
    static intangibilityHandler(intangibility: boolean) {
    const intangibilityStateImage= document.getElementById("intangibilityStateImage") as HTMLImageElement;
   if(intangibilityStateImage === null) {
     throw new Error("intangibilityStateImage not found");
   }
        const baseImg = "./images/Intangibility_State";
      let image = "False.jpg";
     if(intangibility) {
       image = "True.jpg";
     }
    intangibilityStateImage.src = `${baseImg}_${image}`;
    }
    
    static render() {
        // Get canvas and context
        const canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
        if (canvas === null) {
            throw new Error("Could not get canvas");

        }
        const drawingContext = canvas.getContext("2d");

        if (drawingContext === null) {
            throw new Error("Could not get drawing context");
        }
        // clear to draw on blank slate
        drawingContext.clearRect(0, 0, canvas.width, canvas.height);

        // scale whatever server sent into the canvas to properly fill the whole canvas
        const scaleX = canvas.width / WorldRenderer.worldState.virtualCanvasWidth;
        const scaleY = canvas.height / WorldRenderer.worldState.virtualCanvasHeight;

        // Render each entity with scaled positions and sizes
        WorldRenderer.worldState.entities.forEach((entity: Entity) => {

            // Scale entity position and size
            const scaledX = entity.x * scaleX;
            const scaledY = entity.y * scaleY;
            const scaledWidth = entity.width * scaleX;
            const scaledHeight = entity.height * scaleY;
            const scaledEdges = entity.edges.map((edge: Edge) => {
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
    static drawForcefield(scaledEntity: Entity, drawingContext: CanvasRenderingContext2D) {
        drawingContext.strokeStyle = scaledEntity.color;
        drawingContext.lineWidth = 4;
        drawingContext.beginPath();

        scaledEntity.edges.forEach((edge: Edge) => {
            drawingContext.moveTo(edge.x1, edge.y1);
            drawingContext.lineTo(edge.x2, edge.y2);
        });
        drawingContext.stroke();
    }
    static draw_rectangular_entity_and_it_s_outline(scaledEntity: Entity, drawingContext: CanvasRenderingContext2D) {
        this.draw_the_rectangular_entity(scaledEntity, drawingContext);
        this.draw_the_outline(scaledEntity.edges, drawingContext);
    }
    static draw_the_rectangular_entity(scaledEntity: Entity, drawingContext: CanvasRenderingContext2D) {
        drawingContext.fillStyle = scaledEntity.color;
        drawingContext.fillRect(scaledEntity.x, scaledEntity.y, scaledEntity.width, scaledEntity.height);
    }
    static draw_the_outline(scaledEntityEdges: Edge[], drawingContext: CanvasRenderingContext2D) {
        drawingContext.strokeStyle = "black";
        drawingContext.lineWidth = 2;
        drawingContext.beginPath();

        // slight black border for each entity to be able to tell each apart visually
        scaledEntityEdges.forEach((edge: Edge) => {
            drawingContext.moveTo(edge.x1, edge.y1);
            drawingContext.lineTo(edge.x2, edge.y2);
        });
        drawingContext.stroke();
    }
}


