import simpleGit, { SimpleGit } from 'simple-git';

/**
 * Creates a configured Git client
 * 
 * @returns {SimpleGit} A configured SimpleGit instance
 */
export function createGitClient(): SimpleGit {
  // Create a new SimpleGit instance with default configuration
  const git = simpleGit();
  
  // Configure the git client as needed
  // For example, you might want to set timeouts for operations
  git.outputHandler((command, stdout, stderr) => {
    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
    return {
      command,
      stdout,
      stderr
    };
  });
  
  return git;
}