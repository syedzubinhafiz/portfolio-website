import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Developer Portfolio <span className="text-yellow-400">&</span> Interactive Playgrounds</h1>
            <p className="text-xl mb-8">
              Explore my projects across Java, Python, and modern web technologies. 
              Try them out in interactive environments directly in your browser.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                <Link href="/projects">
                  Browse Projects
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                <Link href="/playground">
                  Open Playgrounds
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Project Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Project <span className="text-yellow-400">Categories</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 hover:border-yellow-400 transition-colors duration-300">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-black">Java Applications</CardTitle>
                <CardDescription>
                  Command-line tools and GUI applications built with Java
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Explore Java applications with both command-line interfaces and graphical user interfaces.
                  Run them directly from your browser.
                </p>
                <Button asChild className="bg-black hover:bg-yellow-400 hover:text-black transition-colors">
                  <Link href="/playground/java">
                    View Java Projects
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 hover:border-yellow-400 transition-colors duration-300">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-black">Python Projects</CardTitle>
                <CardDescription>
                  Scripts, tools, and applications written in Python
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Dive into Python applications ranging from data analysis to automation tools.
                  Execute Python code with a web-based terminal.
                </p>
                <Button asChild className="bg-black hover:bg-yellow-400 hover:text-black transition-colors">
                  <Link href="/playground/python">
                    View Python Projects
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 hover:border-yellow-400 transition-colors duration-300">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-black">Web Applications</CardTitle>
                <CardDescription>
                  Modern web applications built with JavaScript frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Experience web applications built with modern JavaScript frameworks.
                  Interact with them directly within the portfolio.
                </p>
                <Button asChild className="bg-black hover:bg-yellow-400 hover:text-black transition-colors">
                  <Link href="/playground/web">
                    View Web Projects
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">About <span className="text-yellow-400">Me</span></h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg mb-6">
              I'm Syed Zubin Hafiz, a passionate developer with expertise in multiple programming languages and frameworks.
              My portfolio showcases various projects I've built using Java, Python, and modern web technologies.
            </p>
            <p className="text-lg mb-6">
              What makes this portfolio unique is the ability to interact with my projects directly in your browser.
              You can run Java applications, execute Python scripts, and use web applications without having to download or set up anything.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Get In <span className="text-yellow-400">Touch</span></h2>
          <div className="max-w-md mx-auto">
            <p className="text-center mb-8">
              Interested in collaboration or have questions about my projects? Feel free to reach out!
            </p>
            <div className="flex flex-col space-y-4 items-center">
              <div className="flex space-x-4">
                <Button asChild size="lg" className="bg-black hover:bg-yellow-400 hover:text-black transition-colors">
                  <a href="mailto:zubinhafiz99@gmail.com">
                    Email Me
                  </a>
                </Button>
                <Button asChild size="lg" className="bg-black hover:bg-yellow-400 hover:text-black transition-colors">
                  <a href="tel:+8801734316537">
                    Call Me
                  </a>
                </Button>
              </div>
              <div className="flex space-x-4">
                <Button asChild size="lg" variant="outline" className="border-black hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-colors">
                  <a href="https://linkedin.com/in/syedzubinhafiz" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-black hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-colors">
                  <a href="https://github.com/syedzubinhafiz" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}