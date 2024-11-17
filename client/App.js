export { App }
import { AppSetup } from "./AppSetup.js";
import { AnimationLoop } from "./AnimationLoop.js"
import { Socket } from "./Socket.js";
class App {
    static movementControlCommands = new Set();
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
        if (App.isMobile()) {
            AppSetup.runJoystickSetupCode();
        } else {
            AppSetup.runKeyboardControlsSetupCode();
        }
        AppSetup.runFullscreenButtonCode();
        AnimationLoop.start();

        // Example usage of App.movementControlCommands
        setInterval(() => {
            
            const directionsArray = Array.from(App.movementControlCommands);
            console.log(directionsArray)
            Socket.get().emit("movement", directionsArray);
        }, 100);

    }

}