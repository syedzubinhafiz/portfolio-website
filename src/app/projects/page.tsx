import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Sample project data - replace with your actual projects
const projects = [
  {
    id: 'java-cli-1',
    title: 'Java CLI Project',
    description: 'A command-line tool built with Java',
    type: 'java',
    category: 'cli',
    technologies: ['Java', 'Maven'],
    playgroundUrl: '/playground/java/java-cli-1'
  },
  {
    id: 'java-gui-1',
    title: 'Java GUI Application',
    description: 'A desktop application with graphical interface',
    type: 'java',
    category: 'gui',
    technologies: ['Java', 'JavaFX', 'Gradle'],
    playgroundUrl: '/playground/java/java-gui-1'
  },
  {
    id: 'python-data-analyzer',
    title: 'Python Data Analyzer',
    description: 'Data analysis tool built with Python',
    type: 'python',
    category: 'cli',
    technologies: ['Python', 'Pandas', 'Matplotlib'],
    playgroundUrl: '/playground/python/python-data-analyzer'
  },
  {
    id: 'halbert',
    title: 'Halbert',
    description: 'A modern web application for data visualization',
    type: 'web',
    technologies: ['React', 'TypeScript', 'D3.js'],
    externalUrl: 'https://your-halbert-url.com' // Replace with actual URL
  },
  {
    id: 'project-hercules',
    title: 'Project Hercules',
    description: 'A powerful project management tool',
    type: 'web',
    technologies: ['Next.js', 'GraphQL', 'TailwindCSS'],
    externalUrl: 'https://your-project-hercules-url.com' // Replace with actual URL
  },
  // Add more projects as needed
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Projects</h1>
          <p className="text-xl max-w-3xl">
            Explore my projects across different technologies and try them out in interactive playgrounds.
          </p>
        </div>
      </section>
      
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">All <span className="text-yellow-400">Projects</span></h2>
            <p className="text-lg">
              Click on a project to view details and interact with it in the playground.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
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
                  
                  <div className="text-sm">
                    <span className="font-medium">Type: </span>
                    <Badge variant="secondary" className="ml-1 bg-gray-800 text-white border border-yellow-400">
                      {project.type === 'java' ? 'Java' : 
                       project.type === 'python' ? 'Python' : 'Web Application'}
                    </Badge>
                    
                    {(project.type === 'java' || project.type === 'python') && project.category && (
                      <>
                        <span className="font-medium ml-3">Interface: </span>
                        <Badge variant="secondary" className="ml-1 bg-gray-800 text-white border border-yellow-400">
                          {project.category === 'cli' ? 'Command Line' : 'Graphical UI'}
                        </Badge>
                      </>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter>
                  {project.externalUrl ? (
                    <Button asChild className="bg-black hover:bg-yellow-400 hover:text-black transition-colors border border-yellow-400">
                      <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
                        Visit Project
                      </a>
                    </Button>
                  ) : project.playgroundUrl ? (
                    <Button asChild className="bg-black hover:bg-yellow-400 hover:text-black transition-colors border border-yellow-400">
                      <Link href={project.playgroundUrl}>
                        Open in Playground
                      </Link>
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}