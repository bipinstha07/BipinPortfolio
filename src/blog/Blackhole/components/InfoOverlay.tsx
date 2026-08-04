
import React from 'react';

export const InfoOverlay: React.FC = () => {
  return (
    <div className="fixed bottom-8 left-8 right-8 md:left-auto md:w-[400px] p-6 bg-black/60 backdrop-blur-2xl border border-white/5 rounded-[32px] pointer-events-auto z-10 shadow-2xl transition-all hover:bg-black/70 group">
      <div className="flex items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-medium text-white/90 tracking-tight">System Navigation</h3>
          <p className="text-xs text-white/40 leading-relaxed mt-2">
            Orbit the singularity by <span className="text-white/60">Dragging</span>. Scroll your mouse <span className="text-white/60">Wheel</span> to navigate deep space. Observe the multi-layered starfield—each magnitude calculated based on relativistic luminosity.
          </p>
        </div>
      </div>
    </div>
  );
};
