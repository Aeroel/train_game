import { App } from "#root/App"

export class TouchscreenControlsSetup {
  static runTheSetupCode() {
    this.intangibilityButton();
 this.zoomButtons();
 this.speedUpButton();
 this.console();
  }
  static console() {
    const showConsoleButton = document.getElementById("showConsoleButton");
    if(!showConsoleButton) {
      throw new Error('Html element showConsoleButton not found')
    }
    const consoleContainer = document.getElementById("console");
   if(!consoleContainer) {
      throw new Error('Html element consoleContainer not found')
    }
    const hideConsoleButton = document.getElementById("hideConsoleButton");
   if(!hideConsoleButton) {
      throw new Error('Html element hideConsoleButton not found')
    }
    
    
    showConsoleButton.addEventListener('pointerup', ()=>{
      consoleContainer.style.display = "block";
    });
    hideConsoleButton.addEventListener('pointerup', ()=>{
      consoleContainer.style.display = "none";
    });
  }
    static intangibilityButton() {
          const intangibilityButton = document.getElementById("intangibilityButton");
   if(intangibilityButton === null) {
     throw new Error("intangibilityButton not found");
   }
   intangibilityButton.addEventListener("pointerup",()=> {
     App.intangibility = !(App.intangibility)
   })
  }
  
  
  static zoomButtons() {
       const zoomInButton = document.getElementById("zoomInButton");
       const zoomOutButton = document.getElementById("zoomOutButton");
   if(zoomInButton === null || zoomOutButton === null) {
     throw new Error("zoomInButton and/or zoomOutButton not found");
   }
   zoomInButton.addEventListener("pointerup",()=> {
     App.zoom = "in";
   })   
   zoomOutButton.addEventListener("pointerup",()=> {
     App.zoom = "out";
   })   
  }
  
  
 static speedUpButton() {
      const speedup_button = document.getElementById("speedupButton");
   if(speedup_button === null) {
     throw new Error("speedup_button not found");
   }
   speedup_button.addEventListener("pointerup",()=> {
     App.playerWantsToMoveFaster = !(App.playerWantsToMoveFaster)
   })
 }
}