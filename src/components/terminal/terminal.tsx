import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

interface TerminalProps {
  initialText?: string;
  className?: string;
  projectId?: string;
  mainClass?: string;
  sourceLocation?: 'local' | 'github';
  repoUrl?: string;
}

export interface TerminalRef {
  xterm: XTerm | null;
  write: (text: string) => void;
  clear: () => void;
  focus: () => void;
}

export const Terminal = forwardRef<TerminalRef, TerminalProps>(
  ({ 
    initialText = '', 
    className = '',
    projectId = 'java-cli-1',
    mainClass = 'edu.monash.fit2099.game.Application',
    sourceLocation = 'github',
    repoUrl = 'https://github.com/syedzubinhafiz/your-cli-repo' // Replace with your actual repo URL
  }, ref) => {
    const xtermRef = useRef<XTerm | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [initialRun, setInitialRun] = useState(true);
    
    useImperativeHandle(ref, () => ({
      xterm: xtermRef.current,
      write: (text: string) => {
        if (xtermRef.current) {
          xtermRef.current.write(text);
        }
      },
      clear: () => {
        if (xtermRef.current) {
          xtermRef.current.clear();
        }
      },
      focus: () => {
        if (xtermRef.current) {
          xtermRef.current.focus();
        }
      }
    }));
    
    // Function to execute Java program
    const executeJava = async (input = '') => {
      if (!xtermRef.current) return;
      
      const requestBody = {
        projectId,
        sourceLocation,
        mainClass,
        repoUrl,
        input: input ? input + '\n' : undefined
      };
      
      try {
        xtermRef.current.write('Executing Java program...\r\n');
        
        const response = await fetch('/api/execute/java', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const text = await response.text();
        if (!text || text.trim() === '') {
          xtermRef.current.write('No response from server\r\n$ ');
          return;
        }
        
        try {
          const data = JSON.parse(text);
          if (data.error) {
            xtermRef.current.write(`Error: ${data.error}\r\n`);
          } else if (data.output) {
            const lines = data.output.split('\n');
            lines.forEach((line: string) => {
              if (line.trim()) {
                xtermRef.current.write(`${line}\r\n`);
              }
            });
          } else {
            xtermRef.current.write('Command executed but no output returned\r\n');
          }
        } catch (e) {
          xtermRef.current.write(`Invalid response format: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}\r\n`);
        }
        
        xtermRef.current.write('$ ');
      } catch (error: any) {
        if (xtermRef.current) {
          xtermRef.current.write(`\r\nError: ${error.message}\r\n$ `);
        }
        console.error('Terminal fetch error:', error);
      }
    };
    
    useEffect(() => {
      if (!containerRef.current) return;
      
      const xterm = new XTerm({
        fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
        fontSize: 14,
        lineHeight: 1.2,
        cursorBlink: true,
        convertEol: true,
        cols: 120,
        rows: 35,
        allowProposedApi: true,
        scrollback: 1000,
        theme: {
          background: '#1a1b26',
          foreground: '#a9b1d6',
          cursor: '#c0caf5',
          selectionBackground: '#5c6370',
          black: '#414868',
          red: '#f7768e',
          green: '#9ece6a',
          yellow: '#e0af68',
          blue: '#7aa2f7',
          magenta: '#bb9af7',
          cyan: '#7dcfff',
          white: '#c0caf5',
          brightBlack: '#414868',
          brightRed: '#f7768e',
          brightGreen: '#9ece6a',
          brightYellow: '#e0af68',
          brightBlue: '#7aa2f7',
          brightMagenta: '#bb9af7',
          brightCyan: '#7dcfff',
          brightWhite: '#c0caf5'
        }
      });

      let currentLine = '';
      let commandBuffer = '';
      
      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();
      
      xterm.loadAddon(fitAddon);
      xterm.loadAddon(webLinksAddon);
      
      xterm.open(containerRef.current);
      fitAddon.fit();
      
      if (initialText) {
        xterm.write(initialText);
      }
      
      xterm.write('\x1b[1;32mWelcome to the Interactive Terminal\x1b[0m\r\n');
      xterm.write('The game will load shortly. You can then type commands to interact.\r\n\r\n');
      
      // Set initial run flag to show we need to run the program when first mounted
      setInitialRun(true);
      
      xterm.onKey(({ key, domEvent }) => {
        const char = key;
        
        if (domEvent.keyCode === 13) {
          xterm.write('\r\n');
          commandBuffer = currentLine;
          
          if (commandBuffer) {
            xterm.write('Processing command...\r\n');
            executeJava(commandBuffer);
          } else {
            xterm.write('$ ');
          }
          currentLine = '';
        }
        else if (domEvent.keyCode === 8) {
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            xterm.write('\b \b');
          }
        }
        else if (!domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey) {
          currentLine += char;
          xterm.write(char);
        }
      });
      
      xtermRef.current = xterm;
      fitAddonRef.current = fitAddon;
      setIsReady(true);
      
      const handleResize = () => {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      };
      
      window.addEventListener('resize', handleResize);
      setTimeout(() => {
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
        }
      }, 100);
      return () => {
        window.removeEventListener('resize', handleResize);
        xterm.dispose();
      };
    }, [initialText]);
    
    // Run the Java program when the terminal is first mounted
    useEffect(() => {
      if (isReady && initialRun) {
        setInitialRun(false);
        executeJava();
      }
    }, [isReady, initialRun]);
    
    return (
      <div 
        ref={containerRef} 
        className={`h-[700px] min-h-[500px] w-full rounded-md overflow-hidden border border-yellow-400 ${className}`}
        style={{ minHeight: '500px' }}      />
    );
  }
);

Terminal.displayName = 'Terminal';