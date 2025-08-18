import type { Undesirable_Hardcoded_Socket_Type } from "#root/Socket_Type_Stuff.js" 
import { World} from "#root/World.js"

type Command_Result =  {message: string};
type Command_Callback = (args: string[], socket: Undesirable_Hardcoded_Socket_Type) => string;


export class Command_Console {
  static welcomeMessages = [
    "Hi, bro, welcome to the console!", 
    "Available commands:",
    "tp 1 777 888 <-- teleport entity with id 1 to x 777 y 888",
    "listentities 7 <-- lists page 7 of all entities",
    ]
  private static commands: Record<string, Command_Callback> = {};
static add(name: string, cb: Command_Callback) {
        this.commands[name.toLowerCase()] = cb;
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
        const callback = this.commands[commandName];
        if (!callback) {
          result.message= "error: command not found";
            return result;
        }

       const msg= callback(parts, socket);
        result.message =msg;
        return result;

  }
}

Command_Console.add("tp", (args, socket) => {
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

Command_Console.add("listentities", (args, socket) => {
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
