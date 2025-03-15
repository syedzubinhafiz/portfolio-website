export interface Command {
    name: string;
    description: string;
    execute: (args: string[], terminal: any) => void;
  }
  
  export const availableCommands: Command[] = [
    {
      name: 'help',
      description: 'Display available commands',
      execute: (args, terminal) => {
        terminal.write('\r\n\x1b[1mAvailable Commands:\x1b[0m\r\n');
        availableCommands.forEach(cmd => {
          terminal.write(`\x1b[1;34m${cmd.name}\x1b[0m - ${cmd.description}\r\n`);
        });
        terminal.write('\r\n');
      }
    },
    {
      name: 'clear',
      description: 'Clear the terminal',
      execute: (args, terminal) => {
        terminal.clear();
      }
    },
    {
      name: 'echo',
      description: 'Display a message',
      execute: (args, terminal) => {
        terminal.write(`\r\n${args.join(' ')}\r\n\n`);
      }
    }
  ];
  
  export const processCommand = (input: string, terminal: any): void => {
    const parts = input.trim().split(' ');
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    const command = availableCommands.find(cmd => cmd.name === commandName);
    
    if (command) {
      command.execute(args, terminal);
    } else if (commandName) {
      terminal.write(`\r\n\x1b[1;31mCommand not found: ${commandName}\x1b[0m\r\n\n`);
    }
  };