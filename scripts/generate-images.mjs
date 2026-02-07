/**
 * Generate cinematic placeholder images for The Real Americans website.
 * Creates character portraits, scene images, and location backgrounds.
 * Run: node scripts/generate-images.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join } from 'path';

const OUT = join(import.meta.dirname, '..', 'public', 'images');
mkdirSync(join(OUT, 'characters'), { recursive: true });
mkdirSync(join(OUT, 'world'), { recursive: true });

// ── Helpers ──────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function darken({ r, g, b }, factor = 0.3) {
  return { r: Math.round(r * factor), g: Math.round(g * factor), b: Math.round(b * factor) };
}

function lighten({ r, g, b }, factor = 1.4) {
  return {
    r: Math.min(255, Math.round(r * factor)),
    g: Math.min(255, Math.round(g * factor)),
    b: Math.min(255, Math.round(b * factor)),
  };
}

/**
 * Create a cinematic portrait-style image (3:4 ratio)
 * Dark moody gradient with accent color glow, text overlay via SVG
 */
async function createPortrait(filename, { accent, name, subtitle, w = 600, h = 800 }) {
  const rgb = hexToRgb(accent);
  const dark = darken(rgb, 0.15);
  const glow = lighten(rgb, 1.2);

  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g1" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="rgb(${rgb.r},${rgb.g},${rgb.b})" stop-opacity="0.4"/>
        <stop offset="60%" stop-color="rgb(${dark.r},${dark.g},${dark.b})" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#0a0a12" stop-opacity="1"/>
      </radialGradient>
      <radialGradient id="g2" cx="30%" cy="70%" r="50%">
        <stop offset="0%" stop-color="rgb(${glow.r},${glow.g},${glow.b})" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a0a12" stop-opacity="0.6"/>
        <stop offset="40%" stop-color="transparent" stop-opacity="0"/>
        <stop offset="70%" stop-color="transparent" stop-opacity="0"/>
        <stop offset="100%" stop-color="#0a0a12" stop-opacity="0.9"/>
      </linearGradient>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feBlend in="SourceGraphic" mode="multiply" result="blend"/>
      </filter>
    </defs>
    <rect width="${w}" height="${h}" fill="#0a0a12"/>
    <rect width="${w}" height="${h}" fill="url(#g1)"/>
    <rect width="${w}" height="${h}" fill="url(#g2)"/>
    <ellipse cx="${w * 0.5}" cy="${h * 0.35}" rx="${w * 0.25}" ry="${h * 0.2}" fill="rgb(${rgb.r},${rgb.g},${rgb.b})" opacity="0.08"/>
    <ellipse cx="${w * 0.4}" cy="${h * 0.6}" rx="${w * 0.15}" ry="${h * 0.12}" fill="rgb(${glow.r},${glow.g},${glow.b})" opacity="0.06"/>
    <rect width="${w}" height="${h}" fill="url(#g3)"/>
    <!-- Silhouette hint -->
    <ellipse cx="${w * 0.5}" cy="${h * 0.38}" rx="${w * 0.18}" ry="${h * 0.22}" fill="rgb(${dark.r},${dark.g},${dark.b})" opacity="0.5"/>
    <rect x="${w * 0.35}" y="${h * 0.55}" width="${w * 0.3}" height="${h * 0.3}" rx="4" fill="rgb(${dark.r},${dark.g},${dark.b})" opacity="0.3"/>
    <!-- Text -->
    <text x="${w * 0.5}" y="${h * 0.88}" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="${w * 0.1}" fill="rgb(${rgb.r},${rgb.g},${rgb.b})" opacity="0.7" letter-spacing="4">${name.toUpperCase()}</text>
    <text x="${w * 0.5}" y="${h * 0.93}" text-anchor="middle" font-family="sans-serif" font-weight="400" font-size="${w * 0.035}" fill="white" opacity="0.3" letter-spacing="6">${subtitle.toUpperCase()}</text>
    <!-- Film grain overlay -->
    <rect width="${w}" height="${h}" opacity="0.04" filter="url(#noise)"/>
    <!-- Accent line -->
    <rect x="${w * 0.3}" y="${h * 0.83}" width="${w * 0.4}" height="2" fill="rgb(${rgb.r},${rgb.g},${rgb.b})" opacity="0.5"/>
  </svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(join(OUT, filename));
  console.log(`  ✓ ${filename}`);
}

/**
 * Create a cinematic scene/landscape image (4:3 ratio)
 */
