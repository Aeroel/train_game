import { SocketWrapper } from "#root/SocketWrapper";
import { WorldRenderer } from "#root/WorldRenderer";
import { FullscreenSetup } from "#root/FullscreenSetup";
import { JoystickSetup } from "#root/JoystickSetup";
import { TouchscreenControlsSetup } from "#root/TouchscreenControlsSetup"
import { KeyboardControlsSetup } from "#root/KeyboardControlsSetup";
import { ServerConnectionStatusVisualizer } from "#root/ServerConnectionStatusVisualizer";
import { App } from "#root/App"
import { mustGetById} from "#root/RandomFuncs"

export { AppSetup };
class AppSetup {
  static prepareAndSetupStuff(ip: string) {
    AppSetup.initialVisualCSSStyleAdjustments();
    AppSetup.serverConnectionStuff(ip);
    if (App.isUserUsingAPhone()) {
      AppSetup.runJoystickSetupCode();
    } else {
      AppSetup.runKeyboardControlsSetupCode();
    }
    AppSetup.runFullscreenButtonSetupCode();
    AppSetup.runTouchscreenControlsSetupCode();
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
  
  
    static initialVisualCSSStyleAdjustments() {
        this.resizeFSButtonToAMoreIconeySize();
        this.setCanvasSizeToAvoidPixelatedRendering();
    }
    
    static resizeFSButtonToAMoreIconeySize() {
              // ensure the big fullscreen button icon is appropriately icon-sized. (Maybe I will resize the original image later instead?)
        const FSButtonImage = document.getElementById("fullscreenButtonIcon");
        if (FSButtonImage === null) {
            throw new Error("Could not find full screen button image element");

        }
        FSButtonImage.style.width = "50px";
        FSButtonImage.style.height = "50px";
    }
    
    static setCanvasSizeToAvoidPixelatedRendering() {
              /* unless I manually set canvas size to a big number like 1000, for some reason 
         if I don't set it, it will cause pixelated rendering... */
        const gameCanvas = <HTMLCanvasElement>mustGetById("gameCanvas");
        gameCanvas.width = 1000;
        gameCanvas.height = 1000;
   
    }
    

    // this is only a visual thingie for fun, I am not doing any actual manual reconnection.
    // I suppose socket.io does it automatically.
    static showConnectionStatusAndRetryTextIfConnectionTakesTooLong() {
        ServerConnectionStatusVisualizer.initialize();
    }

    static runFullscreenButtonSetupCode() {
        FullscreenSetup.buttonSetupCode();
    }

    static runJoystickSetupCode() {

        JoystickSetup.runTheSetupCode();
    }

    static runKeyboardControlsSetupCode() {
        KeyboardControlsSetup.runTheSetupCode();
    }
    static runTouchscreenControlsSetupCode() {
      TouchscreenControlsSetup.runTheSetupCode();
    }
}