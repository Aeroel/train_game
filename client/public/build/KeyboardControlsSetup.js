import { App } from "./App.js";
export { KeyboardControlsSetup };
class KeyboardControlsSetup {
    static runTheSetupCode() {
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