async function createScene(filename, { accent, label, w = 800, h = 600 }) {
  const rgb = hexToRgb(accent);
  const dark = darken(rgb, 0.2);

  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgb(${dark.r},${dark.g},${dark.b})"/>
        <stop offset="50%" stop-color="rgb(${rgb.r},${rgb.g},${rgb.b})" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#0a0a12"/>
      </linearGradient>
      <radialGradient id="sun" cx="60%" cy="45%" r="30%">
        <stop offset="0%" stop-color="rgb(${rgb.r},${rgb.g},${rgb.b})" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a0a12" stop-opacity="0.5"/>
        <stop offset="30%" stop-color="transparent"/>
        <stop offset="75%" stop-color="transparent"/>
        <stop offset="100%" stop-color="#0a0a12" stop-opacity="0.7"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#sky)"/>
    <rect width="${w}" height="${h}" fill="url(#sun)"/>
    <!-- Horizon line elements -->
    <path d="M0 ${h * 0.55} Q${w * 0.25} ${h * 0.48} ${w * 0.5} ${h * 0.52} T${w} ${h * 0.5} V${h} H0 Z" fill="rgb(${dark.r},${dark.g},${dark.b})" opacity="0.6"/>
    <path d="M0 ${h * 0.6} Q${w * 0.3} ${h * 0.55} ${w * 0.6} ${h * 0.58} T${w} ${h * 0.56} V${h} H0 Z" fill="#0a0a12" opacity="0.5"/>
    <!-- Small detail elements -->
    <rect x="${w * 0.15}" y="${h * 0.48}" width="3" height="${h * 0.08}" fill="rgb(${rgb.r},${rgb.g},${rgb.b})" opacity="0.3"/>
    <rect x="${w * 0.7}" y="${h * 0.45}" width="4" height="${h * 0.1}" fill="rgb(${rgb.r},${rgb.g},${rgb.b})" opacity="0.2"/>
    <rect x="${w * 0.72}" y="${h * 0.44}" width="3" height="${h * 0.11}" fill="rgb(${rgb.r},${rgb.g},${rgb.b})" opacity="0.15"/>
    <!-- Vignette -->
    <rect width="${w}" height="${h}" fill="url(#vignette)"/>
    <!-- Label -->
    <text x="${w * 0.5}" y="${h * 0.92}" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="${w * 0.025}" fill="white" opacity="0.25" letter-spacing="4">${label.toUpperCase()}</text>
  </svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(join(OUT, filename));
  console.log(`  ✓ ${filename}`);
}

/**
 * Create a world location image (16:10 ratio, wider)
 */
async function createLocation(filename, { colors, label, w = 1200, h = 750 }) {
  const rgb1 = hexToRgb(colors[0]);
  const rgb2 = hexToRgb(colors[1]);
  const dark = darken(rgb1, 0.15);

  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgb(${dark.r},${dark.g},${dark.b})"/>
        <stop offset="50%" stop-color="#111117"/>
        <stop offset="100%" stop-color="#0a0a12"/>
      </linearGradient>
      <radialGradient id="glow1" cx="35%" cy="50%" r="40%">
        <stop offset="0%" stop-color="rgb(${rgb1.r},${rgb1.g},${rgb1.b})" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <radialGradient id="glow2" cx="70%" cy="40%" r="35%">
        <stop offset="0%" stop-color="rgb(${rgb2.r},${rgb2.g},${rgb2.b})" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <linearGradient id="vig" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a0a12" stop-opacity="0.4"/>
        <stop offset="40%" stop-color="transparent"/>
        <stop offset="65%" stop-color="transparent"/>
        <stop offset="100%" stop-color="#0a0a12" stop-opacity="0.8"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect width="${w}" height="${h}" fill="url(#glow1)"/>
    <rect width="${w}" height="${h}" fill="url(#glow2)"/>
    <!-- Architecture hints -->
    <rect x="${w * 0.1}" y="${h * 0.3}" width="${w * 0.12}" height="${h * 0.5}" rx="2" fill="rgb(${rgb1.r},${rgb1.g},${rgb1.b})" opacity="0.07"/>
    <rect x="${w * 0.25}" y="${h * 0.25}" width="${w * 0.08}" height="${h * 0.55}" rx="2" fill="rgb(${rgb1.r},${rgb1.g},${rgb1.b})" opacity="0.05"/>
    <rect x="${w * 0.6}" y="${h * 0.2}" width="${w * 0.15}" height="${h * 0.6}" rx="2" fill="rgb(${rgb2.r},${rgb2.g},${rgb2.b})" opacity="0.06"/>
    <rect x="${w * 0.8}" y="${h * 0.35}" width="${w * 0.1}" height="${h * 0.45}" rx="2" fill="rgb(${rgb2.r},${rgb2.g},${rgb2.b})" opacity="0.04"/>
    <!-- Ground plane -->
    <path d="M0 ${h * 0.7} L${w} ${h * 0.65} V${h} H0 Z" fill="rgb(${dark.r},${dark.g},${dark.b})" opacity="0.4"/>
    <!-- Horizon glow -->
    <ellipse cx="${w * 0.5}" cy="${h * 0.65}" rx="${w * 0.5}" ry="40" fill="rgb(${rgb1.r},${rgb1.g},${rgb1.b})" opacity="0.1"/>
    <rect width="${w}" height="${h}" fill="url(#vig)"/>
    <!-- Title -->
    <text x="${w * 0.5}" y="${h * 0.5}" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="${w * 0.06}" fill="white" opacity="0.08" letter-spacing="8">${label.toUpperCase()}</text>
    <text x="${w * 0.5}" y="${h * 0.56}" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="${w * 0.018}" fill="rgb(${rgb1.r},${rgb1.g},${rgb1.b})" opacity="0.3" letter-spacing="6">THE REAL AMERICANS</text>
  </svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(join(OUT, filename));
  console.log(`  ✓ ${filename}`);
}

