import { motion } from 'motion/react';

export function PlanetBeginning() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center select-none">
      {/* Outer nested HUD rings */}
      <div className="absolute inset-0 border border-hud-cyan/15 rounded-full animate-[spin_40s_linear_infinite]" />
      <div className="absolute inset-2 border border-dashed border-hud-cyan/30 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
      <div className="absolute inset-6 border border-hud-cyan/10 rounded-full" />
      <div className="absolute inset-10 border border-hud-cyan/5 rounded-full" />

      {/* Internal planet clip mask */}
      <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-hud-cyan/40 bg-space-black glow-cyan">
        {/* Swirling space clouds / dust behind planet sphere */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-zinc-800 via-stone-950 to-neutral-950 opacity-90" />

        {/* The planetary sphere itself */}
        <div className="absolute inset-4 rounded-full overflow-hidden bg-zinc-900 border border-zinc-700/80 shadow-inner">
          {/* Planet shading */}
          <div className="absolute inset-0 bg-radial-[circle_at_center,_rgba(255,255,255,0.05)_0%,_rgba(0,0,0,0.9)_80%]" />
          
          {/* Swirling gases / glowing energy ribbons */}
          <svg className="absolute inset-0 w-full h-full mix-blend-screen opacity-65 animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="cloud-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#71717a" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {/* Wave paths representing planet atmosphere */}
            <path
              d="M10,50 Q30,20 50,50 T90,50"
              fill="none"
              stroke="url(#cloud-grad)"
              strokeWidth="4"
              className="animate-[pulse_4s_ease-in-out_infinite]"
            />
            <path
              d="M5,60 Q35,80 65,40 T95,65"
              fill="none"
              stroke="url(#cloud-grad)"
              strokeWidth="3"
            />
          </svg>

          {/* Dark planetary shadow covering half of the planet */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/40 to-black pointer-events-none" />
        </div>

        {/* Ambient atmospheric flare ring */}
        <div className="absolute inset-0 rounded-full border border-hud-cyan/40 mix-blend-screen animate-pulse pointer-events-none" />

        {/* Glitch / scanning line across portal */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-hud-cyan/30 animate-[bounce_8s_ease-in-out_infinite] shadow-[0_0_8px_#00f2ff]" />
      </div>

      {/* Orbiting UI coordinate tags */}
      <div className="absolute w-full h-full animate-[spin_50s_linear_infinite] pointer-events-none">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[8px] font-mono text-hud-cyan bg-space-black px-1.5 border border-hud-cyan/20">
          SEC: DELTA_9
        </span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-[8px] font-mono text-hud-cyan bg-space-black px-1.5 border border-hud-cyan/20">
          POS: 114.92
        </span>
      </div>
    </div>
  );
}
