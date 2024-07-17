import { rando } from "@nastyox/rando.js";

function chooseRandomlyFromPossibilities({possibilities}) {
    
    return possibilities[rando(0, (possibilities.length - 1))];

    }
export default {
    chooseRandomlyFromPossibilities,
}