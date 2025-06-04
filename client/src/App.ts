export { App }
import { AppSetup } from "#root/AppSetup";
import { AnimationLoop } from "#root/AnimationLoop"
import { SocketWrapper } from "#root/SocketWrapper";
class App {
    static movementControlCommands = new Set();
    static initialize() {
        document.addEventListener("DOMContentLoaded", () => {
            App.runThisCodeOncePageIsFullyLoaded();
        })

    }

    static runThisCodeOncePageIsFullyLoaded() {
      const ip_address_button = document.getElementById("ip_address_button");
      if(ip_address_button === null) {
        throw new Error("ip_address_button not found");
      }
      const ip_address_field = document.getElementById("ip_address_field");
      if(ip_address_field === null) {
        throw new Error("ip_address_field not found")
      }
      ip_address_button.addEventListener("click", () => {

        App.runThisUponIPAddressSubmit();
      })
      ip_address_field.addEventListener("keydown", (e) => {

        if(e.key !== 'Enter') {
          return;
        }
        App.runThisUponIPAddressSubmit();
      })
      
    }
    static runThisUponIPAddressSubmit() {
            const ip_address_input = <HTMLInputElement>document.getElementById("ip_address_input");
      if(ip_address_input === null) {
        throw new Error("ip_address_input not found");
      }
      const ip = ip_address_input.value;
      
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

            const directionsArray = Array.from(App.movementControlCommands);
            // console.log(directionsArray)
            SocketWrapper.emit("movement", directionsArray);
        }, 100);

    }

    static isUserUsingAPhone() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
   static hideIPChoiceAndShowGameContainer() {
           const server_ip_choice_container = document.getElementById("server_ip_choice_container");
      if(server_ip_choice_container === null) {
        throw new Error("server_ip_choice_container not found");
      }
      const gameContainer = document.getElementById("gameContainer");
      if(gameContainer===null) {
        throw new Error("gameContainer not found");
      }
      server_ip_choice_container.style.display ="none";
      gameContainer.style.display ="flex";
   }
}