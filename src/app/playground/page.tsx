import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Interactive Playgrounds</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Java Projects</CardTitle>
                <CardDescription>Run Java applications directly in your browser</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Experience Java applications without any setup. Perfect for demos and quick testing.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/playground/java">Launch Java Playground</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg mb-6">
              These playgrounds connect to backend services that can execute your code in isolated environments.
              For Java and Python applications, the code runs on secure servers and streams the output to your browser.
              For web applications, you'll be directed to the live hosted sites.
            </p>
            <p className="text-lg">
              No installation needed - just click and experience the projects directly!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}