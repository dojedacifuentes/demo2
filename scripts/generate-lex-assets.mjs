import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outRoot = join(root, 'public', 'assets', 'images', 'lex-quest');

const colors = {
  ink: '#07111f',
  ink2: '#0d1c2c',
  panel: '#101827',
  panel2: '#172033',
  cyan: '#33d8ff',
  teal: '#20c7b3',
  gold: '#f4b94a',
  amber: '#e58b32',
  rose: '#e15c86',
  purple: '#7b4cc2',
  wood: '#5b3420',
  stone: '#6f7683',
  cream: '#f2e6c8',
  white: '#f8f5e8',
};

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function write(relPath, content) {
  const filePath = join(outRoot, relPath);
  ensureDir(filePath);
  writeFileSync(filePath, content, 'utf8');
}

function svg(width, height, body, defs = '') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">
<defs>
  <linearGradient id="night" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#06101f"/>
    <stop offset="0.55" stop-color="#0b1726"/>
    <stop offset="1" stop-color="#111a28"/>
  </linearGradient>
  <linearGradient id="court" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0" stop-color="#2b1712"/>
    <stop offset="1" stop-color="#5d341f"/>
  </linearGradient>
  <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#ffd36c" stop-opacity="0.45"/>
    <stop offset="1" stop-color="#ffd36c" stop-opacity="0"/>
  </radialGradient>
  <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
    <path d="M64 0H0V64" fill="none" stroke="#17283a" stroke-width="2" opacity="0.35"/>
  </pattern>
  ${defs}
</defs>
${body}
</svg>`;
}

function rect(x, y, w, h, fill, attrs = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${attrs}/>`;
}

function line(x1, y1, x2, y2, stroke, width = 4, attrs = '') {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" ${attrs}/>`;
}

