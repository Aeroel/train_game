export { WorldRenderer }
class WorldRenderer {
    static worldState = null;
    static receiveWorldState(worldState) {
        WorldRenderer.worldState = worldState;
    }
    static render() {
        // render whatever is in static prop WorldRenderer.worldState
    };
}