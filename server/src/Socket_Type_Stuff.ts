import * as SocketIO from "socket.io"

// I copied this type that vscode showed in popup of socket var from startThis...ts  file
export type Undesirable_Hardcoded_Socket_Type = SocketIO.Socket<SocketIO.DefaultEventsMap, SocketIO.DefaultEventsMap, SocketIO.DefaultEventsMap, any>;