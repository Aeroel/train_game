import { JavaScriptConsole } from './JS_Eval_Console.js';
import * as net from 'net';
import * as repl from 'repl';
import * as readline from 'readline';
import * as http from 'http';
import * as url from 'url';
import { createRequire } from 'module';

// Create require function for packages that don't have ES module exports
const require = createRequire(import.meta.url);

/**
 * Extended REPL connection system with multiple connection methods (ES Module compatible)
 */
export class REPLConnectionManager {
  private static tcpServer: net.Server | null = null;
  private static httpServer: http.Server | null = null;
  private static wsServer: any = null; // WebSocket server
  private static connections = new Set<any>();

  /**
   * Method 1: Start local REPL in current terminal
   * This runs directly in your Node.js process terminal
   */
  static startLocalREPL(): void {
    console.log("Starting local REPL...");
    JavaScriptConsole.startREPL();
    // You can now type commands directly in your terminal
  }

  /**
   * Method 2: Start TCP REPL Server (connect via telnet/nc)
   * Usage: telnet localhost 3001 (or nc localhost 3001)
   */
  static startTCPServer(port: number = 3001): void {
    if (this.tcpServer) {
      console.log("TCP REPL server already running");
      return;
    }

    this.tcpServer = net.createServer((socket) => {
      console.log(`New REPL connection from ${socket.remoteAddress}:${socket.remotePort}`);
      
      const replInstance = repl.start({
        prompt: 'Game-REPL> ',
        input: socket,
        output: socket,
        terminal: true,
        useColors: true,
        eval: (cmd: string, context: any, filename: string, callback: Function) => {
          const cleanCmd = cmd.replace(/^\(|\)$/g, '').trim();
          
          if (!cleanCmd) {
            callback(null, undefined);
            return;
          }
          
          const result = JavaScriptConsole.execute(cleanCmd);
          
          if (result.success) {
            callback(null, result.result);
          } else {
            callback(new Error(result.error));
          }
        }
      });

      // Add connection to tracking set
      this.connections.add(socket);

      // Handle disconnect
      socket.on('close', () => {
        console.log('REPL connection closed');
        this.connections.delete(socket);
      });

      socket.on('error', (err) => {
        console.error('REPL socket error:', err);
        this.connections.delete(socket);
      });

      // Send welcome message
      socket.write("🎮 Connected to Game REPL Server!\n");
      socket.write("Try: $.players(), $.findById(123), etc.\n");
      socket.write("Type .help for REPL commands\n\n");
    });

    this.tcpServer.listen(port, () => {
      console.log(`🌐 TCP REPL server listening on port ${port}`);
      console.log(`Connect with: telnet localhost ${port}`);
      console.log(`Or with: nc localhost ${port}`);
      console.log(`Or with: ssh -t user@yourserver "telnet localhost ${port}"`);
    });

    this.tcpServer.on('error', (err) => {
      console.error('TCP REPL server error:', err);
    });
  }

  /**
   * Method 3: HTTP API for web-based execution
   */
  static startHTTPAPI(port: number = 3002): void {
    if (this.httpServer) {
      console.log("HTTP server already running");
      return;
    }

    this.httpServer = http.createServer((req, res) => {
      // Set CORS headers once at the beginning
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      // Handle preflight OPTIONS request
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      const parsedUrl = url.parse(req.url || '', true);
      
      // Handle POST /execute
      if (parsedUrl.pathname === '/execute' && req.method === 'POST') {
        let body = '';
        
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        
        req.on('end', () => {
          try {
            const { code } = JSON.parse(body);
            const result = JavaScriptConsole.execute(code);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: result.success,
              result: result.result,
              error: result.error,
              executionTime: result.executionTime,
              formatted: JavaScriptConsole.executeAndFormat(code)
            }));
          } catch (err) {
            if (!res.headersSent) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          }
        });
        
        req.on('error', (err) => {
          if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Request error' }));
          }
        });
        
