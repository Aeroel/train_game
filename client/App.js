export { App }
import { io } from "./externalScripts/socket.io.esm.min.js";
class App {
    static init() {
        const socket = io("http://127.0.0.1:3000");
        socket.on("welcome", (message) => {
            console.log(message);
        });
        socket.on("worldUpdate", (newWorldState) => {

        })
    }
}