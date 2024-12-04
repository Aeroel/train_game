import { App } from "./App.js";

export { JoystickSetup };

class JoystickSetup {
    static runTheSetupCode() {
        const joystickContainer = document.getElementById("joystickContainer");
        const joystick = document.getElementById("joystick");

        joystickContainer.style.display = "block";

        // Track joystick movements
        joystickContainer.addEventListener("touchmove", (e) => {
            this.update_the_current_movement_commands_based_on_how_the_user_is_dragging_the_joystick(e, joystickContainer, joystick);
        });

        // Reset joystick on touchend
        joystickContainer.addEventListener("touchend", () => {
            App.movementControlCommands.clear();
            joystick.style.top = "50%";
            joystick.style.left = "50%";
        });
    }
    static update_the_current_movement_commands_based_on_how_the_user_is_dragging_the_joystick(e, joystickContainer, joystick) {
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

        // what does this do, initialize position or update every joystick touch?? not sure
        joystick.style.top = `${Math.min(Math.max(touch.clientY - rect.top, 0), rect.height) - 20}px`;
        joystick.style.left = `${Math.min(Math.max(touch.clientX - rect.left, 0), rect.width) - 20}px`;

        e.preventDefault();
    }
}