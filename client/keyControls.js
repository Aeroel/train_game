class KeyControls {
    activeControls = [];
    onNextKeyUpPushObject = {};
    constructor() {
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }
    handleKeyDown(event) {
        if (this.activeControls.includes(event.code)) {
            return;
        }
        this.activeControls.push(event.code);
        console.log(this.activeControls)
    }

    handleKeyUp(event) {
        this.removeKey(event.code);
    }
    removeKey(code) {
        const index = this.activeControls.indexOf(code);

        if (index === -1) {
            return;
        }

        this.activeControls.splice(index, 1);
        console.log(this.activeControls)
    }
}

export {
    KeyControls,
}