import React from 'react';
import { Settings, Maximize2, RotateCw, Activity, X } from 'lucide-react';
import { SimulationParams } from '../types';

interface ControlsProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  visible: boolean;
  toggleVisibility: () => void;
}

const Controls: React.FC<ControlsProps> = ({ params, setParams, visible, toggleVisibility }) => {
  const handleChange = (key: keyof SimulationParams, value: number | string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Persistent Toggle Button (Visible when panel is hidden) */}
      <button 
        onClick={toggleVisibility}
        className={`fixed bottom-20 right-4 md:bottom-28 md:right-8 z-40 p-3 bg-white/5 backdrop-blur-md rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/10 shadow-lg ${visible ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
        aria-label="Open Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Main Panel */}
      <div className={`fixed top-4 right-4 z-50 transition-all duration-500 ease-out ${visible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-80 text-white shadow-2xl ring-1 ring-white/5 relative overflow-hidden">
          
          {/* Decorative background gradients */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-sm font-medium tracking-[0.2em] uppercase flex items-center gap-2 text-white/90">
              <Settings className="w-4 h-4" />
              Simulation
            </h2>
            <button 
              onClick={toggleVisibility}
              className="text-white/40 hover:text-white hover:rotate-90 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-7 relative z-10">
            
            {/* Zoom Slider */}
            <div className="space-y-3 group">
              <div className="flex justify-between text-[10px] text-white/50 font-mono tracking-wider uppercase group-hover:text-white/80 transition-colors">
                <span className="flex items-center gap-1.5"><Maximize2 className="w-3 h-3" /> Distance (LY)</span>
                <span className="text-orange-300">{params.cameraZoom.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.2" 
                step="0.01" 
                value={params.cameraZoom}
                onChange={(e) => handleChange('cameraZoom', parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(249,115,22,0.5)] hover:[&::-webkit-slider-thumb]:bg-orange-400 hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
              />
            </div>

            {/* Disk Speed Slider */}
            <div className="space-y-3 group">
              <div className="flex justify-between text-[10px] text-white/50 font-mono tracking-wider uppercase group-hover:text-white/80 transition-colors">
                <span className="flex items-center gap-1.5"><RotateCw className="w-3 h-3" /> Spin Velocity</span>
                <span className="text-blue-300">{(params.diskSpeed * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.2"
                step="0.005"
                value={params.diskSpeed}
                onChange={(e) => handleChange('diskSpeed', parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:[&::-webkit-slider-thumb]:bg-blue-400 hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
              />
            </div>

            {/* Turbulence Slider */}
            <div className="space-y-3 group">
              <div className="flex justify-between text-[10px] text-white/50 font-mono tracking-wider uppercase group-hover:text-white/80 transition-colors">
                <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> Plasma Flux</span>
                <span className="text-purple-300">{(params.turbulence * 10).toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.0"
                step="0.05"
                value={params.turbulence}
                onChange={(e) => handleChange('turbulence', parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(168,85,247,0.5)] hover:[&::-webkit-slider-thumb]:bg-purple-400 hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
              />
            </div>

            {/* Color Picker */}
            <div className="pt-2 border-t border-white/5">
               <div className="flex justify-between text-[10px] text-white/40 font-mono uppercase mb-3">
                <span>Accretion Spectrum</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'Gargantua', value: '#ffad5c' },
                  { name: 'Quasar', value: '#5caaff' },
                  { name: 'Crimson', value: '#ff5c5c' },
                  { name: 'Phantom', value: '#aaff5c' },
                  { name: 'Violet', value: '#ad5cff' },
                  { name: 'Cyan', value: '#5cffad' },
                  { name: 'Magenta', value: '#ff5cad' },
                  { name: 'White', value: '#ffffff' },
                ].map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleChange('accretionDiskColor', color.value)}
                    className={`w-full h-10 rounded-full border border-white/10 transition-all hover:scale-110 active:scale-95 ${params.accretionDiskColor === color.value ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-60 hover:opacity-100'}`}
                    style={{ 
                      background: `radial-gradient(circle at 30% 30%, ${color.value}, #000)`,
                      boxShadow: params.accretionDiskColor === color.value ? `0 0 15px ${color.value}80` : 'none'
                    }}
                    title={color.name}
                  />
                ))}
              </div>
              {/* Custom Color Picker */}
              <div className="mt-4">
                <label className="block text-[10px] text-white/40 font-mono uppercase mb-2">
                  Custom Color
                </label>
                <input
                  type="color"
                  value={params.accretionDiskColor}
                  onChange={(e) => handleChange('accretionDiskColor', e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer border border-white/10 bg-white/5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Controls;