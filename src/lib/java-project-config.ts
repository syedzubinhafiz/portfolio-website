export interface JavaProject {
    id: string;
    name: string;
    description: string;
    type: 'cli' | 'gui';
    sourceLocation: 'local' | 'github';
    mainClass: string;
    repoUrl?: string;
    technologies: string[];
    screenshots?: string[];
  }
  
  const JAVA_PROJECTS: Record<string, JavaProject> = {
    'java-cli-1': {
      id: 'java-cli-1',
      name: 'Java CLI Project',
      description: 'A Super Mario Game, in a Rogue-like setting to be played on the CLI',
      type: 'cli',
      sourceLocation: 'github', // Using GitHub as the source
      repoUrl: 'https://github.com/syedzubinhafiz/supermario', // Replace with your actual repository URL
      mainClass: 'edu.monash.fit2099.game.Application', 
      technologies: ['Java'],
      screenshots: []
    },
    // 'java-gui-1': {
    //   id: 'java-gui-1',
    //   name: 'Java GUI Application',
    //   description: 'A simple desktop application with a graphical interface built using Java Swing. Demonstrates basic user interaction with text input and button clicks.',
    //   type: 'gui',
    //   sourceLocation: 'local',
    //   mainClass: 'SimpleGUI',
    //   technologies: ['Java', 'Swing', 'Gradle'],
    //   screenshots: [
    //     '/images/java-gui-1-screenshot1.jpg',
    //     '/images/java-gui-1-screenshot2.jpg'
    //   ]
    // },
    // You can add more Java projects here
  };
  
  export const getAllJavaProjects = (): JavaProject[] => {
    return Object.values(JAVA_PROJECTS);
  };
  
  export const getJavaProject = (id: string): JavaProject | null => {
    return JAVA_PROJECTS[id] || null;
  };
  
  export const getJavaProjectsByType = (type: 'cli' | 'gui'): JavaProject[] => {
    return Object.values(JAVA_PROJECTS).filter(project => project.type === type);
  };