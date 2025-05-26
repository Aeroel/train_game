import { SocketWrapper } from "./SocketWrapper.js";
export { ServerConnectionStatusVisualizer };
class ServerConnectionStatusVisualizer {
    static initialize() {
        const socket = SocketWrapper.get();
        const serverMessage = document.getElementById("serverMessage");
        if (serverMessage === null) {
            throw new Error("serverMessage element not found");
        }
        serverMessage.style.color = "white";
        serverMessage.textContent = "Connecting to server ...";
        let visualRetryCount = 0;
        let consideredToBeReconnectingRatherThanConnecting = false;
        const increaseVisualRetryCountEveryMs = 2000;
        let lastRetryVisualCountIncreaseTime = Date.now();
        let visualRetryCountUpdater = (() => {
            if (!socket.connected) {
                visualRetryCount++;
            }
            let retryMessage = `${visualRetryCount > 2 ? "Still t" : "T"}rying to ${consideredToBeReconnectingRatherThanConnecting ? "re" : ""}connect... Attempt #${visualRetryCount}`;
            serverMessage.textContent = retryMessage;
        });
        socket.on("connect_error", () => {
            const now = Date.now();
            const timeToIncreaseCount = Boolean(now > (lastRetryVisualCountIncreaseTime + increaseVisualRetryCountEveryMs));
            if (timeToIncreaseCount) {
                visualRetryCountUpdater();
                lastRetryVisualCountIncreaseTime = Date.now();
            }
        });
        socket.on("connect", () => {
            visualRetryCount = 0;
            serverMessage.textContent = "Connected to server.";
        });
        socket.on("disconnect", () => {
            serverMessage.textContent = "Connection lost...";
            consideredToBeReconnectingRatherThanConnecting = true;
        });
    }
}
