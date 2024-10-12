class InteractionsWithKeyboard {
    currentlyPressedKeys = []
    constructor() {
        document.addEventListener("keydown", this.addKeyToPressed.bind(this));
        document.addEventListener("keyup", this.removeKeyFromPressed.bind(this));
    }

    isKeyBeingPressed(keyName) {
        const answer = (this.currentlyPressedKeys.includes(keyName));
        return answer;
    }

    removeKeyFromPressed(keyEvent) {
        const keyCode = keyEvent.code;
        const index = this.currentlyPressedKeys.indexOf(keyCode);
        const keyIsNotInPressed = (index === -1);
        const howManyElementsToRemoveStartingFromTheIndex = 1;
        if (keyIsNotInPressed) {
            return;
        }
        return this.currentlyPressedKeys.splice(index, howManyElementsToRemoveStartingFromTheIndex);
    }

    addKeyToPressed(keyCode) {
        const keyCode = keyEvent.code;
        const index = this.currentlyPressedKeys.indexOf(keyCode);
        const keyAlreadyInPressed = (index !== -1);
        if (keyAlreadyInPressed) {
            return;
        }
        this.currentlyPressedKeys.push(keyCode);
    }
}

export {
    InteractionsWithKeyboard
} 