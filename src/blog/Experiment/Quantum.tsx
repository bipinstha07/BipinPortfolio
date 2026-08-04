import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExperimentMode, Photon, DetectionData } from './types';
import { ControlPanel } from './components/ControlPanel';
import { SimulationCanvas } from './components/SimulationCanvas';
import { InterferenceGraph } from './components/InterferenceGraph';
import Header from '../../component/Header';



// Canvas & Layout Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 550;

// Coordinates
const CENTER_Y = 300;
const LASER = { x: 20, y: CENTER_Y };
const SLIT = { x: 80, y: CENTER_Y }; 
const BBO = { x: 150, y: CENTER_Y }; 

// Idler Path (Long)
const PRISM = { x: 150, y: CENTER_Y };
const BS_A = { x: 450, y: 200 }; // Upper Path A
const BS_B = { x: 450, y: 400 }; // Lower Path B
const MIRROR_A = { x: 600, y: 150 }; // Updated to match canvas
const MIRROR_B = { x: 600, y: 470 }; // Updated to match canvas
const BS_C = { x: 520, y: 280 }; // Updated to match canvas

const DETECTORS = {
    D0: { x: 320, y: 60 }, 
    D1: { x: 480, y: 100 }, // Updated position
    D2: { x: 450, y: 500 }, // Updated position
    D3: { x: 370, y: 450 }, // Updated position
    D4: { x: 370, y: 150 }, // Updated position
};

