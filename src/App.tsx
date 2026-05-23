import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Award, 
  Activity, 
  ChevronRight, 
  Clock, 
  Layers, 
  HelpCircle, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Info,
  X,
  Compass,
  ArrowDown
} from 'lucide-react';

import { WATCH_MATERIALS, WATCH_SPECS, EDITORIAL_BLOCKS, WatchMaterial } from './data';
import InteractiveChronometer from './components/InteractiveChronometer';
import WatchCustomizer from './components/WatchCustomizer';

// Reference our high-res generated watch image path
import luxuryWatchImg from './assets/images/luxury_watch_1779547662372.png';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [selectedMaterial, setSelectedMaterial] = useState<WatchMaterial>(WATCH_MATERIALS[0]);
  const [activeSpecTab, setActiveSpecTab] = useState<string>('mechanical');
  const [preorderModalOpen, setPreorderModalOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'40mm' | '42mm'>('42mm');
  const [engravingText, setEngravingText] = useState('');
  
  // Preorder Form States
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Switzerland');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const scrollyTriggerRef = useRef<HTMLDivElement | null>(null);

  // Scroll Sync and Anim Initialization
  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      prevent: (node) => node.classList.contains('scroll-prevent'),
    });

    // 2. Sync ScrollTrigger with Lenis Scrolling
    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    // 3. Construct the Scrollytelling Timeline
    const mm = gsap.matchMedia();
    const pinTrigger = scrollyTriggerRef.current;

    const ctx = gsap.context(() => {
      if (!pinTrigger) return;

      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinTrigger,
          start: 'top top',
          end: '+=200%', // Scroll depth distance
          scrub: 1.0,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        }
      });

      // Animate background color fade from dense charcoal black layout overlay to vanilla ivory beige
      mainTl.to('.beige-background-fade', {
        opacity: 1,
        ease: 'power1.inOut'
      }, 0);

      // Fade out Initial Hero textual descriptions
      mainTl.to('.hero-scroll-fadeout', {
        opacity: 0,
        y: -100,
        stagger: 0.05,
        ease: 'power2.inOut'
      }, 0);

      // Transition the watch image size and location layouts responsively
      mm.add({
        isDesktop: "(min-width: 1024px)",
        isTablet: "(min-width: 768px) and (max-width: 1023px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        const { isDesktop, isTablet } = context.conditions as { isDesktop: boolean; isTablet: boolean };

        if (isDesktop) {
          // Desktop positioning: Move watch left, reveal editorial info blocks on the right
          mainTl.to('.animated-watch-focal', {
            x: '-22vw',
            y: '0',
            scale: 0.52,
            filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))',
            ease: 'power3.inOut'
          }, 0);

          mainTl.to('.editorial-column-reveal', {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            ease: 'power3.out'
          }, 0.3);
        } else if (isTablet) {
          // Tablet positioning: Move slightly left, scale slightly
          mainTl.to('.animated-watch-focal', {
            x: '-16vw',
            y: '-5vh',
            scale: 0.44,
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
            ease: 'power3.inOut'
          }, 0);

          mainTl.to('.editorial-column-reveal', {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            ease: 'power3.out'
          }, 0.3);
        } else {
          // Mobile positioning: Translate watch upwards, text columns emerge cleanly below it
          mainTl.to('.animated-watch-focal', {
            x: '0',
            y: '-22vh',
            scale: 0.38,
            filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.12))',
            ease: 'power3.inOut'
          }, 0);

          mainTl.to('.editorial-column-reveal', {
            opacity: 1,
            y: '16vh',
            stagger: 0.1,
            ease: 'power3.out'
          }, 0.2);
        }
      });
    }, pinTrigger);

    return () => {
      lenis.destroy();
      ctx.revert();
      mm.revert();
    };
  }, []);

  // Simple Preorder form validations
  const handlePreorderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    if (!customerName.trim()) errors.name = 'Please provide your full name.';
    if (!customerEmail.trim() || !customerEmail.includes('@')) errors.email = 'Please provide a valid email.';
    if (!phone.trim()) errors.phone = 'A contact phone number is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setOrderSubmitted(true);
  };

  const handleResetForm = () => {
    setCustomerName('');
    setCustomerEmail('');
    setPhone('');
    setEngravingText('');
    setOrderSubmitted(false);
    setPreorderModalOpen(false);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#121212] text-[#E5E0D5] font-sans selection:bg-gold-accent selection:text-[#121212] overflow-x-hidden">
      
      {/* Premium Minimal Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-5 md:px-12 backdrop-blur-md bg-[#121212]/30 border-b border-neutral-800/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gold-accent stroke-[1.5px]" />
          <span className="font-serif text-lg tracking-[0.25em] font-semibold text-white">Z E X A N</span>
        </div>

        {/* Desktop navbar options */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.25em] text-neutral-400 font-mono uppercase">
          <a href="#heritage" className="hover:text-gold-accent transition-colors duration-200">HERITAGE</a>
          <a href="#mechanical" className="hover:text-gold-accent transition-colors duration-200">ENGINE</a>
          <a href="#atelier" className="hover:text-gold-accent transition-colors duration-200">ATELIER</a>
          <a href="#specs" className="hover:text-gold-accent transition-colors duration-200">SPECIFICATIONS</a>
        </nav>

        {/* Dynamic CTAs */}
        <button 
          id="btn_nav_preorder"
          onClick={() => setPreorderModalOpen(true)}
          className="cursor-pointer bg-gold-accent/10 hover:bg-gold-accent text-gold-accent hover:text-[#121212] border border-gold-accent/40 font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] px-4 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-gold-accent/15"
        >
          PRE-ORDER COLLECTIBLE
        </button>
      </header>

      {/* Hero Section Banner - Initial Scroll Space */}
      <section ref={heroRef} className="relative h-[100vh] w-full flex flex-col justify-between items-center bg-[#121212] pt-24 px-6 md:px-12 z-20 pb-8 select-none">
        
        {/* Absolute Background atmospheric stars element */}
        <div className="absolute inset-0 bg-radial from-stone-900/30 to-black/20 opacity-65 pointer-events-none" />

        {/* Meta Coordinates / Issue Labeling Header */}
        <div className="w-full max-w-7xl mx-auto flex justify-between items-start pt-6 border-t border-white/5 font-mono text-[9px] sm:text-[10px] px-2 text-neutral-500 uppercase tracking-[0.25em] z-10">
          <div className="flex flex-col gap-1">
            <span>COLLECTION // ÉLYSÉE NOIRE</span>
            <span className="text-neutral-400">REFERENCE NO. 9912-A</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-accent animate-pulse" />
            <span className="text-neutral-300">SWISS WORKSHOP EDITION</span>
          </div>
        </div>

        {/* Epic Center Title Canvas */}
        <div className="w-full text-center flex flex-col items-center justify-center my-auto z-10">
          <span className="hero-scroll-fadeout font-mono text-xs text-gold-accent tracking-[0.3em] font-medium uppercase mb-4 block">
            THE APEX ARCHITECTURE OF TIME
          </span>
          <h1 className="hero-scroll-fadeout font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-light text-white tracking-widest leading-none">
            OBSIDIENNE
          </h1>
          <p className="hero-scroll-fadeout font-sans text-xs sm:text-sm text-neutral-400 max-w-lg mt-6 leading-relaxed font-light tracking-wide">
            Forged in volcanic high-density carbonite compounds. Synced with the Calibre Z-9912 master heart. Scroll down to unpack its pristine mechanical sculpture.
          </p>
          
          <div className="hero-scroll-fadeout mt-10 animate-bounce duration-1000">
            <div className="flex flex-col items-center gap-1.5 text-neutral-500 hover:text-gold-accent text-[9px] tracking-[0.25em] uppercase font-mono transition-colors">
              <span>EXPLORE THE LANDING</span>
              <ArrowDown className="w-4.5 h-4.5 text-gold-accent" />
            </div>
          </div>
        </div>

        {/* Minimal Bottom Specifications bar */}
        <div className="w-full max-w-7xl mx-auto flex flex-wrap justify-between items-center py-4 border-b border-neutral-800/20 font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] gap-4 px-2 z-10">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gold-accent" />
            <span>5HZ HIGH BEAT (36,000 VPH)</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold-accent" />
            <span>SWISS JURA HAND-FINISHED BRIDGES</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gold-accent" />
            <span>72-HOUR CONSTANT POWER RESERVE</span>
          </div>
        </div>
      </section>

      {/* SCROLLYTELLING PINNING TRIGGER TRACK */}
      <section 
        ref={scrollyTriggerRef} 
        id="heritage" 
        className="scrollytelling-trigger relative h-[100vh] w-full bg-[#121212] overflow-hidden z-10 select-none"
      >
        {/* BEIGE BACKDROP OVERLAY - Fades in based onScroll progress */}
        <div className="beige-background-fade absolute inset-0 bg-[#E5E0D5] opacity-0 pointer-events-none transition-all duration-300 z-0" />

        {/* Elegant Side Rail Indicator - Styled from the design HTML */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 border-r border-neutral-800/20 md:border-neutral-900/10 flex items-center justify-center z-10 pointer-events-none">
          <span className="rotate-180 [writing-mode:vertical-lr] uppercase text-[9px] tracking-[0.4rem] font-medium text-neutral-500/85">
            LIMITED EDITION — 100 COHORTS
          </span>
        </div>

        {/* Giant Watch Mockup Object scaling and translating across layouts */}
        <div className="animated-watch-focal absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[85%] h-[85%] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] pointer-events-none flex items-center justify-center">
          {/* Circular shadow and halo plate backing representing bezel frame trim */}
          <div className="absolute w-[82%] h-[82%] rounded-full bg-[#121212] opacity-80 shadow-[0_30px_70px_rgba(0,0,0,0.85)] ring-1 ring-[#1A1A1A]/20 transition-all duration-500 pointer-events-none" />
          <img 
            src={luxuryWatchImg} 
            alt="Zexan Elysee Luxury Showcase" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.92)] relative z-10 rounded-3xl" 
          />
        </div>

        {/* Editorial Text column layout wrapper - Absolute layered, fades in as watch moves left */}
        <div className="absolute inset-0 flex items-center justify-end z-10 max-w-7xl mx-auto px-6 md:px-12 pointer-events-none">
          <div className="w-full md:w-[50%] lg:w-[45%] flex flex-col py-12 text-left pointer-events-auto select-text md:pr-4 py-24 gap-12">
            
            {/* Structural Editorial Blocks */}
            {EDITORIAL_BLOCKS.map((block, index) => (
              <div 
                key={index} 
                className="editorial-column-reveal opacity-0 translate-y-24 transition-opacity flex flex-col gap-3"
              >
                <div className="flex items-baseline gap-4 mb-1">
                  <span className="text-6xl md:text-7xl font-serif font-black leading-none italic text-gold-accent/25 select-none">0{index + 1}</span>
                  <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-[#1A1A1A] text-neutral-900">
                    {block.title}
                  </h2>
                </div>
                
                <p className="font-mono text-xs text-gold-accent font-semibold leading-relaxed tracking-wider">
                  {block.subtitle}
                </p>
                
                <div className="flex flex-col gap-4 text-xs font-light text-neutral-600 leading-relaxed font-sans font-light mt-2">
                  <p>{block.paragraph1}</p>
                  <p>{block.paragraph2}</p>
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </section>

      {/* HEROICAL HEARTBEAT ENGINE: THE ACTIVE CHRONOMETER ENGINE */}
      <section id="mechanical" className="relative w-full bg-[#121212] py-24 border-y border-neutral-800/10 text-white overflow-hidden">
        {/* Subtle geometric circles ornament */}
        <div className="absolute top-1/2 right-[-10%] w-[500px] h-[500px] rounded-full border border-gold-accent/5 pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full border border-gold-accent/5 pointer-events-none z-0" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-10">
          <div className="text-center md:text-left mb-12 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-neutral-800/80 pb-6">
            <div>
              <span className="font-mono text-[10px] text-gold-accent tracking-[0.2em] uppercase block mb-1">HOROLOGICAL RIGOR</span>
              <h2 className="font-serif text-4xl md:text-5xl text-neutral-100 font-light tracking-wide leading-tight">
                THE MECHANICAL SWEEP
              </h2>
            </div>
            <p className="font-mono text-[10px] md:text-sm text-neutral-400 font-light tracking-wide max-w-sm">
              *Ticking and sweeping smoothly in perfect alignment with atomic local browser standards.
            </p>
          </div>

          <InteractiveChronometer />
        </div>
      </section>

      {/* METALLURGY AND ALLOY OPTIONS PICKER (ATELIER) */}
      <section id="atelier" className="relative w-full bg-[#121212] py-24 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="mb-14 border-b border-neutral-900 pb-6 flex flex-col md:flex-row items-baseline justify-between gap-2 text-center md:text-left">
            <div>
              <span className="font-mono text-xs text-gold-accent tracking-[0.25em] uppercase font-bold">CONFIGURE BESPOKE ATOMICS</span>
              <h2 className="font-serif text-4xl md:text-5xl text-neutral-100 font-medium tracking-tight mt-1.5 leading-none">
                THE ALLOY ATELIER
              </h2>
            </div>
            <span className="font-mono text-xs text-neutral-500 tracking-[0.15em] uppercase font-light">
              CUSTOM COMPOSITIONS // THREE SOVEREIGN ALIGNMENTS
            </span>
          </div>

          <WatchCustomizer 
            selectedMaterial={selectedMaterial} 
            onSelectMaterial={setSelectedMaterial}
            watchImagePath={luxuryWatchImg}
          />
        </div>
      </section>

      {/* SPECIFICATIONS GRID IN BEAUTIFUL GRID */}
      <section id="specs" className="relative w-full bg-stone-950 py-24 text-neutral-300">
        <div className="absolute inset-0 bg-radial from-stone-900/10 to-[#0c0c0d]" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left intro panel */}
            <div className="lg:col-span-4 flex flex-col gap-6 text-center lg:text-left">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] text-gold-accent tracking-[0.2em] font-semibold uppercase">TECHNICAL REPORT</span>
                <h2 className="font-serif text-4xl text-white tracking-wide font-light uppercase">
                  CALIBRE Z-9912 SPECIFICATION
                </h2>
              </div>
              <p className="text-sm text-neutral-400 font-sans font-light leading-relaxed">
                Our chronometer is built around twin integrated mainspring barrels connected in series. This delivers clean, friction-compensated torque energy to our high-frequency lever escapement balance wheel for steady time performance over 72 active hours.
              </p>

              {/* Specs Filter Selector Tabs */}
              <div className="flex flex-wrap lg:flex-col gap-2 p-1.5 bg-[#121213] rounded-xl border border-neutral-800/80 mt-4 justify-center">
                {[
                  { id: 'mechanical', name: 'Escapement & Heartbeat' },
                  { id: 'materials', name: 'Material Resistance' },
                  { id: 'dimensions', name: 'Chronometer Dimensions' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    id={`btn_spec_tab_${tab.id}`}
                    onClick={() => setActiveSpecTab(tab.id)}
                    className={`cursor-pointer w-full text-center lg:text-left px-4 py-2.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-300 flex items-center justify-between gap-3 ${
                      activeSpecTab === tab.id
                        ? 'bg-[#c5a880] text-black font-semibold shadow-md shadow-[#c5a880]/15'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                    }`}
                  >
                    <span>{tab.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 hidden lg:inline-block" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Specifications visual panels representation */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSpecTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {activeSpecTab === 'mechanical' && (
                    <>
                      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between h-44 hover:border-gold-accent transition-colors duration-300">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Regulator Organ</span>
                        <div className="my-2">
                          <h3 className="font-serif text-3xl font-light text-white leading-none">Glucydur Balance</h3>
                          <p className="font-mono text-[10px] text-gold-accent mt-1">Invariable spring with micro-regulating screws</p>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans font-light">Vibrated to 300 microgram accuracy.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between h-44 hover:border-gold-accent transition-colors duration-300">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Tuning Escapement</span>
                        <div className="my-2">
                          <h3 className="font-serif text-3xl font-light text-white leading-none">Swiss Lever</h3>
                          <p className="font-mono text-[10px] text-gold-accent mt-1">Sintered sapphire pallet stones</p>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans font-light">Compacted palette lines for optimal impulse delivery.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between h-44 hover:border-gold-accent transition-colors duration-300">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Shock Absorption</span>
                        <div className="my-2">
                          <h3 className="font-serif text-3xl font-light text-white leading-none">Incabloc®</h3>
                          <p className="font-mono text-[10px] text-gold-accent mt-1">Double spring pivot axis protection</p>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans font-light">Tested to absorb impacts up to 5000g acceleration.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between h-44 hover:border-gold-accent transition-colors duration-300">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Finishing Standards</span>
                        <div className="my-2">
                          <h3 className="font-serif text-3xl font-light text-white leading-none">Côtes de Geneve</h3>
                          <p className="font-mono text-[10px] text-gold-accent mt-1">Exclusive linear parallel striping</p>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans font-light">Diamond-chamfered edges with brilliant contrast.</p>
                      </div>
                    </>
                  )}

                  {activeSpecTab === 'materials' && (
                    <>
                      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between h-44 hover:border-gold-accent transition-colors duration-300">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Bezel Armour</span>
                        <div className="my-2">
                          <h3 className="font-serif text-3xl font-light text-white leading-none">Hardness V-1000</h3>
                          <p className="font-mono text-[10px] text-gold-accent mt-1">Proprietary Vitreous Obsidian Composite</p>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans font-light">Twice the density of standard titanium formulations.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between h-44 hover:border-gold-accent transition-colors duration-300">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Face Optics</span>
                        <div className="my-2">
                          <h3 className="font-serif text-3xl font-light text-white leading-none">Ar-Coated Dome</h3>
                          <p className="font-mono text-[10px] text-gold-accent mt-1">9-Grade Corundum Sapphire</p>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans font-light">Seven chemical anti-reflection layers for invisibility index.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between h-44 hover:border-gold-accent transition-colors duration-300">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Magnetic Shield</span>
                        <div className="my-2">
                          <h3 className="font-serif text-3xl font-light text-white leading-none">4,800 A/m Range</h3>
                          <p className="font-mono text-[10px] text-gold-accent mt-1">Silicon non-magnetic balance hairspring</p>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans font-light">Retains high accuracy amidst laptop cores and smart fields.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between h-44 hover:border-gold-accent transition-colors duration-300">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Ambient Visibility</span>
                        <div className="my-2">
                          <h3 className="font-serif text-3xl font-light text-white leading-none">Super-LumiNova®</h3>
                          <p className="font-mono text-[10px] text-gold-accent mt-1">High Intensity Light Charge Compound</p>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans font-light">Custom gold-creme glow indexes active for eight hours.</p>
                      </div>
                    </>
                  )}

                  {activeSpecTab === 'dimensions' && (
                    <>
                      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between h-44 hover:border-gold-accent transition-colors duration-300">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Casing Diameter</span>
                        <div className="my-2">
                          <h3 className="font-serif text-3xl font-light text-white leading-none">42 mm Edition</h3>
                          <p className="font-mono text-[10px] text-gold-accent mt-1">Optional 40 mm also available globally</p>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans font-light">Bespoke lug design tailored to sit flatly on smaller scales.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between h-44 hover:border-gold-accent transition-colors duration-300">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Casing Profile</span>
                        <div className="my-2">
                          <h3 className="font-serif text-3xl font-light text-white leading-none">10.8 mm Slimness</h3>
                          <p className="font-mono text-[10px] text-gold-accent mt-1">Extremely compact full manual caliber specs</p>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans font-light">Rides smoothly under formal evening double-cuffs.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between h-44 hover:border-gold-accent transition-colors duration-300">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Lug-To-Lug Horizon</span>
                        <div className="my-2">
                          <h3 className="font-serif text-3xl font-light text-white leading-none">48.2 mm Length</h3>
                          <p className="font-mono text-[10px] text-gold-accent mt-1">Custom double-downward curved chassis lugs</p>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans font-light">Ensures centralized leverage and secure balanced grip.</p>
                      </div>

                      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between h-44 hover:border-gold-accent transition-colors duration-300">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Overall Weight</span>
                        <div className="my-2">
                          <h3 className="font-serif text-3xl font-light text-white leading-none">72 Grams Total</h3>
                          <p className="font-mono text-[10px] text-gold-accent mt-1">Extremely lightweight ergonomic composite density</p>
                        </div>
                        <p className="text-xs text-neutral-400 font-sans font-light">Maximizes formal wrist elegance without fatigue.</p>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Quick Stats overview items block */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-16 pt-16 border-t border-neutral-800/25 text-center">
            {WATCH_SPECS.map((spec) => (
              <div key={spec.id} className="flex flex-col gap-1 hover:brightness-125 transition-all">
                <span className="font-serif text-3xl md:text-4xl text-gold-accent font-light leading-none">{spec.value}</span>
                <span className="font-mono text-[9px] text-white tracking-widest uppercase mt-1">{spec.title}</span>
                <span className="text-[10px] text-neutral-500 font-light font-sans max-w-[130px] mx-auto mt-0.5 leading-tight">{spec.metric}</span>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* CALL TO ACTION COLLECTIBLE PANEL */}
      <section className="relative w-full bg-[#121212] py-24 text-white text-center border-t border-neutral-800/25 overflow-hidden">
        {/* Glow backdrop indicating watch preorder presence */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-950/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 z-10 flex flex-col items-center">
          <span className="font-mono text-xs text-gold-accent tracking-[0.25em] uppercase font-bold mb-4">LIMITED TO 100 COMMISSIONS</span>
          <h2 className="font-serif text-4xl sm:text-6xl text-white font-light tracking-wide leading-tight mb-6">
            CLAIM YOUR LEGACY COHORT
          </h2>
          <p className="text-neutral-400 font-sans text-sm md:text-base font-light max-w-2xl leading-relaxed mb-10">
            Each Élysée chronometer is serial engraved with its chronological issue number. Lock in your placement within our manufacture queue. Personal consultations follow via email instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              id="btn_main_order_initiate"
              onClick={() => setPreorderModalOpen(true)}
              className="cursor-pointer px-8 py-4 rounded-xl bg-gold-accent text-neutral-950 font-mono text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 shadow-xl shadow-gold-accent/10 flex items-center justify-center gap-3 group"
            >
              <span>INITIATE PRE-ORDER</span>
              <ArrowRight className="w-4 h-4 text-current transition-transform duration-300 group-hover:translate-x-2" />
            </button>

            <a
              href="#atelier"
              className="cursor-pointer px-8 py-4 rounded-xl border border-neutral-800 hover:border-neutral-500 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-neutral-300 hover:text-white transition-all duration-300 flex items-center justify-center"
            >
              PREVIEW ALLOY CUSTOMIZER
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="w-full bg-[#070707] py-12 text-center text-neutral-600 border-t border-neutral-900 font-mono text-[10px] tracking-wider uppercase">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gold-accent" />
            <span>Z E X A N   G E N È V E</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <span className="hover:text-neutral-400 transition-colors cursor-help">TERMS OF PATRONAGE</span>
            <span className="hover:text-neutral-400 transition-colors cursor-help">PRIVACY PROTOCOL</span>
            <span className="hover:text-neutral-400 transition-colors cursor-help">swiss workshop coordinates</span>
          </div>

          <div>
            <span>© 2026 ZEXAN CO. ALL RIGHTS SECURED</span>
          </div>
        </div>
      </footer>


      {/* PREORDER BOOKING MODAL PANEL & FORM VALIDATIONS */}
      <AnimatePresence>
        {preorderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="scroll-prevent w-full max-w-2xl bg-[#111111] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top sticky bar */}
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#c5a880]" />
                  <span className="font-mono text-xs font-semibold tracking-widest text-[#c5a880] uppercase">Z E X A N   C O M M I S S I O N</span>
                </div>
                <button
                  id="btn_modal_close"
                  onClick={() => setPreorderModalOpen(false)}
                  className="cursor-pointer text-neutral-500 hover:text-white transition-colors p-1 rounded-full bg-neutral-850 hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable content container for form inputs */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {!orderSubmitted ? (
                  <form onSubmit={handlePreorderSubmit} className="space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl text-white font-light tracking-wide uppercase">Preorder Specifications</h3>
                      <p className="text-neutral-400 font-sans text-xs mt-1">Configure options. Our representatives gather precise fittings later.</p>
                    </div>

                    {/* Options selection group info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Casing composite selection display */}
                      <div className="p-4 rounded-xl bg-[#1c1c1a]/55 border border-neutral-800">
                        <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block mb-1">Casing Alloy Selected</span>
                        <div className="flex items-center gap-2.5">
                          <span className={`inline-block w-4 h-4 rounded-full bg-gradient-to-tr ${selectedMaterial.caseColor}`} />
                          <span className="text-sm text-neutral-100 font-semibold">{selectedMaterial.name}</span>
                        </div>
                        <span className="font-mono text-[8px] text-[#c5a880] block mt-1 uppercase tracking-wider">{selectedMaterial.dialName}</span>
                      </div>

                      {/* Horizon sizes */}
                      <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                        <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block mb-2">Chassis Horizon Size</span>
                        <div className="flex gap-2">
                          {['40mm', '42mm'].map((size) => (
                            <button
                              key={size}
                              type="button"
                              id={`btn_form_size_${size}`}
                              onClick={() => setSelectedSize(size as any)}
                              className={`flex-1 py-1 px-3 text-center rounded font-mono text-xs transition-colors cursor-pointer ${
                                selectedSize === size
                                  ? 'bg-gold-accent text-neutral-950 font-bold'
                                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Engraving input string option */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-baseline">
                        <label className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider">Custom Engraving (Optional)</label>
                        <span className="font-mono text-[8px] text-neutral-600">{engravingText.length} / 18 CHARS</span>
                      </div>
                      <input
                        id="form_engraving"
                        type="text"
                        maxLength={18}
                        value={engravingText}
                        onChange={(e) => setEngravingText(e.target.value)}
                        placeholder="E.g. HORAE VII SWISS"
                        className="w-full bg-[#18181a] border border-neutral-800 rounded-lg px-4 py-3 text-sm font-mono text-[#c5a880] placeholder-stone-700 outline-none focus:border-gold-accent/50 focus:bg-[#1f1f22] transition-all"
                      />
                    </div>

                    <div className="border-t border-neutral-800/80 pt-6">
                      <h4 className="font-serif text-lg text-white font-light tracking-wide uppercase mb-4">Patron Demographics</h4>
                      
                      <div className="space-y-4">
                        {/* Name Input */}
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider">Patron Full Name *</label>
                          <input
                            id="form_fullname"
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Lord / Lady Chancellor"
                            className={`w-full bg-[#18181a] border ${formErrors.name ? 'border-red-500' : 'border-neutral-800'} rounded-lg px-4 py-3 text-sm text-neutral-100 placeholder-neutral-700 outline-none focus:border-gold-accent/40`}
                          />
                          {formErrors.name && <span className="font-mono text-[8px] text-red-400 mt-0.5">{formErrors.name}</span>}
                        </div>

                        {/* Email & Phone grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider">Contact Email *</label>
                            <input
                              id="form_email"
                              type="email"
                              value={customerEmail}
                              onChange={(e) => setCustomerEmail(e.target.value)}
                              placeholder="chancellor@atelier-zexan.ch"
                              className={`w-full bg-[#18181a] border ${formErrors.email ? 'border-red-500' : 'border-neutral-800'} rounded-lg px-4 py-3 text-sm text-neutral-100 placeholder-neutral-700 outline-none focus:border-gold-accent/40`}
                            />
                            {formErrors.email && <span className="font-mono text-[8px] text-red-400 mt-0.5">{formErrors.email}</span>}
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider">Mobile Number *</label>
                            <input
                              id="form_phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+41 22 123 4567"
                              className={`w-full bg-[#18181a] border ${formErrors.phone ? 'border-red-500' : 'border-neutral-800'} rounded-lg px-4 py-3 text-sm text-neutral-100 placeholder-neutral-700 outline-none focus:border-gold-accent/40`}
                            />
                            {formErrors.phone && <span className="font-mono text-[8px] text-red-400 mt-0.5">{formErrors.phone}</span>}
                          </div>
                        </div>

                        {/* Sovereign Location Dropdown selection */}
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider">Country of Citizenship</label>
                          <select
                            id="form_country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-[#18181a] border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-300 outline-none focus:border-gold-accent/40 cursor-pointer text-left"
                          >
                            <option value="Switzerland">Switzerland (Confoederatio Helvetica)</option>
                            <option value="United Kingdom">United Kingdom (Great Britain)</option>
                            <option value="United States">United States of America</option>
                            <option value="Japan">Japan (Nippon)</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                            <option value="Germany">Germany (Bundesrepublik)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="btn_form_submit"
                      className="cursor-pointer w-full py-4 rounded-xl bg-gold-accent text-neutral-950 font-mono text-xs font-bold uppercase tracking-[0.25em] hover:brightness-110 shadow-lg shadow-gold-accent/15 transition-all mt-6"
                    >
                      COMMIT COMMISSION PLACEMENT
                    </button>
                  </form>
                ) : (
                  // Success representation card
                  <div className="py-12 text-center flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                      <CheckCircle2 className="w-8 h-8 stroke-[1.5px]" />
                    </div>

                    <div className="space-y-2">
                      <span className="font-mono text-xs text-gold-accent tracking-widest font-semibold uppercase">COMMISSION LOCKED</span>
                      <h3 className="font-serif text-3xl text-white font-light tracking-wide">ZEXAN REFERENCE ENGRAVED</h3>
                      <p className="text-[#a59480] font-mono text-[10px] tracking-wider uppercase font-semibold">
                        Issue Allocation: No. {Math.floor(Math.random() * 85) + 15} / 100
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 max-w-md text-left text-xs text-neutral-400 font-sans font-light leading-relaxed space-y-3">
                      <p>
                        We have recorded your allocation for the <span className="text-neutral-100 font-semibold">{selectedMaterial.name}</span> composite under name <span className="text-white font-medium">{customerName}</span>.
                      </p>
                      {engravingText && (
                        <p>
                          Your localized chronological engraving is scheduled as: <span className="font-mono text-[#c5a880] bg-[#1a1a1c] px-2 py-0.5 rounded border border-neutral-800">{engravingText.toUpperCase()}</span>.
                        </p>
                      )}
                      <p className="border-t border-neutral-800 pt-2 text-[11px]">
                        A Swiss Zexan horologist specialist will call you at <span className="text-white font-medium">{phone}</span> inside 2 hours to coordinate dimensions, optional strap sizes, and secure logistics deposit.
                      </p>
                    </div>

                    <button
                      type="button"
                      id="btn_success_complete"
                      onClick={handleResetForm}
                      className="cursor-pointer px-6 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono text-xs font-medium uppercase tracking-wider hover:text-white hover:border-neutral-500 transition-all shadow-md"
                    >
                      Return to Gallery
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
