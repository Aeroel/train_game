'use strict';

import { io } from "./socket.io.esm.min.js";
import { World } from "./world.js";
import { KeyControls } from "./keyControls.js";

function main() {
    const socket = io("127.0.0.1:3000");
    const keyControlsObject = new KeyControls();
    const worldObject = new World(keyControlsObject);
    worldObject.start();

    socket.on("testMessage", msg => {
        console.log(msg);
    })
    socket.on("objects", objects => {
        worldObject.receiveObjects(objects);
    })



}

export {
    main,
}