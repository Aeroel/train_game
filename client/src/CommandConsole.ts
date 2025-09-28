import {SocketWrapper} from "#root/SocketWrapper"
import { mustGetById} from "#root/RandomFuncs"
export class CommandConsole {
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

     const userPressedTheEnterKey = (e.key === 'Enter')
      if (!userPressedTheEnterKey) {
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
}