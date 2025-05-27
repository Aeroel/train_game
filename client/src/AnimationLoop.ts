export { AnimationLoop }
import {  WorldRenderer } from "#root/WorldRenderer";
class AnimationLoop {
    static start() {
        AnimationLoop.loop();
    }
    static loop() {
        WorldRenderer.render();
        requestAnimationFrame(() => AnimationLoop.loop());
    }
}