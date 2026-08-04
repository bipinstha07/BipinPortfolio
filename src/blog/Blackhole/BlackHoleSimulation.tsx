import React, { useState, useRef, useEffect } from 'react';
import BlackHoleCanvas from './components/BlackHoleCanvas';
import Controls from './components/Controls';
import { SimulationParams } from './types';
import Header from '../../component/Header';

const BlackHoleSimulation: React.FC = () => {
  // Cinematic presets - now with state management for controls
  const [params, setParams] = useState<SimulationParams>({
    mass: 100,
    accretionDiskColor: '#ffad5c', // Gargantua orange
    diskSpeed: 1.15, // Slow, majestic rotation
    glowIntensity: 1.0, 
    cameraZoom: 2.0,
    turbulence: 1.1,
  });

  const [controlsVisible, setControlsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set audio volume to low
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 30%
    }
  }, []);

  // Handle audio play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn('Audio autoplay prevented:', error);
            setIsPlaying(false); // Update state if autoplay fails
          });
        }
      } else {
        // Force pause and reset
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  // Sync state with audio element's actual playing state
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  // Try to start audio on first user interaction (for browsers that block autoplay)
  useEffect(() => {
    if (!isPlaying) return; // Only try to play if we want it playing
    
    const handleFirstInteraction = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // User interaction didn't work, keep it paused
            setIsPlaying(false);
          });
      }
    };
    
    // Only add listeners if audio is not playing (meaning autoplay was blocked)
    if (audioRef.current && audioRef.current.paused) {
      document.addEventListener('click', handleFirstInteraction, { once: true });
      document.addEventListener('touchstart', handleFirstInteraction, { once: true });
      
      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
    }
  }, [isPlaying]);

  const handleStopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset to beginning
    }
    setIsPlaying(false);
  };

  const handlePlayMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.warn('Failed to play audio:', error);
        setIsPlaying(false);
      });
    }
    setIsPlaying(true);
  };

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/blackholebg.mp3"
        loop
        preload="auto"
      />
    
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-gray-100 selection:bg-orange-500 selection:text-white">
      
      {/* Background/Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <BlackHoleCanvas params={params} />
      </div>

      {/* Header - Top Center */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-7xl px-4">
        <Header />
      </div>

      {/* Controls Panel */}
      <Controls 
        params={params}
        setParams={setParams}
        visible={controlsVisible}
        toggleVisibility={() => setControlsVisible(!controlsVisible)}
      />
      
      {/* Music Control Button */}
      <button
        onClick={isPlaying ? handleStopMusic : handlePlayMusic}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-30 px-4 py-2 md:px-6 md:py-3 bg-black/70 hover:bg-black/80 border border-white/30 hover:border-white/50 rounded-lg backdrop-blur-sm transition-all duration-300 text-white/90 hover:text-white font-light text-xs md:text-sm tracking-wide shadow-lg"
        aria-label={isPlaying ? "Stop music" : "Play music"}
      >
        <span className="flex items-center gap-1.5 md:gap-2">
          {isPlaying ? (
            <>
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              <span className="hidden sm:inline">Stop Music</span>
              <span className="sm:hidden">Stop</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">Play Music</span>
              <span className="sm:hidden">Play</span>
            </>
          )}
        </span>
      </button>
      
      {/* Minimal Overlay */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10 pointer-events-none select-none">
        <h1 className="text-4xl md:text-6xl font-thin tracking-tighter text-white/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          GARGANTUA
        </h1>
        <div className="h-px w-20 bg-gradient-to-r from-orange-500/50 to-transparent my-3" />
        <p className="text-xs text-white/40 tracking-[0.4em] font-light uppercase">
          Gravitational Lensing Simulation
          <br />Background Music Credit: Jennifer Galatis
        </p>
      </div>
    </div>
    </>
  );
};

export default BlackHoleSimulation;