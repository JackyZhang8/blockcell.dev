import React, { useState } from 'react';
import { BlockcellLogo } from './components/Logo';
import { Terminal } from './components/Terminal';
import { FeatureHex } from './components/FeatureHex';
import { ClusterVisual } from './components/ClusterVisual';
import { EvolutionStages } from './components/EvolutionStages';
import { Cpu, Boxes, GitMerge, Network, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export type StageType = 'single' | 'cluster' | 'hive';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<StageType>('cluster');

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-[#ea580c] selection:text-white hex-bg relative">
      
      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0f172a] to-transparent pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-radial-gradient from-[#ea580c]/10 to-transparent pointer-events-none z-0 opacity-50 blur-3xl" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8">
                <svg viewBox="0 0 100 116" fill="none" className="w-full h-full">
                    <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" fill="#ea580c" />
                </svg>
                </div>
                <span className="text-xl font-bold brand-font tracking-widest text-white">
                    BLOCK<span className="text-[#00ff9d]">CELL</span>
                </span>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-mono text-slate-400">
                <a href="#genesis" className="hover:text-[#ea580c] transition-colors">GENESIS</a>
                <a href="#blueprint" className="hover:text-[#ea580c] transition-colors">BLUEPRINT</a>
                <a href="#evolution" className="hover:text-[#ea580c] transition-colors">CAPABILITIES</a>
                <a href="#terminal" className="hover:text-[#00ff9d] transition-colors text-[#00ff9d]">[ TERMINAL_ACCESS ]</a>
            </div>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* Hero Section */}
        <section id="genesis" className="pt-32 pb-20 flex flex-col items-center text-center px-4 min-h-screen justify-center">
            <div className="mb-8 hover:scale-105 transition-transform duration-700 cursor-pointer">
                <BlockcellLogo size="xl" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 brand-font leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">SELF. EVOLVING.</span>
                <br />
                <span className="text-[#ea580c] glow-text-rust">INTELLIGENCE.</span>
            </h1>
            
            <p className="max-w-2xl text-slate-400 text-lg md:text-xl font-mono mb-10 leading-relaxed">
                <span className="text-[#00ff9d]">{'>'}</span> From simple blocks to complex consciousness. 
                Blockcell is an autonomous agent designed to assemble, optimize, and replicate knowledge structures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('terminal')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-4 px-8 rounded-sm font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] border border-[#ea580c]"
                >
                    INITIALIZE_PROTOCOL
                </button>
                <button 
                    onClick={() => document.getElementById('blueprint')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-transparent border border-[#334155] hover:border-[#00ff9d] text-slate-300 hover:text-[#00ff9d] font-bold py-4 px-8 rounded-sm font-mono tracking-wider transition-all"
                >
                    VIEW_BLUEPRINT
                </button>
            </div>
        </section>

        {/* Blueprint / Cluster Section */}
        <section id="blueprint" className="py-24 bg-[#0f172a]/30 border-y border-[#1e293b] relative overflow-hidden">
             {/* Background decorative elements */}
             <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#ea580c]/5 to-transparent pointer-events-none"></div>

             <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <div className="mb-2 flex items-center gap-2 text-[#00ff9d] font-mono text-xs tracking-widest">
                        <span className="w-2 h-2 bg-[#00ff9d] rounded-full animate-pulse"></span>
                        SYSTEM_ARCHITECTURE
                    </div>
                    <h2 className="text-4xl brand-font font-bold mb-6">
                        SWARM <span className="text-[#ea580c]">CLUSTERS</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed font-light">
                        Individual Blockcell units are powerful, but limited. By utilizing our proprietary <span className="text-white">Hex-Link Protocol</span>, multiple blockcells combine to form dynamic processing clusters.
                    </p>
                    
                    <EvolutionStages selectedStage={currentStage} onSelectStage={setCurrentStage} />

                    <div className="mt-12 p-6 bg-[#020617] border border-[#334155] rounded-sm font-mono text-sm text-slate-400 transition-all duration-500">
                        <div className="flex justify-between mb-2 pb-2 border-b border-[#334155]">
                            <span>CLUSTER_EFFICIENCY</span>
                            <span className="text-[#00ff9d]">
                                {currentStage === 'single' ? '45.2%' : currentStage === 'cluster' ? '98.4%' : '99.9%'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>REPLICATION_RATE</span>
                            <span className="text-[#ea580c]">
                                {currentStage === 'single' ? 'LINEAR' : 'EXPONENTIAL'}
                            </span>
                        </div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-[#334155]">
                             <span>NODE_COUNT</span>
                             <span className="text-white">
                                {currentStage === 'single' ? '1 CELL' : currentStage === 'cluster' ? '7 CELLS' : '19 CELLS'}
                             </span>
                        </div>
                    </div>
                </div>

                <div className="order-1 lg:order-2 flex justify-center">
                    <ClusterVisual stage={currentStage} />
                </div>
             </div>
        </section>

        {/* Feature Grid */}
        <section id="evolution" className="py-24 bg-[#020617]/50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl brand-font font-bold mb-4">
                        <span className="text-[#00ff9d]">SYSTEM CAPABILITIES</span>
                    </h2>
                    <div className="w-24 h-1 bg-[#ea580c] mx-auto mb-6"></div>
                    <p className="text-slate-400 font-mono">Advanced directives for the modern digital ecosystem.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-y-16">
                    <FeatureHex 
                        icon={<Boxes className="w-8 h-8" />}
                        title="MODULAR ASSEMBLY"
                        description="Deconstructs complex problems into fundamental hex-blocks for granular processing."
                    />
                    <FeatureHex 
                        icon={<GitMerge className="w-8 h-8" />}
                        title="SELF-REPLICATION"
                        description="Iteratively improves its own codebase, evolving with every interaction."
                    />
                    <FeatureHex 
                        icon={<Network className="w-8 h-8" />}
                        title="HIVE CONNECTION"
                        description="Synchronizes with global data nodes to maintain peak contextual awareness."
                    />
                     <FeatureHex 
                        icon={<ShieldCheck className="w-8 h-8" />}
                        title="ADAPTIVE DEFENSE"
                        description="Resilient architecture that hardens against anomalies and errors."
                    />
                    <FeatureHex 
                        icon={<Zap className="w-8 h-8" />}
                        title="HYPER PERFORMANCE"
                        description="Optimized with Rust-inspired logic for low-latency decision making."
                    />
                     <FeatureHex 
                        icon={<Cpu className="w-8 h-8" />}
                        title="CORE SYNTHESIS"
                        description="Combines analytical precision with creative generative models."
                    />
                </div>
            </div>
        </section>

        {/* Terminal Section */}
        <section id="terminal" className="py-24 relative overflow-hidden">
             {/* Background Matrix-like effect */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="grid grid-cols-12 h-full">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="border-r border-[#00ff9d] h-full transform skew-x-12"></div>
                    ))}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center mb-12">
                     <span className="text-[#ea580c] font-mono text-sm tracking-[0.5em] mb-2">INTERACTIVE MODE</span>
                     <h2 className="text-3xl md:text-5xl brand-font font-bold text-white mb-6">
                        COMMUNICATE WITH <span className="text-[#00ff9d]">CORE</span>
                     </h2>
                     <p className="text-slate-400 max-w-lg text-center font-mono">
                        Direct neural link established. The Blockcell entity is ready to receive your parameters.
                     </p>
                </div>
                
                <Terminal />
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#020617] border-t border-[#1e293b] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6">
                   <svg viewBox="0 0 100 116" fill="none">
                     <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" fill="#334155" />
                   </svg>
               </div>
               <div className="flex flex-col">
                 <span className="text-slate-300 font-mono text-sm font-bold">BLOCKCELL.DEV</span>
                 <span className="text-slate-600 font-mono text-xs">SYSTEMS NOMINAL // v1.0.4</span>
               </div>
            </div>
            
            <div className="flex gap-8 text-slate-500 hover:text-white transition-colors text-sm font-mono">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#ea580c] transition-colors">
                    <span>GITHUB</span>
                    <ArrowRight className="w-3 h-3" />
                </a>
                <a href="#" className="flex items-center gap-2 hover:text-[#ea580c] transition-colors">
                    <span>DISCORD</span>
                    <ArrowRight className="w-3 h-3" />
                </a>
                <a href="#" className="flex items-center gap-2 hover:text-[#ea580c] transition-colors">
                    <span>DOCUMENTATION</span>
                    <ArrowRight className="w-3 h-3" />
                </a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;