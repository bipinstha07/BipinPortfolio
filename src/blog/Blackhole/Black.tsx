
import React, { useState, useCallback } from 'react';
import { Simulation } from './components/Simulation';
import { ControlPanel } from './components/ControlPanel';
import { InfoOverlay } from './components/InfoOverlay';
import { SimSettings } from './types';

const Black: React.FC = () => {
  const [settings, setSettings] = useState<SimSettings>({
    mass: 1.4,
    discSize: 3.5,
    tilt: 0.3, 
    rotationSpeed: 0.4,
    glowIntensity: 1.8,
    lensingEnabled: true,
    lensingStrength: 1.0,
    cameraDistance: 12.0,
    fieldOfView: 0.8,
    bloom: 1.2
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSettingChange = useCallback((key: keyof SimSettings, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col md:flex-row bg-[#010103]">
      {/* Background Simulation */}
      <div className="absolute inset-0 z-0">
        <Simulation settings={settings} onSettingChange={handleSettingChange} />
      </div>

      {/* UI Controls */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-black/80 backdrop-blur-2xl border-r border-white/5 z-20 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <ControlPanel 
            settings={settings} 
            onChange={handleSettingChange} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-6 left-6 z-30 p-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl transition-all active:scale-95"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      )}

      {/* Header Info */}
      <div className="absolute top-6 right-8 pointer-events-none text-right z-10 hidden md:block">
        <h1 className="text-3xl font-extralight tracking-[0.3em] text-white/90 uppercase mb-1 drop-shadow-lg">Singularity</h1>
        <p className="text-[10px] text-white/30 font-mono tracking-widest uppercase">Deep Space Kerr Visualizer</p>
      </div>

      <InfoOverlay />
    </div>
  );
};

export default Black;
