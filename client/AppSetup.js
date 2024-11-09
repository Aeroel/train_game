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
        socket.on("worldUpdate", (newWorldState) => {
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

        joystickContainer.style.display = "none";
        if (App.isMobile()) {
            joystickContainer.style.display = "block";
        }

        // Track joystick movements
        joystickContainer.addEventListener("touchmove", (e) => {
            const touch = e.touches[0];
            const rect = joystickContainer.getBoundingClientRect();
            const dx = touch.clientX - (rect.left + rect.width / 2);
            const dy = touch.clientY - (rect.top + rect.height / 2);

            // Determine direction based on dx, dy
            const threshold = 10; // Threshold to avoid minor movements
            App.controlKeys.clear();

            if (dy < -threshold) App.controlKeys.add("up");
            if (dy > threshold) App.controlKeys.add("down");
            if (dx < -threshold) App.controlKeys.add("left");
            if (dx > threshold) App.controlKeys.add("right");

            // Ensure no conflicting directions
            if (App.controlKeys.has("up") && App.controlKeys.has("down")) {
                App.controlKeys.delete("up");
                App.controlKeys.delete("down");
            }
            if (App.controlKeys.has("left") && App.controlKeys.has("right")) {
                App.controlKeys.delete("left");
                App.controlKeys.delete("right");
            }

            // Position joystick element within container
            joystick.style.top = `${Math.min(Math.max(touch.clientY - rect.top, 0), rect.height) - 20}px`;
            joystick.style.left = `${Math.min(Math.max(touch.clientX - rect.left, 0), rect.width) - 20}px`;

            e.preventDefault();
        });

        // Reset joystick on touchend
        joystickContainer.addEventListener("touchend", () => {
            App.controlKeys.clear();
            joystick.style.top = "50%";
            joystick.style.left = "50%";
        });

    }
}