        return; // Important: return here to avoid falling through
      }
      
      // Handle GET /history
      if (parsedUrl.pathname === '/history' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(JavaScriptConsole.getHistory()));
        return;
      }
      
      // Handle GET /console (web interface)
      if (parsedUrl.pathname === '/console' && req.method === 'GET') {
        // Serve a simple web console
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Game Console</title>
            <style>
              body { font-family: monospace; background: #1a1a1a; color: #00ff00; margin: 20px; }
              #input { width: 100%; background: #000; color: #00ff00; border: 1px solid #333; padding: 10px; font-family: monospace; }
              #output { background: #000; padding: 20px; height: 400px; overflow-y: scroll; border: 1px solid #333; white-space: pre-wrap; margin-bottom: 10px; }
              button { background: #333; color: #00ff00; border: 1px solid #666; padding: 10px; cursor: pointer; margin-right: 5px; }
              button:hover { background: #555; }
              .examples { background: #2a2a2a; padding: 15px; margin: 10px 0; border-radius: 5px; }
              .examples h3 { color: #ffff00; margin-top: 0; }
              .examples code { background: #000; padding: 2px 5px; border-radius: 3px; }
            </style>
          </head>
          <body>
            <h2>🎮 Game JavaScript Console</h2>
            <div id="output">Welcome to Game Console!

Try these examples:
• $.players() - Get all players
• $.findById(123) - Find entity by ID
• $.teleport($.findById(123), 500, 300) - Teleport entity
• $.all().length - Count all entities

</div>
            <input type="text" id="input" placeholder="Enter JavaScript code..." />
            <button onclick="execute()">Execute (Enter)</button>
            <button onclick="clearOutput()">Clear</button>
            <button onclick="showHistory()">History</button>
            <button onclick="showExamples()">Examples</button>
            
            <div class="examples" id="examples" style="display: none;">
              <h3>📝 Example Commands:</h3>
              <div onclick="setCode('$.players()')"><code>$.players()</code> - List all players</div><br>
              <div onclick="setCode('$.findById(123)')"><code>$.findById(123)</code> - Find entity by ID</div><br>
              <div onclick="setCode('$.teleport($.findById(123), 500, 300)')"><code>$.teleport($.findById(123), 500, 300)</code> - Teleport entity</div><br>
              <div onclick="setCode('$.addVel($.findById(123), \"boost\", 200, 0)')"><code>$.addVel($.findById(123), "boost", 200, 0)</code> - Add velocity</div><br>
              <div onclick="setCode('$.players().forEach(p => p.health = 100)')"><code>$.players().forEach(p => p.health = 100)</code> - Heal all players</div><br>
              <div onclick="setCode('console.table($.all().map(e => ({id: e.id, type: e.constructor.name, x: e.x, y: e.y})))')"><code>console.table(...)</code> - Show entity table</div><br>
              <div onclick="setCode('Game_Loop.getStats()')"><code>Game_Loop.getStats()</code> - Performance stats</div><br>
            </div>
            
            <script>
              const output = document.getElementById('output');
              const input = document.getElementById('input');
              
              input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') execute();
              });
              
              function setCode(code) {
                input.value = code;
                input.focus();
              }
              
              async function execute() {
                const code = input.value.trim();
                if (!code) return;
                
                output.textContent += '> ' + code + '\\n';
                
                try {
                  const response = await fetch('/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code })
                  });
                  
                  const result = await response.json();
                  output.textContent += result.formatted + '\\n\\n';
                } catch (err) {
                  output.textContent += '❌ Network Error: ' + err.message + '\\n\\n';
                }
                
                output.scrollTop = output.scrollHeight;
                input.value = '';
              }
              
              function clearOutput() {
                output.textContent = 'Console cleared\\n';
              }
              
              function showExamples() {
                const examples = document.getElementById('examples');
                examples.style.display = examples.style.display === 'none' ? 'block' : 'none';
              }
              
              async function showHistory() {
                try {
                  const response = await fetch('/history');
                  const history = await response.json();
                  output.textContent += '\\n=== Execution History ===\\n';
                  history.forEach((entry, i) => {
                    output.textContent += \`\${i + 1}. \${entry.code}\\n\`;
                    if (entry.error) {
                      output.textContent += \`   ❌ \${entry.error}\\n\`;
                    }
                  });
                  output.textContent += '\\n';
                  output.scrollTop = output.scrollHeight;
                } catch (err) {
                  output.textContent += '❌ Failed to load history\\n';
                }
              }
            </script>
          </body>
          </html>
        `);
        return;
      }
      
      // Handle root path redirect
      if (parsedUrl.pathname === '/' && req.method === 'GET') {
        res.writeHead(302, { 'Location': '/console' });
        res.end();
        return;
      }
      
      // Handle 404 for all other requests
      if (!res.headersSent) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    this.httpServer.listen(port, () => {
      console.log(`🌐 HTTP Console API listening on port ${port}`);
      console.log(`Web console: http://localhost:${port}/console`);
      console.log(`API endpoint: POST http://localhost:${port}/execute`);
    });
  }

  /**
   * Method 4: WebSocket server for real-time web console
   */
  /*static async startWebSocketServer(port: number = 3003): Promise<void> {
    try {
      // Try to import ws dynamically
      const { WebSocketServer } = await import('ws');
      
      this.wsServer = new WebSocketServer({ port });
      
      this.wsServer.on('connection', (ws: any) => {
        console.log('New WebSocket REPL connection');
        
        ws.send(JSON.stringify({
          type: 'welcome',
          message: '🎮 Connected to Game WebSocket Console!'
        }));
        
        ws.on('message', (data: any) => {
          try {
            const { code } = JSON.parse(data.toString());
            const result = JavaScriptConsole.execute(code);
            
            ws.send(JSON.stringify({
              type: 'result',
              success: result.success,
              result: result.result,
              error: result.error,
              executionTime: result.executionTime,
              formatted: JavaScriptConsole.executeAndFormat(code)
            }));
          } catch (err) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid message format'
            }));
          }
        });
        
        ws.on('close', () => {
          console.log('WebSocket REPL connection closed');
        });
      });
      
      console.log(`🌐 WebSocket Console server listening on port ${port}`);
      console.log(`Connect with WebSocket client to: ws://localhost:${port}`);
      
    } catch (err) {
      console.warn('WebSocket server not available. Install ws package: npm install ws');
      console.warn('Error:', (err as Error).message);
    }
  }*/

  /**
   * Method 5: SSH tunnel for remote access
   */
  static printSSHTunnelInstructions(): void {
    console.log(`
🔒 For remote access via SSH tunnel:

1. On your server, start TCP REPL:
   REPLConnectionManager.startTCPServer(3001);

2. On your local machine, create SSH tunnel:
   ssh -L 3001:localhost:3001 user@your-server.com

3. Connect locally:
   telnet localhost 3001
   # or
   nc localhost 3001

This securely tunnels the REPL through SSH.
    `);
  }

  /**
   * Stop all servers
   */
  static stopAllServers(): void {
    if (this.tcpServer) {
      this.tcpServer.close();
      this.tcpServer = null;
      console.log('TCP REPL server stopped');
    }
    
    if (this.httpServer) {
      this.httpServer.close();
      this.httpServer = null;
      console.log('HTTP server stopped');
    }
    
    if (this.wsServer) {
      this.wsServer.close();
      this.wsServer = null;
      console.log('WebSocket server stopped');
    }
    
    // Close all active connections
    for (const connection of this.connections) {
      connection.destroy();
    }
    this.connections.clear();
  }

  /**
   * Get server status
   */
  static getStatus(): {
    tcpRunning: boolean;
    httpRunning: boolean;
    wsRunning: boolean;
    activeConnections: number;
  } {
    return {
      tcpRunning: this.tcpServer !== null,
      httpRunning: this.httpServer !== null,
      wsRunning: this.wsServer !== null,
      activeConnections: this.connections.size
    };
  }
}

// Usage examples and setup
export async function setupREPLServers(): Promise<void> {
  console.log("🚀 Setting up REPL servers...\n");
  
  // Initialize JavaScript console first
  JavaScriptConsole.initialize();
  
  // Method 1: Local terminal REPL (uncomment to use)
  // REPLConnectionManager.startLocalREPL();
  
  // Method 2: TCP server (connect via telnet)
  REPLConnectionManager.startTCPServer(3001);
  
  // Method 3: HTTP API with web interface
  REPLConnectionManager.startHTTPAPI(3002);
  
  // Method 4: WebSocket server (requires 'ws' package)
 // await REPLConnectionManager.startWebSocketServer(3003);
  
  // Show connection instructions
  console.log(`
📋 Connection Methods:

1️⃣  Local Terminal (if enabled):
   - Already running in this terminal

2️⃣  TCP/Telnet:
   telnet localhost 3001
   # or
   nc localhost 3001

3️⃣  Web Browser (Recommended):
   http://localhost:3002/console

4️⃣  HTTP API:
   curl -X POST http://localhost:3002/execute \\
     -H "Content-Type: application/json" \\
     -d '{"code":"$.players()"}'

5️⃣  WebSocket (if available):
   ws://localhost:3003

6️⃣  SSH Tunnel (for remote):
   ssh -L 3001:localhost:3001 user@server
   then: telnet localhost 3001
  `);
  
  // Show SSH tunnel instructions
  REPLConnectionManager.printSSHTunnelInstructions();
}

// Simple setup function for quick start
export function startQuickConsole(): void {
  console.log("🚀 Starting Quick Console Setup...");
  
  JavaScriptConsole.initialize();
  REPLConnectionManager.startHTTPAPI(3002);
  
  console.log("✅ Quick setup complete!");
  console.log("🌐 Open: http://localhost:3002/console");
}

// Example: Start servers in your game initialization
/*
// In your main server file:
import { setupREPLServers, startQuickConsole } from './repl_connection_guide.js';

// Full setup:
await setupREPLServers();

// Or quick setup (just web console):
startQuickConsole();
*/