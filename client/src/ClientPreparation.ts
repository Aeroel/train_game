import { App } from "#root/App"
import { AnimationLoop } from "#root/AnimationLoop"
import { AppSetup } from "#root/AppSetup"
import { SocketWrapper } from "#root/SocketWrapper"
import {CommandConsole} from "#root/CommandConsole"
import { mustGetById } from "#root/RandomFuncs"


export class ClientPreparation {
  static lastPingTime=0;
  static preparationBeforeClientCanConnectToAServer() {
    this.ipAddressFieldAndButton()
}
static ipAddressFieldAndButton() {
     const ip_address_button = mustGetById("ip_address_button");

    const ip_address_field = mustGetById("ip_address_field");

    ip_address_button.addEventListener("click", () => {

      this.runThisUponIPAddressSubmit();
    })
    ip_address_field.addEventListener("keydown", (e) => {
      const userPressedTheEnterKey = (e.key === 'Enter')
      if (!userPressedTheEnterKey) {
        return;
      }
      this.runThisUponIPAddressSubmit();
      }) 
}

  static runThisUponIPAddressSubmit() {
    const ip_address_field = <HTMLInputElement>mustGetById("ip_address_field");

    const ip = ip_address_field.value;

    this.prepareAndConnect(ip);
  }
 
  static prepareAndConnect(ip: string) {
    this.hideIPChoiceAndShowGameContainer();
    AppSetup.prepareAndSetupStuff(ip);

    AnimationLoop.start();

   this.sendUserInputToServer({everySoOften: 50});
    
   this.measurePing({pingServerEveryMs: 2000});
   CommandConsole.consoleStuff();

  }
  
  static sendUserInputToServer({everySoOften}:{everySoOften: number}) {
    // send whatever keys user presses every something secs
    setInterval(() => {
      
      const movementControlKeysArray = Array.from(App.movementControlCommands);

      SocketWrapper.emit("controlKeys", {
        movement: movementControlKeysArray,
        speedUp: App.playerWantsToMoveFaster,
        zoom: App.zoom,
        intangibility: App.intangibility,
      });
      // reset zoom after sending so we do not keep zooming in or out more than once when user clicks 
      App.zoom = "no_change";
    }, everySoOften);
  }
  
  
  
  static measurePing({pingServerEveryMs}: {pingServerEveryMs: number}) {
    setInterval(
    ()=>{
      SocketWrapper.emit("ping", "emptyMsg");
      this.lastPingTime=Date.now();
    }, pingServerEveryMs);
    
  SocketWrapper.on("pong",()=>{
    const pingMs = Date.now() - this.lastPingTime;
  const msg = `Ping: ${pingMs} ms`;
  const elem = mustGetById("ping");
  elem.innerText = msg;
    
  });
  }

  static hideIPChoiceAndShowGameContainer() {
    const server_ip_choice_container = mustGetById("server_ip_choice_container");

    const gameContainer =mustGetById("gameContainer");

    server_ip_choice_container.style.display = "none";
    gameContainer.style.display = "flex";
  }
}