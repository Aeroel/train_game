import { World } from "#root/World.js";
import { Game_Loop } from "#root/Game_Loop.js";
import * as vm from 'vm';
import * as util from 'util';

/**
 * JavaScript Evaluation Console - Execute arbitrary JavaScript code safely
 * WARNING: This is powerful but potentially dangerous. Use only in development!
 */
export class JavaScriptConsole {
  private static context: vm.Context | null = null;
  private static executionHistory: Array<{ code: string; result: any; timestamp: number; error?: string }> = [];
  private static isEnabled = false;
  private static timeout = 5000; // 5 second timeout for code execution

  /**
   * Initialize the JavaScript console with a secure context
   */
  static initialize(options: {
    timeout?: number;
    enableFileSystem?: boolean;
    enableNetwork?: boolean;
    enableProcess?: boolean;
  } = {}): void {
    
    this.timeout = options.timeout || 5000;
    
    // Create a new VM context with controlled access
    const contextObject = {
      // Core game systems
      World,
      Game_Loop,
      
      // Utility functions
      console: {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
        table: console.table
      },
      
      // Math and basic JavaScript globals
      Math,
      Date,
      JSON,
      Object,
      Array,
      String,
      Number,
      Boolean,
      RegExp,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      
      // Helper functions for common operations
      $: {
        // Find entities
        findEntities: (predicate: (entity: any) => boolean) => {
          return World.getCurrentEntities().filter(predicate);
        },
        
        // Find entity by ID
        findById: (id: number) => {
          return World.getCurrentEntities().find(e => e.id === id);
        },
        
        // Find entities by tag
        findByTag: (tag: string) => {
          return World.getCurrentEntities().filter(e => e.hasTag && e.hasTag(tag));
        },
        
        // Find entities by type
        findByType: (typeName: string) => {
          return World.getCurrentEntities().filter(e => 
            e.constructor.name.toLowerCase() === typeName.toLowerCase()
          );
        },
        
        // Get all players
        players: () => {
          return World.getCurrentEntities().filter(e => e.hasTag && e.hasTag("Player"));
        },
        
        // Get all entities
        all: () => {
          return World.getCurrentEntities();
        },
        
        // Teleport entity
        teleport: (entity: any, x: number, y: number) => {
          if (entity.setPosition) {
            entity.setPosition({ x, y });
          } else {
            entity.x = x;
            entity.y = y;
          }
          return entity;
        },
        
        // Add velocity to entity
        addVel: (entity: any, key: string, vx: number, vy: number) => {
          if (entity.movementForces && entity.movementForces.addVelocityComponent) {
            entity.movementForces.addVelocityComponent(key, vx, vy);
          }
          return entity;
        },
        
        // Clear velocity from entity
        clearVel: (entity: any, key: string) => {
          if (entity.movementForces && entity.movementForces.removeVelocityComponent) {
            entity.movementForces.removeVelocityComponent(key);
          }
          return entity;
        },
        
        // Inspect entity
        inspect: (entity: any) => {
          const info: any = {
            id: entity.id,
            type: entity.constructor.name,
            name: entity.name,
            position: { x: entity.x, y: entity.y },
            size: { width: entity.width, height: entity.height }
          };
          
          if (entity.health !== undefined) info.health = entity.health;
          if (entity.vx !== undefined || entity.vy !== undefined) {
            info.velocity = { x: entity.vx || 0, y: entity.vy || 0 };
          }
          if (entity.getTags) info.tags = entity.getTags();
          
          return info;
        },
        
        // Get game loop stats
        stats: () => Game_Loop.deltaTime,
        
        // Wait function (returns Promise)
        wait: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
        
        // Execute code after delay
        delay: (ms: number, code: () => void) => {
          setTimeout(code, ms);
        }
      }
    };
    
    // Conditionally add dangerous APIs based on options
    if (options.enableFileSystem) {
      try {
        (contextObject as any).fs = require('fs');
        (contextObject as any).path = require('path');
      } catch (e) {
        console.warn("File system modules not available");
      }
    }
    
    if (options.enableProcess) {
      (contextObject as any).process = process;
    }
    
    this.context = vm.createContext(contextObject);
    this.isEnabled = true;
    
    console.log("JavaScript Console initialized");
    console.log("Available helpers: $.findById(123), $.players(), $.teleport(entity, x, y), etc.");
  }

  /**
   * Execute JavaScript code in the secure context
   */
  static execute(code: string): {
    success: boolean;
    result?: any;
    error?: string;
    executionTime: number;
  } {
    if (!this.isEnabled || !this.context) {
      return {
        success: false,
        error: "JavaScript console not initialized",
        executionTime: 0
      };
    }

    const startTime = performance.now();
    let result: any;
    let error: string | undefined;
    let success = true;

    try {
      // Execute the code with timeout protection
      result = vm.runInContext(code, this.context, {
        timeout: this.timeout,
        displayErrors: true
      });
      
      // Handle promises
      if (result && typeof result.then === 'function') {
        result = result.catch((err: any) => `Promise rejected: ${err.message}`);
      }
      
    } catch (err: any) {
      success = false;
      error = err.message;
      
      // Handle specific VM errors
      if (err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') {
        error = `Code execution timed out after ${this.timeout}ms`;
      }
    }

    const executionTime = performance.now() - startTime;

    // Store in history
    this.executionHistory.push({
      code,
      result: success ? result : undefined,
      timestamp: Date.now(),
      error
    });

    // Keep only last 100 executions
    if (this.executionHistory.length > 100) {
      this.executionHistory.shift();
    }

    return {
      success,
      result,
      error,
      executionTime
    };
  }

