import { App } from "#root/App"
import { AnimationLoop } from "#root/AnimationLoop"
import { AppSetup } from "#root/AppSetup"
import { SocketWrapper } from "#root/SocketWrapper"


export class ClientPreparation {
  static preparationBeforeClientCanConnectToAServer() {
    this.ipAddressFieldAndButton()
}
static ipAddressFieldAndButton() {
     const ip_address_button = document.getElementById("ip_address_button");
    if (ip_address_button === null) {
      throw new Error("ip_address_button not found");
    }
    const ip_address_field = document.getElementById("ip_address_field");
    if (ip_address_field === null) {
      throw new Error("ip_address_field not found")
    }
    ip_address_button.addEventListener("click", () => {

      this.runThisUponIPAddressSubmit();
    })
    ip_address_field.addEventListener("keydown", (e) => {

      if (e.key !== 'Enter') {
        return;
      }
      this.runThisUponIPAddressSubmit();
      }) 
}

  static runThisUponIPAddressSubmit() {
    const ip_address_field = <HTMLInputElement>document.getElementById("ip_address_field");
    if (ip_address_field === null) {
      throw new Error("ip_address_field not found");
    }
    const ip = ip_address_field.value;

    this.prepareAndConnect(ip);
  }
 
  static prepareAndConnect(ip: string) {
    this.hideIPChoiceAndShowGameContainer();
    AppSetup.prepareAndSetupStuff(ip);

    AnimationLoop.start();

    // Example usage of App.movementControlCommands
    // send whatever keys user presses every something secs
    setInterval(() => {
      
      const movementControlKeysArray = Array.from(App.movementControlCommands);
       //console.log(movementControlKeysArray)
      SocketWrapper.emit("controlKeys", {
        movement: movementControlKeysArray,
        speedUp: App.playerWantsToMoveFaster,
        zoom: App.zoom,
        intangibility: App.intangibility,
      });
      // reset zoom after sending so we do not keep zooming in or out more than once when user clicks 
      App.zoom = "no_change";
    }, 25);

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