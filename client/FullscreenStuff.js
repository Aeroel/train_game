import { App } from "./App.js";

export { FullscreenStuff }

class FullscreenStuff {
  static doThisWhenTheUserClicksOnTheFullscreenButton() {
            const isFullscreenModeCurrentlyOn =  Boolean(document.fullscreenElement);
                            const isScreenOrientationSwitchingFunctionalityAvailable = Boolean(screen.orientation && screen.orientation.lock && screen.orientation.unlock);
            if (isFullscreenModeCurrentlyOn) {
              FullscreenStuff.adjustJoystickPositionToBetterFitScreenMode("nonFullScreen");
              joystickContainer.style.right="50px";
               
                           FullscreenStuff.doStuffToExitFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable);
                      return;
            }
            FullscreenStuff.adjustJoystickPositionToBetterFitScreenMode("fullscreen");
            joystickContainer.style.right = "140px";
                FullscreenStuff.doStuffToEnterFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable);
  }
  static doStuffToExitFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable) {
                document.exitFullscreen();
            // bring orient. to whatever is default
            if (App.isUserUsingAPhone() && isScreenOrientationSwitchingFunctionalityAvailable) {
                screen.orientation.unlock();
            }
  }
  static doStuffToEnterFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable) {
    const gameContainer = document.getElementById("gameContainer");
                    gameContainer.requestFullscreen();
                // to landscape on fs if on mobile

                if (App.isUserUsingAPhone() && isScreenOrientationSwitchingFunctionalityAvailable) {
                    screen.orientation.lock("landscape").catch(error => {
                        console.log("Not on mobile but emulating mobile?");

                    })
                }
  }
  static adjustJoystickPositionToBetterFitScreenMode(mode) {
                     const joystickContainer = document.getElementById("joystickContainer");
switch(mode) {
  case "fullscreen":
    
  break;
  case 'nonFullScreen':
    
    break;
}
  }
}