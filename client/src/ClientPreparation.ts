import { App } from "#root/App"
import { AnimationLoop } from "#root/AnimationLoop"
import { AppSetup } from "#root/AppSetup"
import { SocketWrapper } from "#root/SocketWrapper"
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

      if (e.key !== 'Enter') {
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
    
   this.pingMeasurement();
   this.consoleStuff();

  }
  static consoleStuff() {
    const consoleCommandInputField = <HTMLInputElement>mustGetById("consoleCommandInputField");
    SocketWrapper.on("consoleMessages", (messages: string[]) =>{
       for (const msg of messages) {
         this.appendConsoleMessage(msg);
       };
       consoleCommandInputField.value=''
    });
    const consoleCommandSubmitButton = mustGetById("consoleCommandSubmitButton");

      
    consoleCommandSubmitButton.addEventListener("pointerup",()=>{
      const cmd = consoleCommandInputField.value;
         this.sendCommand(cmd)
    })
        consoleCommandInputField.addEventListener("keydown", (e) => {

      if (e.key !== 'Enter') {
        return;
      }
            const cmd = consoleCommandInputField.value;
      this.sendCommand(cmd);
      }) 
  }
  static sendCommand(cmd:string){
    SocketWrapper.emit("consoleCommand",cmd)
  }
  static appendConsoleMessage(msg: string) {
     const consoleMessagesContainer = mustGetById("consoleMessagesContainer")
    const msgDiv = document.createElement('div');
  msgDiv.textContent = msg;
  consoleMessagesContainer.appendChild(msgDiv);

  }
  
  
  static pingMeasurement() {
    setInterval(
    ()=>{
      SocketWrapper.emit("ping", "ok");
      this.lastPingTime=Date.now();
    }
    ,2000);
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