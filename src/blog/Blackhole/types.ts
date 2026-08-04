export interface SimulationParams {
  mass: number;
  accretionDiskColor: string;
  diskSpeed: number;
  glowIntensity: number;
  cameraZoom: number;
  turbulence: number;
}


export interface SimSettings {
  mass: number;
  discSize: number;
  tilt: number;
  rotationSpeed: number;
  glowIntensity: number;
  lensingEnabled: boolean;
  lensingStrength: number;
  cameraDistance: number;
  fieldOfView: number;
  bloom: number;
}

export interface MousePos {
  x: number;
  y: number;
}
