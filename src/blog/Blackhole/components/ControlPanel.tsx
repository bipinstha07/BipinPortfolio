
import React from 'react';
import { SimSettings } from '../types';

interface ControlPanelProps {
  settings: SimSettings;
  onChange: (key: keyof SimSettings, value: number | boolean) => void;
  onClose: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onChange, onClose }) => {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-xl font-extralight tracking-widest uppercase text-white/90">Controls</h2>
          <p className="text-[10px] text-white/30 font-mono mt-1 uppercase tracking-tighter">Singularity Visualization</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-8">
        {/* Physics Section */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Singularity</h3>
          
          <ControlItem 
            label="Singularity Mass" 
            value={`${settings.mass.toFixed(1)} M☉`} 
            min={0.5} max={3.0} step={0.1}
            current={settings.mass}
            onChange={(v) => onChange('mass', v)}
            accent="bg-orange-500"
          />

          <ControlItem 
            label="Accretion Disc" 
            value={`${settings.discSize.toFixed(1)} r_s`} 
            min={1.5} max={8.0} step={0.1}
            current={settings.discSize}
            onChange={(v) => onChange('discSize', v)}
            accent="bg-yellow-500"
          />
        </div>

        {/* Optics Section */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Relativity</h3>
          
          <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
            <span className="text-xs font-mono uppercase text-white/40 group-hover:text-white/60">Light Bending</span>
            <button 
              onClick={() => onChange('lensingEnabled', !settings.lensingEnabled)}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.lensingEnabled ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${settings.lensingEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <ControlItem 
            label="Lensing Strength" 
            value={`${(settings.lensingStrength * 100).toFixed(0)}%`} 
            min={0} max={2.0} step={0.05}
            current={settings.lensingStrength}
            onChange={(v) => onChange('lensingStrength', v)}
            accent="bg-blue-400"
          />

          <ControlItem 
            label="Bloom Magnitude" 
            value={settings.bloom.toFixed(1)} 
            min={0} max={4} step={0.1}
            current={settings.bloom}
            onChange={(v) => onChange('bloom', v)}
            accent="bg-red-500"
          />
        </div>

        {/* Camera Section */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Observation</h3>
          
          <ControlItem 
            label="Distance" 
            value={settings.cameraDistance.toFixed(1)} 
            min={4} max={40} step={0.5}
            current={settings.cameraDistance}
            onChange={(v) => onChange('cameraDistance', v)}
            accent="bg-emerald-400"
          />

          <ControlItem 
            label="Field of View" 
            value={`${(settings.fieldOfView * 100).toFixed(0)}%`} 
            min={0.2} max={2.0} step={0.05}
            current={settings.fieldOfView}
            onChange={(v) => onChange('fieldOfView', v)}
            accent="bg-cyan-500"
          />
        </div>
      </div>

      <div className="pt-8 border-t border-white/5">
        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <p className="text-[10px] text-blue-300/60 font-mono leading-relaxed italic">
            Command Center: Drag to rotate. Use Scroll to zoom. High lensing strength approximates extreme curvature.
          </p>
        </div>
      </div>
    </div>
  );
};

const ControlItem: React.FC<{
  label: string;
  value: string | number;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
  accent: string;
}> = ({ label, value, min, max, step, current, onChange, accent }) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-white/40">
      <span>{label}</span>
      <span className="text-white/80">{value}</span>
    </div>
    <div className="relative flex items-center h-4">
      <div className="absolute w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${accent} opacity-50`} 
          style={{ width: `${((current - min) / (max - min)) * 100}%` }}
        />
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={current}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute w-full h-full bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:active:scale-125 transition-transform"
      />
    </div>
  </div>
);
