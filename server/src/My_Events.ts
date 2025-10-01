type Event_Callback = ((event: any) => void);

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
  static emit(eventName: string, data: any) {
       const listeners = My_Events.events.get(eventName);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }
}
