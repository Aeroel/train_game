import { App } from "#root/App";

export { FullscreenSetup };


class FullscreenSetup {
  static buttonSetupCode() {
    const fullscreenButton = document.getElementById("fullscreenButton");
    if(fullscreenButton === null) {
      throw new Error("fullscreenButton is null");
      
    }

    // Fullscreen function
    // I wonder why is is async?
    fullscreenButton.addEventListener("click", async () => {
      FullscreenSetup.doThisWhenTheUserClicksOnTheFullscreenButton();
    });

  }
  
  static doThisWhenTheUserClicksOnTheFullscreenButton() {
    const userIsInFullscreenModeRightNow = Boolean(document.fullscreenElement);

    // again, ts says screen.orientation.lock is not found
    // @ts-ignore
    const isScreenOrientationSwitchingFunctionalityAvailable = Boolean(screen.orientation && screen.orientation.lock && screen.orientation.unlock);
    if (userIsInFullscreenModeRightNow) {
      FullscreenSetup.doStuffToExitFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable);
      return;
    }
    FullscreenSetup.doStuffToEnterFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable);
  }
  static doStuffToExitFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable: boolean) {



    document.exitFullscreen().then(()=>{
          FullscreenSetup.adjustPositionsOfButtonsFor("nonFullscreen");
              if (App.isUserUsingAPhone()) {
     this.releaseUsersScreenOrientationAfterExitingFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable);
    }
    });


  }
  
  static releaseUsersScreenOrientationAfterExitingFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable: boolean) {
    if(!isScreenOrientationSwitchingFunctionalityAvailable) {
      return;
    }
    
          screen.orientation.unlock();
  }
  
  
  static doStuffToEnterFullscreenMode(isScreenOrientationSwitchingFunctionalityAvailable: boolean) {

    const gameContainer = document.getElementById("gameContainer");
    if(gameContainer === null) {
      throw new Error('gameContainer is null');
    }
    gameContainer.requestFullscreen().then(()=>{
          FullscreenSetup.adjustPositionsOfButtonsFor("fullscreen");
              // to landscape on fs if on mobile

    if (App.isUserUsingAPhone()) {
       this.switchScreenToLandscapeForMoreGameyExperience(isScreenOrientationSwitchingFunctionalityAvailable);
    }
    });

  }
  
  static switchScreenToLandscapeForMoreGameyExperience( isScreenOrientationSwitchingFunctionalityAvailable: boolean) {
    if(!isScreenOrientationSwitchingFunctionalityAvailable) {
      return;
    }
    
      // TS says lock method does not exist
      // lock does not exist normally, I guess? Maybe on mobile only?
      // @ts-ignore
      screen.orientation.lock("landscape").catch((error: any) => {
        console.log("Not on mobile but emulating mobile?");

      });
  }
  
  
  static adjustPositionsOfButtonsFor(screenMode: string) {
    this.adjustJoystickPositionToBetterFitScreenMode(screenMode);
    this.adjustZoomButtons(screenMode);
    this.adjustIntangibilityButton(screenMode);
    this.adjustConsole(screenMode);
  }   
    
  static adjustConsole(screenMode: string) {
    // todo
  }
  
  
  static adjustIntangibilityButton(screenMode: string) {
    const intangibilityButton = document.getElementById("intangibilityButton");
    if(intangibilityButton === null) {
      throw new Error("intangibilityButton is null");
    }
    const intangibilityButtonMargin = {top:"10px", right:"80px"};
    switch(screenMode) {
      case "fullscreen":
         intangibilityButtonMargin.top = "10p "
         intangibilityButtonMargin.right = "180px" 
      break;
      case "nonFullscreen":
        intangibilityButtonMargin.top = "10px"
         intangibilityButtonMargin.right = "80px"
      break;
      default:
         throw new Error(`Invalid mode ${screenMode}`)
      break;
    }
    intangibilityButton.style.top = intangibilityButtonMargin.top;
    intangibilityButton.style.right = intangibilityButtonMargin.right;
  }
  
  
  static adjustZoomButtons(screenMode: string) {
        const zoomInButton = document.getElementById("zoomInButton");
        const zoomOutButton = document.getElementById("zoomOutButton");
        
    if(zoomOutButton === null || zoomInButton === null) {
      throw new Error("Can't find zoomInButton and/or zoomOutButton");
      
    }
    let zoomInButtonMargin = {top: "150px", right: "20px"};
    let zoomOutButtonMargin = {top: "200px", right: "20px"};
    switch (screenMode) {
      case "fullscreen":
        zoomInButtonMargin = {
          top: "10px", right: "100px"
        };
        zoomOutButtonMargin = {
          top: "70px", right: "100px"
        };
        break;
      case 'nonFullscreen':
        zoomInButtonMargin = {
          top: "150px", right: "20px"
        };
        zoomOutButtonMargin = {
          top: "200px", right: "20px"
        };
        break;
      default:
        throw new Error(`Invalid mode ${screenMode}`);
        
      break;
    }
    zoomInButton.style.right = zoomInButtonMargin.right;
    zoomInButton.style.top = zoomInButtonMargin.top;
 
    zoomOutButton.style.right = zoomOutButtonMargin.right;
    zoomOutButton.style.top = zoomOutButtonMargin.top;
  }
  
  
  static adjustJoystickPositionToBetterFitScreenMode(mode: string) {
    const joystickContainer = document.getElementById("joystickContainer");
    if(joystickContainer === null) {
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