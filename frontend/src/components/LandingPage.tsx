import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const chatVideoRef = React.useRef<HTMLVideoElement>(null);
    const codeVideoRef = React.useRef<HTMLVideoElement>(null);
    const competeVideoRef = React.useRef<HTMLVideoElement>(null);

    // Spotlight pointer coordinates tracking relative to the viewport
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        e.currentTarget.style.setProperty('--mouse-x', `${clientX}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${clientY}px`);
    };

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // IntersectionObserver to auto play/pause videos
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target as HTMLVideoElement;
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, {
            threshold: 0.15
        });

        const videoElements = [chatVideoRef.current, codeVideoRef.current, competeVideoRef.current];
        videoElements.forEach(video => {
            if (video) observer.observe(video);
        });

        return () => {
            videoElements.forEach(video => {
                if (video) observer.unobserve(video);
            });
            observer.disconnect();
        };
    }, []);

    // IntersectionObserver for general scroll-reveal elements
    useEffect(() => {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        revealElements.forEach(el => revealObserver.observe(el));

        return () => {
            revealElements.forEach(el => revealObserver.unobserve(el));
            revealObserver.disconnect();
        };
    }, []);

    const features = [
        {
            icon: (
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            title: "Smart AI Assistant",
            desc: "Discuss logical parameters, outline algorithms, or debug coding challenges directly next to your workspace."
        },
        {
            icon: (
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            ),
            title: "Monaco Code Editor",
            desc: "Full-featured browser code editor equipped with syntax highlighting, autocomplete indices, and tab formatting."
        },
        {
            icon: (
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Competitive Challenges",
            desc: "Join real-time coding contests, practice problem challenges, and test your solution execution speeds."
        },
        {
            icon: (
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: "Global Leaderboards",
            desc: "Rank your skills, trace performance outputs, and climb the scoreboard alongside other developers."
        },
        {
            icon: (
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            title: "Fluid Theme Runtimes",
            desc: "Select HSL-tailored dark and light configurations optimized for visual comfort while coding."
        },
        {
            icon: (
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Custom User Profiles",
            desc: "Track solved programs, review active chat sessions, and trace contest performance history."
        }
    ];

    return (
        <div 
            className="min-h-screen bg-primary text-primary-text overflow-x-hidden transition-colors duration-300 relative font-sans spotlight-container"
            onMouseMove={handleMouseMove}
        >
            {/* Global cursor-following spotlight glow */}
            <div className="spotlight-glow" />
            
            {/* 1. Floating Glassmorphic Capsule Navigation Bar */}
            <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl rounded-full border border-border bg-primary/80 backdrop-blur-md px-6 py-3 shadow-lg z-50 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 select-none">
                        <Logo className="w-7 h-7 text-accent animate-pulse-slow" />
                        <span className="text-lg font-bold tracking-tight text-accent font-heading">NotAI</span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-secondary-text">
                        <button onClick={() => document.getElementById('features-showcase')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary-text transition-colors">Videos</button>
                        <button onClick={() => document.getElementById('grid-features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary-text transition-colors">Features</button>
                        <button onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-primary-text transition-colors">Stats</button>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-1.5 rounded-xl bg-secondary/80 border border-border hover:border-accent transition-all duration-300 group"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <svg className="w-4 h-4 text-accent group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-accent group-hover:-rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="px-4 py-2 bg-accent hover:bg-accent/90 text-primary text-xs font-bold rounded-full transition-all duration-300 hover:scale-[1.03]"
                        >
                            Launch App
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. Interactive Spotlight & Mesh Background */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div 
                    className="absolute inset-0 opacity-40 mix-blend-normal"
                    style={{
                        backgroundImage: isDark
                            ? `linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`
                            : `linear-gradient(to right, rgba(212, 138, 106, 0.04) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(212, 138, 106, 0.04) 1px, transparent 1px)`,
                        backgroundSize: '48px 48px',
                        maskImage: 'radial-gradient(circle at center, black, transparent 90%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 90%)'
                    }}
                />
                
                {/* Float blur Blobs */}
                <div 
                    className="absolute top-[-5%] right-[5%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-35"
                    style={{
                        background: 'radial-gradient(circle, rgba(227, 160, 132, 0.25) 0%, transparent 70%)',
                    }}
                />
                <div 
                    className="absolute bottom-[20%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[160px] opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 75%)',
                    }}
                />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 z-10 pt-24">
                <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    
                    {/* Interactive Banner Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/80 backdrop-blur text-xs font-mono font-semibold tracking-wider text-secondary-text shadow-sm hover:border-accent/40 transition-colors cursor-pointer select-none">
                            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                            POWERED BY GEMINI 1.5 PRO
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-none font-heading">
                        Chat and Code in <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-[#e28a6a] to-[#d9774f] animate-pulse-slow">
                            One Seamless Workflow
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-secondary-text max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        NotAI integrates smart, context-aware AI conversations with real-time browser-based code edits. Discuss logic, organize workspace code, and practice contests instantly.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={onGetStarted}
                            className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent/90 text-primary rounded-xl font-bold text-base transition-all duration-300 shadow-[0_8px_30px_rgb(227,160,132,0.25)] hover:shadow-[0_8px_40px_rgb(227,160,132,0.5)] hover:scale-[1.03]"
                        >
                            Get Started Free
                        </button>
                        <button
                            onClick={() => document.getElementById('features-showcase')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-secondary/80 backdrop-blur border border-border hover:border-accent/50 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-[1.03]"
                        >
                            Watch Features
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. Vertical Video Walkthrough Showcases */}
            <div id="features-showcase" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 pb-32 pt-16">
                
                {/* Showcase 1: AI Chat */}
                <section className="reveal-on-scroll group max-w-5xl mx-auto">
                    <div className="text-left mb-8">
                        <div className="text-xs font-bold font-mono tracking-widest text-accent uppercase mb-2">01 / CONVERSATION</div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading mb-4">
                            Intelligent conversations, built for developers
                        </h2>
                        <p className="text-base sm:text-lg text-secondary-text leading-relaxed">
                            Discuss algorithms, request code optimizations, or parse bugs. NotAI retains complete conversation memory, giving the AI full contextual understanding of your active codebase.
                        </p>
                    </div>

                    {/* macOS Style Large Video Frame */}
                    <div className="relative rounded-2xl border border-border bg-[#131110] overflow-hidden shadow-[0_20px_50px_var(--shadow-color)] hover:border-accent/40 transition-all duration-500">
                        {/* macOS Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#131110] border-b border-[#242120] select-none">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                            </div>
                            <div className="text-xs font-mono text-secondary-text">notai / ai-chat.py</div>
                            <div className="w-14" />
                        </div>
                        {/* Video Container - w-full h-auto block prevents any clipping */}
                        <div className="w-full bg-[#0a0a0c]">
                            <video
                                ref={chatVideoRef}
                                src="/chat.mp4"
                                loop
                                muted
                                playsInline
                                preload="auto"
                                className="w-full h-auto block"
                            />
                        </div>
                    </div>
                </section>

                {/* Showcase 2: Coding Assistant */}
                <section className="reveal-on-scroll group max-w-5xl mx-auto">
                    <div className="text-left mb-8">
                        <div className="text-xs font-bold font-mono tracking-widest text-accent uppercase mb-2">02 / WORKSPACE</div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading mb-4">
                            Write and align your code side-by-side
                        </h2>
                        <p className="text-base sm:text-lg text-secondary-text leading-relaxed">
                            Formulate drafts, write scripts, or review source lines in a workspace editor. Discuss code files interactively and request inline corrections dynamically in a cohesive visual window.
                        </p>
                    </div>

                    {/* macOS Style Large Video Frame */}
                    <div className="relative rounded-2xl border border-border bg-[#131110] overflow-hidden shadow-[0_20px_50px_var(--shadow-color)] hover:border-accent/40 transition-all duration-500">
                        {/* macOS Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#131110] border-b border-[#242120] select-none">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                            </div>
                            <div className="text-xs font-mono text-secondary-text">notai / workspace-editor.tsx</div>
                            <div className="w-14" />
                        </div>
                        {/* Video Container - w-full h-auto block prevents any clipping */}
                        <div className="w-full bg-[#0a0a0c]">
                            <video
                                ref={codeVideoRef}
                                src="/code.mp4"
                                loop
                                muted
                                playsInline
                                preload="auto"
                                className="w-full h-auto block"
                            />
                        </div>
                    </div>
                </section>

                {/* Showcase 3: Contests */}
                <section className="reveal-on-scroll group max-w-5xl mx-auto">
                    <div className="text-left mb-8">
                        <div className="text-xs font-bold font-mono tracking-widest text-accent uppercase mb-2">03 / COMPETITION</div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading mb-4">
                            Participate in coding challenges and contests
                        </h2>
                        <p className="text-base sm:text-lg text-secondary-text leading-relaxed">
                            Practice with dynamic contests and programming tasks. Track your performance, solve challenges against time limits, and climb the leaderboard.
                        </p>
                    </div>

                    {/* macOS Style Large Video Frame */}
                    <div className="relative rounded-2xl border border-border bg-[#131110] overflow-hidden shadow-[0_20px_50px_var(--shadow-color)] hover:border-accent/40 transition-all duration-500">
                        {/* macOS Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#131110] border-b border-[#242120] select-none">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                            </div>
                            <div className="text-xs font-mono text-secondary-text">notai / code-contests.py</div>
                            <div className="w-14" />
                        </div>
                        {/* Video Container - w-full h-auto block prevents any clipping */}
                        <div className="w-full bg-[#0a0a0c]">
                            <video
                                ref={competeVideoRef}
                                src="/compete.mp4"
                                loop
                                muted
                                playsInline
                                preload="auto"
                                className="w-full h-auto block"
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* 4. Detailed Grid Features */}
            <section id="grid-features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border/40 reveal-on-scroll">
                <div className="text-center mb-16">
                    <div className="text-xs font-bold font-mono tracking-widest text-accent uppercase mb-2">PRODUCT FEATURES</div>
                    <h2 className="text-4xl font-extrabold tracking-tight font-heading mb-4">Complete Developer Toolkit</h2>
                    <p className="text-lg text-secondary-text max-w-2xl mx-auto font-medium">
                        Everything you need to write, refactor, and test algorithms inside a supercharged, single-tab coding workspace.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feat, index) => (
                        <div key={index} className="gradient-border-card p-8 flex flex-col items-start transition-all duration-300">
                            <div className="p-3 bg-accent/10 border border-accent/25 rounded-xl mb-6 flex items-center justify-center">
                                {feat.icon}
                            </div>
                            <h3 className="text-xl font-bold font-heading mb-3 text-primary-text">{feat.title}</h3>
                            <p className="text-sm text-secondary-text font-medium leading-relaxed">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Stats Grid */}
            <section id="stats" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-border/40 z-10 max-w-6xl mx-auto reveal-on-scroll">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 rounded-2xl bg-secondary/50 backdrop-blur border border-border hover:border-accent/30 transition-all duration-300 hover:scale-[1.02]">
                        <div className="text-5xl font-extrabold text-accent mb-2 font-heading">4+</div>
                        <div className="text-xs font-bold text-secondary-text uppercase tracking-wider">Languages Supported</div>
                    </div>
                    <div className="p-8 rounded-2xl bg-secondary/50 backdrop-blur border border-border hover:border-accent/30 transition-all duration-300 hover:scale-[1.02]">
                        <div className="text-5xl font-extrabold text-accent mb-2 font-heading">∞</div>
                        <div className="text-xs font-bold text-secondary-text uppercase tracking-wider font-heading">Conversations Supported</div>
                    </div>
                    <div className="p-8 rounded-2xl bg-secondary/50 backdrop-blur border border-border hover:border-accent/30 transition-all duration-300 hover:scale-[1.02]">
                        <div className="text-5xl font-extrabold text-accent mb-2 font-heading">100%</div>
                        <div className="text-xs font-bold text-secondary-text uppercase tracking-wider">Free Forever</div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA Block */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 reveal-on-scroll">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative bg-secondary/80 backdrop-blur border border-border rounded-3xl p-12 overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-accent/5 animate-pulse-slow"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight font-heading mb-4">
                                Ready to Code Differently?
                            </h2>
                            <p className="text-base sm:text-lg text-secondary-text mb-8 max-w-xl mx-auto leading-relaxed font-medium">
                                Join NotAI today for a streamlined AI-integrated coding environment. Free forever, no configuration required.
                            </p>
                            <button
                                onClick={onGetStarted}
                                className="px-10 py-5 bg-accent hover:bg-accent/90 text-primary rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_8px_30px_rgb(227,160,132,0.25)] hover:scale-105"
                            >
                                Launch NotAI App
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-secondary/50 z-10">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm font-medium text-secondary-text">
                        Built with ❤️ by <span className="text-accent font-semibold">Harshit Shakya</span>
                    </p>
                    <p className="text-xs text-secondary-text/70 mt-2">
                        © 2026 NotAI. All rights reserved.
                    </p>
                </div>
            </footer>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-25px) rotate(3deg); }
                }
                
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
