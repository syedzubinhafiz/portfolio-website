import { NextRequest, NextResponse } from 'next/server';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { createGitClient } from '@/lib/git-client';

const execAsync = promisify(exec);

// Configure these paths in your .env file or adjust them to match your server setup
const JAVA_PROJECTS_DIR = process.env.JAVA_PROJECTS_DIR || 'server/java-projects';
const TEMP_DIR = process.env.TEMP_DIR || 'server/temp';

// Helper function to find Java files
function findJavaFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      findJavaFiles(filePath, fileList);
    } else if (file.endsWith('.java')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, sourceLocation, repoUrl, mainClass, input } = body;
    
    let projectPath = '';
    
    // Handle different source locations
    if (sourceLocation === 'local') {
      // For local projects, use the configured directory
      projectPath = path.join(JAVA_PROJECTS_DIR, projectId);
      
      if (!fs.existsSync(projectPath)) {
        return NextResponse.json(
          { error: `Project not found: ${projectId}` },
          { status: 404 }
        );
      }
    } else if (sourceLocation === 'github' && repoUrl) {
      // For GitHub projects, clone the repository
      const repoTempDir = path.join(TEMP_DIR, projectId);
      
      // Ensure temp directory exists
      if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
      }
      
      console.log(`Cloning/updating repository ${repoUrl} to ${repoTempDir}`);
      
      // Clone or pull the repository
      const git = createGitClient();
      
      if (fs.existsSync(repoTempDir)) {
        // Pull latest changes if repo exists
        console.log('Repository already exists, pulling latest changes...');
        await git.cwd(repoTempDir).pull();
      } else {
        // Clone the repository
        console.log('Cloning the repository...');
        await git.clone(repoUrl, repoTempDir);
      }
      
      projectPath = repoTempDir;
      console.log(`Using project path: ${projectPath}`);
    } else {
      return NextResponse.json(
        { error: 'Invalid source configuration' },
        { status: 400 }
      );
    }
    
    // Check for Maven or Gradle first
    if (fs.existsSync(path.join(projectPath, 'pom.xml'))) {
      // Maven project
      console.log('Detected Maven project, building...');
      await execAsync('mvn clean package -DskipTests', { cwd: projectPath });
      
      // Execute Maven-built project
      try {
        const targetDir = path.join(projectPath, 'target');
        if (fs.existsSync(targetDir)) {
          const jarFiles = fs.readdirSync(targetDir).filter(file => 
            file.endsWith('.jar') && !file.endsWith('-sources.jar') && !file.endsWith('-javadoc.jar')
          );
          
          let output;
          if (jarFiles.length > 0) {
            // Run the jar
            try {
              const { stdout, stderr } = await execAsync(`java -jar target/${jarFiles[0]}`, {
                cwd: projectPath,
                timeout: 5000 // 5-second timeout for interactive programs
              });
              output = stdout || stderr;
            } catch (timeoutError: any) {
              // If it's a timeout error but we have output, consider it a success
              if (timeoutError.killed && timeoutError.stdout) {
                console.log('Process timed out but produced output (expected for interactive programs)');
                output = timeoutError.stdout;
              } else {
                throw timeoutError;
              }
            }
          } else if (mainClass) {
            // Run the main class
            try {
              const { stdout, stderr } = await execAsync(`java -cp target/classes ${mainClass}`, {
                cwd: projectPath,
                timeout: 5000 // 5-second timeout for interactive programs
              });
              output = stdout || stderr;
            } catch (timeoutError: any) {
              // If it's a timeout error but we have output, consider it a success
              if (timeoutError.killed && timeoutError.stdout) {
                console.log('Process timed out but produced output (expected for interactive programs)');
                output = timeoutError.stdout;
              } else {
                throw timeoutError;
              }
            }
          } else {
            return NextResponse.json(
              { error: 'Could not find a runnable JAR file or main class' },
              { status: 500 }
            );
          }
          return NextResponse.json({ output });
        }
      } catch (error: any) {
        console.error('Maven execution error:', error);
        return NextResponse.json(
          { error: `Error executing Maven project: ${error.message}` },
          { status: 500 }
        );
      }
    } else if (fs.existsSync(path.join(projectPath, 'build.gradle'))) {
      // Gradle project
      console.log('Detected Gradle project, building...');
      await execAsync('./gradlew build -x test', { cwd: projectPath });
      
      // Execute Gradle-built project
      try {
        let output;
        if (mainClass) {
          try {
            const { stdout, stderr } = await execAsync(`java -cp build/classes/java/main ${mainClass}`, {
              cwd: projectPath,
              timeout: 5000 // 5-second timeout for interactive programs
            });
            output = stdout || stderr;
          } catch (timeoutError: any) {
            // If it's a timeout error but we have output, consider it a success
            if (timeoutError.killed && timeoutError.stdout) {
              console.log('Process timed out but produced output (expected for interactive programs)');
              output = timeoutError.stdout;
            } else {
              throw timeoutError;
            }
          }
        } else {
          const buildLibDir = path.join(projectPath, 'build/libs');
          if (fs.existsSync(buildLibDir)) {
            const jarFiles = fs.readdirSync(buildLibDir).filter(file => file.endsWith('.jar'));
            if (jarFiles.length > 0) {
              try {
                const { stdout, stderr } = await execAsync(`java -jar build/libs/${jarFiles[0]}`, {
                  cwd: projectPath,
                  timeout: 5000 // 5-second timeout for interactive programs
                });
                output = stdout || stderr;
              } catch (timeoutError: any) {
                // If it's a timeout error but we have output, consider it a success
                if (timeoutError.killed && timeoutError.stdout) {
                  console.log('Process timed out but produced output (expected for interactive programs)');
                  output = timeoutError.stdout;
                } else {
                  throw timeoutError;
                }
              }
            } else {
              return NextResponse.json(
                { error: 'Could not find a runnable JAR file' },
                { status: 500 }
              );
            }
          } else {
            return NextResponse.json(
              { error: 'Could not find build output directory' },
              { status: 500 }
            );
          }
        }
        return NextResponse.json({ output });
      } catch (error: any) {
        console.error('Gradle execution error:', error);
        return NextResponse.json(
          { error: `Error executing Gradle project: ${error.message}` },
          { status: 500 }
        );
      }
    } else {
      // Simple Java project
      console.log('Compiling Java project...');
      
      try {
        // Create a build directory for class files
        const buildDir = path.join(projectPath, 'build');
        if (!fs.existsSync(buildDir)) {
          fs.mkdirSync(buildDir, { recursive: true });
        }
        
        if (!mainClass) {
          return NextResponse.json(
            { error: 'Main class not specified for Java project' },
            { status: 400 }
          );
        }
        
        // Compile with sourcepath and output to build directory
        const mainClassPath = mainClass.replace(/\./g, '/') + '.java';
        const mainClassFile = path.join(projectPath, 'src', mainClassPath);
        
        console.log(`Checking main class file path: ${mainClassFile}`);
        
        if (!fs.existsSync(mainClassFile)) {
          console.error(`Main class file not found: ${mainClassFile}`);
          return NextResponse.json(
            { error: `Main class file not found: ${mainClassPath}` },
            { status: 404 }
          );
        }
        
        console.log(`Compiling main class: ${mainClassFile}`);
        
        // Use find to get all Java files recursively
        console.log('Finding all Java files to compile...');
        const javaFiles = findJavaFiles(path.join(projectPath, 'src'));
        const relativeJavaFiles = javaFiles.map(file => 
          path.relative(projectPath, file)
        );
        
        console.log(`Found ${javaFiles.length} Java files to compile`);
        
        // Compile all Java files to ensure dependencies are compiled
        await execAsync(`javac -d build ${relativeJavaFiles.join(' ')}`, {
          cwd: projectPath
        });
        
        console.log('Compilation successful');
        
        // Check if class files were created
        const packageDir = mainClass.substring(0, mainClass.lastIndexOf('.'));
        const packagePath = packageDir.replace(/\./g, '/');
        const classFileName = mainClass.substring(mainClass.lastIndexOf('.') + 1) + '.class';
        const classFilePath = path.join(projectPath, 'build', packagePath, classFileName);
        
        console.log(`Looking for class file at: ${classFilePath}`);
        
        if (!fs.existsSync(classFilePath)) {
          console.error(`Compiled class file not found: ${classFilePath}`);
          // Let's try to list what's in the build directory to debug
          if (fs.existsSync(path.join(projectPath, 'build'))) {
            try {
              const list = await execAsync('find build -name "*.class"', { cwd: projectPath });
              console.log('Found class files:', list.stdout);
            } catch (e) {
              console.error('Error listing class files:', e);
            }
          }
          
          return NextResponse.json(
            { error: `Compiled class file not found. Compilation may have failed silently.` },
            { status: 500 }
          );
        }
        
        console.log('Class file found, executing Java application...');
        
        let output;
        if (input) {
          // Handle input using spawn
          const childProcess = spawn('java', ['-cp', 'build', mainClass], { cwd: projectPath });
          
          return new Promise((resolve, reject) => {
            let stdoutData = '';
            let stderrData = '';
            
            childProcess.stdout.on('data', (data) => {
              const text = data.toString();
              console.log('Java stdout:', text);
              stdoutData += text;
            });
            
            childProcess.stderr.on('data', (data) => {
              const text = data.toString();
              console.error('Java stderr:', text);
              stderrData += text;
            });
            
            childProcess.on('close', (code) => {
              console.log(`Java process exited with code ${code}`);
              output = stdoutData || stderrData;
              resolve(NextResponse.json({ output, exitCode: code }));
            });
            
            childProcess.on('error', (err) => {
              console.error('Java process error:', err);
              reject(NextResponse.json(
                { error: `Error executing Java project: ${err.message}` },
                { status: 500 }
              ));
            });
            
            // Write input to stdin and close it
            childProcess.stdin.write(input);
            childProcess.stdin.end();
          });
        } else {
          // No input needed
          try {
            console.log(`Running: java -cp build:src ${mainClass}`);
            
            // For interactive games, we want to capture output but expect the process to timeout
            try {
              const { stdout, stderr } = await execAsync(`java -cp build:src ${mainClass}`, {
                cwd: projectPath,
                timeout: 5000 // 5-second timeout is enough to get initial output
              });
              
              output = stdout || stderr;
              console.log('Process completed successfully before timeout');
              return NextResponse.json({ output });
            } catch (timeoutError: any) {
              // If it's a timeout error but we have output, consider it a success
              if (timeoutError.killed && timeoutError.stdout) {
                console.log('Process timed out but produced output (expected for interactive programs)');
                output = timeoutError.stdout;
                return NextResponse.json({ output });
              }
              
              // Other errors are still problems
              throw timeoutError;
            }
          } catch (execError: any) {
            console.error('Java execution error:', execError);
            
            // Try with different classpaths as fallbacks
            try {
              console.log('Trying with "out" directory as classpath...');
              // Create 'out' directory if it doesn't exist
              const outDir = path.join(projectPath, 'out');
              if (!fs.existsSync(outDir)) {
                fs.mkdirSync(outDir, { recursive: true });
              }
              
              // Try to compile again but with 'out' directory
              console.log('Recompiling with out directory...');
              await execAsync(`javac -d out src/edu/monash/fit2099/game/Application.java`, {
                cwd: projectPath
              });
              
              console.log('Running with out directory...');
              try {
                const { stdout, stderr } = await execAsync(`java -cp out edu.monash.fit2099.game.Application`, {
                  cwd: projectPath,
                  timeout: 5000 // 5-second timeout for interactive programs
                });
                
                output = stdout || stderr;
                return NextResponse.json({ output });
              } catch (timeoutError: any) {
                // If it's a timeout error but we have output, consider it a success
                if (timeoutError.killed && timeoutError.stdout) {
                  console.log('Process timed out but produced output (expected for interactive programs)');
                  output = timeoutError.stdout;
                  return NextResponse.json({ output });
                }
                throw timeoutError;
              }
            } catch (fallbackError: any) {
              console.error('Fallback execution error with "out":', fallbackError);
              
              // Try other classpath variations
              try {
                console.log('Trying with src directory in classpath...');
                try {
                  const { stdout, stderr } = await execAsync(`java -cp build:src ${mainClass}`, {
                    cwd: projectPath,
                    timeout: 5000 // 5-second timeout
                  });
                  
                  output = stdout || stderr;
                  return NextResponse.json({ output });
                } catch (timeoutError: any) {
                  // If it's a timeout error but we have output, consider it a success
                  if (timeoutError.killed && timeoutError.stdout) {
                    console.log('Process timed out but produced output (expected for interactive programs)');
                    output = timeoutError.stdout;
                    return NextResponse.json({ output });
                  }
                  throw timeoutError;
                }
              } catch (fallback2Error: any) {
                console.error('Second fallback execution error:', fallback2Error);
                return NextResponse.json(
                  { error: `Error executing Java project: ${execError.message}` },
                  { status: 500 }
                );
              }
            }
          }
        }
      } catch (error: any) {
        console.error('Java execution error:', error);
        return NextResponse.json(
          { error: `Error executing Java project: ${error.message}` },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { error: `Error executing Java project: ${error.message}` },
      { status: 500 }
    );
  }
}