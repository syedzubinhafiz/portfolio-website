'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { JavaPlayground } from '@/app/playground/java-playground';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getJavaProject } from '@/lib/java-project-config';

// This would typically come from a database or API
// For now, we'll use a hard-coded projects object
const javaProjects = {
  'java-cli-1': {
    id: 'java-cli-1',
    name: 'Java CLI Project',
    description: 'A command-line tool built with Java',
    type: 'cli',
    sourceLocation: 'local' as const,
    mainClass: 'com.example.Main',
    technologies: ['Java', 'Maven']
  },
  'java-gui-1': {
    id: 'java-gui-1',
    name: 'Java GUI Application',
    description: 'A desktop application with a graphical interface',
    type: 'gui' as const,
    sourceLocation: 'github' as const,
    repoUrl: 'https://github.com/syedzubinhafiz/java-gui-app',
    mainClass: 'com.example.GuiApp',
    technologies: ['Java', 'JavaFX', 'Gradle']
  },
  // Add more Java projects as needed
};

export default function JavaProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the project data from an API
    // For now, we're using the hard-coded data
    const fetchProject = async () => {
      setLoading(true);
      try {
        const projectData = getJavaProject(projectId);
        
        if (!projectData) {
          setError('Project not found');
          return;
        }
        
        setProject(projectData);
      } catch (err) {
        setError('Failed to load project');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-xl text-red-500 mb-4">{error || 'Project not found'}</p>
          <Button asChild variant="outline">
            <Link href="/playground/java">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Java Projects
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Button asChild variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
            <Link href="/playground/java">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Java Projects
            </Link>
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-lg text-gray-300 mb-4">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech: string, index: number) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-black text-white border border-yellow-400 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <JavaPlayground
          projectId={project.id}
          projectName={project.name}
          projectType={project.type}
          sourceLocation={project.sourceLocation}
          repoUrl={project.repoUrl}
          mainClass={project.mainClass}
        />
      </div>
    </div>
  );
}