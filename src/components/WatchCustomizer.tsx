import React, { useState } from 'react';
import { WATCH_MATERIALS, WatchMaterial } from '../data';
import { Armchair, Shield, RefreshCw } from 'lucide-react';

interface CustomizerProps {
  selectedMaterial: WatchMaterial;
  onSelectMaterial: (m: WatchMaterial) => void;
  watchImagePath: string;
}

export default function WatchCustomizer({ selectedMaterial, onSelectMaterial, watchImagePath }: CustomizerProps) {
  const [accentRotation, setAccentRotation] = useState(0);

  const rotateWatchMockup = () => {
    setAccentRotation((prev) => prev + 45);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6 bg-[#1a1a1a]/30 border border-neutral-800/30 rounded-2xl flex flex-col md:flex-row gap-8 items-center justify-between">
      {/* Visual Product Preview with Alloy Accents */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-4">
        {/* Glow Halo indicating the alloy material selection */}
        <div 
          className={`absolute w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-radial from-[var(--alloy-accent)]/8 to-transparent blur-3xl transition-all duration-700`}
          style={{ '--alloy-accent': selectedMaterial.accentHex } as React.CSSProperties}
        />

        {/* Dynamic Shadow Ring container */}
        <div 
          className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full shadow-2xl flex items-center justify-center transition-all duration-700"
          style={{
            boxShadow: `0 25px 50px -12px ${selectedMaterial.accentHex}1a`,
          }}
        >
          {/* Main Watch Object Mockup Image */}
          <div 
            className="absolute z-10 w-[80%] h-[80%] flex items-center justify-center transition-transform duration-700 ease-out cursor-grab"
            style={{ transform: `rotate(${accentRotation}deg)` }}
          >
            <img 
              src={watchImagePath} 
              alt={selectedMaterial.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] rounded-3xl"
            />
          </div>

          {/* Golden Highlight Ring representing bezel trim alloy */}
          <div 
            className="absolute inset-4 rounded-full border-2 transition-colors duration-700 ease-in-out pointer-events-none z-0" 
            style={{ borderColor: `${selectedMaterial.accentHex}25` }}
          />

          {/* Compass indicators of materials */}
          <div className="absolute inset-0 flex justify-between items-center px-4 font-mono text-[8px] tracking-[0.2em] text-neutral-600 uppercase pointer-events-none">
            <span>A L L O Y</span>
            <span>C R A F T</span>
          </div>
        </div>

        {/* Rotate Assist utility */}
        <button
          id="btn_rotate_mockup"
          onClick={rotateWatchMockup}
          className="cursor-pointer mt-6 flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-gold-accent/70 hover:text-white transition-all uppercase py-1 px-3 border border-neutral-800 hover:border-gold-accent/40 rounded-full bg-neutral-900/40"
        >
          <RefreshCw className="w-3 h-3 text-gold-accent" />
          <span>Interactive Rotate Bezel ({accentRotation}°)</span>
        </button>
      </div>

      {/* Materials Picker Menu */}
      <div className="flex-1 flex flex-col items-start gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs tracking-[0.2em] text-gold-accent font-semibold uppercase">MATERIAL ATELIER</span>
          <h2 className="font-serif text-3xl md:text-3xl text-neutral-100 tracking-tight leading-none font-medium">
            Forge Your Monument
          </h2>
          <p className="text-xs text-neutral-400 font-sans font-light mt-1.5 max-w-md">
            The Élysée chronometer is crafted individually of selected high-performance metallurgy. Select your preferred casing alloy below to preview its bespoke characteristics.
          </p>
        </div>

        {/* Buttons Alloy Selector Stack */}
        <div className="flex flex-col gap-3 w-full max-w-md">
          {WATCH_MATERIALS.map((material) => (
            <button
              key={material.id}
              id={`btn_alloy_select_${material.id}`}
              onClick={() => onSelectMaterial(material)}
              className={`cursor-pointer w-full text-left p-4 rounded-xl border flex gap-4 transition-all duration-300 outline-none ${
                selectedMaterial.id === material.id
                  ? 'bg-[#181818] border-gold-accent shadow-lg shadow-black/45'
                  : 'bg-neutral-900/10 border-neutral-800/30 hover:border-neutral-750 hover:bg-neutral-900/30'
              }`}
            >
              {/* Alloy sample orb preview */}
              <div 
                className={`w-10 h-10 rounded-full bg-gradient-to-br ring-2 ring-black ${material.caseColor} flex items-center justify-center border transition-all shadow-inner`}
                style={{ borderColor: material.accentHex }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-950/90" />
              </div>

              {/* Alloy Title / Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-100">{material.name}</span>
                  {selectedMaterial.id === material.id && (
                    <span className="font-mono text-[9px] text-gold-accent tracking-widest uppercase font-bold">SELECTED</span>
                  )}
                </div>
                <div className="font-mono text-[9px] text-gold-accent font-medium mt-0.5 uppercase tracking-wide">
                  {material.dialName}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bespoke active material summary description */}
        <div className="p-4 rounded-xl bg-[#0e0e0d] border border-neutral-800/50 w-full max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-3.5 h-3.5 text-gold-accent" />
            <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">Alloy Composition Notes</span>
          </div>
          <p className="text-xs text-neutral-400 font-sans font-light leading-relaxed">
            {selectedMaterial.description}
          </p>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-neutral-800/40 text-[10px]">
            <div>
              <span className="text-neutral-500 block font-mono">STRAP STRAND</span>
              <span className="text-neutral-300 block font-semibold">{selectedMaterial.strapMaterial}</span>
            </div>
            <div>
              <span className="text-neutral-500 block font-mono">ALUM HIGHLIGHT</span>
              <span className="text-neutral-300 block font-semibold flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedMaterial.accentHex }} />
                {selectedMaterial.accentHex}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
