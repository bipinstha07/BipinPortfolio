import React, { useRef, useEffect } from 'react';
import { Photon, ExperimentMode, DetectionData } from '../types';

interface SimulationCanvasProps {
  photons: Photon[];
  detections: DetectionData[];
  mode: ExperimentMode;
  width: number;
  height: number;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  photons,
  detections,
  mode,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#020617'; 
    ctx.fillRect(0, 0, width, height);

    drawOpticalBench(ctx, width, height, mode);
    drawDetections(ctx, detections);
    drawPhotons(ctx, photons);

  }, [photons, detections, mode, width, height]);

  const drawOpticalBench = (
    ctx: CanvasRenderingContext2D, 
    _w: number, 
    _h: number, 
    mode: ExperimentMode
  ) => {
    const centerY = 300;
    const laserX = 20;
    const slitX = 80;
    const bboX = 150;
    const prismX = 150;
    
    const bsAx = 450, bsAy = 200;
    const bsBx = 450, bsBy = 400;
    const mirAx = 600, mirAy = 150;
    const mirBx = 600, mirBy = 470;
    const bsCx = 520, bsCy = 280; // UPDATED: Eraser BS position

    // --- Paths ---
    ctx.strokeStyle = '#64748b'; // Brighter slate-500
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    
    // Laser to BBO - Upper Slit Path (Path A)
    ctx.beginPath();
    ctx.moveTo(laserX, centerY);
    ctx.lineTo(slitX, centerY - 5); // Through upper slit
    ctx.lineTo(bboX, centerY - 10);
    ctx.stroke();
    
    // Laser to BBO - Lower Slit Path (Path B)
    ctx.beginPath();
    ctx.moveTo(laserX, centerY);
    ctx.lineTo(slitX, centerY + 5); // Through lower slit
    ctx.lineTo(bboX, centerY + 10);
    ctx.stroke();
    
    // Signal
    ctx.beginPath();
    ctx.moveTo(bboX, centerY);
    ctx.lineTo(320, 60);
    ctx.stroke();

    // Idler Paths
    ctx.beginPath();
    ctx.moveTo(bboX, centerY);
    ctx.lineTo(prismX, centerY);
    ctx.lineTo(bsAx, bsAy);
    ctx.lineTo(mirAx, mirAy);
    ctx.lineTo(bsCx, bsCy);
    ctx.stroke();
    
    // Reflections
    ctx.beginPath(); ctx.moveTo(bsAx, bsAy); ctx.lineTo(370, 150); ctx.stroke(); // To D4
    ctx.beginPath(); ctx.moveTo(bboX, centerY); ctx.lineTo(prismX, centerY); ctx.lineTo(bsBx, bsBy); ctx.lineTo(mirBx, mirBy); ctx.lineTo(bsCx, bsCy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bsBx, bsBy); ctx.lineTo(370, 450); ctx.stroke(); // To D3
    
    // Eraser Paths (Folded Geometry)
    // All paths go through BS_C:
    // MIRROR_A -> BS_C -> D1 or D2
    // MIRROR_B -> BS_C -> D1 or D2
    ctx.beginPath(); ctx.moveTo(bsCx, bsCy); ctx.lineTo(480, 100); ctx.stroke(); // BS_C -> D1
    ctx.beginPath(); ctx.moveTo(bsCx, bsCy); ctx.lineTo(450, 500); ctx.stroke(); // BS_C -> D2

    ctx.setLineDash([]);

    // --- Components ---
    // Laser
    ctx.fillStyle = '#10b981'; // Green Laser Body
    ctx.fillRect(laserX - 10, centerY - 10, 20, 20);
    ctx.fillStyle = '#fff'; ctx.font = '10px monospace'; ctx.fillText('LASER', laserX - 15, centerY + 25);

    // Double Slit
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
    ctx.beginPath();
    // Top Block
    ctx.moveTo(slitX, centerY - 40); ctx.lineTo(slitX, centerY - 10);
    // Middle Block
    ctx.moveTo(slitX, centerY - 2); ctx.lineTo(slitX, centerY + 2);
    // Bottom Block
    ctx.moveTo(slitX, centerY + 10); ctx.lineTo(slitX, centerY + 40);
    ctx.stroke();
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.fillText('Slit', slitX - 10, centerY + 50);

    // BBO
    ctx.save(); ctx.translate(bboX, centerY);
    ctx.fillStyle = '#8b5cf6'; ctx.fillRect(-5, -20, 10, 40);
    ctx.strokeStyle = '#7c3aed'; ctx.strokeRect(-5, -20, 10, 40);
    ctx.fillStyle = '#c4b5fd'; ctx.font = '10px sans-serif'; ctx.fillText('BBO', -10, 30);
    ctx.restore();

    // D0 Screen
    const d0X = 320; const d0Y = 60;
    ctx.save(); ctx.translate(d0X, d0Y);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(-80, -5, 160, 10);
    ctx.strokeStyle = '#22d3ee'; ctx.strokeRect(-80, -5, 160, 10);
    ctx.fillStyle = '#22d3ee'; ctx.fillText('D0 (Signal Screen)', -40, -15);
    ctx.restore();

    // Prism
    ctx.fillStyle = 'rgba(71, 85, 105, 0.5)';
    ctx.beginPath(); ctx.moveTo(prismX, centerY - 15); ctx.lineTo(prismX + 15, centerY); ctx.lineTo(prismX, centerY + 15); ctx.fill();
    // Label Prism
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.fillText('Prism', prismX - 15, centerY + 25);

    // Splitters & Mirrors
    drawSplitter(ctx, bsAx, bsAy, mode === ExperimentMode.ERASER ? 'BSa' : 'BSa (Refl)', mode === ExperimentMode.ERASER, 1);
    drawSplitter(ctx, bsBx, bsBy, mode === ExperimentMode.ERASER ? 'BSb' : 'BSb (Refl)', mode === ExperimentMode.ERASER, -1);
    
    drawMirror(ctx, mirAx, mirAy, 1);
    // Label Mirror A
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.fillText('Ma', mirAx + 10, mirAy + 5);

    drawMirror(ctx, mirBx, mirBy, -1);
    // Label Mirror B
    ctx.fillStyle = '#64748b'; ctx.font = '10px sans-serif'; ctx.fillText('Mb', mirBx + 10, mirBy + 5);

    drawSplitter(ctx, bsCx, bsCy, 'BSc', true, 0);

    // Detectors
    drawDetector(ctx, 370, 150, 'D4', '#f59e0b'); // Moved to the left
    drawDetector(ctx, 370, 450, 'D3', '#f59e0b'); // Moved to the left
    
    // Updated Positions for D1 and D2
    drawDetector(ctx, 480, 100, 'D1', '#22d3ee'); // Moved slightly to the left, top of Ma
    drawDetector(ctx, 450, 500, 'D2', '#a78bfa'); // Moved slightly to the right, bottom of Mb
  };

  const drawDetections = (ctx: CanvasRenderingContext2D, detections: DetectionData[]) => {
    ctx.save();
    detections.forEach(d => {
        let color = '#ffffff';
        // D1=Cyan, D2=Purple, D3/D4=Amber
        if (d.idlerDetector === 'D1') color = '#22d3ee'; 
        else if (d.idlerDetector === 'D2') color = '#a78bfa'; 
        else if (d.idlerDetector === 'D3' || d.idlerDetector === 'D4') color = '#f59e0b'; 

        ctx.globalAlpha = 1.0;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(d.d0Position - 1.5, 60 - 4, 3, 8);
        ctx.fill();
        
        // Bright glow for the single hit
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
    });
    ctx.restore();
  };

  const drawSplitter = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string, isSplitter: boolean, _orientation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4); 
    ctx.fillStyle = isSplitter ? 'rgba(168, 85, 247, 0.4)' : '#64748b';
    ctx.strokeStyle = isSplitter ? '#a855f7' : '#94a3b8';
    ctx.lineWidth = 2;
    ctx.fillRect(-15, -2, 30, 4);
    ctx.strokeRect(-15, -2, 30, 4);
    ctx.restore();
    ctx.fillStyle = '#94a3b8'; ctx.font = '9px sans-serif'; ctx.fillText(label, x - 15, y - 15);
  };

  const drawMirror = (ctx: CanvasRenderingContext2D, x: number, y: number, orientation: number) => {
    ctx.save(); ctx.translate(x, y);
    if (orientation === 1) {
      // Mirror A: 60 degrees
      ctx.rotate((60 * Math.PI) / 180);
    } else {
      // Mirror B: 120 degrees
      ctx.rotate((160 * Math.PI) / 180);
    }
    ctx.fillStyle = '#475569'; ctx.fillRect(-15, -2, 30, 4);
    ctx.fillStyle = '#cbd5e1'; ctx.fillRect(-15, -3, 30, 1);
    ctx.restore();
  };

  const drawDetector = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = color; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff'; ctx.font = '11px bold sans-serif'; ctx.fillText(label, x + 15, y + 4);
  };

  const drawPhotons = (ctx: CanvasRenderingContext2D, photons: Photon[]) => {
    photons.forEach((p) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      
      // Path A (Upper) -> Blue
      // Path B (Lower) -> Red
      if (p.path === 'A') {
        ctx.fillStyle = '#3b82f6'; // Blue 500
        ctx.shadowColor = '#3b82f6';
      } else {
        ctx.fillStyle = '#ef4444'; // Red 500
        ctx.shadowColor = '#ef4444';
      }
      
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    });
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-[#020617] relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block w-full h-full"
      />
    </div>
  );
};