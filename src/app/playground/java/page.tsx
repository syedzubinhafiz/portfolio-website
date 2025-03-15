import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Sample Java projects data - replace with your actual projects
const javaProjects = [
  {
    id: 'java-cli-1',
    title: 'Super Mario Game',
    description: 'A command-line tool built with Java',
    type: 'cli',
    technologies: ['Java'],
    playgroundUrl: '/playground/java/java-cli-1'
  },
  {
    id: 'java-gui-1',
    title: 'Nine Men Morris Game',
    description: 'A computer based Nine Men Morris game',
    type: 'gui',
    technologies: ['Java', 'JavaFX', 'Gradle'],
    playgroundUrl: '/playground/java/java-gui-1'
  },
  // Add more Java projects as needed
];

export default function JavaProjectsPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Java <span className="text-yellow-400">Projects</span></h1>
          <p className="text-xl max-w-3xl mb-8">
            Explore my Java applications with both command-line and graphical interfaces.
            Run them directly in your browser using the interactive playground.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {javaProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-yellow-400 bg-black text-white">
                <CardHeader>
                  <CardTitle className="text-white">{project.title}</CardTitle>
                  <CardDescription className="text-gray-300">{project.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="bg-black text-white border-yellow-400 hover:bg-yellow-400 hover:text-white transition-colors">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm mb-4">
                    <span className="font-medium">Interface: </span>
                    <Badge variant="secondary" className="ml-1 bg-gray-800 text-white border border-yellow-400">
                      {project.type === 'cli' ? 'Command Line' : 'Graphical UI'}
                    </Badge>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button asChild className="bg-black hover:bg-yellow-400 hover:text-black transition-colors border border-yellow-400 w-full">
                    <Link href={project.playgroundUrl}>
                      Open in Playground
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">How to Use the <span className="text-yellow-400">Java Playground</span></h2>
          <div className="max-w-3xl">
            <ol className="list-decimal list-inside space-y-4 text-gray-300">
              <li>
                <span className="text-white font-medium">Select a project</span> - Choose a Java project from the list above
              </li>
              <li>
                <span className="text-white font-medium">Explore the code</span> - View the project's source code and structure
              </li>
              <li>
                <span className="text-white font-medium">Run the application</span> - Execute the Java project directly in your browser
              </li>
              <li>
                <span className="text-white font-medium">Interact with the terminal</span> - For CLI applications, provide input and view output
              </li>
              <li>
                <span className="text-white font-medium">View the GUI</span> - For graphical applications, interact with the user interface
              </li>
            </ol>
            
            <div className="mt-8 p-4 border border-yellow-400 rounded-md bg-black">
              <h3 className="text-xl font-medium mb-2 text-yellow-400">Note</h3>
              <p>
                All Java applications run on a secure server environment. CLI applications display their output in a terminal,
                while GUI applications are streamed to your browser using a special rendering system.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}