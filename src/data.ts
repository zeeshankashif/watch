export interface WatchMaterial {
  id: string;
  name: string;
  caseColor: string; // Tailwind color or custom style
  glowColor: string;
  accentHex: string;
  dialName: string;
  strapMaterial: string;
  description: string;
}

export interface WatchSpec {
  id: string;
  title: string;
  value: string;
  metric: string;
}

export const WATCH_MATERIALS: WatchMaterial[] = [
  {
    id: 'carbon-obsidian',
    name: 'Obsidian Black',
    caseColor: 'from-[#0d0d0d] to-[#1e1c1a]',
    glowColor: 'shadow-red-950/20',
    accentHex: '#c5a880',
    dialName: 'Deep Matte Obsidian Carbonite',
    strapMaterial: 'Hand-stitched Tuscan calf leather',
    description: 'Forged from ultra-dense obsidian carbon compound, displaying deep crystalline grain textures matching tactical stealth with haute horlogerie.'
  },
  {
    id: 'aurum-satin',
    name: 'Satin Rose Gold',
    caseColor: 'from-[#2e2620] to-[#45372d]',
    glowColor: 'shadow-amber-950/20',
    accentHex: '#e5c19d',
    dialName: 'Brushed Rose-gold Guilloché',
    strapMaterial: 'Matte black premium Louisiana alligator',
    description: 'A 18k modern rose gold alloy treated with micromachined satin-brush strokes for an exquisite lustre that catches light with unparalleled warmth.'
  },
  {
    id: 'platinum-brushed',
    name: 'Brushed Platinum d\’Élysée',
    caseColor: 'from-[#1a1c1e] to-[#2c2f33]',
    glowColor: 'shadow-slate-900/10',
    accentHex: '#d8dee9',
    dialName: 'Open-worked Silver Skeleton',
    strapMaterial: 'Brushed grade 5 titanium integrated link',
    description: 'A sovereign platinum formulation of extreme purity, styled with elegant hand-chamfered bridges revealing the caliber’s core gear trains.'
  }
];

export const WATCH_SPECS: WatchSpec[] = [
  {
    id: 'calibre',
    title: 'Calibre Zexan',
    value: 'Z-9912',
    metric: 'Manufacture hand-wound movement'
  },
  {
    id: 'frequency',
    title: 'Precision Frequency',
    value: '36,000',
    metric: 'Vibrations per hour (5 Hz)'
  },
  {
    id: 'power',
    title: 'Power Reserve',
    value: '72',
    metric: 'Hours active reserve (twin barrels)'
  },
  {
    id: 'jewels',
    title: 'Jewel Count',
    value: '34',
    metric: 'Rubies on custom gold-chatons'
  },
  {
    id: 'water',
    title: 'Water Resistance',
    value: '100',
    metric: 'Meters with screw-down crown'
  },
  {
    id: 'tolerance',
    title: 'Daily Tolerance',
    value: '± 1',
    metric: 'Seconds deviation per day'
  }
];

export const EDITORIAL_BLOCKS = [
  {
    title: "THE PHILOSOPHY OF ABSOLUTE PRECISION",
    subtitle: "A modern monolith of pure horology, crafted without compromise.",
    paragraph1: "Every tick of the Calibre M-9912 represents an absolute devotion to micro-mechanical perfection. Crafted inside our remote Swiss Jura workshop, our master horologists spend upwards of 240 hours hand-finishing each carbon bridge, utilizing traditional anglage techniques that reflect light with pristine uniformity.",
    paragraph2: "We designed the Élysée Obsidienne around a single unified concept: temporal silence. It represents the quiet, relentless motion of time shaped in high-tech architectural materials, creating a stark but mesmerizing contrast on your wrist."
  },
  {
    title: "AN EXTRAORDINARY ALLOY REVEALED",
    subtitle: "Where space-age resilience meets historic decorative arts.",
    paragraph1: "The watch's external casing features our proprietary dense-crystalline obsidian composite, carbonites sintered under high pressures to mimic natural volcanic crystallization. This makes the exterior virtually scratch-proof while retaining an organic, tactile grain structure that ensures no two luxury watches in this collection are ever identical.",
    paragraph2: "Protected by an anti-reflective double-domed sapphire crystal, the matte-brushed dial relies on architectural levels of depth to suspend the elegant faceted hands, creating a miniature canyon of light and shadow."
  }
];