  /**
   * Execute code and format the output nicely
   */
  static executeAndFormat(code: string): string {
    const result = this.execute(code);
    
    if (!result.success) {
      return `❌ Error: ${result.error}`;
    }
    
    let output = `✅ Executed in ${result.executionTime.toFixed(2)}ms\n`;
    
    if (result.result !== undefined) {
      if (typeof result.result === 'object') {
        output += util.inspect(result.result, { 
          depth: 3, 
          colors: true, 
          compact: false 
        });
      } else {
        output += String(result.result);
      }
    }
    
    return output;
  }

  /**
   * Get execution history
   */
  static getHistory(count = 10): typeof JavaScriptConsole.executionHistory {
    return this.executionHistory.slice(-count);
  }

  /**
   * Clear execution history
   */
  static clearHistory(): void {
    this.executionHistory = [];
  }

  /**
   * Add a custom helper function to the context
   */
  static addHelper(name: string, func: Function): void {
    if (!this.context) {
      throw new Error("Console not initialized");
    }
    
    (this.context as any).$.push = (this.context as any).$ || {};
    (this.context as any).$[name] = func;
  }

  /**
   * Create a REPL interface for interactive use
   */
  static startREPL(): void {
    const repl = require('repl');
    
    const replServer = repl.start({
      prompt: 'JS> ',
      eval: (cmd: string, context: any, filename: string, callback: Function) => {
        // Remove the wrapping parentheses that REPL adds
        const cleanCmd = cmd.replace(/^\(|\)$/g, '').trim();
        
        if (!cleanCmd) {
          callback(null, undefined);
          return;
        }
        
        const result = this.execute(cleanCmd);
        
        if (result.success) {
          callback(null, result.result);
        } else {
          callback(new Error(result.error));
        }
      }
    });
    
    // Add some REPL-specific commands
    replServer.defineCommand('history', {
      help: 'Show execution history',
      action() {
        console.log('\nExecution History:');
        const history = JavaScriptConsole.getHistory();
        history.forEach((entry, index) => {
          console.log(`${index + 1}. ${entry.code}`);
          if (entry.error) {
            console.log(`   ❌ ${entry.error}`);
          } else if (entry.result !== undefined) {
            console.log(`   ✅ ${util.inspect(entry.result, { depth: 1 })}`);
          }
        });
        this.displayPrompt();
      }
    });
    
    replServer.defineCommand('clear', {
      help: 'Clear execution history',
      action() {
        JavaScriptConsole.clearHistory();
        console.log('History cleared');
        this.displayPrompt();
      }
    });
    
    console.log("JavaScript REPL started. Try some commands:");
    console.log("  $.players()");
    console.log("  $.findById(123)");
    console.log("  $.teleport($.findById(123), 100, 200)");
    console.log("  .history (show history)");
    console.log("  .clear (clear history)");
  }

  /**
   * Disable the console for security
   */
  static disable(): void {
    this.isEnabled = false;
    this.context = null;
    console.log("JavaScript console disabled");
  }

  /**
   * Create a web-safe version that can be exposed to browser
   */
  static createWebInterface(): {
    execute: (code: string) => any;
    getHistory: () => any[];
    addHelper: (name: string, func: Function) => void;
  } {
    return {
      execute: (code: string) => this.executeAndFormat(code),
      getHistory: () => this.getHistory(),
      addHelper: (name: string, func: Function) => this.addHelper(name, func)
    };
  }
}

// Example usage and common patterns
const EXAMPLE_COMMANDS = `
// Basic Examples:
$.all()                                    // Get all entities
$.players()                                // Get all players  
$.findById(123)                           // Find entity by ID
$.findByTag("Enemy")                      // Find entities by tag

// Teleportation:
$.teleport($.findById(123), 500, 300)    // Teleport entity 123 to (500, 300)
$.players().forEach(p => $.teleport(p, 100, 100))  // Teleport all players

// Velocity manipulation:
$.addVel($.findById(123), "boost", 200, 0)     // Add velocity component
$.clearVel($.findById(123), "boost")           // Remove velocity component

// Advanced operations:
const players = $.players();
players.forEach(p => { 
  p.health = 100; 
  $.addVel(p, "heal_boost", 0, -50); 
});

// Conditional operations:
$.all().filter(e => e.x > 500).forEach(e => $.teleport(e, 0, e.y));

// Inspection and debugging:
$.players().map(p => $.inspect(p))        // Inspect all players
Game_Loop.getStats()                      // Get performance stats
console.table($.players().map(p => ({id: p.id, x: p.x, y: p.y})))

// Async operations:
(async () => {
  console.log("Starting in 3 seconds...");
  await $.wait(3000);
  $.teleport($.findById(123), 777, 666);
  console.log("Teleported!");
})();

// Create custom helpers:
JavaScriptConsole.addHelper("killAll", (tag) => {
  $.findByTag(tag).forEach(e => e.destroy && e.destroy());
});
// Then use: $.killAll("Enemy")
`;

export { EXAMPLE_COMMANDS };

// Usage:
/*
// Initialize (DEVELOPMENT ONLY!)
JavaScriptConsole.initialize({
  timeout: 5000,
  enableFileSystem: false,  // Keep false for security
  enableProcess: false      // Keep false for security
});

// Start REPL for CLI
JavaScriptConsole.startREPL();

// Or execute single commands
const result = JavaScriptConsole.executeAndFormat('$.players()');
console.log(result);

// For web interface:
window.gameJS = JavaScriptConsole.createWebInterface();
// Then in browser: gameJS.execute('$.teleport($.findById(123), 100, 200)')
*/