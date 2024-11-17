import { App } from "./App.js";
import { Socket } from "./Socket.js";
import { WorldRenderer } from "./WorldRenderer.js";

export { AppSetup }
class AppSetup {
    static serverConnectionStuff() {
        Socket.establishConnection();
        const socket = Socket.get();

        socket.on("welcome", (message) => {
            console.log(message);
        });
        socket.on("newWorldState", (newWorldState) => {
            WorldRenderer.receiveWorldState(newWorldState);
        })
        const serverMessage = document.getElementById("serverMessage");
        serverMessage.style.color = "white";
        serverMessage.textContent = "Connecting to server ...";

        let retryCount = 0;
        const waitBetweenRetriesMs = 2000;
        let retryInterval = setInterval(() => {
            if (!socket.connected) {
                retryCount++;
                serverMessage.textContent = `Still trying to connect... Retry #${retryCount}`;
            }
        }, waitBetweenRetriesMs);

        socket.on("connect", () => {
            clearInterval(retryInterval);
            serverMessage.textContent = "Connected to server.";
        })
        socket.on("disconnect", () => {
            serverMessage.textContent = "Connection lost..."
        })

    }

    static runFullscreenButtonCode() {
        const fullscreenButton = document.getElementById("fullscreenButton");

        // Fullscreen function
        fullscreenButton.addEventListener("click", async () => {
            // enter fs if not in fs
            if (!document.fullscreenElement) {
                await gameContainer.requestFullscreen();
                // to landscape on fs if on mobile
                if (App.isMobile() && screen.orientation && screen.orientation.lock) {
                    await screen.orientation.lock("landscape").catch(error => {
                        console.log("Not on mobile but emulating mobile?");

                    })
                }
                return;
            }
            // else exit fs if in fs mode
            await document.exitFullscreen();
            // bring orient. to whatever is default
            if (App.isMobile() && screen.orientation && screen.orientation.unlock) {
                await screen.orientation.unlock();
            }
        });

    }
    static runJoystickSetupCode() {

        const joystickContainer = document.getElementById("joystickContainer");
        const joystick = document.getElementById("joystick");

        joystickContainer.style.display = "block";

        // Track joystick movements
        joystickContainer.addEventListener("touchmove", (e) => {
            AppSetup.runComplicatedJoystickMovementSetupCodeIDoNotCompletelyUnderstand(e, joystickContainer, joystick)
        });

        // Reset joystick on touchend
        joystickContainer.addEventListener("touchend", () => {
            App.movementControlCommands.clear();
            joystick.style.top = "50%";
            joystick.style.left = "50%";
        });

    }
    static runComplicatedJoystickMovementSetupCodeIDoNotCompletelyUnderstand(e, joystickContainer, joystick) {
        const touch = e.touches[0];
        const rect = joystickContainer.getBoundingClientRect();
        const dx = touch.clientX - (rect.left + rect.width / 2);
        const dy = touch.clientY - (rect.top + rect.height / 2);

        // Determine direction based on dx, dy
        const threshold = 10; // Threshold to avoid minor movements
        App.movementControlCommands.clear();

        if (dy < -threshold) App.movementControlCommands.add("up");
        if (dy > threshold) App.movementControlCommands.add("down");
        if (dx < -threshold) App.movementControlCommands.add("left");
        if (dx > threshold) App.movementControlCommands.add("right");

        // Ensure no conflicting directions
        if (App.movementControlCommands.has("up") && App.movementControlCommands.has("down")) {
            App.movementControlCommands.delete("up");
            App.movementControlCommands.delete("down");
        }
        if (App.movementControlCommands.has("left") && App.movementControlCommands.has("right")) {
            App.movementControlCommands.delete("left");
            App.movementControlCommands.delete("right");
        }

        // Position joystick element within container
        joystick.style.top = `${Math.min(Math.max(touch.clientY - rect.top, 0), rect.height) - 20}px`;
        joystick.style.left = `${Math.min(Math.max(touch.clientX - rect.left, 0), rect.width) - 20}px`;

        e.preventDefault();
    }
    static runKeyboardControlsSetupCode() {
        const controlCommandsToKeyNamesMapping = {
            up: ["KeyW", "ArrowUp"],
            down: ["KeyS", "ArrowDown"],
            left: ["KeyA", "ArrowLeft"],
            right: ["KeyD", "ArrowRight"],
        };
    
        document.addEventListener("keydown", event => {
            // Iterate through the mapping to find a match for the pressed key
            for (const [controlCommandName, keyNames] of Object.entries(controlCommandsToKeyNamesMapping)) {
                
                if (keyNames.includes(event.code)) {
                    App.movementControlCommands.add(controlCommandName); // Add the control name to the active keys
                    break; // Exit the loop once a match is found
                }
            }
        });
    
        document.addEventListener("keyup", event => {
            // Iterate through the mapping to find a match for the released key
            for (const [controlCommandName, keyNames] of Object.entries(controlCommandsToKeyNamesMapping)) {
                if (keyNames.includes(event.code)) {
                    App.movementControlCommands.delete(controlCommandName); // Remove the control name from the active keys
                    break; // Exit the loop once a match is found
                }
            }
        });
    }
}