const Quantum: React.FC = () => {
  const [mode, setMode] = useState<ExperimentMode>(ExperimentMode.STANDARD);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number>(8);
  const [photons, setPhotons] = useState<Photon[]>([]);
  const [detections, setDetections] = useState<DetectionData[]>([]);
 

  const animationRef = useRef<number>(0);

  // Helper: Gaussian Random for Clumps
  const randn_bm = () => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  };

  const spawnPhotonPair = useCallback(() => {
    setDetections([]);

    const id = Date.now() + Math.random();
    
    const path = Math.random() > 0.5 ? 'A' : 'B';
    let idlerFate: 'D1' | 'D2' | 'D3' | 'D4';

    if (mode === ExperimentMode.STANDARD) {
        idlerFate = path === 'A' ? 'D4' : 'D3';
    } else {
        const passedFirstBS = Math.random() > 0.5;
        if (!passedFirstBS) {
             idlerFate = path === 'A' ? 'D4' : 'D3';
        } else {
             idlerFate = Math.random() > 0.5 ? 'D1' : 'D2';
        }
    }

    let d0X = 0;
    const centerX = DETECTORS.D0.x;
    
    const generateFringePosition = (phaseShift: number) => {
        let found = false;
        let result = 0;
        while (!found) {
            const x = (Math.random() - 0.5) * 140; 
            const phase = x * 0.25 + phaseShift;
            const prob = Math.pow(Math.cos(phase), 2);
            if (Math.random() < prob) {
                result = centerX + x;
                found = true;
            }
        }
        return result;
    };

    const generateClumpPosition = (pathOffset: number) => {
         return centerX + pathOffset + (randn_bm() * 15);
    };

    if (idlerFate === 'D1') {
        d0X = generateFringePosition(0);
    } else if (idlerFate === 'D2') {
        d0X = generateFringePosition(Math.PI / 2);
    } else if (idlerFate === 'D3') {
        d0X = generateClumpPosition(10);
    } else { 
        d0X = generateClumpPosition(-10);
    }

    const currentSpeed = speed;

    const signal: Photon = {
        id, x: LASER.x, y: LASER.y, vx: currentSpeed, vy: 0,
        type: 'SIGNAL', path, stage: 0, active: true, 
        targetDetector: 'D0',
        signalDestinationX: d0X,
        idlerFate: idlerFate
    };

    const idler: Photon = {
        id: id + 0.1, x: LASER.x, y: LASER.y, vx: currentSpeed, vy: 0,
        type: 'IDLER', path, stage: 0, active: true, 
        targetDetector: idlerFate
    };
    
    setPhotons(prev => [...prev, signal, idler]);
  }, [mode, speed]);

  const updatePhysics = () => {
    setPhotons(prev => {
        const nextPhotons: Photon[] = [];
        
        prev.forEach(p => {
            if (!p.active) return;

            let { x, y, vx, vy, stage } = p;
            const currentSpeed = speed;

            // --- Stage 0: Laser -> Slit ---
            if (stage === 0) {
                const dx = SLIT.x - x;
                if (dx < currentSpeed) {
                    x = SLIT.x;
                    stage = 0.5;
                } else {
                    x += currentSpeed;
                }
            }

            // --- Stage 0.5: Slit -> BBO ---
            else if (stage === 0.5) {
                const bboTargetY = p.path === 'A' ? BBO.y - 10 : BBO.y + 10;
                const dx = BBO.x - x;
                const dy = bboTargetY - y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < currentSpeed) {
                    x = BBO.x;
                    y = bboTargetY;
                    stage = 1;
                } else {
                    vx = (dx / dist) * currentSpeed;
                    vy = (dy / dist) * currentSpeed;
                    x += vx;
                    y += vy;
                }
            }
            
            // --- Stage 1: Diverge from BBO ---
            else if (stage === 1) {
                if (p.type === 'SIGNAL') {
                    const targetX = p.signalDestinationX || DETECTORS.D0.x;
                    const dx = targetX - x;
                    const dy = DETECTORS.D0.y - y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < currentSpeed) {
                        p.active = false;
                        setDetections(ds => {
                            const newDetections = [...ds, {
                                id: p.id,
                                d0Position: targetX,
                                idlerDetector: p.idlerFate || null,
                                path: p.path
                            }];
                            return newDetections;
                        });
                    } else {
                        vx = (dx / dist) * currentSpeed;
                        vy = (dy / dist) * currentSpeed;
                        x += vx;
                        y += vy;
                    }
                } else {
                    // Idler -> Prism
                    const dx = PRISM.x - x;
                    const dy = PRISM.y - y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < currentSpeed) {
                        x = PRISM.x; y = PRISM.y; stage = 2;
                    } else {
                        vx = (dx / dist) * currentSpeed; vy = (dy / dist) * currentSpeed;
                        x += vx;
                        y += vy;
                    }
                }
            }

            // --- Stage 2: Prism -> BS_A / BS_B ---
            else if (stage === 2) {
                const target = p.path === 'A' ? BS_A : BS_B;
                const dx = target.x - x;
                const dy = target.y - y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < currentSpeed) {
                    x = target.x; y = target.y; stage = 3;
                } else {
                    vx = (dx / dist) * currentSpeed; vy = (dy / dist) * currentSpeed;
                    x += vx;
                    y += vy;
                }
            }

            // --- Stage 3: At BS_A / BS_B ---
            else if (stage === 3) {
                if (p.targetDetector === 'D4' && p.path === 'A') {
                    const dx = DETECTORS.D4.x - x;
                    const dy = DETECTORS.D4.y - y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < currentSpeed) {
                        p.active = false;
                    } else {
                        vx = (dx / dist) * currentSpeed;
                        vy = (dy / dist) * currentSpeed;
                        x += vx;
                        y += vy;
                    }
                } else if (p.targetDetector === 'D3' && p.path === 'B') {
                    const dx = DETECTORS.D3.x - x;
                    const dy = DETECTORS.D3.y - y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < currentSpeed) {
                        p.active = false;
                    } else {
                        vx = (dx / dist) * currentSpeed;
                        vy = (dy / dist) * currentSpeed;
                        x += vx;
                        y += vy;
                    }
                } else {
                    const target = p.path === 'A' ? MIRROR_A : MIRROR_B;
                    const dx = target.x - x;
                    const dy = target.y - y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < currentSpeed) {
                        x = target.x;
                        y = target.y;
                        stage = 4;
                    } else {
                        vx = (dx / dist) * currentSpeed;
                        vy = (dy / dist) * currentSpeed;
                        x += vx;
                        y += vy;
                    }
                }
            }

            // --- Stage 4: Mirrors -> BS_C ---
            // Paths: MIRROR_A -> BS_C or MIRROR_B -> BS_C
            else if (stage === 4) {
                const dx = BS_C.x - x;
                const dy = BS_C.y - y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < currentSpeed) { 
                    x = BS_C.x; 
                    y = BS_C.y; 
                    stage = 5; 
                } else {
                    vx = (dx / dist) * currentSpeed; 
                    vy = (dy / dist) * currentSpeed;
                    x += vx;
                    y += vy;
                }
            }

            // --- Stage 5: BS_C -> D1/D2 ---
            // All paths go through BS_C:
            // MIRROR_A -> BS_C -> D1 or D2
            // MIRROR_B -> BS_C -> D1 or D2
            else if (stage === 5) {
                // Only route to D1 or D2 if targetDetector is set
                if (p.targetDetector === 'D1' || p.targetDetector === 'D2') {
                    const target = p.targetDetector === 'D1' ? DETECTORS.D1 : DETECTORS.D2;
                    const dx = target.x - x;
                    const dy = target.y - y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < currentSpeed) {
                        p.active = false;
                    } else {
                        vx = (dx / dist) * currentSpeed; 
                        vy = (dy / dist) * currentSpeed;
                        x += vx;
                        y += vy;
                    }
                } else {
                    // Should not happen, but deactivate if targetDetector is invalid
                    p.active = false;
                }
            }

            if (p.active) {
                nextPhotons.push({ ...p, x, y, vx, vy, stage });
            }
        });
        return nextPhotons;
    });
  };

  const tick = useCallback(() => {
    if (!isPaused) {
        updatePhysics();
    }
    animationRef.current = requestAnimationFrame(tick);
  }, [isPaused]); 

  useEffect(() => {
    animationRef.current = requestAnimationFrame(tick);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [tick]);

  const handleReset = () => {
    setPhotons([]);
    setDetections([]);
  };

  return (
    <div className="relative overflow-x-hidden selection:bg-purple-500 selection:text-white text-white h-full w-full bg-slate-950">
      <div className="absolute pointer-events-none bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
      </div>
      <div className="container z-10 relative px-8 text-white mx-auto">
      <Header />
        <div className="min-h-screen text-slate-200 p-4 lg:p-8 flex flex-col gap-6">
      <div>
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-400 bg-clip-text text-transparent mb-4">
            Delayed Choice Quantum Eraser
          </h1>
        </div>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        <div className="lg:col-span-8 flex flex-col gap-6">
            <SimulationCanvas 
                photons={photons} 
                detections={detections}
                mode={mode} 
                width={CANVAS_WIDTH} 
                height={CANVAS_HEIGHT} 
            />
            
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="h-[150px]">
                <InterferenceGraph 
                    data={detections} 
                    mode={mode} 
                />
            </div>
            
            <ControlPanel 
                isPaused={isPaused}
                setIsPaused={setIsPaused}
                speed={speed}
                setSpeed={setSpeed}
                mode={mode}
                setMode={setMode}
                onReset={handleReset}
                onFireSingle={() => spawnPhotonPair()}
            />
            
             <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs text-slate-500">
                <h4 className="text-slate-400 font-semibold mb-2">Legend</h4>
                <div className="flex items-center gap-2 mb-1">
                   <div className="w-3 h-3 rounded-full bg-cyan-400"></div> <span className="text-slate-300">D1 Pattern (Interference)</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                   <div className="w-3 h-3 rounded-full bg-purple-400"></div> <span className="text-slate-300">D2 Pattern (Interference)</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                   <div className="w-3 h-3 rounded-full bg-amber-500"></div> <span className="text-slate-300">D3/D4 (No Interference)</span>
                </div>
            </div>
        </div>
      </main>
        </div>
      </div>
    </div>
  );
};

export default Quantum;