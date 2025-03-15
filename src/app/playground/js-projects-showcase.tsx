// import React from 'react';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { ExternalLink, Github } from 'lucide-react';

// interface JSProjectProps {
//   id: string;
//   title: string;
//   description: string;
//   technologies: string[];
//   liveUrl: string;
//   repoUrl?: string;
//   imageUrl?: string;
// }

// export const JSProjectCard: React.FC<JSProjectProps> = ({
//   id,
//   title,
//   description,
//   technologies,
//   liveUrl,
//   repoUrl,
//   imageUrl,
// }) => {
//   return (
//           <div className="overflow-hidden transition-all duration-300 hover:shadow-lg">
//       <Link href={liveUrl} target="_blank" rel="noopener noreferrer" className="block">
//         <div className="h-48 bg-black relative overflow-hidden group">
//           {imageUrl ? (
//             <img 
//               src={imageUrl} 
//               alt={title} 
//               className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105" 
//             />
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <h3 className="text-yellow-400 text-2xl font-bold">{title}</h3>
//             </div>
//           )}
//           <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//             <span className="text-yellow-400 text-xl font-bold flex items-center gap-2">
//               Visit Project <ExternalLink size={20} />
//             </span>
//           </div>
//         </div>
//       </Link>
      
//       <CardHeader>
//         <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
//           <CardTitle className="text-xl hover:text-blue-600 transition-colors duration-200">{title}</CardTitle>
//         </Link>
//         <CardDescription>{description}</CardDescription>
//       </CardHeader>
      
//       <CardContent>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {technologies.map((tech, index) => (
//             <Badge key={index} variant="outline">{tech}</Badge>
//           ))}
//         </div>
//       </CardContent>
      
//       <CardFooter className="flex justify-between">
//         <Button asChild variant="default" className="bg-black hover:bg-yellow-400 hover:text-black transition-colors">
//           <Link href={liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
//             <ExternalLink size={16} /> Visit Site
//           </Link>
//         </Button>
        
//         {repoUrl && (
//           <Button asChild variant="outline" className="border-black hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-colors">
//             <Link href={repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
//               <Github size={16} /> View Code
//             </Link>
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export interface JSProjectsShowcaseProps {
//   projects: JSProjectProps[];
// }

// export const JSProjectsShowcase: React.FC<JSProjectsShowcaseProps> = ({ projects }) => {
//   return (
//     <div className="bg-black text-white">
//       <div className="container mx-auto px-4 py-12">
//         <h2 className="text-3xl font-bold mb-8">JavaScript <span className="text-yellow-400">Projects</span></h2>
//         <p className="text-lg mb-12">Click on any project to visit the live site.</p>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {projects.map((project) => (
//             <JSProjectCard key={project.id} {...project} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };