import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Animated dot wave background
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Dot configuration
        const dots: Array<{ x: number; y: number; baseY: number; speed: number; amplitude: number }> = [];
        const dotCount = 150;
        const dotSize = 2;

        // Initialize dots
        for (let i = 0; i < dotCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            dots.push({
                x,
                y,
                baseY: y,
                speed: 0.5 + Math.random() * 1.5,
                amplitude: 20 + Math.random() * 30
            });
        }

        let animationFrame: number;
        let time = 0;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Get theme color
            const isDark = theme === 'dark';
            const dotColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)';

            // Update and draw dots
            dots.forEach((dot, index) => {
                // Wave motion
                const wave1 = Math.sin(time * 0.001 * dot.speed + index * 0.1) * dot.amplitude;
                const wave2 = Math.cos(time * 0.0015 * dot.speed + index * 0.15) * (dot.amplitude * 0.5);

                dot.y = dot.baseY + wave1 + wave2;
                dot.x += Math.sin(time * 0.0005 + index) * 0.5;

                // Wrap around screen
                if (dot.x > canvas.width) dot.x = 0;
                if (dot.x < 0) dot.x = canvas.width;
                if (dot.y > canvas.height) dot.baseY = 0;
                if (dot.y < 0) dot.baseY = canvas.height;

                // Draw dot
                ctx.fillStyle = dotColor;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
                ctx.fill();
            });

            time++;
            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrame);
        };
    }, [theme]);

    const features = [
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            title: 'Intelligent Conversations',
            description: 'Have natural, context-aware conversations with advanced AI that understands and remembers your chat history.',
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: 'Instant Code Execution',
            description: 'Run your code instantly in the browser without any setup. Test algorithms and debug on the fly.',
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            title: 'Multi-Language Support',
            description: 'Switch seamlessly between JavaScript, Python, Java, and C++ - all in one unified environment.',
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            title: 'Smart Code Editor',
            description: 'Professional-grade editor with syntax highlighting, auto-completion, and error detection.',
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            title: 'Conversation Management',
            description: 'Organize and revisit your conversations anytime. Never lose track of important discussions.',
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Real-Time Responses',
            description: 'Get instant streaming responses as the AI thinks, making conversations feel natural and dynamic.',
        }
    ];

    const stats = [
        { value: '4+', label: 'Languages Supported' },
        { value: '∞', label: 'Code Executions' },
        { value: '100%', label: 'Free Forever' }
    ];

    return (
        <div className="min-h-screen bg-primary text-primary-text overflow-x-hidden transition-colors duration-300">
            {/* Animated Dot Wave Background */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full pointer-events-none z-0"
            />

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="fixed top-6 right-6 z-50 p-3 rounded-lg bg-secondary border-2 border-border hover:border-accent transition-all duration-300 shadow-lg group"
                aria-label="Toggle theme"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                {theme === 'dark' ? (
                    <svg className="w-6 h-6 text-accent group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-accent group-hover:-rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </button>

            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5 z-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {/* Logo Animation */}
                    <div className="flex justify-center mb-8 animate-fade-in">
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-pulse"></div>
                            <Logo className="w-24 h-24 text-accent relative z-10 animate-float" />
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
                        Welcome to <span className="text-accent">NotAI</span>
                    </h1>

                    <p className="text-xl sm:text-2xl lg:text-3xl text-secondary-text mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        AI Chat & Code Execution Platform
                    </p>

                    <p className="text-lg sm:text-xl text-secondary-text mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        Chat with AI, write code, execute it, error? No problem ask NotAI just by selecting line instantly - all in one seamless experience.
                        No installations, no configurations, just pure productivity.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
                        <button
                            onClick={onGetStarted}
                            className="group relative px-8 py-4 bg-accent text-primary rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <span className="relative z-10">Get Started Free</span>
                        </button>

                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-secondary border-2 border-accent rounded-xl font-semibold text-lg hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-105"
                        >
                            Explore Features
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            Powerful <span className="text-accent">Features</span>
                        </h2>
                        <p className="text-xl text-secondary-text">Everything you need to code and create</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-primary border-2 border-border hover:border-accent rounded-2xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="relative z-10">
                                    <div className="text-accent mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-secondary-text group-hover:text-primary-text transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="group p-8 bg-secondary border-2 border-border rounded-2xl hover:border-accent transition-all duration-300 hover:scale-105"
                            >
                                <div className="text-5xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                                    {stat.value}
                                </div>
                                <div className="text-xl text-secondary-text">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            How It <span className="text-accent">Works</span>
                        </h2>
                        <p className="text-xl text-secondary-text">Get started in three simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-primary border-2 border-border rounded-2xl hover:border-accent transition-all duration-300 hover:scale-105">
                            <div className="w-16 h-16 bg-accent text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Sign Up</h3>
                            <p className="text-secondary-text">Create your free account in seconds. No credit card required.</p>
                        </div>

                        <div className="text-center p-8 bg-primary border-2 border-border rounded-2xl hover:border-accent transition-all duration-300 hover:scale-105">
                            <div className="w-16 h-16 bg-accent text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Start Chatting</h3>
                            <p className="text-secondary-text">Ask questions, get answers, and have intelligent conversations.</p>
                        </div>

                        <div className="text-center p-8 bg-primary border-2 border-border rounded-2xl hover:border-accent transition-all duration-300 hover:scale-105">
                            <div className="w-16 h-16 bg-accent text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Code & Execute</h3>
                            <p className="text-secondary-text">Write code in your favorite language and run it instantly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative bg-secondary border-2 border-accent rounded-3xl p-12 overflow-hidden">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-accent/5 animate-pulse"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                                Ready to Get Started?
                            </h2>
                            <p className="text-xl text-secondary-text mb-8">
                                Join now and experience the future of AI-powered development
                            </p>
                            <button
                                onClick={onGetStarted}
                                className="group relative px-10 py-5 bg-accent text-primary rounded-xl font-bold text-xl overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                            >
                                <span className="relative z-10">Launch App</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-8 px-4 sm:px-6 lg:px-8 border-t-2 border-border bg-secondary">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-secondary-text">
                        Built with ❤️ by <span className="text-accent font-semibold">Harshit Shakya</span>
                    </p>
                    <p className="text-secondary-text mt-2">
                        © 2025 NotAI. All rights reserved.
                    </p>
                </div>
            </footer>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};
