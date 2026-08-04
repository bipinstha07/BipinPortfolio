
import Connect from "./component/connect"
import ContentFirst from "./component/content-first"
import Education from "./component/education"
import Header from "./component/Header"
import Project from "./component/project"
import Skills from "./component/skills-second"
import {useState } from "react";
import { FiEye, FiEyeOff, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import GalaxyBackground from "./component/GalaxyBackground";
import Awards from "./component/Awards";
import './index.css'
import Message from "./component/Message"
import Research from "./component/Research"

function App() {
  const [showGalaxy, setShowGalaxy] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const ROT_STEP = 0.3;

  const handleToggle = () => {
    setShowGalaxy((v) => !v);
  };
    
  return (
    <>
    
      <div className="relative overflow-x-hidden selection:bg-purple-500 selection:text-white text-white h-full w-full bg-slate-950">
    
    {/* Animation for the toggle button */}
<div className="fixed right-5 top-5 z-50 border border-white/30 rounded-full" style={{ animation: 'pulse 1s ease-in-out 5' }}> 
  <p className="text-white font-semibold bg-gradient-to-r from-green-500 to-blue-500  rounded-full">
  <button
          onClick={handleToggle}
          className={`z-20 p-2 bg-black/40 text-cyan-300 border rounded-full shadow hover:bg-cyan-900/40 transition-all duration-200 flex items-center justify-center`}
          title={showGalaxy ? "Hide Galaxy" : "Show Galaxy"}
        >
          {showGalaxy ? <FiEyeOff size={18}  style={{ animation: 'pulse 1s ease-in-out 5' }}/> : <FiEye size={18} />}
        </button>
  </p>
</div>

       
       
        {/* Angle Buttons */}
        {showGalaxy && (
          <div className="fixed top-25 right-3 z-20 flex flex-col items-center gap-1">
            <button onClick={() => setRotation(r => ({ ...r, x: r.x - ROT_STEP }))} className="p-1 bg-black/40 text-cyan-300 border border-cyan-700 rounded-full shadow hover:bg-cyan-900/40"><FiArrowUp size={16} /></button>
            <div className="flex gap-1">
              <button onClick={() => setRotation(r => ({ ...r, y: r.y - ROT_STEP }))} className="p-1 bg-black/40 text-cyan-300 border border-cyan-700 rounded-full shadow hover:bg-cyan-900/40"><FiArrowLeft size={16} /></button>
              <button onClick={() => setRotation(r => ({ ...r, y: r.y + ROT_STEP }))} className="p-1 bg-black/40 text-cyan-300 border border-cyan-700 rounded-full shadow hover:bg-cyan-900/40"><FiArrowRight size={16} /></button>
            </div>
            <button onClick={() => setRotation(r => ({ ...r, x: r.x + ROT_STEP }))} className="p-1 bg-black/40 text-cyan-300 border border-cyan-700 rounded-full shadow hover:bg-cyan-900/40"><FiArrowDown size={16} /></button>
          </div>
        )}
        {showGalaxy && <GalaxyBackground rotation={rotation} />}
        <div className="absolute pointer-events-none bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
        </div>
        <div className="container z-10 relative px-8 text-white mx-auto">
          <section id="home">
            <Header />
            <ContentFirst />
          </section>
          <section id="skills">
            <Skills />
          </section>
          <section id="projects">
            <Project />
          </section>
          <section id="research">
            <Research />
          </section>
          <section id="certificate">
            <Awards />
          </section>
          <Education />
          <Message />
          <section id="contact">
            <Connect />
          </section>
        </div>
      </div>
    </>
  )
}

export default App
