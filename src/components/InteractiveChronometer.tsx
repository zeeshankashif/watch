import { useEffect, useState, useRef } from 'react';
import { Play, Pause, Zap, Compass, RotateCcw } from 'lucide-react';

export default function InteractiveChronometer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // normal time
  const [timeZone, setTimeZone] = useState('Local Time');
  const [displayDate, setDisplayDate] = useState('');

  // We track the logical smooth "ticks" and angle positions
  const baseRotationRef = useRef({ hour: 0, minute: 0, second: 0 });
  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Refs for direct DOM manipulation to achieve ultra-smooth 60fps movement without React re-render overhead
  const secondHandRef = useRef<SVGGElement | null>(null);
  const minuteHandRef = useRef<SVGGElement | null>(null);
  const hourHandRef = useRef<SVGGElement | null>(null);
  const subDialHandRef = useRef<SVGGElement | null>(null);
  const digitalTimeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize standard initial time
    const now = new Date();
    const ms = now.getMilliseconds();
    const sec = now.getSeconds() + ms / 1000;
    const min = now.getMinutes() + sec / 60;
    const hr = (now.getHours() % 12) + min / 60;

    baseRotationRef.current = {
      second: sec * 6, // 360 deg / 60 sec = 6 deg/sec
      minute: min * 6, // 6 deg/min
      hour: hr * 30,   // 360 deg / 12 hr = 30 deg/hr
    };

    // Human timezone label formatting
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimeZone(tz);
    } catch (e) {
      setTimeZone('UTC / Local Time');
    }

    // Set stable initial visible date
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    setDisplayDate(now.toLocaleDateString('en-US', options).toUpperCase());
  }, []);

  useEffect(() => {
    const updateHands = () => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (isPlaying) {
        // Calculate dynamic rotations with custom speed multiplier
        // 1 second of normal time = 6 degrees.
        // delta in ms / 1000 * 6 * multiplier
        const elapsedSec = (delta / 1000) * speedMultiplier;
        
        baseRotationRef.current.second = (baseRotationRef.current.second + elapsedSec * 6) % 360;
        baseRotationRef.current.minute = (baseRotationRef.current.minute + (elapsedSec / 60) * 6) % 360;
        baseRotationRef.current.hour = (baseRotationRef.current.hour + (elapsedSec / 3600) * 30) % 360;
      }

      // Rotate actual SVGs
      if (secondHandRef.current) {
        secondHandRef.current.style.transform = `rotate(${baseRotationRef.current.second}deg)`;
      }
      if (minuteHandRef.current) {
        minuteHandRef.current.style.transform = `rotate(${baseRotationRef.current.minute}deg)`;
      }
      if (hourHandRef.current) {
        hourHandRef.current.style.transform = `rotate(${baseRotationRef.current.hour}deg)`;
      }
      if (subDialHandRef.current) {
        // Sub-dial rotates representing active reserve indicator or microsecond cycle
        const reserveRot = (baseRotationRef.current.second * 4) % 360;
        subDialHandRef.current.style.transform = `rotate(${reserveRot}deg)`;
      }

      // Live Digital Overlay
      if (digitalTimeRef.current) {
        const d = new Date();
        const hrs = String(d.getHours()).padStart(2, '0');
        const mins = String(d.getMinutes()).padStart(2, '0');
        const secs = String(d.getSeconds()).padStart(2, '0');
        digitalTimeRef.current.textContent = `${hrs}:${mins}:${secs} ${speedMultiplier > 1 ? `[${speedMultiplier}x Speed]` : ''}`;
      }

      animationFrameId.current = requestAnimationFrame(updateHands);
    };

    lastTimeRef.current = Date.now();
    animationFrameId.current = requestAnimationFrame(updateHands);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, speedMultiplier]);

  const resetToRealTime = () => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const sec = now.getSeconds() + ms / 1000;
    const min = now.getMinutes() + sec / 60;
    const hr = (now.getHours() % 12) + min / 60;

    baseRotationRef.current = {
      second: sec * 6,
      minute: min * 6,
      hour: hr * 30,
    };
    setSpeedMultiplier(1);
    setIsPlaying(true);
    lastTimeRef.current = Date.now();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-between w-full max-w-5xl mx-auto py-12 px-6">
      {/* Visual Clock Face */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-[#121110] to-[#252321] p-3 shadow-2xl shadow-black/60 border border-gold-accent/25 flex items-center justify-center group">
        {/* Outer Bezel */}
        <div className="absolute inset-2 rounded-full border border-[#2d2925] bg-radial from-[#191715] to-[#0c0b0a] shadow-inner flex items-center justify-center">
          {/* Hour Tick Markers */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-full py-2 flex flex-col justify-between items-center"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <span className={`w-0.5 rounded-full ${i % 3 === 0 ? 'h-3.5 bg-gold-accent' : 'h-2 bg-neutral-600/60'}`} />
              <span className="w-0.5 h-2 bg-neutral-800/20" />
            </div>
          ))}

          {/* Core Branding Label */}
          <div className="absolute top-[28%] text-center flex flex-col items-center">
            <span className="font-serif text-[10px] md:text-sm tracking-[0.2em] text-gold-accent font-medium">Z E X A N</span>
            <span className="font-mono text-[8px] tracking-wider text-neutral-500 mt-1">GENÈVE // SWISS</span>
          </div>

          {/* Date Window */}
          <div className="absolute right-[22%] top-[48%] bg-[#080807] border border-[#201d1a] px-1.5 py-0.5 rounded-sm shadow-md text-center">
            <span className="font-mono text-[9px] md:text-[10px] tracking-wider text-gold-accent font-semibold">{displayDate?.split(' ')[1] || '23'}</span>
          </div>

          {/* Dynamic Active Indicator sub-dial and state labels */}
          <div className="absolute bottom-[25%] text-center flex flex-col items-center">
            <span className="font-mono text-[7px] md:text-[8px] tracking-[0.14em] text-neutral-400">72 HR RESERVE</span>
            {/* Tiny Circle Power Meter Dial */}
            <div className="relative w-8 h-8 rounded-full border border-neutral-800 bg-[#080807] mt-1 flex items-center justify-center">
              <span className="absolute left-[3px] top-[14px] w-1 h-1 rounded-full bg-orange-600/40" />
              <div 
                ref={subDialHandRef}
                className="absolute w-0.5 h-3 bg-gold-accent/80 rounded" 
                style={{ transformOrigin: '50% 100%', bottom: '50%', transform: 'rotate(45deg)' }} 
              />
              <span className="absolute w-1 h-1 rounded-full bg-neutral-900 border border-neutral-700" />
            </div>
          </div>

          {/* Hands Assembly Group */}
          <div className="relative w-full h-full">
            {/* HOUR HAND */}
            <div
              ref={hourHandRef}
              className="absolute inset-0 flex justify-center items-center pointer-events-none transition-transform duration-100 ease-out"
              style={{ transformOrigin: 'center center' }}
            >
              <div className="relative w-1.5 h-full">
                {/* Pointer rod starting from center going up */}
                <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-1.5 h-[28%] bg-white rounded shadow-md border-r border-neutral-400" />
                {/* Tail counterbalance */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1 h-[8%] bg-neutral-700/80 rounded" />
              </div>
            </div>

            {/* MINUTE HAND */}
            <div
              ref={minuteHandRef}
              className="absolute inset-0 flex justify-center items-center pointer-events-none transition-transform duration-100 ease-out"
              style={{ transformOrigin: 'center center' }}
            >
              <div className="relative w-1 h-full">
                {/* Long sleeve */}
                <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-1 h-[40%] bg-gold-accent rounded shadow-md" />
                {/* Counter balance */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[3px] h-[10%] bg-neutral-700" />
              </div>
            </div>

            {/* SECOND HAND (Sweeping needle) */}
            <div
              ref={secondHandRef}
              className="absolute inset-0 flex justify-center items-center pointer-events-none"
              style={{ transformOrigin: 'center center' }}
            >
              <div className="relative w-0.5 h-full">
                {/* Ultra thin sweeping gold needle */}
                <div className="absolute bottom-[44%] left-1/2 -translate-x-1/2 w-[1.5px] h-[45%] bg-amber-500 rounded" />
                {/* Circular styled hub and tail */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[1.2px] h-[14%] bg-amber-500/80 rounded" />
                {/* Tiny secondary circular accent counter weight */}
                <div className="absolute top-[57%] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-amber-500 bg-black/60 shadow" />
              </div>
            </div>

            {/* Center Cap Ring Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-[#1a1816] to-[#423a31] border border-neutral-700 shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Clock controls and dynamic mechanical analytics */}
      <div className="flex-1 flex flex-col items-start gap-5 self-stretch justify-center">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs tracking-[0.2em] text-gold-accent font-semibold uppercase">ACTIVE TIME ENGINE</span>
          <h2 className="font-serif text-3xl md:text-4xl text-neutral-100 tracking-tight leading-none">
            Swiss Heartbeat, Digital Precision
          </h2>
          <p className="text-sm text-neutral-400 max-w-lg mt-2 font-sans font-light">
            Toggle our interactive virtual Escapement Wheel. Experience the distinction of an automatic sweep mechanism vibrating at <span className="text-white font-medium">10 beats per second</span>. Increase the multiplier to simulate gear cycles.
          </p>
        </div>

        {/* Live Digital Display & Stats Overlay */}
        <div className="w-full bg-stone-900/45 p-4 rounded-xl border border-neutral-800/50 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">Active Timezone</div>
            <div className="text-sm text-neutral-300 font-semibold mt-0.5 truncate max-w-[200px] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-gold-accent stroke-[2px] animate-pulse" />
              {timeZone}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Ticking Escapement</div>
            <div ref={digitalTimeRef} className="text-sm font-mono text-emerald-400 font-semibold mt-0.5">
              00:00:00
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">Mechanism State</div>
            <div className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${isPlaying ? 'bg-emerald-950/45 text-emerald-400 border border-emerald-805/30' : 'bg-red-950/45 text-red-400 border border-red-805/30'}`}>
              {isPlaying ? 'UNLOCKED / SWEEPING' : 'LOCKED'}
            </div>
          </div>
        </div>

        {/* Controls Layout */}
        <div className="flex flex-wrap gap-3 w-full">
          <button
            id="btn_clock_lock"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`cursor-pointer px-4 py-2.5 rounded-lg font-mono text-xs font-medium uppercase tracking-wider border transition-all duration-300 flex items-center gap-2 ${
              isPlaying
                ? 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-gold-accent'
                : 'bg-gold-accent border-gold-accent text-neutral-950 font-bold hover:brightness-110 shadow-lg shadow-gold-accent/10'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Stop Escapement</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Sweep</span>
              </>
            )}
          </button>

          {/* Speed settings multiplier */}
          <div className="inline-flex rounded-lg bg-neutral-900 p-1 border border-neutral-800">
            {[1, 5, 20, 100].map((m) => (
              <button
                key={m}
                id={`btn_clock_speed_${m}`}
                onClick={() => {
                  setSpeedMultiplier(m);
                  if (!isPlaying) setIsPlaying(true);
                }}
                className={`cursor-pointer px-3 py-1.5 rounded-md font-mono text-xs transition-all duration-300 flex items-center gap-1 ${
                  speedMultiplier === m
                    ? 'bg-neutral-800 text-gold-accent font-semibold shadow-inner'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                {m > 1 ? <Zap className="w-3 h-3 text-gold-accent fill-current" /> : null}
                <span>{m}x</span>
              </button>
            ))}
          </div>

          <button
            id="btn_clock_reset"
            onClick={resetToRealTime}
            className="cursor-pointer px-4 py-2.5 rounded-lg font-mono text-xs font-medium uppercase tracking-wider bg-transparent border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all duration-300 flex items-center gap-2 ml-auto"
            title="Sychronize with exact current Atomic clock"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Atomic Sync</span>
          </button>
        </div>
      </div>
    </div>
  );
}
