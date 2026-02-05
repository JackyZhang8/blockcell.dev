import React from 'react';

interface FeatureHexProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureHex: React.FC<FeatureHexProps> = ({ icon, title, description }) => {
  return (
    <div className="relative group w-full max-w-[300px] h-[350px] flex flex-col items-center justify-center p-6 mx-auto transition-transform hover:-translate-y-2">
      
      {/* Hexagon Background Shape */}
      <div className="absolute inset-0 z-0">
         <svg viewBox="0 0 100 116" preserveAspectRatio="none" className="w-full h-full fill-[#0f172a] stroke-[#1e293b] stroke-1 group-hover:stroke-[#00ff9d] transition-colors duration-300">
             <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" />
         </svg>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 z-[-1] blur-xl bg-[#00ff9d]/0 group-hover:bg-[#00ff9d]/20 transition-all duration-500 rounded-full scale-75"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#020617] border border-[#ea580c] flex items-center justify-center text-[#ea580c] group-hover:text-[#00ff9d] group-hover:border-[#00ff9d] transition-colors shadow-lg">
           {icon}
        </div>
        <h3 className="text-xl brand-font font-bold text-white group-hover:text-[#00ff9d] tracking-wider">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed max-w-[200px] font-mono">
            {description}
        </p>
      </div>
      
      {/* Decorative tech lines */}
      <div className="absolute bottom-8 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#ea580c] to-transparent opacity-50"></div>
    </div>
  );
};