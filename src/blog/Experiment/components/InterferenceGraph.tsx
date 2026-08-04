import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DetectionData } from '../types';

interface InterferenceGraphProps {
  data: DetectionData[];
  mode: string;
}

export const InterferenceGraph: React.FC<InterferenceGraphProps> = ({ data}) => {
  
  // Determine if we should show the pattern background
  const lastDetection = data.length > 0 ? data[data.length - 1] : null;
  
  // Show interference only if D1 or D2 hit
  const showInterferencePattern = lastDetection && (lastDetection.idlerDetector === 'D1' || lastDetection.idlerDetector === 'D2');
  
  // Clump check (D3/D4) - User requested NOT to show these
  const isClump = lastDetection && (lastDetection.idlerDetector === 'D3' || lastDetection.idlerDetector === 'D4');

  // Determine Fringe Color based on Source Path
  // Path A (Upper) = Blue
  // Path B (Lower) = Red
  let fringeColor = 'rgba(30, 64, 255, '; // Default Blue-ish base
  if (lastDetection?.path === 'A') {
      fringeColor = 'rgba(59, 130, 246, '; // Tailwind Blue-500
  } else if (lastDetection?.path === 'B') {
      fringeColor = 'rgba(239, 68, 68, '; // Tailwind Red-500
  }

  const processData = () => {
    // If it's a clump (D3/D4), user requested "don't show the clump", so we return empty
    if (isClump) return [];

    // Range on D0: 320 center. Range approx +/- 70. 
    const minX = 250; 
    const maxX = 390;
    const range = maxX - minX;
    const buckets = new Array(50).fill(0).map(() => ({ D1_D2: 0, D3_D4: 0 }));
    const bucketSize = range / 50;

    data.forEach(d => {
      const bucketIndex = Math.floor((d.d0Position - minX) / bucketSize);
      if (bucketIndex >= 0 && bucketIndex < 50) {
        if (d.idlerDetector === 'D1' || d.idlerDetector === 'D2') {
             buckets[bucketIndex].D1_D2++;
        } else {
             // We track it but won't display if clump logic triggers
             buckets[bucketIndex].D3_D4++;
        }
      }
    });

    return buckets.map((b, i) => ({
      bin: i,
      EraserHits: b.D1_D2,
      PathHits: b.D3_D4,
    }));
  };

  const chartData = processData();

  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg h-full flex flex-col relative overflow-hidden">
      
      {/* High Quality Interference Fringes Background */}
      {/* Visible only when Eraser (D1/D2) hits occur */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
            opacity: showInterferencePattern ? 1 : 0,
            background: `
                repeating-linear-gradient(
                    90deg,
                    ${fringeColor} 0.02) 0%,
                    ${fringeColor} 0.1) 4%, 
                    ${fringeColor} 0.3) 8%, 
                    ${fringeColor} 0.1) 12%,
                    ${fringeColor} 0.02) 16%
                )
            `,
            backgroundSize: '20% 100%', // Adjust frequency of fringes
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))' // Fade out at bottom
        }}
      ></div>

      <div className="flex justify-between items-center mb-4 z-10">
        <h3 className="text-slate-300 font-semibold flex items-center gap-2">
            Interference Pattern 
            {showInterferencePattern && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-wide">Fringes Visible</span>}
            {/* Clump message hidden as requested */}
        </h3>
      </div>
      
      <div className="flex-grow min-h-[200px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} stackOffset="sign">
            <XAxis dataKey="bin" hide={true} />
            <YAxis hide={true} />
            <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.1)'}}
                contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}}
                labelFormatter={() => ''}
            />
            <Bar 
                dataKey="EraserHits" 
                name="Eraser (D1/D2)"
                fill={lastDetection?.path === 'B' ? '#f87171' : '#60a5fa'} // Bar color matches fringe/path
                stackId="a"
                radius={[2, 2, 0, 0]}
                isAnimationActive={false} 
                hide={!!showInterferencePattern}
            />
            {/* Clump bar removed/hidden */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};