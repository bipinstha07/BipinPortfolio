export enum ExperimentMode {
  STANDARD = 'STANDARD', // Eraser OFF (BS removed/reflective)
  ERASER = 'ERASER',     // Eraser ON (BS inserted)
}

export interface Photon {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'SIGNAL' | 'IDLER'; 
  path: 'A' | 'B'; 
  stage: number; 
  active: boolean;
  targetDetector?: 'D0' | 'D1' | 'D2' | 'D3' | 'D4';
  signalDestinationX?: number; // Pre-calculated landing spot on D0 (Signal only)
  idlerFate?: 'D1' | 'D2' | 'D3' | 'D4'; // The fate of the partner photon (carried by Signal for correlation)
}

export interface SimulationState {
  isRunning: boolean;
  mode: ExperimentMode;
  photonSpeed: number;
  totalPhotons: number;
}

export interface DetectionData {
  id: number;
  d0Position: number; // X position on screen
  idlerDetector: 'D1' | 'D2' | 'D3' | 'D4' | null; // Which detector the idler hit
  path: 'A' | 'B'; // Source path for color coding
}