// ── Generate All Images ──────────────────────────────────
async function main() {
  console.log('Generating character portraits...');

  const characters = [
    { id: 'coodles', accent: '#ff6b9d', name: 'Coodles', role: 'Smiling Badass Sis' },
    { id: 'jimbo-jr', accent: '#4a9eff', name: 'Jimbo Jr', role: 'Hothead Older Bro' },
    { id: 'jimbob', accent: '#ff8c42', name: 'Jimbob', role: 'Meathead Dad' },
    { id: 'granny-betty', accent: '#e85d75', name: 'Granny Betty', role: 'Boomer Karen' },
    { id: 'pappy-merle', accent: '#c9a227', name: 'Pappy Merle', role: 'Conspiracy Grandpa' },
    { id: 'pete-perez', accent: '#9b59b6', name: 'Pete Perez', role: 'Angry Weapons Nerd' },
    { id: 'susan', accent: '#2ecc71', name: 'Susan', role: 'Drunk Alien Liability' },
    { id: 'tiberius', accent: '#f39c12', name: 'Tiberius', role: 'Do Not Pet' },
  ];

  // Character portraits (3:4) - main image
  for (const c of characters) {
    await createPortrait(`characters/${c.id}-portrait.jpg`, {
      accent: c.accent, name: c.name, subtitle: c.role,
    });
  }

  console.log('\nGenerating character scenes...');

  // Scene images (4:3) - inline and secondary images
  const sceneLabels = [
    ['coodles', '#ff6b9d', 'Mid-firefight selfie', 'Kiddie pool aftermath'],
    ['jimbo-jr', '#4a9eff', 'The burning plan', 'Shielding the family'],
    ['jimbob', '#ff8c42', 'Alien welding shop', 'Rocket lawnmower'],
    ['granny-betty', '#e85d75', 'Wiping the counter', 'Behind the bar'],
    ['pappy-merle', '#c9a227', 'Moonshine weapon', 'Sack-headed philosopher'],
    ['pete-perez', '#9b59b6', 'Nose to nose', 'Back to back'],
    ['susan', '#2ecc71', 'Martian tech', 'Confused amid chaos'],
    ['tiberius', '#f39c12', 'Innocent Tiberius', 'Battlefield aftermath'],
  ];

  for (const [id, accent, label1, label2] of sceneLabels) {
    await createScene(`characters/${id}-scene-1.jpg`, { accent, label: label1 });
    await createScene(`characters/${id}-scene-2.jpg`, { accent, label: label2 });
  }

  console.log('\nGenerating world locations...');

  await createLocation('world/bettys-bar.jpg', {
    colors: ['#8B4513', '#D2691E'], label: "Betty's Bar",
  });
  await createLocation('world/roughneck-acres.jpg', {
    colors: ['#c1440e', '#e67e22'], label: 'Roughneck Acres',
  });
  await createLocation('world/martian-front.jpg', {
    colors: ['#1a5c3a', '#27ae60'], label: 'The Martian Front',
  });

  console.log('\nDone! All images generated.');
}

main().catch(console.error);
