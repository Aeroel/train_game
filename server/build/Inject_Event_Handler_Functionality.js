// Export the function so it can be imported in other files
export default { injectEventHandlerFunctionality };
function injectEventHandlerFunctionality(entity) {
    entity.eventHandlers = {}; // Initialize an object to store event handlers
    // Method to add an event handler
    entity.addEventListener = function (name, call) {
        if (!this.eventHandlers[name]) {
            this.eventHandlers[name] = []; // Initialize an array for this event if it doesn't exist
        }
        this.eventHandlers[name].push(call); // Add the handler to the array
        return call; // Return the handler for potential removal later
    };
    // Method to dispatch an event
    entity.dispatchEvent = function (name, data) {
        const handlers = this.eventHandlers[name]; // Get the handlers for this event
        if (handlers) {
            handlers.forEach(handler => handler(data)); // Call each handler with the provided data
        }
    };
    // Method to remove an event listener
    entity.removeEventListener = function (handler) {
        for (const name in this.eventHandlers) {
            const index = this.eventHandlers[name].indexOf(handler);
            if (index !== -1) {
                this.eventHandlers[name].splice(index, 1); // Remove the handler from the array
                break; // Exit after removing from one event type
            }
        }
    };
}
