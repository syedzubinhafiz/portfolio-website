import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal } from '@/components/terminal/terminal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

interface PythonPlaygroundProps {
  projectId: string;
  projectName: string;
  projectType: 'cli' | 'gui';
  mainFile: string;
  description?: string;
  requirements?: string[];
}

export const PythonPlayground: React.FC<PythonPlaygroundProps> = ({
  projectId,
  projectName,
  projectType,
  mainFile,
  description,
  requirements,
}) => {
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const terminalRef = useRef<any>(null);
  
  const runPythonProject = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/execute/python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          mainFile,
          input,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute Python project');
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
  
  // For CLI Python applications
  if (projectType === 'cli') {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{projectName} - Python CLI</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="terminal" className="w-full">
            <TabsList>
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
              <TabsTrigger value="input">Input</TabsTrigger>
              <TabsTrigger value="info">Project Info</TabsTrigger>
            </TabsList>
            <TabsContent value="terminal" className="space-y-4">
              <Terminal ref={terminalRef} />
              <div className="flex space-x-2">
                <Button onClick={runPythonProject} disabled={loading}>
                  {loading ? 'Running...' : 'Run Project'}
                </Button>
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
            <TabsContent value="input" className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Enter input for your Python program (optional):
                </p>
                <Textarea
                  className="w-full h-32"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter input here..."
                />
              </div>
            </TabsContent>
            <TabsContent value="info">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Main File</h3>
                  <p>{mainFile}</p>
                </div>
                {description && (
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p>{description}</p>
                  </div>
                )}
                {requirements && requirements.length > 0 && (
                  <div>
                    <h3 className="font-medium">Requirements</h3>
                    <ul className="list-disc pl-5">
                      {requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }
  
  // For GUI Python applications
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{projectName} - Python GUI</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demo" className="w-full">
          <TabsList>
            <TabsTrigger value="demo">Demo</TabsTrigger>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            <TabsTrigger value="info">Project Info</TabsTrigger>
          </TabsList>
          <TabsContent value="demo" className="space-y-4">
            <div className="aspect-video bg-gray-100 flex items-center justify-center border rounded-md">
              <p className="text-gray-500">
                {loading 
                  ? 'Loading application...' 
                  : 'GUI demo will appear here when running'}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={runPythonProject} disabled={loading}>
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
                <h3 className="font-medium">Main File</h3>
                <p>{mainFile}</p>
              </div>
              {description && (
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p>{description}</p>
                </div>
              )}
              {requirements && requirements.length > 0 && (
                <div>
                  <h3 className="font-medium">Requirements</h3>
                  <ul className="list-disc pl-5">
                    {requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};