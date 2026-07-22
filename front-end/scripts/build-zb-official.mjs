/**
 * 1) Traça referência oficial → silhueta
 * 2) Suaviza e monta suite de assets ZB (fidelidade à imagem)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import ImageTracer from 'imagetracerjs';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.resolve(__dirname, '../src/assets/brand');
const publicDir = path.resolve(__dirname, '../public');
const refSrc = path.join(brandDir, 'reference-official.png');
const refClean = path.join(brandDir, '_ref-clean.png');

const VB = 128;
const PAD = 26;

async function ensureCleanPng() {
  await sharp(refSrc).png().toFile(refClean);
}

async function traceSilhouette() {
  const { data, info } = await sharp(refClean)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const imgData = { width, height, data: new Uint8ClampedArray(width * height * 4) };

  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (width * y + x) * info.channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const isLogo = lum > 24 || b > 48 || (g > 42 && b > 35);
      const v = isLogo ? 0 : 255;
      const o = (width * y + x) << 2;
      imgData.data[o] = v;
      imgData.data[o + 1] = v;
      imgData.data[o + 2] = v;
      imgData.data[o + 3] = 255;
      if (isLogo) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  const svg = ImageTracer.imagedataToSVG(imgData, {
    ltres: 0.55,
    qtres: 0.55,
    pathomit: 6,
    rightangleenhance: false,
    colorsampling: 0,
    numberofcolors: 2,
    mincolorratio: 0,
    colorquantcycles: 1,
    blurradius: 0,
    strokewidth: 0,
    linefilter: true,
    scale: 1,
    roundcoords: 2,
    viewbox: true,
    desc: false,
  });

  const match = svg.match(/fill="rgb\(0,0,0\)"[^>]*d="([^"]+)"/);
  if (!match) throw new Error('Logo path missing');
  return { pathD: match[1], bbox: { minX, minY, maxX, maxY } };
}

function transformPath(d, bbox) {
  const srcW = bbox.maxX - bbox.minX;
  const srcH = bbox.maxY - bbox.minY;
  const inner = VB - PAD * 2;
  const scale = Math.min(inner / srcW, inner / srcH);
  const usedW = srcW * scale;
  const usedH = srcH * scale;
  const ox = (VB - usedW) / 2 - bbox.minX * scale;
  const oy = (VB - usedH) / 2 - bbox.minY * scale;

  const tokens = d.match(/[MmLlHhVvCcQqTtSsAaZz]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g);
  if (!tokens) throw new Error('tokenize fail');

  let i = 0;
  let cmd = '';
  let out = [];
  let relative = false;
  let lastX = 0;
  let lastY = 0;
  const mapX = (x) => +(x * scale + ox).toFixed(2);
  const mapY = (y) => +(y * scale + oy).toFixed(2);

  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[MmLlHhVvCcQqTtSsAaZz]$/.test(t)) {
      cmd = t;
      relative = cmd === cmd.toLowerCase() && cmd !== 'z' && cmd !== 'Z';
      out.push(cmd.toUpperCase() === 'Z' ? 'Z' : cmd.toUpperCase());
      i++;
      if (cmd === 'z' || cmd === 'Z') continue;
    }
    const c = cmd.toUpperCase();
    if (c === 'M' || c === 'L' || c === 'T') {
      while (i < tokens.length && !/^[MmLlHhVvCcQqTtSsAaZz]$/.test(tokens[i])) {
        let x = parseFloat(tokens[i++]);
        let y = parseFloat(tokens[i++]);
        if (relative) {
          x += lastX;
          y += lastY;
        }
        lastX = x;
        lastY = y;
        out.push(mapX(x), mapY(y));
        if (c === 'M') cmd = relative ? 'l' : 'L';
      }
    } else if (c === 'H') {
      while (i < tokens.length && !/^[MmLlHhVvCcQqTtSsAaZz]$/.test(tokens[i])) {
        let x = parseFloat(tokens[i++]);
        if (relative) x += lastX;
        lastX = x;
        out.push(mapX(x));
      }
    } else if (c === 'V') {
      while (i < tokens.length && !/^[MmLlHhVvCcQqTtSsAaZz]$/.test(tokens[i])) {
        let y = parseFloat(tokens[i++]);
        if (relative) y += lastY;
        lastY = y;
        out.push(mapY(y));
      }
    } else if (c === 'C') {
      while (i < tokens.length && !/^[MmLlHhVvCcQqTtSsAaZz]$/.test(tokens[i])) {
        const pts = [];
        for (let k = 0; k < 6; k++) pts.push(parseFloat(tokens[i++]));
        if (relative) {
          for (let k = 0; k < 6; k += 2) {
            pts[k] += lastX;
            pts[k + 1] += lastY;
          }
        }
        lastX = pts[4];
        lastY = pts[5];
        out.push(mapX(pts[0]), mapY(pts[1]), mapX(pts[2]), mapY(pts[3]), mapX(pts[4]), mapY(pts[5]));
      }
    } else if (c === 'Q' || c === 'S') {
      while (i < tokens.length && !/^[MmLlHhVvCcQqTtSsAaZz]$/.test(tokens[i])) {
        const pts = [];
        for (let k = 0; k < 4; k++) pts.push(parseFloat(tokens[i++]));
        if (relative) {
          for (let k = 0; k < 4; k += 2) {
            pts[k] += lastX;
            pts[k + 1] += lastY;
          }
        }
        lastX = pts[2];
        lastY = pts[3];
        out.push(mapX(pts[0]), mapY(pts[1]), mapX(pts[2]), mapY(pts[3]));
      }
    } else throw new Error(`cmd ${cmd}`);
  }

  let s = '';
  for (const part of out) {
    if (typeof part === 'string') s += (s.endsWith(' ') || !s ? '' : ' ') + part + (part === 'Z' ? ' ' : ' ');
    else s += part + ' ';
  }
  return s.trim().replace(/  +/g, ' ');
}

async function sampleColors() {
  const { data, info } = await sharp(refClean).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const ch = info.channels;
  const at = (x, y) => {
    const i = (y * w + x) * ch;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const hex = ([r, g, b]) =>
    `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

  // Amostra pontos claros (topo) e profundos (base / dobra)
  const samples = {
    top: hex(at(360, 250)),
    mid: hex(at(560, 450)),
    right: hex(at(740, 520)),
    bottom: hex(at(600, 740)),
    fold: hex(at(480, 680)),
  };
  return samples;
}

function defsBlock(samples) {
  // Gradiente alinhado à referência: ciano luminoso → azul royal → cobalto
  // Mistura amostras reais com reforço do ciano do topo da marca oficial
  return `
  <linearGradient id="zbGrad" x1="24" y1="20" x2="110" y2="114" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#3DDFFF"/>
    <stop offset="22%" stop-color="${samples.top}"/>
    <stop offset="55%" stop-color="${samples.mid}"/>
    <stop offset="78%" stop-color="${samples.right}"/>
    <stop offset="100%" stop-color="${samples.bottom}"/>
  </linearGradient>
  <linearGradient id="zbFold" x1="40" y1="55" x2="85" y2="105" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#001433" stop-opacity="0"/>
    <stop offset="45%" stop-color="#001A44" stop-opacity="0.28"/>
    <stop offset="100%" stop-color="#000C28" stop-opacity="0.42"/>
  </linearGradient>
  <radialGradient id="zbBgGlow" cx="50%" cy="42%" r="55%">
    <stop offset="0%" stop-color="#101828"/>
    <stop offset="100%" stop-color="#05080F" stop-opacity="0"/>
  </radialGradient>
  <filter id="zbSoft" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceAlpha" stdDeviation="0.35" result="b"/>
    <feOffset dy="0.4" result="o"/>
    <feFlood flood-color="#001028" flood-opacity="0.25"/>
    <feComposite in2="o" operator="in"/>
    <feMerge>
      <feMergeNode/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>`;
}

function markGroup(pathD, { folds = true } = {}) {
  // Sombras de dobra da referência (sobreposições do ribbon) — clipadas ao path
  const foldLayer = folds
    ? `<g opacity="0.9">
    <path d="${pathD}" fill="url(#zbFold)" clip-path="url(#zbClip)"/>
  </g>`
    : '';
  return `
  <defs>
    <clipPath id="zbClip"><path d="${pathD}"/></clipPath>
  </defs>
  <g filter="url(#zbSoft)">
    <path d="${pathD}" fill="url(#zbGrad)"/>
    ${foldLayer}
  </g>`;
}

function symbolSvg(pathD, samples, { bg = null, solid = null, folds = true } = {}) {
  if (solid) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none" role="img" aria-hidden="true">
  <path d="${pathD}" fill="${solid}"/>
</svg>
`;
  }
  const bgLayer = bg
    ? `<rect width="128" height="128" rx="28" fill="${bg}"/>
  <rect width="128" height="128" rx="28" fill="url(#zbBgGlow)"/>`
    : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none" role="img" aria-hidden="true">
  <defs>${defsBlock(samples)}</defs>
  ${bgLayer}
  ${markGroup(pathD, { folds })}
</svg>
`;
}

function horizontalLogo(pathD, samples, dark = true) {
  const zap = dark ? '#FFFFFF' : '#0A1628';
  const business = dark ? '#14B4EE' : '#0072BB';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 72" fill="none" role="img" aria-hidden="true">
  <defs>${defsBlock(samples)}</defs>
  <g transform="translate(0,-4) scale(0.62)">
    ${markGroup(pathD)}
  </g>
  <text x="92" y="46" font-family="Plus Jakarta Sans, system-ui, sans-serif" font-size="28" font-weight="600" letter-spacing="-0.02em">
    <tspan fill="${zap}">Zap</tspan><tspan fill="${business}">Business</tspan>
  </text>
</svg>
`;
}

function verticalLogo(pathD, samples, dark = true) {
  const zap = dark ? '#FFFFFF' : '#0A1628';
  const business = dark ? '#14B4EE' : '#0072BB';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 210" fill="none" role="img" aria-hidden="true">
  <defs>${defsBlock(samples)}</defs>
  <g transform="translate(16,6)">
    ${markGroup(pathD)}
  </g>
  <text x="80" y="178" text-anchor="middle" font-family="Plus Jakarta Sans, system-ui, sans-serif" font-size="22" font-weight="600" letter-spacing="-0.02em">
    <tspan fill="${zap}">Zap</tspan><tspan fill="${business}">Business</tspan>
  </text>
</svg>
`;
}

async function rasterize(page, svgContent, outPath, size, height = size) {
  const html = `<!doctype html><html><body style="margin:0;background:transparent">
    <div id="c" style="width:${size}px;height:${height}px">${svgContent.replace(
      '<svg',
      `<svg width="${size}" height="${height}"`,
    )}</div>
  </body></html>`;
  await page.setViewportSize({ width: size, height });
  await page.setContent(html, { waitUntil: 'load' });
  await page.locator('#c').screenshot({ path: outPath, omitBackground: true });
}

function writeIcoFromPng(pngPath, icoPath) {
  const png = fs.readFileSync(pngPath);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);
  fs.writeFileSync(icoPath, Buffer.concat([header, entry, png]));
}

async function main() {
  fs.mkdirSync(brandDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  await ensureCleanPng();
  const { pathD: raw, bbox } = await traceSilhouette();
  const pathD = transformPath(raw, bbox);
  const samples = await sampleColors();
  console.log('samples', samples, 'bbox', bbox);

  fs.writeFileSync(path.join(brandDir, '_zb-path.txt'), pathD, 'utf8');

  const withBg = symbolSvg(pathD, samples, { bg: '#05080F' });
  const noBg = symbolSvg(pathD, samples, { bg: null });
  const lightBg = symbolSvg(pathD, samples, { bg: '#F4F8FC', folds: false });

  const files = {
    'zb-symbol.svg': withBg,
    'zb-symbol-dark.svg': withBg,
    'zb-symbol-light.svg': noBg,
    'zb-monogram.svg': noBg,
    'zb-horizontal.svg': horizontalLogo(pathD, samples, true),
    'zb-vertical.svg': verticalLogo(pathD, samples, true),
    'symbol.svg': withBg,
    'app-icon.svg': withBg,
    'logo-horizontal.svg': horizontalLogo(pathD, samples, true),
    'logo-horizontal-light.svg': horizontalLogo(pathD, samples, false),
    'logo-vertical.svg': verticalLogo(pathD, samples, true),
    'logo-vertical-light.svg': verticalLogo(pathD, samples, false),
    'logo-dark.svg': horizontalLogo(pathD, samples, true),
    'logo-light.svg': horizontalLogo(pathD, samples, false),
    'symbol-mono-light.svg': symbolSvg(pathD, samples, { solid: '#F4F8FC' }),
    'symbol-mono-dark.svg': symbolSvg(pathD, samples, { solid: '#0A1628' }),
    'zapbusiness-symbol.svg': withBg,
    'zapbusiness-logo.svg': horizontalLogo(pathD, samples, true),
    'zapbusiness-logo-dark.svg': horizontalLogo(pathD, samples, true),
    'zapbusiness-logo-light.svg': horizontalLogo(pathD, samples, false),
  };

  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(brandDir, name), content.trim() + '\n', 'utf8');
    console.log('wrote', name);
  }

  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), withBg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), withBg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'pwa-192x192.svg'), withBg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'pwa-512x512.svg'), withBg, 'utf8');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const rasters = [
    ['favicon-16.png', 16],
    ['favicon-32.png', 32],
    ['favicon-48.png', 48],
    ['favicon-64.png', 64],
    ['app-icon-128.png', 128],
    ['app-icon-192.png', 192],
    ['app-icon-256.png', 256],
    ['app-icon-512.png', 512],
    ['android-chrome-192x192.png', 192],
    ['android-chrome-512x512.png', 512],
    ['pwa-192x192.png', 192],
    ['pwa-512x512.png', 512],
    ['apple-touch-icon.png', 180],
  ];

  for (const [file, size] of rasters) {
    await rasterize(page, withBg, path.join(publicDir, file), size);
    console.log('raster', file);
  }

  for (const size of [128, 192, 256, 512]) {
    await rasterize(page, withBg, path.join(brandDir, `app-icon-${size}.png`), size);
  }
  await rasterize(page, noBg, path.join(brandDir, 'zb-monogram-512.png'), 512);
  await rasterize(page, withBg, path.join(brandDir, 'zb-symbol-512.png'), 512);

  // Comparação lado a lado
  await page.setViewportSize({ width: 680, height: 360 });
  await page.setContent(
    `<!doctype html><html><body style="margin:0;display:flex;gap:20px;padding:20px;background:#0a0a0a;align-items:center">
      <img src="file:///${refClean.replace(/\\/g, '/')}" width="320" height="320" style="border-radius:28px"/>
      <img src="file:///${path.join(brandDir, 'zb-symbol-512.png').replace(/\\/g, '/')}" width="320" height="320"/>
    </body></html>`,
    { waitUntil: 'load' },
  );
  await page.screenshot({ path: path.join(brandDir, '_compare-ref-vs-svg.png') });
  console.log('wrote _compare-ref-vs-svg.png');

  await browser.close();
  writeIcoFromPng(path.join(publicDir, 'favicon-32.png'), path.join(publicDir, 'favicon.ico'));
  console.log('ZB_OFFICIAL_OK');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
