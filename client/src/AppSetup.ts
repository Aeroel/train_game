import { SocketWrapper } from "#root/SocketWrapper";
import { WorldRenderer } from "#root/WorldRenderer";
import { FullscreenSetup } from "#root/FullscreenSetup";
import { JoystickSetup } from "#root/JoystickSetup";
import { KeyboardControlsSetup } from "#root/KeyboardControlsSetup";
import { ServerConnectionStatusVisualizer } from "#root/ServerConnectionStatusVisualizer";

export { AppSetup };
class AppSetup {
    static initialVisualCSSStyleAdjustments() {
        // ensure the big fullscreen button icon is appropriately icon-sized. (Maybe I will resize the original image later instead?)
        const FSButtonImage = document.getElementById("fullscreenButtonIcon");
        if (FSButtonImage === null) {
            throw new Error("Could not find full screen button image element");

        }
        FSButtonImage.style.width = "50px";
        FSButtonImage.style.height = "50px";

        // unless I manually set canvas size to a big number like 1000, for some reason 
        // if I don't set it, it will cause pixelated rendering...
        const gameCanvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
        if (gameCanvas === null) {
            throw new Error("Could not find full screen button image element");

        }
        gameCanvas.width = 1000;
        gameCanvas.height = 1000;

    }
    static serverConnectionStuff(ip: string) {
        SocketWrapper.establishConnection(ip);
        const socket = SocketWrapper.get();
        socket.on("welcome", (message) => {
            console.log(message);
        });
        socket.on("newWorldState", (newWorldState) => {
            WorldRenderer.receiveWorldState(newWorldState);
        });


        this.showConnectionStatusAndRetryTextIfConnectionTakesTooLong();


    }
    // this is only a visual thingie for fun, I am not doing any actual manual reconnection.
    // I suppose socket.io does it automatically.
    static showConnectionStatusAndRetryTextIfConnectionTakesTooLong() {
        ServerConnectionStatusVisualizer.initialize();
    }

    static runFullscreenButtonCode() {
        FullscreenSetup.buttonSetupCode();
    }

    static runJoystickSetupCode() {

        JoystickSetup.runTheSetupCode();
    }

    static runKeyboardControlsSetupCode() {
        KeyboardControlsSetup.runTheSetupCode();
    }
}