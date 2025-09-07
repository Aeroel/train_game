import type { Undesirable_Hardcoded_Socket_Type } from "#root/Socket_Type_Stuff.js" 
import { World} from "#root/World.js"

type Command_Result =  {message: string};
type Command_Callback = (args: string[], socket: Undesirable_Hardcoded_Socket_Type) => string;


export class Command_Console {

    
   static get welcomeMessages(): string[] {
    const baseMessages = [
        "Hi, bro, welcome to the console!", 
        "Available commands:"
    ];
    const helpCmd = "help"
     const helpMsg= this.getHelp();
    
    return [...baseMessages, ...helpMsg];
} 
  private static commands: Record<string, {callback: Command_Callback, description: string}> = {};
static add(name: string, description: string, cb: Command_Callback) {
    this.commands[name.toLowerCase()] = {
        callback: cb,
        description: description
    };
}

  static executeCommand(commandStr: string, socket: Undesirable_Hardcoded_Socket_Type,): Command_Result {
    const result: Command_Result={
      message:'Error'
    }
        const parts = commandStr.trim().split(/\s+/);
        if (parts.length === 0) {
          return result;
        }

        const commandName = parts[0].toLowerCase();
        const command = this.commands[commandName];
        if (!command) {
          result.message= "error: command not found";
            return result;
        }

       const msg= command.callback(parts, socket);
        result.message =msg;
        return result;

  }
  
  static getHelp() : string[] {
        const commandDescriptions = Object.entries(this.commands)
        .map(
        
        ([name, cmd]) => `${name} - ${cmd.description}`
        )
        
        return commandDescriptions
  }
}

Command_Console.add("wallofchars", "sends N random emoji and text characters", (args, socket) => {
    if (args.length !== 2 || isNaN(Number(args[1]))) {
        return "Usage: wallofchars <number>";
    }

    const count = Number(args[1]);
    if (count <= 0 || count > 10000) {
        return "Number must be between 1 and 10000";
    }

    const chars = [
        // Emoji
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
        '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
        '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
        '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
        '🎉', '🎊', '🎈', '🎁', '🎀', '🌟', '⭐', '✨', '💫', '⚡',
        '🔥', '💥', '💯', '💢', '💨', '👍', '👎', '👌', '✌️', '🤞',
        // Text characters
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7',
        '8', '9', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
        '-', '_', '=', '+', '[', ']', '{', '}', '|', '\\', ':', ';',
        '"', "'", '<', '>', ',', '.', '?', '/', '~', '`'
    ];

    let result = '';
    for (let i = 0; i < count; i++) {
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        result += randomChar;
    }

    return result;
});
Command_Console.add("tp", "tp 1 777 888 <-- teleport entity with id 1 to x 777 y 888", (args, socket) => {
    if (args.length !== 4 || isNaN(Number(args[1])) || isNaN(Number(args[2])) || isNaN(Number(args[3]))) {
        return "args invalid";
    }

    const entityId = Number(args[1]);
    const x = Number(args[2]);
    const y = Number(args[3]);

    const entity = World.getCurrentEntities().find((e) => e.id === entityId);
    if (!entity) {
        return "entity not found";
    }

    entity.setPosition({ x, y });
    return "tp success";
});

Command_Console.add("listentities", "listentities 7 <-- lists page 7 of all entities", (args, socket) => {
    const perPage = 10;
    let page = 1;

    if (args.length >= 2) {
        page = Math.max(1, Number(args[1]) || 1);
    }
    const entities =  World.getCurrentEntities();
    const totalEntities = entities.length;
    const totalPages = Math.ceil(totalEntities / perPage);

    if (page > totalPages) page = totalPages;

    const startIndex = (page - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage, totalEntities);

    let msg: string= `Page ${page} of ${totalPages}>>`;
    
    for (let i = startIndex; i < endIndex; i++) {
        const e = entities[i];
        msg = `${msg}, <Id:${e.id}, Tags: [${JSON.stringify(e.tags)}], x:${e.x}, y: ${e.y}>`;
    }

   return msg;
});
Command_Console.add("tpab","tpab 1 2 <-- teleport entity with id 1 to entity with id 2", (args, socket) => {
    if (args.length !== 3) {
      return "invalid argument count"
    }
    const idA = Number(args[1]);
    const idB = Number(args[2]);

    const entities = World.getEntities();
    const entityA = entities.find((e) => e.id === idA);
    const entityB = entities.find((e) => e.id === idB);

    if (!entityA || !entityB) {
     return "error: one or both entities not found";
    }

    entityA.setPosition({ x: entityB.x, y: entityB.y });
    return "tp entity a to entity b succeeded"
});
Command_Console.add("help", " <- list all available commands", (args, socket)=>{
       const cmds = Command_Console.getHelp();
       
        const cmdsStr= cmds.join('\n\n');
        return cmdsStr;
})