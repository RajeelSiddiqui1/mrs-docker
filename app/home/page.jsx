"use client";

import React, { useState } from 'react';
import { Github, Linkedin, User, Briefcase, Code, GraduationCap, ArrowRight, UploadCloud, FolderKanban, ShieldCheck, Building } from 'lucide-react';
import { Spotlight } from '@/components/ui/spotlight-new';

// Spotlight component implementation to resolve the import error



// Mock Button component since the original is not provided
const Button = ({ className, children, ...props }) => (
  <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`} {...props}>
    {children}
  </button>
);

// Mock Link component
const Link = ({ href, children, ...props }) => (
  <a href={href} {...props}>{children}</a>
);

// Mock useSession hook
const useSession = () => ({ status: "unauthenticated" }); // "authenticated" or "unauthenticated"

export default function HomePage() {
  const { status } = useSession();
  const [infoVisible, setInfoVisible] = useState(false);

  const skills = {
    "Frontend": ["HTML", "CSS", "JavaScript", "Bootstrap", "React.js"],
    "Backend": ["Node", "Python"],
    "Full Stack": ["Next.js", "Django", "Express", "Laravel"],
    "Databases": ["MySQL", "MySQLITE", "MongoDB"],
    "UI Libraries": ["Shadcn", "Aceternity UI", "DaisyUI"],
  };

  const socialLinks = {
    linkedin: "linkedin.com/in/rajeel-siddiqui-60532529b/",
    github: "https://github.com/RajeelSiddiqui1/",
    portfolio: "https://rajeel-rajeelsiddiqui1s-projects.vercel.app/",
  };

  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight
        />
        <div className="max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0 text-center p-4">
          <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Mrs Docker
          </h1>
          <p className="mt-4 font-normal text-base md:text-lg text-neutral-300 max-w-2xl mx-auto">
            Your personal, secure, and lightning-fast cloud storage solution. Create folders, organize files, and upload images up to 5MB with ease.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
             {status === "authenticated" ? (
               <Link href="/">
                 <Button className="bg-white text-black font-semibold hover:bg-neutral-200 px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                   Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                 </Button>
               </Link>
             ) : (
               <>
                 <Link href="/login">
                   <Button className="bg-white text-black font-semibold hover:bg-neutral-200 px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                     Login
                   </Button>
                 </Link>
                 <Link href="/register">
                   <Button className="bg-transparent text-white border-2 border-neutral-600 hover:bg-neutral-800 hover:border-neutral-800 px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                     Register
                   </Button>
                 </Link>
               </>
             )}
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
            <div className="flex items-start p-4 bg-white/[0.05] rounded-xl border border-white/[0.1]">
                <UploadCloud className="h-8 w-8 text-cyan-400 mr-4 mt-1 flex-shrink-0"/>
                <div>
                    <h3 className="font-bold text-lg text-white">5MB Uploads</h3>
                    <p className="text-neutral-400 text-sm">Securely upload and store any image file up to 5MB.</p>
                </div>
            </div>
            <div className="flex items-start p-4 bg-white/[0.05] rounded-xl border border-white/[0.1]">
                <FolderKanban className="h-8 w-8 text-purple-400 mr-4 mt-1 flex-shrink-0"/>
                <div>
                    <h3 className="font-bold text-lg text-white">Organize Freely</h3>
                    <p className="text-neutral-400 text-sm">Create nested folders and manage your digital life effortlessly.</p>
                </div>
            </div>
            <div className="flex items-start p-4 bg-white/[0.05] rounded-xl border border-white/[0.1]">
                <ShieldCheck className="h-8 w-8 text-green-400 mr-4 mt-1 flex-shrink-0"/>
                <div>
                    <h3 className="font-bold text-lg text-white">Ironclad Security</h3>
                    <p className="text-neutral-400 text-sm">Your files are encrypted and protected with industry-leading security.</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="w-full py-20 lg:py-32 bg-black text-white antialiased">
        <div className="max-w-5xl mx-auto px-8">
            <h2 className="text-center text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 mb-12">
                About the Creator
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
                <div className="lg:col-span-2">
                    <h3 className="text-3xl font-bold text-white">Muhammad Rajeel Siddiqui</h3>
                    <p className="text-neutral-400 mt-1">Web Developer</p>
                    <p className="text-neutral-300 mt-4 text-sm max-w-prose">
                        I am a dedicated Web Developer with a strong foundation in web technologies, driven by a passion for creating user-friendly interfaces. I have hands-on experience in Django, Next.js, and various databases, and I'm proficient in Git/GitHub for version control.
                    </p>
                    
                    <Button 
                        onClick={() => setInfoVisible(!infoVisible)}
                        className="mt-6 bg-indigo-600 text-white hover:bg-indigo-500 px-5 py-2.5 rounded-lg flex items-center transition-all duration-300"
                    >
                        <User className="mr-2 h-4 w-4" />
                        {infoVisible ? 'Hide Full CV' : 'Show Full CV'}
                    </Button>

                    {infoVisible && (
                        <div className="mt-6 space-y-8 border-l-2 border-indigo-500 pl-6 animate-fade-in">
                            <div>
                                <h4 className="font-semibold text-lg flex items-center mb-3"><Building className="mr-3 h-5 w-5 text-indigo-400"/>Work Experience</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-bold text-white">MHN Enterprises</p>
                                        <p className="text-sm text-neutral-400">Full Stack Developer | May 2025 - Present</p>
                                        <ul className="list-disc list-inside text-neutral-300 mt-1 text-sm space-y-1">
                                            <li>Developing dynamic web pages with Laravel Blade and MERN stack.</li>
                                            <li>Integrating backend data with frontend views.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Genentech Solutions</p>
                                        <p className="text-sm text-neutral-400">Full Stack Developer | Jan 2025 - Apr 2025</p>
                                        <ul className="list-disc list-inside text-neutral-300 mt-1 text-sm space-y-1">
                                            <li>Used Django for back-end and Next.js for front-end development.</li>
                                            <li>Created RESTful APIs and optimized application performance.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Hakam Techsoul</p>
                                        <p className="text-sm text-neutral-400">React Developer | Nov 2024 - Dec 2024</p>
                                        <ul className="list-disc list-inside text-neutral-300 mt-1 text-sm space-y-1">
                                            <li>Built static user interfaces using React and JSX.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg flex items-center"><GraduationCap className="mr-3 h-5 w-5 text-indigo-400"/>Education</h4>
                                <ul className="list-disc list-inside text-neutral-300 mt-2 space-y-1 text-sm">
                                    <li>Diploma in Web Development - Aptech (In progress)</li>
                                    <li>Agentic AI Course - PIAIC (In progress)</li>
                                    <li>Intermediate (ICS) - Completed First Year</li>
                                    <li>Matriculation - Alkamran Public School (2023)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg flex items-center mb-3"><Code className="mr-3 h-5 w-5 text-indigo-400"/>Skills</h4>
                                {Object.entries(skills).map(([category, skillList]) => (
                                    <div key={category} className="mb-3">
                                        <p className="font-bold text-sm text-neutral-300">{category}</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {skillList.map(skill => (
                                                <span key={skill} className="bg-neutral-800 text-neutral-300 text-xs font-medium px-3 py-1.5 rounded-full">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex items-center gap-4">
                        <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                            <Linkedin className="h-6 w-6" />
                        </Link>
                        <Link href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                            <Github className="h-6 w-6" />
                        </Link>
                        <Link href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                            <Briefcase className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 p-1 shadow-2xl shadow-indigo-500/30">
                        <img 
                            src="https://placehold.co/200x200/000000/FFFFFF?text=RS" 
                            alt="Muhammad Rajeel Siddiqui"
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x200/000000/FFFFFF?text=Error'; }}
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes spotlight {
          from { opacity: 0; transform: translate(-72%, -62%) scale(0.5); }
          to { opacity: 1; transform: translate(-50%,-40%) scale(1); }
        }
        .animate-spotlight {
          animation: spotlight 2s forwards;
          animation-delay: 0.5s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}
