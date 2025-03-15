import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// Configure these paths in your .env file or adjust them to match your server setup
const PYTHON_PROJECTS_DIR = process.env.PYTHON_PROJECTS_DIR || 'server/python-projects';
const PYTHON_VENV_DIR = process.env.PYTHON_VENV_DIR || 'server/python-venvs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, mainFile, input } = body;
    
    const projectPath = path.join(PYTHON_PROJECTS_DIR, projectId);
    
    if (!fs.existsSync(projectPath)) {
      return NextResponse.json(
        { error: `Project not found: ${projectId}` },
        { status: 404 }
      );
    }
    
    const mainFilePath = path.join(projectPath, mainFile);
    
    if (!fs.existsSync(mainFilePath)) {
      return NextResponse.json(
        { error: `Main file not found: ${mainFile}` },
        { status: 404 }
      );
    }
    
    // Check if project has a requirements.txt file
    const requirementsPath = path.join(projectPath, 'requirements.txt');
    const hasRequirements = fs.existsSync(requirementsPath);
    
    // Check if the project has a virtual environment
    const venvPath = path.join(PYTHON_VENV_DIR, projectId);
    const hasVenv = fs.existsSync(venvPath);
    
    // Create a virtual environment if it doesn't exist
    if (hasRequirements && !hasVenv) {
      // Ensure the venv directory exists
      if (!fs.existsSync(PYTHON_VENV_DIR)) {
        fs.mkdirSync(PYTHON_VENV_DIR, { recursive: true });
      }
      
      // Create a virtual environment
      await execAsync(`python -m venv ${venvPath}`);
      
      // Install requirements
      const activateCmd = process.platform === 'win32' 
        ? `${venvPath}\\Scripts\\activate`
        : `source ${venvPath}/bin/activate`;
      
      await execAsync(`${activateCmd} && pip install -r ${requirementsPath}`);
    }
    
    // Prepare the Python command
    let pythonCmd = 'python';
    
    if (hasVenv) {
      const pythonBin = process.platform === 'win32'
        ? `${venvPath}\\Scripts\\python.exe`
        : `${venvPath}/bin/python`;
      
      pythonCmd = pythonBin;
    }
    
    // Execute the Python script
    let output;
    
    if (input) {
      // Use spawn for handling input
      const { spawn } = require('child_process');
      const process = spawn(pythonCmd, [mainFilePath], { 
        cwd: projectPath 
      });
      
      return new Promise((resolve, reject) => {
        let stdoutData = '';
        let stderrData = '';
        
        process.stdout.on('data', (data) => {
          stdoutData += data.toString();
        });
        
        process.stderr.on('data', (data) => {
          stderrData += data.toString();
        });
        
        process.on('close', (code) => {
          output = stdoutData || stderrData;
          resolve(NextResponse.json({ output }));
        });
        
        process.on('error', (err) => {
          reject(NextResponse.json(
            { error: `Error executing Python project: ${err.message}` },
            { status: 500 }
          ));
        });
        
        // Write input to stdin and close it
        process.stdin.write(input);
        process.stdin.end();
      });
    } else {
      // If no input is needed, use exec as before
      const { stdout, stderr } = await execAsync(`${pythonCmd} ${mainFilePath}`, {
        cwd: projectPath,
        timeout: 30000 // 30-second timeout
      });
      
      output = stdout || stderr;
    }
    
    return NextResponse.json({ output });
    
  } catch (error: any) {
    console.error('Python execution error:', error);
    
    return NextResponse.json(
      { error: `Error executing Python project: ${error.message}` },
      { status: 500 }
    );
  }
}