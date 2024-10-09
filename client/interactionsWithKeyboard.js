class InteractionsWithKeyboard {
    currentlyPressedKeys = []
    constructor() {
        document.addEventListener("keydown", this.keydownListener.bind(this));
        document.addEventListener("keyup", this.keyupListener.bind(this));
    }

    isKeyBeingPressed(keyName) {
        const answer = (this.currentlyPressedKeys.includes(keyName));
        return answer;
    }

    keyupListener(keyEvent) {
        const index = this.currentlyPressedKeys.indexOf(keyEvent.code);
        if (index === -1) {
            return;
        }
        this.currentlyPressedKeys.splice(index, 1);

    }
    keydownListener(keyEvent) {
        const index = this.currentlyPressedKeys.indexOf(keyEvent.code);
        if (index !== -1) {
            return;
        }
        this.currentlyPressedKeys.push(keyEvent.code)
    }
}

export {
 InteractionsWithKeyboard 
 } 