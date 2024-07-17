'use strict';

const canvas = document.getElementById("game");

canvas.width = (window.innerWidth - 15);
canvas.height = (window.innerHeight - 30);

const observerCanvasX = canvas.width / 2;
const observerCanvasY = canvas.height / 2;

const observerServerPosition = {x: 0, y: 0};

let context = canvas.getContext('2d');

let objects = [];

function animate(timeStamp) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'black';
    
    context.fillRect(observerCanvasX, observerCanvasY, 10, 10);

    objects.forEach(object => {
        context.fillStyle = object.color;
        context.fillRect(object.x, object.y, object.width, object.height);
    });

    requestAnimationFrame(animate);
}

function beginGame() {
    animate(0);
}

function receiveObjects(objectsToReceive) {
    objects = objectsToReceive;
}
function receiveObserverServerPosition(position) {
    observerServerPosition = position;
}

export default {
    receiveObjects,
    beginGame,
    observerServerPosition,
}