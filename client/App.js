export { App }
import { io } from "./externalScripts/socket.io.esm.min.js";
class App {
    static isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    static init() {
        document.addEventListener("DOMContentLoaded", () => {
            App.oncePageFullyLoaded();
        })
        
    }
    static oncePageFullyLoaded() {
        
        const socket = io("http://127.0.0.1:3000");
        socket.on("welcome", (message) => {
            console.log(message);
        });
        socket.on("worldUpdate", (newWorldState) => {

        })
        const gameContainer = document.getElementById("gameContainer")
        const canvas = document.getElementById("gameCanvas");
        const fullscreenButton = document.getElementById("fullscreenButton");
        const joystickContainer = document.getElementById("joystickContainer");
        joystickContainer.style.display = "none";
        if(App.isMobile()) {
            joystickContainer.style.display = "block";
        } 
        const joystick = document.getElementById("joystick");
        
        // Fullscreen function
        fullscreenButton.addEventListener("click", async () => {
            // enter fs if not in fs
          if (!document.fullscreenElement) {
            await gameContainer.requestFullscreen();
            // to landscape on fs
            if(screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock("landscape")
            }
            return;
          } 
          // else exit fs if in fs mode
          await document.exitFullscreen();
          // bring orient. to whatever is default
          if(screen.orientation && screen.orientation.lock) {
            screen.orientation.unlock();
        }
        });
      
        // Joystick control states
        const controlKeys = new Set();
      
        // Track joystick movements
        joystickContainer.addEventListener("touchmove", (e) => {
          const touch = e.touches[0];
          const rect = joystickContainer.getBoundingClientRect();
          const dx = touch.clientX - (rect.left + rect.width / 2);
          const dy = touch.clientY - (rect.top + rect.height / 2);
      
          // Determine direction based on dx, dy
          const threshold = 10; // Threshold to avoid minor movements
          controlKeys.clear();
      
          if (dy < -threshold) controlKeys.add("up");
          if (dy > threshold) controlKeys.add("down");
          if (dx < -threshold) controlKeys.add("left");
          if (dx > threshold) controlKeys.add("right");
      
          // Ensure no conflicting directions
          if (controlKeys.has("up") && controlKeys.has("down")) {
            controlKeys.delete("up");
            controlKeys.delete("down");
          }
          if (controlKeys.has("left") && controlKeys.has("right")) {
            controlKeys.delete("left");
            controlKeys.delete("right");
          }
      
          // Position joystick element within container
          joystick.style.top = `${Math.min(Math.max(touch.clientY - rect.top, 0), rect.height) - 20}px`;
          joystick.style.left = `${Math.min(Math.max(touch.clientX - rect.left, 0), rect.width) - 20}px`;
      
          e.preventDefault();
        });
      
        // Reset joystick on touchend
        joystickContainer.addEventListener("touchend", () => {
          controlKeys.clear();
          joystick.style.top = "50%";
          joystick.style.left = "50%";
        });
      
        // Example usage of controlKeys
        setInterval(() => {
          const directionsArray = Array.from(controlKeys);
          console.log(directionsArray); // Logs the active directions
        }, 100);
      
    }
}