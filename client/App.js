export { App }
import { AppSetup } from "./AppSetup.js";
import { AnimationLoop } from "./AnimationLoop.js"
class App {
    static controlKeys = new Set();
    static isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    static init() {
        document.addEventListener("DOMContentLoaded", () => {
            App.runThisOncePageIsFullyLoaded();
        })

    }
    static runThisOncePageIsFullyLoaded() {

        AppSetup.serverConnectionStuff();
        AppSetup.runJoystickSetupCode();
        AppSetup.runFullscreenButtonCode();
        AnimationLoop.start();

        // Example usage of App.controlKeys
        setInterval(() => {
            const directionsArray = Array.from(App.controlKeys);

        }, 100);

    }

}