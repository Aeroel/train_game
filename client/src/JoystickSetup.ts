import { App } from "#root/App";

export { JoystickSetup };

class JoystickSetup {
  // Track the active pointerId for the joystick
  static activePointerId: number | null = null;

  static runTheSetupCode() {
    const joystickContainer = document.getElementById("joystickContainer");
    const joystick = document.getElementById("joystick");

    if (joystickContainer === null) {
      throw new Error("joystickContainer not found");
    }

    if (joystick === null) {
      throw new Error("joystick not found");
    }

    joystickContainer.style.display = "block";

    // Pointer down: start tracking this pointer if none active
    joystickContainer.addEventListener("pointerdown", (e) => {
      // Only track one pointer for joystick at a time
      if (JoystickSetup.activePointerId === null) {
        JoystickSetup.activePointerId = e.pointerId;
        joystick.setPointerCapture(e.pointerId);
        JoystickSetup.updateMovement(e, joystickContainer, joystick);
      }
    });

    // Pointer move: update movement only if this pointer is active
    joystickContainer.addEventListener("pointermove", (e) => {
      if (e.pointerId === JoystickSetup.activePointerId) {
        JoystickSetup.updateMovement(e, joystickContainer, joystick);
      }
    });

    // Pointer up or cancel: release joystick control if active pointer ends
    const pointerEndHandler = (e: PointerEvent) => {
      if (e.pointerId === JoystickSetup.activePointerId) {
        App.movementControlCommands.clear();
        joystick.style.top = "50%";
        joystick.style.left = "50%";
        joystick.releasePointerCapture(e.pointerId);
        JoystickSetup.activePointerId = null;
      }
    };

    joystickContainer.addEventListener("pointerup", pointerEndHandler);
    joystickContainer.addEventListener("pointercancel", pointerEndHandler);
  }

  static updateMovement(
    e: PointerEvent,
    joystickContainer: HTMLElement,
    joystick: HTMLElement
  ) {
    const rect = joystickContainer.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);

    const threshold = 10; // Threshold to avoid minor movements
    App.movementControlCommands.clear();

    if (dy < -threshold) App.movementControlCommands.add("up");
    if (dy > threshold) App.movementControlCommands.add("down");
    if (dx < -threshold) App.movementControlCommands.add("left");
    if (dx > threshold) App.movementControlCommands.add("right");

    // Avoid conflicting directions
    if (
      App.movementControlCommands.has("up") &&
      App.movementControlCommands.has("down")
    ) {
      App.movementControlCommands.delete("up");
      App.movementControlCommands.delete("down");
    }
    if (
      App.movementControlCommands.has("left") &&
      App.movementControlCommands.has("right")
    ) {
      App.movementControlCommands.delete("left");
      App.movementControlCommands.delete("right");
    }

    // Update joystick visual position within container bounds
    const posX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width) - 20;
    const posY = Math.min(Math.max(e.clientY - rect.top, 0), rect.height) - 20;

    joystick.style.left = `${posX}px`;
    joystick.style.top = `${posY}px`;

    e.preventDefault(); // Prevent scrolling or other default actions
  }
}