function text(x, y, value, size = 40, fill = colors.white, attrs = '') {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="Georgia, serif" font-size="${size}" font-weight="700" letter-spacing="1" ${attrs}>${esc(value)}</text>`;
}

function label(x, y, title, subtitle = '', width = 470) {
  const subtitleLine = subtitle
    ? text(x + 24, y + 74, subtitle, 24, colors.cyan, 'font-family="Arial, sans-serif" font-weight="500"')
    : '';
  return `
    <g>
      ${rect(x, y, width, subtitle ? 96 : 62, '#091422', `stroke="${colors.cyan}" stroke-width="4" opacity="0.94" rx="6"`)}
      ${text(x + 24, y + 42, title, 30, colors.white, 'font-family="Arial Black, Arial, sans-serif"')}
      ${subtitleLine}
    </g>`;
}

function building(x, y, w, h, title, accent = colors.gold) {
  const windows = [];
  for (let yy = y + 70; yy < y + h - 38; yy += 54) {
    for (let xx = x + 34; xx < x + w - 34; xx += 58) {
      const isLit = (xx * 17 + yy * 31 + title.length * 13) % 7 > 2;
      windows.push(rect(xx, yy, 28, 34, isLit ? '#f6bd60' : '#1f3a57', `stroke="#09111e" stroke-width="3"`));
    }
  }
  return `
    <g>
      ${rect(x, y, w, h, '#182438', `stroke="${accent}" stroke-width="5"`)}
      ${rect(x + 18, y + 18, w - 36, 42, '#0c1421', `stroke="${accent}" stroke-width="3"`)}
      ${text(x + w / 2, y + 49, title, 28, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
      ${windows.join('')}
      ${rect(x + w / 2 - 36, y + h - 72, 72, 72, '#221712', `stroke="${accent}" stroke-width="4"`)}
    </g>`;
}

function tree(x, y, pink = false) {
  const leaf = pink ? '#c76a9d' : '#28764c';
  return `
    <g>
      ${rect(x + 21, y + 48, 14, 42, '#58361d')}
      <circle cx="${x + 30}" cy="${y + 34}" r="34" fill="${leaf}"/>
      <circle cx="${x + 10}" cy="${y + 48}" r="24" fill="${leaf}" opacity="0.85"/>
      <circle cx="${x + 52}" cy="${y + 50}" r="25" fill="${leaf}" opacity="0.9"/>
    </g>`;
}

function lamp(x, y) {
  return `
    <g>
      <circle cx="${x}" cy="${y}" r="86" fill="url(#lampGlow)"/>
      ${line(x, y + 12, x, y + 76, '#14100d', 8)}
      <circle cx="${x}" cy="${y}" r="16" fill="#ffd36c" stroke="#3c260e" stroke-width="4"/>
    </g>`;
}

function road(x, y, w, h, vertical = false) {
  const stripes = [];
  if (vertical) {
    for (let yy = y + 48; yy < y + h; yy += 128) stripes.push(rect(x + w / 2 - 7, yy, 14, 58, '#cfd5df', 'opacity="0.45"'));
  } else {
    for (let xx = x + 48; xx < x + w; xx += 128) stripes.push(rect(xx, y + h / 2 - 7, 58, 14, '#cfd5df', 'opacity="0.45"'));
  }
  return `<g>${rect(x, y, w, h, '#151d2a', 'stroke="#263a50" stroke-width="5"')}${stripes.join('')}</g>`;
}

function plaza(x, y) {
  return `
    <g>
      <circle cx="${x}" cy="${y}" r="270" fill="#243244" stroke="${colors.cyan}" stroke-width="7"/>
      <circle cx="${x}" cy="${y}" r="162" fill="#172033" stroke="${colors.gold}" stroke-width="6"/>
      ${line(x, y - 230, x, y + 230, '#34465d', 24)}
      ${line(x - 230, y, x + 230, y, '#34465d', 24)}
      <g transform="translate(${x - 62} ${y - 136})">
        ${rect(46, 76, 34, 145, colors.stone, 'stroke="#101827" stroke-width="5"')}
        <circle cx="63" cy="55" r="32" fill="#7d8795" stroke="#101827" stroke-width="5"/>
        ${line(63, 26, 63, 0, colors.white, 7)}
        ${line(12, 68, 114, 68, colors.white, 8)}
        ${line(34, 68, 16, 116, colors.white, 5)}
        ${line(92, 68, 110, 116, colors.white, 5)}
        ${rect(0, 116, 42, 12, colors.gold)}
        ${rect(86, 116, 42, 12, colors.gold)}
      </g>
    </g>`;
}

function mainMap() {
  const body = `
    ${rect(0, 0, 2560, 5568, 'url(#night)')}
    ${rect(0, 0, 2560, 5568, 'url(#grid)', 'opacity="0.65"')}
    ${road(1168, 0, 224, 5568, true)}
    ${road(0, 1536, 2560, 220)}
    ${road(0, 2880, 2560, 220)}
    ${road(0, 4544, 2560, 220)}
    ${label(760, 4520, 'FACULTAD DE DERECHO', 'aulas, biblioteca y primeros conceptos', 640)}
    ${label(1420, 4520, 'NOTARIA Y REGISTRO', 'documentos, prueba y propiedad', 620)}
    ${label(650, 1664, 'TRIBUNAL CIVIL', 'audiencias por turnos', 560)}
    ${label(1510, 1850, 'DISTRITO COMERCIAL', 'casos ciudadanos y evidencias', 610)}
    ${label(890, 270, 'BOSQUE DE NULIDADES', 'riesgo alto: argumentos debiles', 660)}
    ${building(820, 4240, 560, 330, 'AULAS 101', colors.cyan)}
    ${building(1390, 4240, 600, 330, 'REGISTRO', colors.gold)}
    ${building(560, 1440, 630, 350, 'TRIBUNAL CIVIL', colors.gold)}
    ${building(1500, 1640, 610, 310, 'BUFETE LEX', colors.rose)}
    ${building(360, 2050, 520, 300, 'BIBLIOTECA', colors.teal)}
    ${building(1690, 3180, 600, 330, 'CAFE LEX', colors.amber)}
    ${building(500, 3100, 560, 315, 'TABLON DE MISIONES', colors.cyan)}
    ${plaza(1280, 3440)}
    ${tree(790, 3840, true)}${tree(1620, 3800, true)}${tree(610, 4550)}${tree(1900, 4550)}
    ${tree(380, 2980)}${tree(2140, 2900)}${tree(500, 1200)}${tree(2050, 1200)}
    ${lamp(1000, 4760)}${lamp(1540, 4760)}${lamp(900, 3420)}${lamp(1660, 3420)}
    ${lamp(1200, 2100)}${lamp(1340, 2100)}${lamp(1200, 620)}${lamp(1340, 620)}
    ${text(1280, 3920, 'PLAZA DE LA JUSTICIA', 58, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
    ${text(1280, 3995, 'Reune hechos, identifica normas y ayuda a la ciudad.', 34, colors.cyan, 'text-anchor="middle" font-family="Arial, sans-serif"')}
    ${rect(180, 520, 460, 210, '#0b1220', `stroke="${colors.purple}" stroke-width="5"`)}
    ${text(410, 590, 'CALLEJON DEL CONTRATO', 31, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
    ${text(410, 645, 'casos avanzados', 26, colors.rose, 'text-anchor="middle" font-family="Arial, sans-serif"')}
  `;
  write('map/main_1_level_background.svg', svg(2560, 5568, body));
}

function mainForeground() {
  const glows = [
    [1024, 4736], [1472, 4736], [768, 1920], [1344, 2112], [1088, 320],
    [1600, 3136], [832, 2752], [960, 320],
  ]
    .map(([x, y]) => `<circle cx="${x + 32}" cy="${y + 32}" r="112" fill="${colors.cyan}" opacity="0.12"/>`)
    .join('');
  const body = `${glows}${rect(0, 0, 2560, 5568, '#000000', 'opacity="0"')}`;
  write('map/main_1_level_foreground.svg', svg(2560, 5568, body));
}

function interior(title, subtitle, room, accent) {
  const desks = [];
  for (let y = 210; y <= 390; y += 90) {
    for (let x = 84; x <= 600; x += 172) {
      desks.push(`${rect(x, y, 110, 50, '#4a2b1b', 'stroke="#170d08" stroke-width="4"')}${rect(x + 18, y - 18, 74, 16, '#1d2431')}`);
    }
  }
  const body = `
    ${rect(0, 0, 832, 576, '#111927')}
    ${rect(24, 24, 784, 528, room, `stroke="${accent}" stroke-width="8"`)}
    ${rect(64, 60, 704, 92, '#0a1220', `stroke="${accent}" stroke-width="5"`)}
    ${text(416, 114, title, 42, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
    ${text(416, 146, subtitle, 22, colors.cyan, 'text-anchor="middle" font-family="Arial, sans-serif" font-weight="500"')}
    ${desks.join('')}
    ${rect(320, 456, 192, 70, '#2d1a12', `stroke="${accent}" stroke-width="5"`)}
    ${rect(382, 526, 68, 50, '#111927', `stroke="${accent}" stroke-width="4"`)}
  `;
  return svg(832, 576, body);
}

function interiors() {
  write('map/buildings/building_1_level_background.svg', interior('FACULTAD DE DERECHO', 'aprende hechos, normas y argumentos', '#273141', colors.cyan));
  write('map/buildings/building_2_level_background.svg', interior('NOTARIA Y REGISTRO', 'documentos que dan poder a los casos', '#3a281d', colors.gold));
  write('map/buildings/building_3_level_background.svg', interior('TRIBUNAL CIVIL', 'donde se decide la verdad del expediente', '#2d1d18', colors.amber));
  for (const name of ['building_1', 'building_2', 'building_3']) {
    write(`map/buildings/${name}_level_foreground.svg`, svg(832, 576, rect(0, 0, 832, 576, '#000', 'opacity="0"')));
  }
}

function districtExterior() {
  const body = `
    ${rect(0, 0, 1280, 768, '#06101f')}
    ${rect(0, 0, 1280, 768, 'url(#grid)', 'opacity="0.8"')}
    ${road(0, 320, 1280, 150)}
    ${road(560, 0, 160, 768, true)}
    ${building(90, 90, 340, 200, 'BARRIO RESIDENCIAL', colors.teal)}
    ${building(820, 88, 360, 210, 'DISTRITO COMERCIAL', colors.rose)}
    ${building(110, 510, 360, 180, 'ZONA INDUSTRIAL', colors.gold)}
    ${building(790, 510, 370, 180, 'CALLEJON DEL CONTRATO', colors.purple)}
    ${lamp(560, 360)}${lamp(720, 360)}${lamp(640, 180)}${lamp(640, 600)}
    ${text(640, 62, 'DISTRITOS Y CALLES', 48, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
    ${text(640, 112, 'historias que te rodean', 28, colors.cyan, 'text-anchor="middle" font-family="Arial, sans-serif"')}
  `;
  write('map/forest_1_level_background.svg', svg(1280, 768, body));
  write('map/forest_1_level_foreground.svg', svg(1280, 768, rect(0, 0, 1280, 768, '#000', 'opacity="0"')));
}

function titleAssets() {
  const skyline = Array.from({ length: 36 }, (_, i) => {
    const w = 36 + (i % 4) * 12;
    const h = 130 + (i * 37) % 300;
    const x = i * 54;
    const y = 910 - h;
    return `${rect(x, y, w, h, i % 3 === 0 ? '#142338' : '#0d1a2a', 'stroke="#25344c" stroke-width="3"')}
      ${rect(x + 8, y + 24, 12, 18, i % 2 ? colors.cyan : colors.gold, 'opacity="0.75"')}
      ${rect(x + 30, y + 82, 12, 18, colors.rose, 'opacity="0.55"')}`;
  }).join('');
  const body = `
    ${rect(0, 0, 1824, 1024, 'url(#night)')}
    ${skyline}
    <circle cx="912" cy="420" r="230" fill="${colors.cyan}" opacity="0.08"/>
    ${line(620, 340, 1204, 340, colors.white, 10)}
    ${line(912, 190, 912, 535, colors.white, 10)}
    ${line(700, 340, 640, 500, colors.white, 6)}
    ${line(1124, 340, 1184, 500, colors.white, 6)}
    ${rect(570, 500, 160, 28, colors.gold)}
    ${rect(1094, 500, 160, 28, colors.gold)}
    ${text(912, 700, 'CIUDAD LEX', 94, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
    ${text(912, 760, 'explora, investiga, argumenta', 36, colors.cyan, 'text-anchor="middle" font-family="Arial, sans-serif"')}
  `;
  write('ui/title/background.svg', svg(1824, 1024, body));
  write('ui/title/title_background.svg', svg(2048, 2048, `
    <circle cx="1024" cy="1024" r="900" fill="#081322" stroke="${colors.gold}" stroke-width="18" opacity="0.75"/>
    <circle cx="1024" cy="1024" r="680" fill="none" stroke="${colors.cyan}" stroke-width="10" opacity="0.45"/>
  `));
}

function courtroomBattle() {
  const body = `
    ${rect(0, 0, 1024, 576, '#101827')}
    ${rect(0, 0, 1024, 350, 'url(#court)')}
    ${rect(0, 350, 1024, 226, '#1c2432')}
    ${rect(70, 86, 884, 88, '#17100d', `stroke="${colors.gold}" stroke-width="5"`)}
    ${text(512, 142, 'SALA DE AUDIENCIAS', 42, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
    ${rect(355, 178, 314, 128, '#3d2417', `stroke="${colors.gold}" stroke-width="6"`)}
    ${text(512, 254, 'VS', 56, colors.cyan, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
    ${rect(70, 354, 316, 82, '#263246', `stroke="${colors.cyan}" stroke-width="5"`)}
    ${rect(642, 180, 316, 82, '#462631', `stroke="${colors.rose}" stroke-width="5"`)}
    ${text(230, 408, 'TU ARGUMENTO', 30, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
    ${text(800, 234, 'CONTRAPARTE', 30, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
    ${line(0, 350, 1024, 350, colors.gold, 6)}
  `;
  write('battle/courtroom-background.svg', svg(1024, 576, body));
}

function monsterBook(color, symbol, label) {
  return svg(256, 256, `
    <circle cx="128" cy="128" r="112" fill="#081322" stroke="${colors.cyan}" stroke-width="6" opacity="0.96"/>
    <g transform="translate(58 42) rotate(-8 70 86)">
      ${rect(14, 14, 132, 164, color, `stroke="${colors.gold}" stroke-width="8" rx="12"`)}
      ${rect(28, 28, 104, 138, '#160f22', 'opacity="0.28" rx="8"')}
      ${text(80, 105, symbol, 62, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
      ${rect(0, 178, 150, 16, colors.cream, `stroke="${colors.gold}" stroke-width="4"`)}
    </g>
    ${text(128, 238, label, 24, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
  `);
}

function monsterScroll(label) {
  return svg(256, 256, `
    <circle cx="128" cy="128" r="112" fill="#081322" stroke="${colors.gold}" stroke-width="6"/>
    ${rect(62, 58, 132, 136, colors.cream, 'stroke="#8c5c2d" stroke-width="8" rx="10"')}
    <circle cx="62" cy="72" r="20" fill="#d7b47a" stroke="#8c5c2d" stroke-width="6"/>
    <circle cx="194" cy="180" r="20" fill="#d7b47a" stroke="#8c5c2d" stroke-width="6"/>
    ${line(88, 96, 168, 96, '#5b3420', 5)}
    ${line(88, 124, 168, 124, '#5b3420', 5)}
    ${line(88, 152, 142, 152, '#5b3420', 5)}
    <circle cx="146" cy="164" r="20" fill="${colors.rose}" stroke="#5b1f2e" stroke-width="5"/>
    ${text(128, 238, label, 23, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
  `);
}

function monsterShield(label, accent) {
  return svg(256, 256, `
    <circle cx="128" cy="128" r="112" fill="#081322" stroke="${accent}" stroke-width="6"/>
    <path d="M128 42 L194 68 L184 146 Q178 198 128 220 Q78 198 72 146 L62 68 Z" fill="#687487" stroke="${colors.gold}" stroke-width="8"/>
    ${line(128, 70, 128, 178, colors.white, 10)}
    ${line(92, 126, 164, 126, colors.white, 10)}
    ${text(128, 238, label, 23, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
  `);
}

function monsterClock(label) {
  return svg(256, 256, `
    <circle cx="128" cy="128" r="112" fill="#081322" stroke="${colors.gold}" stroke-width="6"/>
    ${rect(70, 54, 116, 24, colors.gold, 'stroke="#5c3b12" stroke-width="5"')}
    ${rect(84, 178, 88, 26, colors.gold, 'stroke="#5c3b12" stroke-width="5"')}
    <path d="M88 80 Q128 120 168 80 L168 178 Q128 138 88 178 Z" fill="#18344d" stroke="${colors.cream}" stroke-width="8"/>
    <path d="M104 96 Q128 118 152 96" fill="none" stroke="${colors.cyan}" stroke-width="8"/>
    <path d="M104 162 Q128 140 152 162" fill="none" stroke="${colors.cyan}" stroke-width="8"/>
    ${text(128, 238, label, 23, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
  `);
}

function monsterShadow(label) {
  return svg(256, 256, `
    <circle cx="128" cy="128" r="112" fill="#081322" stroke="${colors.rose}" stroke-width="6"/>
    <path d="M64 184 Q76 74 128 66 Q180 74 192 184 Q158 164 128 198 Q98 164 64 184Z" fill="#181722" stroke="#4f3a5f" stroke-width="8"/>
    <circle cx="100" cy="122" r="10" fill="${colors.rose}"/>
    <circle cx="156" cy="122" r="10" fill="${colors.rose}"/>
    ${text(128, 155, '?', 64, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif" opacity="0.75"')}
    ${text(128, 238, label, 22, colors.white, 'text-anchor="middle" font-family="Arial Black, Arial, sans-serif"')}
  `);
}

function legalCreatures() {
  write('monsters/lexis.svg', monsterBook(colors.purple, '§', 'LEXIS'));
  write('monsters/contractus.svg', monsterScroll('CONTRACTUS'));
  write('monsters/dominium.svg', monsterShield('DOMINIUM', colors.cyan));
  write('monsters/garantia.svg', monsterShield('GARANTIA', colors.gold));
  write('monsters/bona-fides.svg', monsterBook('#e8f2ff', '✓', 'BONA FIDES'));
  write('monsters/prescriptio.svg', monsterClock('PRESCRIPTIO'));
  write('monsters/vicio-oculto.svg', monsterShadow('VICIO OCULTO'));
}

function captureAndPickup() {
  write('battle/case-file-512.svg', svg(512, 512, `
    <circle cx="256" cy="256" r="210" fill="#0b1524" stroke="${colors.gold}" stroke-width="16"/>
    ${rect(150, 104, 230, 288, colors.cream, 'stroke="#8c5c2d" stroke-width="14" rx="12"')}
    ${rect(180, 146, 170, 36, colors.gold, 'stroke="#8c5c2d" stroke-width="8"')}
    ${line(184, 234, 328, 234, '#5b3420', 12)}
    ${line(184, 276, 328, 276, '#5b3420', 12)}
    ${line(184, 318, 282, 318, '#5b3420', 12)}
    <circle cx="328" cy="344" r="46" fill="${colors.rose}" stroke="#5b1f2e" stroke-width="12"/>
  `));
  write('battle/case-file-32.svg', svg(32, 32, `
    ${rect(7, 3, 18, 24, colors.cream, 'stroke="#8c5c2d" stroke-width="2" rx="2"')}
    ${line(10, 10, 22, 10, '#5b3420', 2)}
    ${line(10, 15, 22, 15, '#5b3420', 2)}
    <circle cx="21" cy="22" r="4" fill="${colors.rose}"/>
  `));
  write('map/evidence-pickup.svg', svg(64, 64, `
    ${rect(12, 8, 40, 48, colors.cream, 'stroke="#8c5c2d" stroke-width="5" rx="4"')}
    ${line(20, 22, 44, 22, '#5b3420', 4)}
    ${line(20, 32, 44, 32, '#5b3420', 4)}
    <circle cx="40" cy="45" r="7" fill="${colors.cyan}"/>
  `));
}

function characterFrame(x, y, coat, facing, step = 0) {
  const headX = x + 32;
  const armOffset = step === 1 ? 4 : step === 2 ? -4 : 0;
  const face = facing === 'up' ? '' : `<circle cx="${headX - 8}" cy="${y + 25}" r="3" fill="#111"/> <circle cx="${headX + 8}" cy="${y + 25}" r="3" fill="#111"/>`;
  return `
    <g>
      <ellipse cx="${x + 32}" cy="${y + 78}" rx="22" ry="7" fill="#000" opacity="0.28"/>
      <circle cx="${headX}" cy="${y + 26}" r="18" fill="#d9a56f" stroke="#3a2115" stroke-width="3"/>
      <path d="M${x + 15} ${y + 22} Q${x + 32} ${y - 2} ${x + 49} ${y + 22} L${x + 48} ${y + 36} Q${x + 32} ${y + 24} ${x + 16} ${y + 36}Z" fill="#10121b"/>
      ${face}
      ${rect(x + 18, y + 44, 28, 34, coat, 'stroke="#101827" stroke-width="4" rx="6"')}
      ${rect(x + 24, y + 47, 16, 24, '#e7d6b1')}
      ${line(x + 18, y + 48, x + 8 + armOffset, y + 70, '#1b2434', 7)}
      ${line(x + 46, y + 48, x + 56 - armOffset, y + 70, '#1b2434', 7)}
      ${line(x + 26, y + 76, x + 22 + armOffset, y + 88, '#1b2434', 7)}
      ${line(x + 38, y + 76, x + 42 - armOffset, y + 88, '#1b2434', 7)}
    </g>`;
}

function playerSheet() {
  const directions = ['up', 'right', 'down', 'left'];
  let body = '';
  directions.forEach((dir, row) => {
    for (let col = 0; col < 3; col += 1) {
      body += characterFrame(col * 64, row * 88, '#20324a', dir, col);
    }
  });
  write('characters/student-sheet.svg', svg(256, 352, body));
}

function npcSheet() {
  const coats = ['#24344f', '#3f4654', '#4d3429', '#2e4c3a', '#54374b', '#304b5e', '#5b4a2b', '#20242c'];
  let body = '';
  for (let i = 0; i < 200; i += 1) {
    const x = (i % 10) * 16;
    const y = Math.floor(i / 10) * 16;
    const coat = coats[Math.floor(i / 10) % coats.length];
    const skin = i % 5 === 0 ? '#c78f5b' : '#d9a56f';
    body += `
      <g>
        <circle cx="${x + 8}" cy="${y + 5}" r="4" fill="${skin}"/>
        ${rect(x + 4, y + 8, 8, 7, coat)}
        ${rect(x + 5, y + 2, 6, 3, i % 4 === 0 ? '#d7d7d7' : '#141414')}
        ${line(x + 5, y + 14, x + 4, y + 16, '#111827', 2)}
        ${line(x + 11, y + 14, x + 12, y + 16, '#111827', 2)}
      </g>`;
  }
  write('characters/npc-legal-sheet.svg', svg(160, 320, body));
}

mainMap();
mainForeground();
interiors();
districtExterior();
titleAssets();
courtroomBattle();
legalCreatures();
captureAndPickup();
playerSheet();
npcSheet();

console.log(`Generated Lex Quest assets in ${outRoot}`);
