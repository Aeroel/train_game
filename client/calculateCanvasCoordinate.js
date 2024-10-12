function calculateCanvasCoordinate({maxCanvasValue, realPlayerPosition, realObjectPosition, }) {
    const middleOfCanvas = maxCanvasValue / 2;
    const playerPosMinusObjPos = realPlayerPosition - realObjectPosition;
    const playerPosMinusObjPosWithSignFlipped = playerPosMinusObjPos * -1;
    const canvasCoordinate = middleOfCanvas + playerPosMinusObjPosWithSignFlipped;
    return canvasCoordinate;
}

export {
    calculateCanvasCoordinate,
}