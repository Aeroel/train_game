export { AnimationLoop };
import { WorldRenderer } from "./WorldRenderer.js";
class AnimationLoop {
    static start() {
        AnimationLoop.loop();
    }
    static loop() {
        WorldRenderer.render();
        requestAnimationFrame(() => AnimationLoop.loop());
    }
}
