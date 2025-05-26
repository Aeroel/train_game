export { App };
import { AppSetup } from "./AppSetup.js";
import { AnimationLoop } from "./AnimationLoop.js";
import { SocketWrapper } from "./SocketWrapper.js";
class App {
    static movementControlCommands = new Set();
    static initialize() {
        document.addEventListener("DOMContentLoaded", () => {
            App.runThisCodeOncePageIsFullyLoaded();
        });
    }
    static runThisCodeOncePageIsFullyLoaded() {
        AppSetup.initialVisualCSSStyleAdjustments();
        AppSetup.serverConnectionStuff();
        if (App.isUserUsingAPhone()) {
            AppSetup.runJoystickSetupCode();
        }
        else {
            AppSetup.runKeyboardControlsSetupCode();
        }
        AppSetup.runFullscreenButtonCode();
        AnimationLoop.start();
        // Example usage of App.movementControlCommands
        // send whatever keys user presses every 0.1 secs
        setInterval(() => {
            const directionsArray = Array.from(App.movementControlCommands);
            // console.log(directionsArray)
            SocketWrapper.emit("movement", directionsArray);
        }, 100);
    }
    static isUserUsingAPhone() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
}
