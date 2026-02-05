import React from 'react';
import { ChevronRight } from 'lucide-react';
import { StageType } from '../App';

interface EvolutionStagesProps {
  selectedStage: StageType;
  onSelectStage: (stage: StageType) => void;
}

export const EvolutionStages: React.FC<EvolutionStagesProps> = ({ selectedStage, onSelectStage }) => {
  const stages: { id: string; key: StageType; name: string; type: string; desc: string }[] = [
    {
      id: "01",
      key: "single",
      name: "SINGLE CELL",
      type: "NANO_UNIT",
      desc: "Basic autonomous unit. Capable of local data processing and simple code execution."
    },
    {
      id: "02",
      key: "cluster",
      name: "CLUSTER",
      type: "SWARM_NODE",
      desc: "Multiple cells linked via local mesh network. Parallel processing and specialized roles enabled."
    },
    {
      id: "03",
      key: "hive",
      name: "HIVE MIND",
      type: "GLOBAL_ARRAY",
      desc: "Planetary scale integration. Infinite compute context and self-improving architecture."
    }
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-5xl mx-auto">
      {stages.map((stage, idx) => {
        const isActive = selectedStage === stage.key;
        return (
          <React.Fragment key={stage.id}>
            <button 
                onClick={() => onSelectStage(stage.key)}
                className={`text-left relative flex-1 p-6 border transition-all duration-300 group min-h-[200px] flex flex-col justify-between w-full md:w-auto
                    ${isActive 
                        ? 'border-[#ea580c] bg-[#ea580c]/10 shadow-[0_0_30px_rgba(234,88,12,0.15)] scale-105 z-10' 
                        : 'border-slate-700 bg-[#0f172a]/50 hover:bg-[#0f172a]/80 hover:border-slate-500 hover:scale-[1.02] text-slate-400'
                    }
                `}
            >
               {/* Hex Background Icon */}
               <div className={`absolute top-2 right-2 transition-opacity ${isActive ? 'opacity-20 text-[#ea580c]' : 'opacity-5 text-slate-500 group-hover:opacity-10'}`}>
                  <svg width="40" height="46" viewBox="0 0 100 116" fill="currentColor">
                      <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" />
                  </svg>
               </div>
  
               <div>
                  <div className={`font-mono text-xs mb-1 ${isActive ? 'text-[#ea580c]' : 'opacity-50'}`}>STAGE_{stage.id} // {stage.type}</div>
                  <h3 className={`text-2xl brand-font font-bold mb-3 ${isActive ? 'text-white glow-text-rust' : 'text-slate-300'}`}>{stage.name}</h3>
                  <p className={`font-mono text-sm leading-relaxed ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{stage.desc}</p>
               </div>
  
               {isActive && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#ea580c] animate-pulse">
                      <span className="w-2 h-2 bg-[#ea580c] rounded-full"></span>
                      CURRENT_STATUS
                  </div>
               )}
            </button>
            
            {idx < stages.length - 1 && (
              <div className="hidden md:block text-slate-600">
                  <ChevronRight className="w-8 h-8 opacity-50" />
              </div>
            )}
            {idx < stages.length - 1 && (
              <div className="md:hidden block text-slate-600 my-2">
                   <div className="w-1 h-8 bg-slate-800 mx-auto"></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};