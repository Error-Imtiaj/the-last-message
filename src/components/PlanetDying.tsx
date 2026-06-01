export function PlanetDying() {
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center select-none overflow-visible">
      {/* Outer red/coral critical atmosphere glow ring */}
      <div className="absolute inset-x-0 w-[140%] h-[140%] bg-radial-[circle_at_center,_rgba(239,68,68,0.06)_0%,_rgba(0,0,0,0)_70%] pointer-events-none" />

      {/* Atmospheric rings / orbits */}
      <div className="absolute inset-0 border border-red-500/10 rounded-full" />
      <div className="absolute inset-6 border border-dashed border-red-500/15 rounded-full animate-[spin_40s_linear_infinite]" />
      
      {/* Planet sphere */}
      <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-red-500/30 bg-black shadow-[0_0_30px_rgba(239,68,68,0.2)]">
        {/* Deep ocean background */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,_rgba(12,25,35,1)_0%,_rgba(2,2,5,1)_100%]" />

        {/* Continents overlay showing dying/orange thermal spots */}
        <svg className="absolute inset-0 w-full h-full opacity-60 animate-[pulse_10s_ease-in-out_infinite]" viewBox="0 0 200 200" fill="none">
          <defs>
            <radialGradient id="dying-heat" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#ef4444" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Abstract landmass shapes */}
          <path
            d="M30,80 Q50,60 80,70 T120,60 T160,80 T150,130 T80,120 Z"
            fill="url(#dying-heat)"
            stroke="#b91c1c"
            strokeWidth="0.5"
            className="animate-pulse"
          />
          <path
            d="M40,110 Q60,140 100,150 T140,130 T130,90 Z"
            fill="url(#dying-heat)"
            stroke="#ea580c"
            strokeWidth="0.5.5"
          />
        </svg>

        {/* Glowing atmospheric rim (red/orange) representing greenhouse trap / heat death */}
        <div className="absolute inset-0 rounded-full border-[6px] border-red-500/10 mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 rounded-full border border-orange-500/40 mix-blend-screen pointer-events-none shadow-[inset_0_0_20px_rgba(239,68,68,0.4)]" />

        {/* Terminator line / shadow of decay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Mini data-pip HUD floating over the planet */}
      <div className="absolute top-1/4 right-8 flex items-center gap-1.5 bg-space-black/90 px-2 py-0.5 border border-red-500/30 text-[9px] font-mono text-red-400">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
        <span>O2 DEPLETED</span>
      </div>
    </div>
  );
}
