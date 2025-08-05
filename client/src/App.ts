import {ClientPreparation} from "#root/ClientPreparation"
import { AppSetup } from "#root/AppSetup";
import { AnimationLoop } from "#root/AnimationLoop"
import { SocketWrapper } from "#root/SocketWrapper";
export class App {
  static movementControlCommands = new Set();
  static playerWantsToMoveFaster = false;
  static zoom: "no_change" | "in" | "out" = "no_change";
  static intangibility = false;
  static initialize() {
    document.addEventListener("DOMContentLoaded", () => {
      App.runThisCodeOncePageIsFullyLoaded();
    })

  }
  
    static runThisCodeOncePageIsFullyLoaded() {
      ClientPreparation.preparationBeforeClientCanConnectToAServer();

  }
  
    static isUserUsingAPhone() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
}