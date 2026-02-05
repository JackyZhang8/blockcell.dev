import React from 'react';

export const BlockcellLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'md' }) => {
  const scale = {
    sm: 'scale-50',
    md: 'scale-100',
    lg: 'scale-150',
    xl: 'scale-[2.0]',
  }[size];

  return (
    <div className={`relative w-32 h-32 flex items-center justify-center ${scale} transition-transform duration-500`}>
      {/* Container for the 3D Array - Optimized with will-change-transform */}
      <div className="relative w-full h-full animate-[spin_20s_linear_infinite] will-change-transform">
        
        {/* Background Hexagon (Dark Structure) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
           <svg width="100" height="116" viewBox="0 0 100 116" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
             <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" fill="#0f172a" stroke="#ea580c" strokeWidth="2"/>
           </svg>
        </div>

        {/* Mid Layer Hexagon (Rust Orange - Hardware) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12">
           <svg width="80" height="92" viewBox="0 0 100 116" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
             <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" stroke="#ea580c" strokeWidth="4" strokeDasharray="10 5"/>
           </svg>
        </div>

        {/* Inner Core (Cyberpunk Green - AI Cell) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
           <svg width="40" height="46" viewBox="0 0 100 116" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" fill="#00ff9d" className="drop-shadow-[0_0_15px_rgba(0,255,157,0.8)]"/>
           </svg>
        </div>

        {/* Floating Satellites (Blocks assembling) */}
        <div className="absolute -top-2 right-0 animate-bounce delay-100">
          <svg width="20" height="24" viewBox="0 0 100 116">
             <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" fill="#ea580c" className="opacity-80"/>
          </svg>
        </div>
        <div className="absolute bottom-0 -left-2 animate-bounce delay-300">
           <svg width="20" height="24" viewBox="0 0 100 116">
             <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" fill="#ea580c" className="opacity-80"/>
          </svg>
        </div>
      </div>
    </div>
  );
};