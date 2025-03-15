import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal } from '@/components/terminal/terminal';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JavaPlaygroundProps {
  projectId: string;
  projectName: string;
  projectType: 'cli' | 'gui';
  sourceLocation: 'local' | 'github';
  repoUrl?: string;
  mainClass?: string;
}

export const JavaPlayground: React.FC<JavaPlaygroundProps> = ({
  projectId,
  projectName,
  projectType,
  sourceLocation,
  repoUrl,
  mainClass,
}) => {
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const terminalRef = useRef<any>(null);
  
  const runJavaProject = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/execute/java', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          sourceLocation,
          repoUrl,
          mainClass,
          input,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute Java project');
      }
      
      setOutput(data.output);
      
      if (terminalRef.current) {
        terminalRef.current.write(`\r\n${data.output}`);
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (projectType === 'cli') {
    return (
      <Card className="w-full max-w-[1000px] mx-auto">
        <CardHeader>
        <CardTitle className="text-xl">{projectName} - Java CLI</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="terminal" className="w-full">
            <TabsList>
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
              <TabsTrigger value="info">Project Info</TabsTrigger>
            </TabsList>
            <TabsContent value="terminal" className="space-y-4">
              <Terminal ref={terminalRef} />
              <div className="flex space-x-2">
                {/* <Button onClick={runJavaProject} disabled={loading}>
                  {loading ? 'Running...' : 'Run Project'}
                </Button> */}
                <Button variant="outline" onClick={() => terminalRef.current?.clear()}>
                  Clear Terminal
                </Button>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </TabsContent>
            <TabsContent value="info">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Source Location</h3>
                  <p>{sourceLocation === 'github' ? 'GitHub Repository' : 'Local Machine'}</p>
                  {sourceLocation === 'github' && repoUrl && (
                    <a 
                      href={repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Repository
                    </a>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Main Class</h3>
                  <p>{mainClass || 'N/A'}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }
  
  // For GUI Java applications
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{projectName} - Java GUI</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stream" className="w-full">
          <TabsList>
            <TabsTrigger value="stream">Live View</TabsTrigger>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            <TabsTrigger value="info">Project Info</TabsTrigger>
          </TabsList>
          <TabsContent value="stream" className="space-y-4">
            <div className="aspect-video bg-gray-100 flex items-center justify-center border rounded-md">
              <p className="text-gray-500">GUI stream will appear here when running</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={runJavaProject} disabled={loading}>
                {loading ? 'Starting...' : 'Launch Application'}
              </Button>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
          <TabsContent value="screenshots">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-gray-100 flex items-center justify-center border rounded-md">
                <p className="text-gray-500">Screenshot 1</p>
              </div>
              <div className="aspect-video bg-gray-100 flex items-center justify-center border rounded-md">
                <p className="text-gray-500">Screenshot 2</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="info">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Source Location</h3>
                <p>{sourceLocation === 'github' ? 'GitHub Repository' : 'Local Machine'}</p>
                {sourceLocation === 'github' && repoUrl && (
                  <a 
                    href={repoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Repository
                  </a>
                )}
              </div>
              <div>
                <h3 className="font-medium">Main Class</h3>
                <p>{mainClass || 'N/A'}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};