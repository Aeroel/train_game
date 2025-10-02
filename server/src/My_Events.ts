
type Event_Callback = ((event: any) => void);

export type { Doors_Of_Train_Opening, Doors_Of_Train_Closing, Train_Reached_Station} from "#root/My_Events_Types.js"


export class My_Events {
  static events: Map<string, Event_Callback[]> = new Map();
  static addEventListener(eventName: string, callback: Event_Callback) {
      if (!My_Events.events.has(eventName)) {
      My_Events.events.set(eventName, []);
    }
      const event = My_Events.events.get(eventName);
      if(event) {
        event.push(callback);
      }
  }
  
  static addEventListenerOnce(eventName: string, callback: Event_Callback) {
    const onceCallback = (data: any) => {
      // Call the original callback
      callback(data);
      // Remove this listener immediately after the first call
      My_Events.removeEventListener(eventName, onceCallback);
    };
    My_Events.addEventListener(eventName, onceCallback);
  }

  
  static emit(eventName: string, data: any) {
       const listeners = My_Events.events.get(eventName);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }
  
  
  
  static removeEventListener(eventName: string, callback: Event_Callback) {
    const listeners = My_Events.events.get(eventName);
    if (!listeners) {
      return;
    }
      // Filter out the callback to remove it
      My_Events.events.set(
        eventName,
        listeners.filter(listener => listener !== callback)
      );

  }

  static clear() {
    My_Events.events.clear();
  }
}
