import { App } from "./App.js";
import { Socket } from "./Socket.js";
import { WorldRenderer } from "./WorldRenderer.js";
import { FullscreenStuff } from "./FullscreenStuff.js";
import { RandomFunctionsIUse } from "./RandomFunctionsIUse.js";

export { AppSetup };
class AppSetup {
    static initialVisualCSSStyleAdjustments() {
        // ensure the big fullscreen button icon is appropriately icon-sized. (Maybe I will resize the original image later instead?)
        const FSButtonImage = document.getElementById("fullscreenButtonIcon");
        FSButtonImage.style.width = "50px";
        FSButtonImage.style.height = "50px";

        // unless I manually set canvas size to a big number like 1000, for some reason 
        // if I don't set it, it will cause pixelated rendering...
        const gameCanvas = document.getElementById("gameCanvas");
        gameCanvas.width = 1000;
        gameCanvas.height = 1000;

    }
    static serverConnectionStuff() {
        Socket.establishConnection();
        const socket = Socket.get();
        socket.on("welcome", (message) => {
            console.log(message);
        });
        socket.on("newWorldState", (newWorldState) => {
            WorldRenderer.receiveWorldState(newWorldState);
        });


        this.showConnectionStatusAndRetryTextIfConnectionTakesTooLong();


    }
    // this is only a visual thingie for fun, I am not doing any actual manual reconnection.
    // I suppose socket.io does it automatically.
    static showConnectionStatusAndRetryTextIfConnectionTakesTooLong() {
        const serverMessage = document.getElementById("serverMessage");
        serverMessage.style.color = "white";
        serverMessage.textContent = "Connecting to server ...";

        let retryCount = 0;
        let sayIsReconnecting = false;
        const retryVisualInterval = 2000;
        let lastRetryVisualCountIncreaseTime = Date.now();
        let makeBelieveFakeRetryCount = (() => {
            if (!socket.connected) {
                retryCount++;
            }
            let retryMessage = `${retryCount > 2 ? "Still t" : "T"}rying to ${sayIsReconnecting ? "re" : ""}connect... Attempt #${retryCount}`;
            serverMessage.textContent = retryMessage;
        });
        const socket = Socket.get();
        socket.on("connect_error", () => {
            const timeToIncreaseCount = Boolean(lastRetryVisualCountIncreaseTime + retryVisualInterval < Date.now());
            if (timeToIncreaseCount) {
                lastRetryVisualCountIncreaseTime = Date.now();
                makeBelieveFakeRetryCount();
            }
        });
        socket.on("connect", () => {
            retryCount = 0;
            serverMessage.textContent = "Connected to server.";
        });
        socket.on("disconnect", () => {
            serverMessage.textContent = "Connection lost...";
            isReconnecting = true;
            //setInterval(makeBelieveFakeRetryCount, waitBetweenRetriesMs);
        });
    }

    static runFullscreenButtonCode() {
        const fullscreenButton = document.getElementById("fullscreenButton");

        // Fullscreen function
        fullscreenButton.addEventListener("click", async () => {
            FullscreenStuff.doThisWhenTheUserClicksOnTheFullscreenButton();
        });

    }

    static runJoystickSetupCode() {

        const joystickContainer = document.getElementById("joystickContainer");
        const joystick = document.getElementById("joystick");

        joystickContainer.style.display = "block";

        // Track joystick movements
        joystickContainer.addEventListener("touchmove", (e) => {
            AppSetup.runComplicatedJoystickMovementSetupCodeIDoNotCompletelyUnderstand(e, joystickContainer, joystick);
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