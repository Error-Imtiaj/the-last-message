export function ArkSchematic() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0 opacity-25">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,242,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Sub-grid dot descriptors */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,242,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Futuristic tactical wireframe ship drawing in SVG */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 max-w-5xl flex items-center justify-center">
        <svg
          className="w-full h-full stroke-hud-cyan/30 stroke-[1px] fill-none animate-[pulse_6s_ease-in-out_infinite]"
          viewBox="0 0 1000 600"
        >
          {/* Main Hull Profile */}
          <path d="M 100,300 L 155,230 L 700,230 L 850,290 L 920,300 L 850,310 L 700,370 L 155,370 Z" />
          
          {/* Internal Structural Slabs */}
          <line x1="200" y1="230" x2="200" y2="370" />
          <line x1="450" y1="230" x2="450" y2="370" />
          <line x1="700" y1="230" x2="700" y2="370" />
          
          {/* Thrusters / Engines at Back */}
          <path d="M 100,250 L 50,260 L 50,340 L 100,350" />
          <line x1="100" y1="270" x2="30" y2="280" />
          <line x1="100" y1="330" x2="30" y2="320" />
          
          {/* Primary Command Deck / Bridge */}
          <path d="M 780,230 L 820,180 L 880,180 L 900,225" />
          <line x1="820" y1="180" x2="820" y2="230" />
          
          {/* Core Energy Cylinder */}
          <rect x="480" y="260" width="180" height="80" rx="4" className="stroke-hud-cyan/50 fill-hud-cyan/5" />
          <circle cx="570" cy="300" r="25" className="stroke-hud-cyan animate-pulse" />
          <line x1="480" y1="300" x2="660" y2="300" />
          
          {/* Blueprint Measurement / Dimension Labels */}
          <g className="font-mono text-[8px] fill-hud-cyan/50 stroke-none">
            <text x="320" y="220">[ CARGO_SECTOR_A ]</text>
            <text x="500" y="250">[ ANTIMATTER_CORE_CONTAINMENT ]</text>
            <text x="730" y="220">[ PASSENGER_CRYO_PODS_01_TO_44 ]</text>
            <text x="830" y="170">BRIDGE: LVL_9</text>
            
            <text x="110" y="390">LENGTH: 3,420M</text>
            <text x="480" y="390">MASS: 8.2M TONNES</text>
            <text x="800" y="390">MAX_VEL: 0.99C</text>
          </g>

          {/* Technical Dimension lines */}
          <path d="M 100,410 L 100,420 L 920,420 L 920,410" />
          <line x1="510" y1="415" x2="510" y2="425" />
        </svg>
      </div>
    </div>
  );
}
