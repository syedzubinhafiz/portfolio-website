import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import 'xterm/css/xterm.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Syed Zubin Hafiz | Developer Portfolio & Interactive Playgrounds',
  description: 'Explore Java, Python, and web projects with interactive playgrounds - Portfolio of Syed Zubin Hafiz',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b bg-black text-white">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex justify-between items-center">
              <Link href="/" className="font-bold text-xl text-yellow-400">Zubin Hafiz</Link>
              <ul className="flex space-x-6">
                <li><Link href="/projects" className="hover:text-yellow-400 transition-colors">Projects</Link></li>
                <li><Link href="/playground" className="hover:text-yellow-400 transition-colors">Playgrounds</Link></li>
                <li><Link href="/#about" className="hover:text-yellow-400 transition-colors">About</Link></li>
                <li><Link href="/#contact" className="hover:text-yellow-400 transition-colors">Contact</Link></li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
        <footer className="bg-black text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400">Syed Zubin Hafiz</h3>
                <p>A showcase of projects across multiple programming languages with interactive playgrounds.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/projects" className="hover:text-yellow-400 transition-colors">All Projects</Link></li>
                  <li><Link href="/playground/java" className="hover:text-yellow-400 transition-colors">Java Playground</Link></li>
                  <li><Link href="/playground/python" className="hover:text-yellow-400 transition-colors">Python Playground</Link></li>
                  <li><Link href="/playground/web" className="hover:text-yellow-400 transition-colors">Web Apps</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="https://github.com/syedzubinhafiz" className="hover:text-yellow-400 transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                  <li><a href="https://linkedin.com/in/syedzubinhafiz" className="hover:text-yellow-400 transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                  <li><a href="tel:+8801734316537" className="hover:text-yellow-400 transition-colors">+880 1734 316537</a></li>
                  <li><a href="mailto:zubinhafiz99@gmail.com" className="hover:text-yellow-400 transition-colors">Email</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center">
              <p>&copy; {new Date().getFullYear()} Syed Zubin Hafiz. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}