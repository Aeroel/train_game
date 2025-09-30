import {My_Assert} from "#root/My_Assert.js"
export class Internal_Messaging {
  static messages = new Map<string, any>();
  
  static send(key: string, val: any) {
    Internal_Messaging.messages.set(key, val)
  }
  
  static getMessage(key: string) : any {

    const msg =  Internal_Messaging.messages.get(key);
    return msg;
  }
}