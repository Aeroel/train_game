import { App } from "./App.js";
export { FullscreenSetup };
class FullscreenSetup {
    static buttonSetupCode() {
        const fullscreenButton = document.getElementById("fullscreenButton");
        if (fullscreenButton === null) {
            throw new Error("fullscreenButton is null");
        }
        // Fullscreen function
        fullscreenButton.addEventListener("click", async () => {
            FullscreenSetup.doThisWhenTheUserClicksOnTheFullscreenButton();
        });
    }
    static doThisWhenTheUserClicksOnTheFullscreenButton() {
        const isFullscreenModeCurrentlyOn = Boolean(document.fullscreenElement);
        // again, ts says screen.orientation.lock is not found
        // @ts-ignore
        const isScreenOrientationSwitchingFunctionalityAvailable = Boolean(screen.orientation && screen.orientation.lock && screen.orientation.unlock);
        if (isFullscreenModeCurrentlyOn) {
            FullscreenSetup.doStuffToExitFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable);
            return;
        }
        FullscreenSetup.doStuffToEnterFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable);
    }
    static doStuffToExitFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable) {
        // css modifications for better visual experience
        FullscreenSetup.adjustCSSFor("nonFullscreen");
        document.exitFullscreen();
        // bring orient. to whatever is default
        if (App.isUserUsingAPhone() && isScreenOrientationSwitchingFunctionalityAvailable) {
            screen.orientation.unlock();
        }
    }
    static doStuffToEnterFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable) {
        FullscreenSetup.adjustCSSFor("fullscreen");
        const gameContainer = document.getElementById("gameContainer");
        if (gameContainer === null) {
            throw new Error('gameContainer is null');
        }
        gameContainer.requestFullscreen();
        // to landscape on fs if on mobile
        if (App.isUserUsingAPhone() && isScreenOrientationSwitchingFunctionalityAvailable) {
            // TS says lock method does not exist
            // lock does not exist normally, I guess? Maybe on mobile only?
            // @ts-ignore
            screen.orientation.lock("landscape").catch((error) => {
                console.log("Not on mobile but emulating mobile?");
            });
        }
    }
    static adjustCSSFor(screenMode) {
        this.adjustJoystickPositionToBetterFitScreenMode(screenMode);
    }
    static adjustJoystickPositionToBetterFitScreenMode(mode) {
        const joystickContainer = document.getElementById("joystickContainer");
        if (joystickContainer === null) {
            throw new Error("Can't find joystickContainer");
        }
        let joystickRightMargin;
        switch (mode) {
            case "fullscreen":
                joystickRightMargin = "140px";
                break;
            case 'nonFullscreen':
                joystickRightMargin = "50px";
                break;
            default:
                throw new Error(`Invalid mode ${mode}`);
                break;
        }
        joystickContainer.style.right = joystickRightMargin;
    }
}
