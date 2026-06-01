import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Radio, AlertTriangle, Cpu, Terminal as TermIcon, Shield, Database, Send, Volume2, VolumeX, Star } from 'lucide-react';
import { ScreenType, SignalMessage } from './types';
import { Typewriter } from './components/Typewriter';
import { Starfield } from './components/Starfield';
import { StarfieldJourney } from './components/StarfieldJourney';
import { PlanetBeginning } from './components/PlanetBeginning';
import { PlanetDying } from './components/PlanetDying';
import { ArkSchematic } from './components/ArkSchematic';
import { BlackHole } from './components/BlackHole';
import { playTick, playSelect, playWarning } from './utils/audio';

// Custom Framer Motion transition definition
const transitionVariants = {
  enter: (dir: 'push' | 'push_back' | 'slide_up') => {
    if (dir === 'push') return { x: '100%', y: 0, opacity: 0 };
    if (dir === 'push_back') return { x: '-100%', y: 0, opacity: 0 };
    return { x: 0, y: '100%', opacity: 0 }; // slide_up
  },
  center: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (dir: 'push' | 'push_back' | 'slide_up') => {
    if (dir === 'push') return { x: '-100%', y: 0, opacity: 0, transition: { duration: 0.5 } };
    if (dir === 'push_back') return { x: '100%', y: 0, opacity: 0, transition: { duration: 0.5 } };
    return { x: 0, y: '-100%', opacity: 0, transition: { duration: 0.5 } }; // slide_up
  },
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('beginning');
  const [direction, setDirection] = useState<'push' | 'push_back' | 'slide_up'>('push');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // States for Ticker & Countdowns
  const [missionTime, setMissionTime] = useState<number>(1); // seconds
  const [countdownTime, setCountdownTime] = useState<number>(389572); // corresponds to 04:12:09:52 in seconds

  // Custom User Signals (Screen 6 Log)
  const [userMsgInput, setUserMsgInput] = useState<string>('');
  const [transmittedSignals, setTransmittedSignals] = useState<SignalMessage[]>(() => {
    const saved = localStorage.getItem('transmitted_signals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'init-1',
        sender: 'ARCHIVAL_REPRESENTATIVE',
        message: 'WE WERE HERE. WE DREAMED OF THE STARS.',
        timestamp: '3026.06.01 - 15:15:51',
      },
    ];
  });

  // Animated bars state for Equalizer (Screen 3)
  const [eqHeights, setEqHeights] = useState<number[]>([40, 60, 25, 80, 50, 70, 30]);

  // Track window dimensions for perfect scaling to fit 1280 * 1024 terminal layout
  const [winSize, setWinSize] = useState({ width: 1280, height: 1024 });

  useEffect(() => {
    setWinSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setWinSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scale = Math.min(winSize.width / 1280, winSize.height / 1024);

  // Handle ticking Clock
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle countdown Clock (Screen 2)
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Equalizer animation
  useEffect(() => {
    if (currentScreen !== 'ark-project') return;
    const interval = setInterval(() => {
      setEqHeights(Array.from({ length: 8 }, () => Math.floor(Math.random() * 80) + 15));
    }, 120);
    return () => clearInterval(interval);
  }, [currentScreen]);

  // Audio trigger helper
  const handleSound = (type: 'tick' | 'select' | 'warning') => {
    if (!audioEnabled) return;
    if (type === 'tick') playTick();
    else if (type === 'select') playSelect();
    else if (type === 'warning') playWarning();
  };

  // Human Readable Ticker formatter
  const formatMissionClock = (totalSecs: number) => {
    const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Format countdown clock: DD:HH:MM:SS
  const formatCountdown = (totalSecs: number) => {
    const days = String(Math.floor(totalSecs / 86400)).padStart(2, '0');
    const hrs = String(Math.floor((totalSecs % 86400) / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `${days}:${hrs}:${mins}:${secs}`;
  };

  // Navigations according to navigation flow spec
  const navigateTo = (screen: ScreenType, dir: 'push' | 'push_back' | 'slide_up') => {
    setDirection(dir);
    setCurrentScreen(screen);
    if (dir === 'push' || dir === 'slide_up') {
      handleSound('select');
    } else {
      handleSound('tick');
    }
  };

  // Save / Transmit Message custom handler
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsgInput.trim()) return;

    const newSignal: SignalMessage = {
      id: `sig-${Date.now()}`,
      sender: 'COSMOS_PILGRIM_TERRA',
      message: userMsgInput.toUpperCase().trim(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    const updated = [newSignal, ...transmittedSignals];
    setTransmittedSignals(updated);
    localStorage.setItem('transmitted_signals', JSON.stringify(updated));
    setUserMsgInput('');
    handleSound('select');
  };

  return (
    <div className="w-screen h-screen bg-[#020205] text-on-surface overflow-hidden flex items-center justify-center relative select-none font-sans">
      {/* Outer elegant starfield for a beautiful premium desktop-cabinet appearance */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <Starfield speedFactor={0.08} />
      </div>

      {/* Retro chassis wrapper centered dynamically on any screen */}
      <div
        className="relative flex items-center justify-center flex-shrink-0"
        style={{
          width: '1280px',
          height: '1024px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Rounded CRT monitor bezel frame, containing the active 1280x1024 layout */}
        <div className="relative w-[1280px] h-[1024px] bg-space-black border-4 border-zinc-900 shadow-[0_0_80px_rgba(0,0,0,0.9),_inset_0_0_60px_rgba(0,242,255,0.05),_0_0_20px_rgba(0,242,255,0.06)] overflow-hidden flex flex-col justify-between scanlines rounded-lg">
          {/* Ambient glass monitor glare overlays */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.012] to-transparent pointer-events-none z-50 mix-blend-overlay" />
          <div className="absolute inset-0 bg-radial-[circle_at_top,_rgba(0,242,255,0.03)_0%,_rgba(0,0,0,0)_70%] pointer-events-none z-50" />

          {/* Background Ambience inside screen */}
          {currentScreen === 'journey' ? (
            <StarfieldJourney />
          ) : (
            <Starfield speedFactor={currentScreen === 'the-future' ? 0.3 : 1} />
          )}

          {currentScreen === 'ark-project' && <ArkSchematic />}
          {currentScreen === 'the-future' && <BlackHole />}

          {/* Audio Controller toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="absolute bottom-6 right-6 z-50 p-2.5 border border-hud-cyan/20 bg-space-black/70 hover:bg-hud-cyan/10 hover:border-hud-cyan/50 text-hud-cyan transition rounded-none text-xs flex items-center gap-1.5 focus:outline-none pointer-events-auto"
            title="Toggle HUD Sonar Feedback"
          >
            {audioEnabled ? <Volume2 size={14} className="animate-pulse" /> : <VolumeX size={14} />}
            <span className="font-mono text-[10px] tracking-widest">{audioEnabled ? 'SONAR_ON' : 'SONAR_MUTE'}</span>
          </button>

      {/* FIXED METADATA HUD RAILS */}
      <AnimatePresence mode="wait">
        {/* VIEWPORT HUD OVERLAYS */}
        <div className="w-full pointer-events-none z-30 px-6 py-6 md:px-12 flex justify-between items-start font-mono text-[10px] tracking-[0.12em] text-muted-slate select-none">
          {/* Top Left Status Module */}
          <motion.div
            key={`hud-left-${currentScreen}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-1.5"
          >
            {currentScreen === 'beginning' && (
              <>
                <div className="flex items-center gap-2 text-hud-cyan drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]">
                  <span className="w-2 h-2 bg-hud-cyan animate-ping inline-block rounded-none" />
                  <span>[ MISSION_CLOCK: {formatMissionClock(missionTime)} ]</span>
                </div>
                <div>COORDINATES: TERRA_SOL_3</div>
              </>
            )}

            {currentScreen === 'dying-earth' && (
              <>
                <div className="flex items-center gap-2 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                  <span className="w-2 h-2 bg-red-500 animate-ping inline-block rounded-none" />
                  <span>[ SYSTEM_STATUS: CRITICAL ]</span>
                </div>
                <div>LOCATION: SECTOR_001_EARTH</div>
              </>
            )}

            {currentScreen === 'ark-project' && (
              <>
                <div className="flex items-center gap-2 text-hud-cyan">
                  <Cpu size={12} className="animate-spin text-hud-cyan" style={{ animationDuration: '4s' }} />
                  <span>[ STATUS: ARCHIVING_PROTOCOLS ]</span>
                </div>
                <div>COORD: 42.09.88.1</div>
                <div>VEC: PERIPHERY_BOUND</div>
              </>
            )}

            {currentScreen === 'journey' && (
              <div className="flex items-center gap-2 text-hud-cyan">
                <span className="w-2 h-2 bg-hud-cyan animate-pulse inline-block" />
                <span>[ DRIVE_STATUS: ENGAGED ]</span>
              </div>
            )}

            {currentScreen === 'last-signal' && (
              <>
                <div>[ ORIGIN: SOL-3 ]</div>
                <div>[ VECTOR: 114.92 / -2.4 ]</div>
              </>
            )}

            {currentScreen === 'the-future' && (
              <div>[ COORDINATES: SECTOR-06 ]</div>
            )}
          </motion.div>

          {/* Top Right Status Module */}
          <motion.div
            key={`hud-right-${currentScreen}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-end gap-1.5"
          >
            {currentScreen === 'beginning' && (
              <>
                <div>[ SIGNAL_STRENGTH: NO_SIGNAL ]</div>
                <div>RELAY_STATION: VOID_POINT_ALPHA</div>
              </>
            )}

            {currentScreen === 'dying-earth' && (
              <div className="flex items-center gap-3 bg-red-950/20 border border-red-500/30 px-3.5 py-1.5 backdrop-blur-md">
                <div className="text-right">
                  <div className="text-[8px] text-red-400 font-sans tracking-[0.2em] font-medium uppercase font-mono">TIME_REMAINING</div>
                  <div className="text-sm font-bold text-red-500 tracking-wider font-mono drop-shadow-[0_0_6px_rgba(239,68,68,0.4)]">
                    {formatCountdown(countdownTime)}
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <Radio size={16} className="text-red-500 animate-pulse" />
                </div>
              </div>
            )}

            {currentScreen === 'ark-project' && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] text-hud-cyan/60 uppercase">⬤ LIVE_STREAM_CORE</span>
                <div className="flex items-end gap-[3px] h-6 w-24">
                  {eqHeights.map((h, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-hud-cyan w-1"
                      animate={{ height: `${h}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {currentScreen === 'journey' && (
              <>
                <div className="text-hud-cyan">[ VELOCITY: 0.99c ]</div>
                <div>COORDINATES: ERR_OVERFLOW</div>
              </>
            )}

            {currentScreen === 'last-signal' && (
              <>
                <div className="text-hud-cyan">[ STATUS: EMITTING ]</div>
                <div>[ FREQUENCY: 1420 MHZ ]</div>
              </>
            )}

            {currentScreen === 'the-future' && (
              <div className="text-hud-cyan">[ STATUS: TRANSCENDING ]</div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>

      {/* CENTRALIZED INTERACTIVE COMPONENT WITH TRANSITIONS */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 w-full max-w-5xl mx-auto z-10 overflow-y-auto py-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentScreen}
            custom={direction}
            variants={transitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full flex flex-col items-center justify-center"
          >
            {/* SCREEN 1: THE BEGINNING */}
            {currentScreen === 'beginning' && (
              <div className="flex flex-col items-center max-w-3xl text-center space-y-8">
                {/* Orbital planet viewer */}
                <PlanetBeginning />

                <div className="space-y-4">
                  <h1 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white leading-tight">
                    The Year Humanity Sent Its Final Message
                  </h1>

                  <Typewriter
                    text="Silence is the loudest sound in the cosmos. We watched the last beacon flicker from Earth, a pale blue dot fading into the obsidian dark. This is not the end of our journey, but the final echoes of home."
                    speed={20}
                    className="text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto font-mono"
                  />
                </div>

                {/* Bottom Decoding HUD interface */}
                <div className="w-full max-w-md border border-hud-cyan/20 bg-space-black/80 p-5 space-y-4 shadow-[0_0_20px_rgba(0,242,255,0.03)] backdrop-blur-md">
                  <div className="flex items-center gap-2 text-xs font-mono text-hud-cyan animate-pulse">
                    <TermIcon size={14} />
                    <span>[ DECODING_END_OF_ERA_DATA_STREAM ]</span>
                  </div>

                  {/* Standard navigational buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      disabled
                      className="border border-zinc-800 text-zinc-600 px-5 py-3 text-xs font-mono tracking-widest cursor-not-allowed select-none flex items-center justify-center gap-2"
                    >
                      <span>Previous</span>
                    </button>
                    {/* Element xpath: //button[span[contains(text(), 'Continue')]] */}
                    <button
                      onClick={() => navigateTo('dying-earth', 'push')}
                      onMouseEnter={() => handleSound('tick')}
                      className="relative border border-hud-cyan bg-hud-cyan/5 hover:bg-hud-cyan/20 text-hud-cyan font-mono text-xs tracking-widest py-3 px-5 transition duration-200 cursor-pointer overflow-hidden flex items-center justify-center gap-2 group glow-cyan"
                    >
                      {/* Laser scanning light sweep line */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hud-cyan/25 to-transparent w-1/2 h-full -skew-x-12 -translate-x-full group-hover:animate-sweep" />
                      <span>Continue</span>
                      <span className="text-hud-cyan group-hover:translate-x-1 transition-transform">❯</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 2: THE DYING EARTH */}
            {currentScreen === 'dying-earth' && (
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-5xl text-left w-full">
                {/* Glowing dying planet */}
                <div className="w-full lg:w-1/2 flex justify-center">
                  <PlanetDying />
                </div>

                <div className="w-full lg:w-1/2 space-y-8">
                  <div className="space-y-4">
                    <h1 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white leading-tight">
                      Earth Was Running Out O<span className="animate-blink bg-hud-cyan w-2 h-7 inline-block align-middle ml-1" />
                    </h1>

                    <Typewriter
                      text="The atmosphere was thinning. The signals were fading. What we once called home became a silent witness to our final departure."
                      speed={20}
                      className="text-base text-zinc-300 leading-relaxed font-mono"
                    />
                  </div>

                  {/* Vital parameters HUD Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {/* Vital parameter O2 */}
                    <div className="border border-red-500/25 bg-red-950/10 p-5 space-y-2 backdrop-blur-md">
                      <div className="flex justify-between items-center text-xs font-mono text-red-400">
                        <span>🌬️ [ ATMOSPHERIC O2 ]</span>
                      </div>
                      {/* Progress Bar container */}
                      <div className="w-full h-1 bg-red-950/50 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '14.2%' }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          className="h-full bg-red-500"
                        />
                      </div>
                      <div className="text-2xl font-bold font-sans text-red-400 tracking-tight">14.2%</div>
                    </div>

                    {/* Vital parameter Evacuation status */}
                    <div className="border border-hud-cyan/25 bg-hud-cyan/5 p-5 space-y-2 backdrop-blur-md">
                      <div className="flex justify-between items-center text-xs font-mono text-hud-cyan">
                        <span>👥 [ POPULATION EVAC ]</span>
                      </div>
                      {/* Progress Bar container */}
                      <div className="w-full h-1 bg-teal-950/50 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '98.7%' }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          className="h-full bg-hud-cyan"
                        />
                      </div>
                      <div className="text-2xl font-bold font-sans text-hud-cyan tracking-tight">98.7%</div>
                    </div>
                  </div>

                  {/* Footer interface controller */}
                  <div className="flex gap-4 pt-4 border-t border-zinc-900 w-full">
                    {/* Element xpath: //button[span[contains(text(), 'Previous')]] */}
                    <button
                      onClick={() => navigateTo('beginning', 'push_back')}
                      onMouseEnter={() => handleSound('tick')}
                      className="flex-1 border border-zinc-800 hover:border-zinc-500 text-zinc-300 font-mono text-xs tracking-widest py-3 px-5 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Previous</span>
                    </button>
                    {/* Element xpath: //button[span[contains(text(), 'Continue')]] */}
                    <button
                      onClick={() => navigateTo('ark-project', 'push')}
                      onMouseEnter={() => handleSound('tick')}
                      className="flex-1 relative border border-hud-cyan bg-hud-cyan/5 hover:bg-hud-cyan/20 text-hud-cyan font-mono text-xs tracking-widest py-3 px-5 transition cursor-pointer flex items-center justify-center gap-2 group glow-cyan"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hud-cyan/25 to-transparent w-1/2 h-full -skew-x-12 -translate-x-full group-hover:animate-sweep" />
                      <span>Continue</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3: THE ARK PROJECT */}
            {currentScreen === 'ark-project' && (
              <div className="flex flex-col items-center max-w-4xl text-center space-y-8 w-full">
                {/* Central Glassmorphic Dossier Card */}
                <div className="relative border border-hud-cyan/20 bg-glass-surface p-8 md:p-12 backdrop-blur-xl max-w-2xl shadow-[0_0_30px_rgba(0,242,255,0.05)] w-full chamfer">
                  {/* Absolute Corner Blueprint Tabs */}
                  <div className="absolute top-0 left-6 -translate-y-1/2 bg-space-black border border-hud-cyan/30 px-3 py-0.5 text-[8px] font-mono text-hud-cyan tracking-widest">
                    VESSEL_CLASS: ARK_OMEGA
                  </div>

                  <div className="space-y-6">
                    <h1 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white uppercase glow-text-cyan">
                      We Built The Ark
                    </h1>

                    <Typewriter
                      text="It wasn't a choice; it was an ultimatum. The Ark represents our final collective heartbeat, a vessel of steel and silicon destined for the silent reaches of the Periphery."
                      speed={20}
                      className="text-base text-zinc-300 leading-relaxed max-w-md mx-auto font-mono"
                    />

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-hud-cyan/30 to-transparent my-6" />

                    {/* High Fidelity Technical Matrix Specs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      <div className="border border-hud-cyan/10 p-4 space-y-1 backdrop-blur-md">
                        <div className="text-[9px] text-muted-slate font-mono uppercase">Hull Integrity</div>
                        <div className="text-lg font-bold font-sans text-hud-cyan hover:scale-105 transition-transform duration-200">99.4%</div>
                      </div>

                      <div className="border border-hud-cyan/10 p-4 space-y-1 backdrop-blur-md">
                        <div className="text-[9px] text-muted-slate font-mono uppercase">Cryo-Status</div>
                        <div className="text-lg font-bold font-sans text-hud-cyan uppercase tracking-wider">Primed</div>
                      </div>

                      <div className="border border-hud-cyan/10 p-4 space-y-1 backdrop-blur-md">
                        <div className="text-[9px] text-muted-slate font-mono uppercase">Fuel Mass</div>
                        <div className="text-lg font-bold font-sans text-hud-cyan">8.2MT</div>
                      </div>

                      <div className="border border-hud-cyan/10 p-4 space-y-1 backdrop-blur-md">
                        <div className="text-[9px] text-muted-slate font-mono uppercase">Eta Periphery</div>
                        <div className="text-lg font-bold font-sans text-hud-cyan">242Y</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub control elements */}
                <div className="flex gap-4 w-full max-w-md">
                  {/* Element xpath: //button[span[contains(text(), 'Previous')]] */}
                  <button
                    onClick={() => navigateTo('dying-earth', 'push_back')}
                    onMouseEnter={() => handleSound('tick')}
                    className="flex-1 border border-zinc-800 hover:border-zinc-500 text-zinc-300 font-mono text-xs tracking-widest py-3 px-5 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Previous</span>
                  </button>
                  {/* Element xpath: //button[span[contains(text(), 'Continue')]] */}
                  <button
                    onClick={() => navigateTo('journey', 'push')}
                    onMouseEnter={() => handleSound('tick')}
                    className="flex-1 relative border border-hud-cyan bg-hud-cyan/5 hover:bg-hud-cyan/20 text-hud-cyan font-mono text-xs tracking-widest py-3 px-5 transition cursor-pointer flex items-center justify-center gap-2 group glow-cyan"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hud-cyan/25 to-transparent w-1/2 h-full -skew-x-12 -translate-x-full group-hover:animate-sweep" />
                    <span>Continue</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 4: THE JOURNEY */}
            {currentScreen === 'journey' && (
              <div className="flex flex-col items-center max-w-4xl text-center space-y-8 w-full">
                {/* Minimal telemetry control unit with chamfers */}
                <div className="relative border border-hud-cyan/25 bg-glass-surface/60 p-8 md:p-12 backdrop-blur-lg max-w-2xl shadow-[0_0_35px_rgba(0,242,255,0.08)] w-full chamfer">
                  <div className="space-y-6">
                    <h1 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white uppercase glow-text-cyan">
                      Then We Left<span className="text-hud-cyan animate-blink inline-block">_</span>
                    </h1>

                    <Typewriter
                      text="The station grew smaller, a mere spark against the velvet dark. Gravity became a suggestion, then a memory. As the drive engaged, the stars began to bleed into long, luminous needles of light."
                      speed={20}
                      className="text-base text-zinc-300 leading-relaxed max-w-md mx-auto font-mono"
                    />

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-hud-cyan/20 to-transparent my-6" />

                    {/* Flight Telemetry angles */}
                    <div className="grid grid-cols-3 gap-4 font-mono">
                      <div className="space-y-1">
                        <div className="text-[8px] text-muted-slate uppercase">Pitch</div>
                        <div className="text-base font-bold text-hud-cyan animate-pulse">0.021°</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[8px] text-muted-slate uppercase">Yaw</div>
                        <div className="text-base font-bold text-hud-cyan animate-pulse">-0.004°</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[8px] text-muted-slate uppercase">Roll</div>
                        <div className="text-base font-bold text-hud-cyan animate-pulse">12.440°</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CAPITALIZED PREVIOUS / CONTINUE control bar according to specs */}
                <div className="flex gap-4 w-full max-w-md">
                  {/* Element xpath: //button[span[contains(text(), 'PREVIOUS')]] */}
                  <button
                    onClick={() => navigateTo('ark-project', 'push_back')}
                    onMouseEnter={() => handleSound('tick')}
                    className="flex-1 border border-zinc-800 hover:border-zinc-500 text-zinc-300 font-mono text-xs tracking-widest py-3 px-5 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>PREVIOUS</span>
                  </button>
                  {/* Element xpath: //button[span[contains(text(), 'CONTINUE')]] */}
                  <button
                    onClick={() => navigateTo('last-signal', 'push')}
                    onMouseEnter={() => handleSound('tick')}
                    className="flex-1 relative border border-hud-cyan bg-hud-cyan/5 hover:bg-hud-cyan/20 text-hud-cyan font-mono text-xs tracking-widest py-3 px-5 transition cursor-pointer flex items-center justify-center gap-2 group glow-cyan"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hud-cyan/25 to-transparent w-1/2 h-full -skew-x-12 -translate-x-full group-hover:animate-sweep" />
                    <span>CONTINUE</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 5: THE LAST SIGNAL */}
            {currentScreen === 'last-signal' && (
              <div className="flex flex-col items-center max-w-3xl text-center space-y-8 w-full">
                {/* Radial Telemetry Circle Overlay */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <div className="absolute inset-0 border border-hud-cyan/15 rounded-full" />
                  <div className="absolute inset-1 w-full h-full border border-dashed border-hud-cyan/10 rounded-full animate-[spin_100s_linear_infinite]" />
                  <div className="absolute inset-8 border border-hud-cyan/20 rounded-full" />
                  <div className="w-40 h-40 rounded-full bg-space-black/90 border border-hud-cyan/30 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,242,255,0.1)]">
                    <Radio className="text-hud-cyan animate-pulse" size={48} />
                  </div>
                </div>

                {/* Center Content Card */}
                <div className="relative border border-hud-cyan/25 bg-glass-surface p-8 max-w-2xl backdrop-blur-md shadow-[0_0_30px_rgba(0,242,255,0.06)] w-full">
                  <div className="absolute top-0 left-6 -translate-y-1/2 bg-space-black border border-hud-cyan/30 px-3 py-0.5 text-[8px] font-mono text-hud-cyan tracking-widest">
                    INCOMING FRAGMENT: LAST_SIGNAL.VFX
                  </div>

                  <div className="space-y-6">
                    <h1 className="text-2xl md:text-4xl font-sans font-bold tracking-tight text-white uppercase glow-text-cyan leading-snug">
                      A Message For Whoever Come<span className="text-hud-cyan animate-blink inline-block">_</span>
                    </h1>

                    <Typewriter
                      text="The terminal flickers one last time. Across the light-years, a fragment of human history has survived the silence. We were here. We dreamed of the stars."
                      speed={20}
                      className="text-base text-zinc-300 leading-relaxed font-mono text-center"
                    />

                    {/* Custom progress waveform bar representing transmission */}
                    <div className="space-y-2 pt-4">
                      {/* Technical values */}
                      <div className="flex justify-between items-center text-[10px] font-mono text-muted-slate">
                        <span>PACKET LOSS: 0.003%</span>
                        <span className="text-hud-cyan">SIGNAL STRENGTH: NOMINAL</span>
                      </div>
                      
                      {/* Waveform indicator container */}
                      <div className="relative h-1 bg-hud-cyan/10 overflow-hidden w-full">
                        <motion.div
                          animate={{ left: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                          className="absolute top-0 w-[40%] h-full bg-hud-cyan shadow-[0_0_8px_#00f2ff]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Previous / Continue control bar */}
                <div className="flex gap-4 w-full max-w-md">
                  {/* Element xpath: //button[span[contains(text(), 'Previous')]] */}
                  <button
                    onClick={() => navigateTo('journey', 'push_back')}
                    onMouseEnter={() => handleSound('tick')}
                    className="flex-1 border border-zinc-800 hover:border-zinc-500 text-zinc-300 font-mono text-xs tracking-widest py-3 px-5 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Previous</span>
                  </button>
                  {/* Element xpath: //button[span[contains(text(), 'Continue')]] */}
                  <button
                    onClick={() => navigateTo('the-future', 'push')}
                    onMouseEnter={() => handleSound('tick')}
                    className="flex-1 relative border border-hud-cyan bg-hud-cyan/5 hover:bg-hud-cyan/20 text-hud-cyan font-mono text-xs tracking-widest py-3 px-5 transition cursor-pointer flex items-center justify-center gap-2 group glow-cyan"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hud-cyan/25 to-transparent w-1/2 h-full -skew-x-12 -translate-x-full group-hover:animate-sweep" />
                    <span>Continue</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 6: THE FUTURE */}
            {currentScreen === 'the-future' && (
              <div className="flex flex-col items-center max-w-4xl text-center space-y-8 w-full z-10 relative">
                {/* Event Horizon title overlay */}
                <div className="space-y-4">
                  <div className="text-[10px] font-mono text-cyan-400 bg-space-black/80 px-4 py-1.5 border border-cyan-500/20 shadow-[0_0_12px_rgba(0,242,255,0.1)] inline-block tracking-widest animate-pulse">
                    [ TRANSMISSION TERMINATED ]
                  </div>
                  <h1 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white uppercase glow-text-cyan leading-none">
                    THE SIGNAL CONTINUES...
                  </h1>
                </div>

                {/* Sub title details */}
                <p className="text-xs md:text-sm font-mono text-muted-slate tracking-wider max-w-lg">
                   Humanity has dissolved into quantum dust, but the terminal remains alive.
                </p>

                {/* Interactive transmitter board where the user logs their thoughts */}
                <form
                  onSubmit={handleBroadcast}
                  className="w-full max-w-2xl border border-hud-cyan/30 bg-space-black/90 p-6 md:p-8 space-y-6 backdrop-blur-md relative"
                >
                  <label className="block text-left text-xs font-mono text-hud-cyan tracking-wider uppercase">
                    👾 Submit thoughts to the eternal cosmic buffer:
                  </label>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      maxLength={140}
                      value={userMsgInput}
                      onChange={(e) => setUserMsgInput(e.target.value)}
                      placeholder="Will Anyone Hear Us?__"
                      className="w-full text-zinc-200 bg-zinc-950/80 border border-hud-cyan/20 px-4 py-4 pr-12 focus:outline-none focus:border-hud-cyan focus:glow-cyan font-mono text-sm tracking-wide rounded-none transition"
                    />
                    <button
                      type="submit"
                      disabled={!userMsgInput.trim()}
                      className="absolute right-4 p-1.5 text-hud-cyan hover:text-white disabled:text-zinc-600 disabled:cursor-not-allowed transition"
                      title="Transmit to buffer"
                    >
                      <Send size={16} />
                    </button>
                  </div>

                  {/* Transmitted Messages Stream list from local state */}
                  <div className="space-y-4 border-t border-hud-cyan/10 pt-4">
                    <div className="flex justify-between items-center text-[10px] font-mono text-muted-slate uppercase tracking-widest">
                      <span>📡 Buffer Transmission Log</span>
                      <span className="text-hud-cyan animate-pulse">● FEED ACTIVE</span>
                    </div>

                    <div className="h-40 overflow-y-auto pr-1 space-y-3 scrollbar-thin text-left">
                      {transmittedSignals.map((sig) => (
                        <div
                          key={sig.id}
                          className="p-3 border border-zinc-900 bg-zinc-950/40 font-mono text-xs hover:border-hud-cyan/10 transition leading-relaxed"
                        >
                          <div className="flex justify-between text-[8px] text-muted-slate mb-1">
                            <span>FROM: {sig.sender}</span>
                            <span>{sig.timestamp}</span>
                          </div>
                          <p className="text-zinc-300 break-words">{sig.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>

                {/* Ultimate Navigation Board according to XPath layout spec */}
                <div className="flex flex-col items-center gap-4 w-full max-w-md pt-4">
                  {/* Element xpath: //button[contains(., 'RESTART JOURNEY')] */}
                  <button
                    onClick={() => navigateTo('beginning', 'slide_up')}
                    onMouseEnter={() => handleSound('tick')}
                    className="w-full relative border border-hud-cyan bg-hud-cyan/10 hover:bg-hud-cyan/20 text-hud-cyan font-mono text-sm tracking-widest py-4 px-8 transition duration-300 cursor-pointer text-center flex items-center justify-center gap-3 glow-cyan animate-pulse group-hover:animate-none chamfer-sm"
                  >
                    <span>RESTART JOURNEY</span>
                    <span className="text-hud-cyan group-hover:translate-y-[-2px] transition-transform">🞁</span>
                  </button>

                  {/* Element xpath: //button[span[contains(text(), 'PREVIOUS')]] */}
                  <button
                    onClick={() => navigateTo('last-signal', 'push_back')}
                    onMouseEnter={() => handleSound('tick')}
                    className="border border-zinc-900 bg-zinc-950/60 hover:border-zinc-500 text-zinc-400 font-mono text-xs tracking-widest py-3 px-8 transition cursor-pointer flex items-center justify-center gap-2 w-1/2"
                  >
                    <span>PREVIOUS</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FOOTER GRID METADATA SUMMARY BAR */}
      <div className="w-full font-mono text-[8px] tracking-[0.2em] text-muted-slate px-6 py-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-2 border-t border-hud-cyan/5 bg-space-black/65 z-30 pointer-events-none">
        <div>[ CPT_ID: {((missionTime * 3) / 2 + 104).toFixed(0)} // SECTOR: PERIPHERY_OUTPOST_X9 ]</div>
        <div>EMITTERS: ENERGISED // PROXIMITY_ALERT: ALL_CLEAR</div>
        <div>CRAFTED BY mebacklink // YEAR_3026</div>
      </div>
        </div>
      </div>
    </div>
  );
}
