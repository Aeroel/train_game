class KeyControls {
    activeControls = [];
    constructor(worldObject) {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }
    handleKeyDown(event) {
        if (this.activeControls.includes(event.code)) {
            return;
        }

        this.activeControls.push(event.code);
    }
    handleKeyUp(event) {
        const index = this.activeControls.indexOf(event.key);

        if (index === -1) {
            return;
        }

        this.activeControls.splice(index, 1);
    }
}

export {
    KeyControls,
}