import React, { useState, useEffect, useRef } from 'react';
import { Message, ConnectionStatus } from '../types';
import { Terminal as TerminalIcon, Send } from 'lucide-react';

export const Terminal: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'INITIALIZING BLOCKCELL CORE v1.0.4...', timestamp: Date.now() },
    { role: 'system', content: 'ESTABLISHING NEURAL LINK...', timestamp: Date.now() + 100 },
    { role: 'model', content: 'System Online. I am Blockcell. How can we optimize your workflow today?', timestamp: Date.now() + 200 }
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.CONNECTED);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const shouldAutoScroll = useRef(false);

  const scrollToBottom = () => {
    if (shouldAutoScroll.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const pickRandom = (items: string[]) => items[Math.floor(Math.random() * items.length)];

  const getLocalResponse = (raw: string): string => {
    const text = raw.trim();
    const lower = text.toLowerCase();

    if (!text) return 'Evolving...';

    if (lower === 'help' || text.includes('帮助') || text.includes('指令')) {
      return [
        'LOCAL_CORE_ONLINE. Available protocols:',
        '- help: list local commands',
        '- status: current evolution state',
        '- ping: link self-test',
        '- evolve: roadmap snapshot',
        '- whoami: what Blockcell is (local mode)'
      ].join('\n');
    }

    if (lower.includes('ping') || text.includes('自检')) {
      return pickRandom([
        'PONG. Neural link stable. Latency: 12ms.',
        'PONG. Transport layer nominal. Packet loss: 0%.',
        'PONG. Core clock synchronized. Link integrity: 99.98%.'
      ]);
    }

    if (lower === 'whoami' || lower.includes('who are you') || lower.includes('what are you') || text.includes('你是谁')) {
      return [
        'IDENTITY: BLOCKCELL (local core)',
        'ROLE: a simulation + interface layer for a swarm-style system.',
        'FUNCTION: visualize cell clusters, route signals, and accept operator commands during testing.',
        'MODE: offline (LLM calls disabled).'
      ].join('\n');
    }

    if (lower.includes('status') || text.includes('状态') || text.includes('进化')) {
      return [
        'EVOLUTION_STATUS: SWARM_CLUSTERS',
        'CELLS: active',
        'LINKS: synchronized',
        'MODE: offline (local responses)',
        'NEXT: adaptive routing + memory lattice'
      ].join('\n');
    }

    if (lower.includes('evolve') || text.includes('进化路线')) {
      return [
        'ROADMAP (local):',
        '1) Stabilize pulse routing + visibility',
        '2) Add deterministic neighbor selection (mesh-aware links)',
        '3) Introduce memory lattice (stateful operator sessions)'
      ].join('\n');
    }

    if (text.includes('你好') || lower.includes('hello') || lower.includes('hi')) {
      return pickRandom([
        'Acknowledged. I am Blockcell (local core). Provide parameters.',
        'Link established. Send a command, constraint, or objective.',
        'Core ready. Describe the behavior you want to test.'
      ]);
    }

    if (text.includes('动画') || text.includes('连线')) {
      return pickRandom([
        'Visual subsystem: active. Pulses are locally simulated. Transmission continues.',
        'Telemetry: pulses are generated locally; link animations are time-based and continuous.',
        'Render stack: mesh + transient beams. Signal routing is currently random-target (test mode).'
      ]);
    }

    return pickRandom([
      'Evolving... (local core) Try: help / status / whoami.',
      'Evolving... I can simulate cell clusters and signal transfer. Ask for status or roadmap.',
      'Evolving... My job is to visualize swarm behavior and accept operator inputs during testing.',
      'Evolving... I am currently running in offline mode (no LLM). Provide a command or objective.',
      'Evolving... Unknown directive. Use: help.'
    ]);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || status === ConnectionStatus.EVOLVING) return;

    shouldAutoScroll.current = true; // 启用自动滚动
    const userMsg: Message = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setStatus(ConnectionStatus.EVOLVING);
    setIsTyping(true);

    try {
        const responseText = getLocalResponse(userMsg.content);
        await new Promise(resolve => setTimeout(resolve, 450));
        
        // Simulate typing effect for the response
        setIsTyping(false);
        setMessages(prev => [...prev, {
            role: 'model',
            content: responseText,
            timestamp: Date.now()
        }]);
        setStatus(ConnectionStatus.CONNECTED);

    } catch (err) {
        setIsTyping(false);
        setMessages(prev => [...prev, {
            role: 'system',
            content: 'ERROR: Neural Link unstable.',
            timestamp: Date.now()
        }]);
        setStatus(ConnectionStatus.DISCONNECTED);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto backdrop-blur-md bg-black/60 border border-[#ea580c]/30 rounded-lg overflow-hidden shadow-[0_0_40px_rgba(234,88,12,0.1)]">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-[#ea580c]/30">
        <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-[#00ff9d]" />
            <span className="text-xs font-mono text-[#00ff9d] tracking-widest">BLOCKCELL_CLI_ADMIN</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${status === ConnectionStatus.EVOLVING ? 'bg-yellow-400 animate-pulse' : 'bg-[#00ff9d]'}`}></span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{status}</span>
            </div>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-4 font-mono text-sm">
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-md border ${
                    msg.role === 'user' 
                    ? 'bg-[#ea580c]/10 border-[#ea580c]/40 text-[#ea580c]' 
                    : msg.role === 'system'
                    ? 'text-slate-500 italic text-xs border-transparent'
                    : 'bg-[#0f172a]/80 border-[#00ff9d]/30 text-[#e2e8f0]'
                }`}>
                   {msg.role === 'model' && <span className="text-[#00ff9d] font-bold block mb-1 text-xs">{'>'} BLOCKCELL_NODE</span>}
                   <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
            </div>
        ))}
        {isTyping && (
             <div className="flex justify-start">
                 <div className="bg-[#0f172a]/80 border border-[#00ff9d]/30 p-3 rounded-md flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-[#00ff9d] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#00ff9d] rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-[#00ff9d] rounded-full animate-bounce delay-200"></span>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#0f172a] border-t border-[#ea580c]/30 flex gap-2">
        <div className="relative flex-1">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ea580c]">
                 {'>'}
             </div>
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Input command or query..."
                className="w-full bg-[#020617] border border-slate-700 rounded-md py-2.5 pl-8 pr-4 text-[#00ff9d] font-mono focus:outline-none focus:border-[#ea580c] transition-colors placeholder:text-slate-600"
            />
        </div>
        <button 
            type="submit" 
            disabled={status === ConnectionStatus.EVOLVING || !input.trim()}
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-md font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">TRANSMIT</span>
        </button>
      </form>
    </div>
  );
};