export { App }
import { AppSetup } from "#root/AppSetup";
import { AnimationLoop } from "#root/AnimationLoop"
import { SocketWrapper } from "#root/SocketWrapper";
class App {
  static movementControlCommands = new Set();
  static playerWantsToMoveFaster = false;
  static initialize() {
    document.addEventListener("DOMContentLoaded", () => {
      App.runThisCodeOncePageIsFullyLoaded();
    })

  }

  static runThisCodeOncePageIsFullyLoaded() {
   const speedup_button = document.getElementById("speedupButton");
   if(speedup_button === null) {
     throw new Error("speedup_button not found");
   }
   const speedup_state_image= document.getElementById("speedupStateImage") as HTMLImageElement;
   if(speedup_state_image === null) {
     throw new Error("speedup_state_image not found");
   }
   const baseImg = "./images/Speedup";
   speedup_button.addEventListener("click",()=> {
     App.playerWantsToMoveFaster = !(App.playerWantsToMoveFaster)
      let image = "False.jpg";
     if(App.playerWantsToMoveFaster) {
       image = "True.jpg";
     }
      speedup_state_image.src = `${baseImg}_${image}`;
   })
    const ip_address_button = document.getElementById("ip_address_button");
    if (ip_address_button === null) {
      throw new Error("ip_address_button not found");
    }
    const ip_address_field = document.getElementById("ip_address_field");
    if (ip_address_field === null) {
      throw new Error("ip_address_field not found")
    }
    ip_address_button.addEventListener("click", () => {

      App.runThisUponIPAddressSubmit();
    })
    ip_address_field.addEventListener("keydown", (e) => {

      if (e.key !== 'Enter') {
        return;
      }
      App.runThisUponIPAddressSubmit();
    })

  }
  static runThisUponIPAddressSubmit() {
    const ip_address_field = <HTMLInputElement>document.getElementById("ip_address_field");
    if (ip_address_field === null) {
      throw new Error("ip_address_field not found");
    }
    const ip = ip_address_field.value;

    App.hideIPChoiceAndShowGameContainer();
    App.runThisAfterIPAddressIsEntered(ip);
  }
  static runThisAfterIPAddressIsEntered(ip: string) {
    AppSetup.initialVisualCSSStyleAdjustments();
    AppSetup.serverConnectionStuff(ip);
    if (App.isUserUsingAPhone()) {
      AppSetup.runJoystickSetupCode();
    } else {
      AppSetup.runKeyboardControlsSetupCode();
    }
    AppSetup.runFullscreenButtonCode();

    AnimationLoop.start();

    // Example usage of App.movementControlCommands
    // send whatever keys user presses every 0.1 secs
    setInterval(() => {
      
      const movementControlKeysArray = Array.from(App.movementControlCommands);
       //console.log(movementControlKeysArray)
      SocketWrapper.emit("controlKeys", {
        movement: movementControlKeysArray,
        speedUp: App.playerWantsToMoveFaster,

      });
    }, 25);

  }

  static isUserUsingAPhone() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  static hideIPChoiceAndShowGameContainer() {
    const server_ip_choice_container = document.getElementById("server_ip_choice_container");
    if (server_ip_choice_container === null) {
      throw new Error("server_ip_choice_container not found");
    }
    const gameContainer = document.getElementById("gameContainer");
    if (gameContainer === null) {
      throw new Error("gameContainer not found");
    }
    server_ip_choice_container.style.display = "none";
    gameContainer.style.display = "flex";
  }
}