import { JSProjectsShowcase } from "@/app/playground/js-projects-showcase";

// Example project data - replace with your actual project details
const jsProjects = [
  {
    id: "halbert",
    title: "Halbert",
    description: "A modern web application for data visualization and analysis.",
    technologies: ["NextJS", "Python", "RAG", "FastAPI"],
    liveUrl: "https://your-halbert-url.com", // Replace with actual URL
    imageUrl: "/images/halbert-preview.jpg", // Add preview images to public/images
  },
  {
    id: "project-hercules",
    title: "Project Hercules",
    description: "A powerful project management tool with real-time collaboration features.",
    technologies: ["Next.js", "GraphQL", "TailwindCSS", "Prisma"],
    liveUrl: "https://your-project-hercules-url.com", // Replace with actual URL
    repoUrl: "https://github.com/yourusername/project-hercules", // Replace or remove if private
    imageUrl: "/images/hercules-preview.jpg", // Add preview images to public/images
  },
  // Add more projects as needed
];

export default function JSProjectsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Web Applications</h1>
          <p className="text-xl max-w-3xl">
            Explore my JavaScript projects built with modern frameworks and technologies.
            Click on any project card to visit the live application.
          </p>
        </div>
      </section>
      
      <JSProjectsShowcase projects={jsProjects} />
    </main>
  );
}