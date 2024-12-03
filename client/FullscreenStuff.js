import { App } from "./App.js";

export { FullscreenStuff }

class FullscreenStuff {
  static doThisWhenTheUserClicksOnTheFullscreenButton() {
    const isFullscreenModeCurrentlyOn = Boolean(document.fullscreenElement);
    const isScreenOrientationSwitchingFunctionalityAvailable = Boolean(screen.orientation && screen.orientation.lock && screen.orientation.unlock);
    if (isFullscreenModeCurrentlyOn) {
      FullscreenStuff.doStuffToExitFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable);
      return;
    }
    FullscreenStuff.doStuffToEnterFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable);
  }
  static doStuffToExitFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable) {

    // css modifications for better visual experience
    FullscreenStuff.adjustCSSFor("nonFullscreen");
    document.exitFullscreen();
    // bring orient. to whatever is default
    if (App.isUserUsingAPhone() && isScreenOrientationSwitchingFunctionalityAvailable) {
      screen.orientation.unlock();
    }

  }
  static doStuffToEnterFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable) {
    FullscreenStuff.adjustCSSFor("fullscreen");
    const gameContainer = document.getElementById("gameContainer");
    gameContainer.requestFullscreen();
    // to landscape on fs if on mobile

    if (App.isUserUsingAPhone() && isScreenOrientationSwitchingFunctionalityAvailable) {
      screen.orientation.lock("landscape").catch(error => {
        console.log("Not on mobile but emulating mobile?");

      })
    }
  }
  static adjustCSSFor(screenMode) {
    this.adjustJoystickPositionToBetterFitScreenMode(screenMode);
  }
  static adjustJoystickPositionToBetterFitScreenMode(mode) {
    const joystickContainer = document.getElementById("joystickContainer");
    let joystickRightMargin;
    switch (mode) {
      case "fullscreen":
        joystickRightMargin = "140px";
        break;
      case 'nonFullscreen':
        joystickRightMargin = "50px";
        break;
    }
    joystickContainer.style.right = joystickRightMargin;
  }
}