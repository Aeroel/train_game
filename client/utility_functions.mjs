function coinFlip(possibilityOne, possibilityTwo) {
    let rand = [possibilityOne, possibilityTwo];
    
    return rand[rando(0, 1)];

    }
export default {
    coinFlip,
}