import React from 'react';
import { ExperimentMode } from '../types';
import { RotateCcw, Disc, Gauge, Square } from 'lucide-react';

interface ControlPanelProps {
  isPaused: boolean;
  setIsPaused: (val: boolean) => void;
  speed: number;
  setSpeed: (val: number) => void;
  mode: ExperimentMode;
  setMode: (mode: ExperimentMode) => void;
  onReset: () => void;
  onFireSingle: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPaused,
  setIsPaused,
  speed,
  setSpeed,
  mode,
  setMode,
  onReset,
  onFireSingle
}) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col gap-6">
      
      {/* Main Controls */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-cyan-400 tracking-wide uppercase">Experiment Controls</h2>
        
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-2 py-2 rounded-lg border font-semibold transition-all ${
                  isPaused
                  ? 'bg-red-500 text-white border-red-600'
                  : ' bg-blue-500 text-slate-200 border-blue-600 '
              }`}
              title="Freeze Physics"
              >
                <Square size={14} /> {isPaused ? 'Resume' : 'Pause'}
              </button>

              <button
              onClick={onReset}
              className="px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition-all"
              title="Reset Experiment"
              >
              <RotateCcw size={18} />
              </button>
            </div>

            <button
              onClick={onFireSingle}
              className="w-full py-3 rounded-lg font-semibold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/50 flex items-center justify-center gap-2 transition-all"
            >
              <Disc size={18} />
              Fire Single Photon Pair
            </button>
        </div>
      </div>

      {/* Mode Switch */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Configuration</h3>
        
        <div className="grid grid-cols-2 gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-700">
            <button
            onClick={() => setMode(ExperimentMode.STANDARD)}
            className={`py-2 text-sm font-medium rounded-md transition-all ${
                mode === ExperimentMode.STANDARD
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            >
            Known Path
            </button>
            <button
            onClick={() => setMode(ExperimentMode.ERASER)}
            className={`py-2 text-sm font-medium rounded-md transition-all ${
                mode === ExperimentMode.ERASER
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            >
            Quantum Eraser
            </button>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed h-10">
            {mode === ExperimentMode.STANDARD 
            ? "Detectors D3/D4 active. We know which slit the photon passed through." 
            : "Beam splitters inserted. Path info erased. D1/D2 coincidence active."}
        </p>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
         <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Gauge size={14} /> Speed
         </h3>
         <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-700">
            {[4, 8, 16].map((s) => (
                <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                        speed === s
                        ? 'bg-slate-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                    {s === 4 ? 'Slow' : s === 8 ? 'Medium' : 'Fast'}
                </button>
            ))}
         </div>
      </div>


    </div>
  );
};