import { App } from "#root/App";

export { JoystickSetup };

// this class seems complicated for me.
// can it be improved? I am not sure. well, almsot certainly yes, in theory and probably in practice as well
class JoystickSetup {
    // what is this again? Sounds very technical
    static activePointerId: number | null = null;

    static runTheSetupCode() {
        const joystickContainer = document.getElementById("joystickContainer");
        const joystick = document.getElementById("joystick");
        if (!joystickContainer) throw new Error("joystickContainer not found");
        if (!joystick) throw new Error("joystick not found");

        joystickContainer.style.display = "block";

        joystickContainer.addEventListener("pointerdown", (e) => {
            // Only start tracking if the pointer is down inside the container
            if (JoystickSetup.activePointerId !== null) return; // already tracking another pointer
            JoystickSetup.activePointerId = e.pointerId;

            const moveHandler = (ev: PointerEvent) => {
                if (ev.pointerId !== JoystickSetup.activePointerId) return;
                JoystickSetup.updateJoystickMovement(ev, joystickContainer, joystick);
            };

            const upHandler = (ev: PointerEvent) => {
                if (ev.pointerId !== JoystickSetup.activePointerId) return;

                App.movementControlCommands.clear();
                joystick.style.top = "50%";
                joystick.style.left = "50%";
                JoystickSetup.activePointerId = null;

                document.removeEventListener("pointermove", moveHandler);
                document.removeEventListener("pointerup", upHandler);
                document.removeEventListener("pointercancel", upHandler);
            };

            document.addEventListener("pointermove", moveHandler);
            document.addEventListener("pointerup", upHandler);
            document.addEventListener("pointercancel", upHandler);
        });
    }

    static updateJoystickMovement(e: PointerEvent, joystickContainer: HTMLElement, joystick: HTMLElement) {
        const rect = joystickContainer.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);

        const threshold = 10;
        App.movementControlCommands.clear();

        if (dy < -threshold) App.movementControlCommands.add("up");
        if (dy > threshold) App.movementControlCommands.add("down");
        if (dx < -threshold) App.movementControlCommands.add("left");
        if (dx > threshold) App.movementControlCommands.add("right");

        // Remove conflicting directions
        if (App.movementControlCommands.has("up") && App.movementControlCommands.has("down")) {
            App.movementControlCommands.delete("up");
            App.movementControlCommands.delete("down");
        }
        if (App.movementControlCommands.has("left") && App.movementControlCommands.has("right")) {
            App.movementControlCommands.delete("left");
            App.movementControlCommands.delete("right");
        }

        const joystickX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width) - 20;
        const joystickY = Math.min(Math.max(e.clientY - rect.top, 0), rect.height) - 20;
        joystick.style.left = `${joystickX}px`;
        joystick.style.top = `${joystickY}px`;
    }
}
