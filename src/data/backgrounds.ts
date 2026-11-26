export type BackgroundFamily = '自然' | '抽象' | '科技' | '极简' | '人物' | '经典'

export type PosterBackground = {
  id: string
  name: string
  family: BackgroundFamily
  kind: 'image' | 'css'
  src?: string
  /** 素材库缩略图（480px），列表里先用它，避免一次加载所有大图 */
  thumb?: string
  /** CSS background-image 值，程序生成，不依赖外部图床 */
  css?: string
  base: string
  /** 是否为浅色背景，用于自动推荐文字颜色 */
  light: boolean
  /** 素材说明，例如「实拍 · 雪山」 */
  tag?: string
  source?: BackgroundSource
}

export type BackgroundSource = {
  provider: string
  title: string
  pageUrl: string
  license: string
  artist: string
}

export const BACKGROUND_GROUPS: BackgroundFamily[] = ['自然', '抽象', '科技', '极简', '人物', '经典']

function photo(
  id: string,
  name: string,
  family: BackgroundFamily,
  tag: string,
  base: string,
  light: boolean,
  source: BackgroundSource,
): PosterBackground {
  return {
    id,
    name,
    family,
    kind: 'image',
    src: `/backgrounds/${id}.webp`,
    thumb: `/backgrounds/${id}-thumb.webp`,
    base,
    light,
    tag,
    source,
  }
}

function svgUrl(markup: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">${markup}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

function starsMarkup(count = 120, seed = 17) {
  let value = seed
  const next = () => {
    value = (value * 16807) % 2147483647
    return value / 2147483647
  }
  let markup = ''
  for (let index = 0; index < count; index += 1) {
    const x = Math.round(next() * 1600)
    const y = Math.round(next() * 740)
    const radius = (0.7 + next() * 1.5).toFixed(2)
    const opacity = (0.18 + next() * 0.62).toFixed(2)
    markup += `<circle cx="${x}" cy="${y}" r="${radius}" fill="#ffffff" opacity="${opacity}"/>`
  }
  return markup
}

const STARS_MARKUP = starsMarkup()

const STARS = svgUrl(STARS_MARKUP)

const GRAIN = svgUrl(`
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="1600" height="900" filter="url(#grain)" opacity="0.22"/>
`)

const PAPER_FIBER = svgUrl(`
  <filter id="fiber">
    <feTurbulence type="fractalNoise" baseFrequency="0.012 0.55" numOctaves="3" seed="4"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="1600" height="900" filter="url(#fiber)" opacity="0.16"/>
`)

const SNOW_SCENE = svgUrl(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#091a31"/>
      <stop offset="0.5" stop-color="#3e6688"/>
      <stop offset="1" stop-color="#cbdeea"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <g opacity="0.9">${STARS_MARKUP}</g>
  <path d="M0 640 L220 440 L430 600 L660 360 L920 630 L1160 470 L1390 650 L1600 520 L1600 900 L0 900 Z" fill="#7f9fbe"/>
  <path d="M660 360 L720 430 L760 410 L800 470 L860 430 L920 630 Z" fill="#e8f2fa" opacity="0.75"/>
  <path d="M0 730 L300 560 L560 720 L860 520 L1100 750 L1340 610 L1600 770 L1600 900 L0 900 Z" fill="#42617f"/>
  <path d="M0 830 L360 690 L690 820 L980 670 L1280 830 L1600 710 L1600 900 L0 900 Z" fill="#1b3147"/>
`)

const COAST_SCENE = svgUrl(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#39283f"/>
      <stop offset="0.42" stop-color="#a4565f"/>
      <stop offset="0.68" stop-color="#f0a06f"/>
      <stop offset="1" stop-color="#ffd9a8"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#20455b"/>
      <stop offset="1" stop-color="#0b1d2a"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <circle cx="1120" cy="520" r="92" fill="#ffe3b4" opacity="0.92"/>
  <rect y="560" width="1600" height="340" fill="url(#sea)"/>
  <g fill="#ffd8a0">
    <rect x="1040" y="600" width="160" height="5" rx="3" opacity="0.55"/>
    <rect x="1000" y="640" width="240" height="4" rx="2" opacity="0.4"/>
    <rect x="1060" y="684" width="140" height="4" rx="2" opacity="0.34"/>
    <rect x="980" y="730" width="300" height="3" rx="2" opacity="0.28"/>
    <rect x="1040" y="780" width="190" height="3" rx="2" opacity="0.22"/>
  </g>
  <path d="M0 560 C180 540 300 585 440 570 C560 557 640 530 760 552 C820 563 860 578 900 560 L900 900 L0 900 Z" fill="#122c38" opacity="0.85"/>
`)

function woodlandScene() {
  let trees = ''
  for (let i = 0; i < 24; i += 1) {
    const x = i * 72 - 40
    const height = 280 + ((i * 137) % 280)
    const width = 74 + ((i * 53) % 46)
    const opacity = 0.42 + ((i * 7) % 46) / 100
    trees += `<path d="M${x} 900 L${x + width / 2} ${900 - height} L${x + width} 900 Z" fill="#081a14" opacity="${opacity}"/>`
  }
  return svgUrl(`
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0c2029"/>
        <stop offset="0.55" stop-color="#1c4038"/>
        <stop offset="1" stop-color="#080f0d"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#ffd9a0" stop-opacity="0.6"/>
        <stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#sky)"/>
    <ellipse cx="1130" cy="330" rx="380" ry="300" fill="url(#glow)"/>
    ${trees}
    <rect y="700" width="1600" height="200" fill="#050d0a" opacity="0.75"/>
  `)
}

const DESERT_SCENE = svgUrl(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f6c98e"/>
      <stop offset="0.55" stop-color="#f2a469"/>
      <stop offset="1" stop-color="#d97a52"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <circle cx="1180" cy="250" r="86" fill="#fff1c9" opacity="0.9"/>
  <path d="M0 620 C260 520 480 640 760 580 C1030 522 1240 600 1600 500 L1600 900 L0 900 Z" fill="#d99a5c"/>
  <path d="M0 730 C300 640 560 760 880 690 C1160 628 1380 700 1600 650 L1600 900 L0 900 Z" fill="#b9723f"/>
  <path d="M0 830 C360 760 660 860 980 800 C1260 748 1440 790 1600 760 L1600 900 L0 900 Z" fill="#8d4f2c"/>
`)

const AURORA_SCENE = svgUrl(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#061223"/>
      <stop offset="0.6" stop-color="#0b2036"/>
      <stop offset="1" stop-color="#071019"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="46"/>
    </filter>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <g opacity="0.85">${STARS_MARKUP}</g>
  <g filter="url(#soft)">
    <path d="M-120 300 C280 60 700 430 1000 190 C1240 0 1460 260 1720 130 L1720 470 C1400 570 1150 320 900 470 C600 640 240 420 -120 540 Z" fill="#2ed6a0" opacity="0.55"/>
    <path d="M-120 400 C280 260 620 580 980 360 C1230 210 1450 400 1720 280 L1720 640 C1300 720 1050 540 780 660 C480 780 200 620 -120 700 Z" fill="#4d7bff" opacity="0.4"/>
    <path d="M220 320 C520 160 780 400 1100 230" stroke="#b477ff" stroke-width="130" fill="none" opacity="0.4"/>
  </g>
  <path d="M0 790 L260 700 L520 780 L800 690 L1080 790 L1340 710 L1600 780 L1600 900 L0 900 Z" fill="#0a1a26"/>
`)

const LAKE_SCENE = svgUrl(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#182a4a"/>
      <stop offset="0.5" stop-color="#4a6a8a"/>
      <stop offset="1" stop-color="#c7d8e0"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9db9c6"/>
      <stop offset="1" stop-color="#25414f"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <path d="M0 500 L240 340 L470 500 L720 300 L980 510 L1220 380 L1420 520 L1600 420 L1600 540 L0 540 Z" fill="#334e63"/>
  <path d="M0 540 L1600 540 L1600 900 L0 900 Z" fill="url(#water)"/>
  <path d="M0 560 L240 420 L470 560 L720 390 L980 570 L1220 450 L1420 580 L1600 490 L1600 600 L0 600 Z" fill="#1b3141" opacity="0.45"/>
  <g stroke="#cfe4ee" stroke-width="3" opacity="0.35">
    <line x1="120" y1="660" x2="520" y2="660"/>
    <line x1="740" y1="700" x2="1180" y2="700"/>
    <line x1="320" y1="760" x2="900" y2="760"/>
    <line x1="1040" y1="800" x2="1500" y2="800"/>
  </g>
`)

const PORTRAIT_SCENE = svgUrl(`
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#241a2a"/>
      <stop offset="0.55" stop-color="#3a2838"/>
      <stop offset="1" stop-color="#58374e"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffcf9e" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#ffcf9e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <circle cx="1450" cy="410" r="380" fill="url(#halo)"/>
  <path d="M1130 900 C1150 730 1270 640 1450 640 C1610 640 1650 730 1680 900 Z" fill="#2f6b58"/>
  <path d="M1410 640 L1490 640 L1510 780 L1390 780 Z" fill="#e3b393"/>
  <ellipse cx="1450" cy="440" rx="170" ry="200" fill="#f0c7a6"/>
  <path d="M1270 450 C1248 250 1360 150 1460 150 C1580 150 1680 252 1648 470 C1620 370 1540 330 1440 340 C1350 348 1290 380 1270 450 Z" fill="#20161f"/>
  <path d="M1634 330 C1690 390 1698 500 1652 570 C1636 520 1626 430 1634 330 Z" fill="#20161f"/>
  <circle cx="1298" cy="500" r="14" fill="#e8b969"/>
  <circle cx="1632" cy="512" r="10" fill="#e8b969" opacity="0.8"/>
`)

const SILHOUETTE_SCENE = svgUrl(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a1e3c"/>
      <stop offset="0.42" stop-color="#8a4a58"/>
      <stop offset="0.7" stop-color="#e8915c"/>
      <stop offset="1" stop-color="#ffd49a"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <circle cx="1120" cy="600" r="120" fill="#ffe1ae" opacity="0.9"/>
  <path d="M0 700 C280 640 520 720 800 680 C1080 640 1340 700 1600 660 L1600 900 L0 900 Z" fill="#2a2028"/>
  <g fill="#141018">
    <circle cx="1030" cy="574" r="14"/>
    <path d="M1014 682 C1014 640 1020 606 1030 592 C1040 606 1046 640 1046 682 Z"/>
    <path d="M1017 626 L994 608 M1043 626 L1066 608" stroke="#141018" stroke-width="7" fill="none"/>
    <path d="M1022 682 L1014 732 M1038 682 L1046 732" stroke="#141018" stroke-width="7" fill="none"/>
  </g>
  <g stroke="#241a22" stroke-width="2.5" fill="none" opacity="0.55">
    <path d="M320 300 C334 286 348 286 362 300"/>
    <path d="M390 340 C402 328 414 328 426 340"/>
  </g>
`)

const PROFILE_SCENE = svgUrl(`
  <rect width="1600" height="900" fill="#eadcc9"/>
  <circle cx="1080" cy="420" r="330" fill="#d9c4aa" opacity="0.65"/>
  <path d="M980 140 C1140 140 1250 250 1250 400 C1250 480 1220 540 1170 590 C1150 610 1148 636 1160 656 C1172 676 1160 692 1136 696 C1106 702 1096 724 1106 754 C1118 790 1088 826 1036 846 C986 866 930 880 900 900 L560 900 C620 700 642 520 660 380 C680 210 810 140 980 140 Z" fill="#3c3128" opacity="0.34"/>
  <path d="M700 500 C760 470 820 500 860 470" stroke="#eadcc9" stroke-width="8" fill="none" opacity="0.5"/>
`)

const MESH_SCENE = svgUrl(`
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2b1a4d"/>
      <stop offset="1" stop-color="#0b1e33"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="80"/></filter>
  </defs>
  <rect width="1600" height="900" fill="url(#base)"/>
  <g filter="url(#blur)">
    <circle cx="330" cy="300" r="260" fill="#ff5f8f" opacity="0.75"/>
    <circle cx="900" cy="220" r="240" fill="#6c5cff" opacity="0.7"/>
    <circle cx="1280" cy="520" r="300" fill="#2ed6c0" opacity="0.55"/>
    <circle cx="620" cy="760" r="280" fill="#ffb15c" opacity="0.5"/>
  </g>
`)

const GLASS_SCENE = svgUrl(`
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#d9e7ef"/>
      <stop offset="1" stop-color="#aec4d6"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="60"/></filter>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <g filter="url(#blur)">
    <circle cx="380" cy="260" r="240" fill="#7fd6c2" opacity="0.8"/>
    <circle cx="1040" cy="340" r="280" fill="#8aa6ff" opacity="0.7"/>
    <circle cx="760" cy="740" r="260" fill="#ffc6d9" opacity="0.6"/>
  </g>
  <g transform="rotate(-14 800 450)">
    <rect x="420" y="210" width="760" height="480" rx="36" fill="#ffffff" opacity="0.28"/>
    <rect x="470" y="260" width="660" height="380" rx="24" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.5"/>
    <path d="M520 600 L760 330" stroke="#ffffff" stroke-width="48" opacity="0.22"/>
  </g>
`)

const STARRY_SCENE = svgUrl(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#040814"/>
      <stop offset="0.55" stop-color="#0a1b38"/>
      <stop offset="1" stop-color="#03060d"/>
    </linearGradient>
    <radialGradient id="milky" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#8fa8e8" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#8fa8e8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <ellipse cx="820" cy="430" rx="760" ry="190" fill="url(#milky)" transform="rotate(-22 820 430)"/>
  ${STARS_MARKUP}
`)

const NEON_SCENE = svgUrl(`
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0712"/>
      <stop offset="1" stop-color="#03050c"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="34"/>
    </filter>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <g filter="url(#soft)" opacity="0.9">
    <rect x="60" y="280" width="1480" height="26" rx="13" fill="#ff3fa4" opacity="0.7"/>
    <rect x="-40" y="530" width="1700" height="14" rx="7" fill="#33e6ff" opacity="0.6" transform="rotate(-3 800 540)"/>
    <rect x="200" y="690" width="1200" height="10" rx="5" fill="#8b5bff" opacity="0.7"/>
    <circle cx="1330" cy="200" r="140" fill="#33e6ff" opacity="0.4"/>
    <circle cx="230" cy="690" r="160" fill="#ff3fa4" opacity="0.36"/>
  </g>
`)

const BOKEH_SCENE = svgUrl(`
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#071a1e"/>
      <stop offset="1" stop-color="#02080b"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="20"/></filter>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <g filter="url(#soft)" opacity="0.8">
    <circle cx="260" cy="240" r="86" fill="#ffcf8a" opacity="0.55"/>
    <circle cx="500" cy="620" r="130" fill="#7fd6c2" opacity="0.35"/>
    <circle cx="980" cy="210" r="70" fill="#ffd9a0" opacity="0.45"/>
    <circle cx="1260" cy="520" r="150" fill="#8aa6ff" opacity="0.3"/>
    <circle cx="1460" cy="230" r="60" fill="#ff9f7a" opacity="0.4"/>
    <circle cx="760" cy="780" r="110" fill="#ffcf8a" opacity="0.22"/>
  </g>
`)

const SAND_SCENE = svgUrl(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fbf0db"/>
      <stop offset="0.6" stop-color="#f4dfbf"/>
      <stop offset="1" stop-color="#e8c99c"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <path d="M0 620 C300 540 560 660 860 600 C1120 548 1380 620 1600 560 L1600 900 L0 900 Z" fill="#efd4a9"/>
  <path d="M0 730 C320 650 620 760 940 700 C1200 652 1420 720 1600 680 L1600 900 L0 900 Z" fill="#e3be8d"/>
  <path d="M0 830 C360 760 680 850 1000 800 C1260 760 1460 790 1600 770 L1600 900 L0 900 Z" fill="#d3a774"/>
`)

const MIST_SCENE = svgUrl(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#dfe8ec"/>
      <stop offset="0.6" stop-color="#c3d2d9"/>
      <stop offset="1" stop-color="#aebfc8"/>
    </linearGradient>
    <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#eef4f6" stop-opacity="0"/>
      <stop offset="1" stop-color="#eef4f6" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <path d="M0 560 L220 380 L420 540 L660 330 L900 560 L1150 400 L1380 570 L1600 450 L1600 900 L0 900 Z" fill="#9fb2bd" opacity="0.6"/>
  <path d="M0 680 L280 500 L520 670 L800 470 L1060 690 L1320 540 L1600 700 L1600 900 L0 900 Z" fill="#7d929f" opacity="0.65"/>
  <path d="M0 800 L340 640 L640 790 L940 620 L1240 810 L1600 680 L1600 900 L0 900 Z" fill="#5f7481" opacity="0.7"/>
  <rect y="620" width="1600" height="280" fill="url(#fog)" opacity="0.8"/>
`)

const SUNSET_SCENE = svgUrl(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b1b45"/>
      <stop offset="0.45" stop-color="#a8496a"/>
      <stop offset="0.72" stop-color="#ef8b5d"/>
      <stop offset="1" stop-color="#ffc98d"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <circle cx="1120" cy="580" r="130" fill="#ffe1ae" opacity="0.9"/>
  <path d="M0 700 C260 650 520 720 800 680 C1080 640 1340 700 1600 660 L1600 900 L0 900 Z" fill="#2b1f2c"/>
  <path d="M0 790 C320 740 640 800 980 770 C1240 746 1440 770 1600 750 L1600 900 L0 900 Z" fill="#1a121d"/>
  <g stroke="#2b1f2c" stroke-width="2" fill="none" opacity="0.5">
    <path d="M430 330 C444 316 458 316 472 330"/>
    <path d="M520 380 C532 368 544 368 556 380"/>
  </g>
`)

const WAVES_SCENE = svgUrl(`
  <defs>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c2a3e"/>
      <stop offset="0.5" stop-color="#124a63"/>
      <stop offset="1" stop-color="#061722"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sea)"/>
  <g fill="none" stroke-linecap="round">
    <path d="M-100 300 C200 240 420 360 720 300 C1020 240 1240 350 1700 280" stroke="#2f7d97" stroke-width="42" opacity="0.35"/>
    <path d="M-100 460 C240 390 480 520 800 450 C1100 386 1320 500 1700 430" stroke="#5fb3c9" stroke-width="26" opacity="0.28"/>
    <path d="M-100 620 C260 550 520 680 840 610 C1140 544 1360 650 1700 590" stroke="#8fd8e4" stroke-width="14" opacity="0.22"/>
    <path d="M-100 760 C300 700 560 800 880 740 C1180 684 1400 760 1700 710" stroke="#2f7d97" stroke-width="30" opacity="0.25"/>
  </g>
`)

const BACKFIGURE_SCENE = svgUrl(`
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f4e7d4"/>
      <stop offset="0.6" stop-color="#e8d2b6"/>
      <stop offset="1" stop-color="#d8b995"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#fff4d8" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#fff4d8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <circle cx="1330" cy="380" r="230" fill="url(#sun)"/>
  <g transform="translate(1360 310) scale(0.94)">
    <circle cx="130" cy="90" r="62" fill="#3a2a24"/>
    <path d="M40 600 C46 380 80 260 130 210 C180 260 214 380 220 600 Z" fill="#3a2a24"/>
    <path d="M70 210 C80 130 180 130 190 220 C170 170 120 160 70 210 Z" fill="#241a17"/>
  </g>
  <path d="M0 760 C300 720 600 770 900 750 C1200 730 1400 760 1600 740 L1600 900 L0 900 Z" fill="#c49f78" opacity="0.45"/>
`)

const RIPPLE_SCENE = svgUrl(`
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#eaf3f7"/>
      <stop offset="1" stop-color="#c6dce6"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <g fill="none" stroke="#7fa8bd">
    <circle cx="1180" cy="420" r="120" stroke-width="2" opacity="0.5"/>
    <circle cx="1180" cy="420" r="210" stroke-width="2" opacity="0.35"/>
    <circle cx="1180" cy="420" r="310" stroke-width="2" opacity="0.24"/>
    <circle cx="1180" cy="420" r="420" stroke-width="2" opacity="0.16"/>
    <circle cx="1180" cy="420" r="540" stroke-width="2" opacity="0.1"/>
  </g>
  <g fill="none" stroke="#ffffff" stroke-width="2" opacity="0.5">
    <circle cx="300" cy="720" r="90"/>
    <circle cx="300" cy="720" r="150" opacity="0.6"/>
    <circle cx="300" cy="720" r="220" opacity="0.35"/>
  </g>
`)

const PHOTO_LIBRARY: PosterBackground[] = [
  photo('photo-snowpeak', '霞光雪峰', '自然', '实拍 · 雪山', '#1b1f26', false, {
    provider: 'Wikimedia Commons',
    title: 'Sunset Mount Cook NZ',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Sunset_Mount_Cook_NZ_(8114766837).jpg',
    license: 'CC0 1.0',
    artist: 'Bernard Spragg. NZ',
  }),
  photo('photo-forestfog', '雾锁林海', '自然', '实拍 · 森林', '#16211d', false, {
    provider: 'Wikimedia Commons',
    title: 'Foggy pine (Unsplash)',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Foggy_pine_(Unsplash).jpg',
    license: 'CC0 1.0',
    artist: 'Vadim Sherbakov',
  }),
  photo('photo-birch', '白桦林径', '自然', '实拍 · 森林', '#2a2b23', false, {
    provider: 'Wikimedia Commons',
    title: 'Edderitz (Oktober 2026)',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Edderitz_(Oktober_2026)_1.jpg',
    license: 'CC0 1.0',
    artist: 'Romzig',
  }),
  photo('photo-goldwoods', '金秋林间', '自然', '实拍 · 秋景', '#2c2417', false, {
    provider: 'Wikimedia Commons',
    title: 'Yamanakako - Yamanaka6753',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Yamanakako_-_Yamanaka6753.jpg',
    license: 'CC0 1.0',
    artist: 'lumoplank',
  }),
  photo('photo-reef', '碧海礁岸', '自然', '实拍 · 海洋', '#123037', false, {
    provider: 'Wikimedia Commons',
    title: 'Cape Peninsula',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Cape_Peninsula_-_CapePeninsula4327.jpg',
    license: 'CC0 1.0',
    artist: 'lumoplank',
  }),
  photo('photo-cliff', '海岸悬崖', '自然', '实拍 · 海岸', '#1a2227', false, {
    provider: 'Wikimedia Commons',
    title: 'El Remo, La Palma',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:El_Remo,_La_Palma,_surf_against_black_cliffs.jpg',
    license: 'CC0 1.0',
    artist: 'Gerda Arendt',
  }),
  photo('photo-lakeglow', '湖光山色', '自然', '实拍 · 湖泊', '#1c2733', false, {
    provider: 'Wikimedia Commons',
    title: 'Beautiful mountain reflection',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Beautiful_mountain_reflection_(Unsplash).jpg',
    license: 'CC0 1.0',
    artist: 'Johannes Plenio',
  }),
  photo('photo-glacierlake', '冰川湖', '自然', '实拍 · 湖泊', '#1b2a34', false, {
    provider: 'Wikimedia Commons',
    title: 'Lake and mountain',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Pexels-james-wheeler-417074.jpg',
    license: 'CC0 1.0',
    artist: 'James Wheeler',
  }),
  photo('photo-dawnsea', '海上晨光', '自然', '实拍 · 日出', '#c9b7a8', true, {
    provider: 'Wikimedia Commons',
    title: 'Sunset sky water',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Sunset_sky_water.jpg',
    license: 'CC0 1.0',
    artist: 'PikWizard',
  }),
  photo('photo-firecloud', '火烧云', '自然', '实拍 · 日落', '#2a1712', false, {
    provider: 'Wikimedia Commons',
    title: 'Dramatic golden sunset',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Dramatic_golden_sunset._(Unsplash).jpg',
    license: 'CC0 1.0',
    artist: 'cindy del valle',
  }),
  photo('photo-duskcloud', '暮色云霞', '自然', '实拍 · 云层', '#232a30', false, {
    provider: 'Wikimedia Commons',
    title: 'Sunset Caletense',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Sunset_Caletense_(245636543).jpeg',
    license: 'CC0 1.0',
    artist: 'Joel Alzugaray',
  }),
  photo('photo-milkyway', '星河', '自然', '实拍 · 夜空', '#0c1320', false, {
    provider: 'Wikimedia Commons',
    title: 'Stars and Milky Way over Åbyfjorden',
    pageUrl:
      'https://commons.wikimedia.org/wiki/File:Stars_and_Milky_Way_over_%C3%85byfjorden_2.jpg',
    license: 'CC0 1.0',
    artist: 'W.carter',
  }),
  photo('photo-dunes', '沙丘曲线', '自然', '实拍 · 沙漠', '#cbb79c', true, {
    provider: 'Wikimedia Commons',
    title: 'Hiking Through Sand Dunes',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Hiking_Through_Sand_Dunes_(Unsplash).jpg',
    license: 'CC0 1.0',
    artist: 'Keith Hardy',
  }),
  photo('photo-citynight', '城市夜色', '自然', '实拍 · 城市夜景', '#11161b', false, {
    provider: 'Wikimedia Commons',
    title: 'Cannon on the ramparts, Quebec City',
    pageUrl:
      'https://commons.wikimedia.org/wiki/File:Cannon_on_the_ramparts_and_the_Lower_Town_at_night,_Quebec_City.jpg',
    license: 'CC0 1.0',
    artist: 'Wilfredor',
  }),
  photo('photo-skyline', '天际线', '自然', '实拍 · 城市夜景', '#0f1318', false, {
    provider: 'Wikimedia Commons',
    title: 'Gray High-rise Building at Night',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Gray_High-rise_Building_at_Night_373893.jpg',
    license: 'CC0 1.0',
    artist: 'Mitul Shah',
  }),
  photo('photo-aurora', '极光湖面', '自然', '实拍 · 极光', '#0d1a1e', false, {
    provider: 'Wikimedia Commons',
    title: 'Aurora borealis over water',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:PIXNIO-1094468-aurora_borealis.jpg',
    license: 'CC0 1.0',
    artist: 'Yuliya',
  }),
  photo('photo-waterfall', '彩虹瀑布', '自然', '实拍 · 瀑布', '#1a2422', false, {
    provider: 'Wikimedia Commons',
    title: 'Iceland (Unsplash)',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Iceland_(Unsplash_8ZAxI5FwjFo).jpg',
    license: 'CC0 1.0',
    artist: 'Sorasak Boontohhgraphy',
  }),
  photo('photo-snowroad', '雪国林道', '自然', '实拍 · 雪景', '#b9c2c4', true, {
    provider: 'Wikimedia Commons',
    title: 'Snow Forest Winter Gäddede',
    pageUrl:
      'https://commons.wikimedia.org/wiki/File:Snow_Forest_Winter_G%C3%A4ddede_(Unsplash_3BWzjqbMlDk).jpg',
    license: 'CC0 1.0',
    artist: 'Jon Flobrant',
  }),
  photo('photo-traffic', '暮色车流', '科技', '实拍 · 城市光轨', '#2a2016', false, {
    provider: 'Wikimedia Commons',
    title: 'Bir-Hakeim bridge at dusk',
    pageUrl: 'https://commons.wikimedia.org/wiki/File:Bir-Hakeim_bridge,_Paris_24_June_2021.jpg',
    license: 'CC0 1.0',
    artist: 'Pierre Blaché',
  }),
  photo('photo-nightroad', '夜路光轨', '科技', '实拍 · 光轨', '#101317', false, {
    provider: 'Wikimedia Commons',
    title: 'Highway light trains at night',
    pageUrl:
      'https://commons.wikimedia.org/wiki/File:Highway_light_trains_at_night_(Unsplash).jpg',
    license: 'CC0 1.0',
    artist: 'Jamie Street',
  }),
]

const DESIGN_LIBRARY: PosterBackground[] = [
  photo('design-gradient', '柔光渐变', '抽象', '设计 · 渐变', '#c9bfd4', true, {
    provider: '项目内置生成',
    title: '柔光渐变',
    pageUrl: '',
    license: '随项目发布',
    artist: 'annual-apps-studio',
  }),
  photo('design-glass', '磨砂玻璃', '抽象', '设计 · 玻璃', '#cfd9df', true, {
    provider: '项目内置生成',
    title: '磨砂玻璃',
    pageUrl: '',
    license: '随项目发布',
    artist: 'annual-apps-studio',
  }),
  photo('design-liquid', '液态大理石', '抽象', '设计 · 液态', '#ded4c4', true, {
    provider: '项目内置生成',
    title: '液态大理石',
    pageUrl: '',
    license: '随项目发布',
    artist: 'annual-apps-studio',
  }),
  photo('design-deepblue', '深蓝粒子', '科技', '设计 · 数字粒子', '#0a1322', false, {
    provider: '项目内置生成',
    title: '深蓝粒子',
    pageUrl: '',
    license: '随项目发布',
    artist: 'annual-apps-studio',
  }),
  photo('design-grid', '数据网格', '科技', '设计 · 网格', '#1a2222', false, {
    provider: '项目内置生成',
    title: '数据网格',
    pageUrl: '',
    license: '随项目发布',
    artist: 'annual-apps-studio',
  }),
  photo('design-traces', '光轨曲线', '科技', '设计 · 光轨', '#0b121c', false, {
    provider: '项目内置生成',
    title: '光轨曲线',
    pageUrl: '',
    license: '随项目发布',
    artist: 'annual-apps-studio',
  }),
  photo('design-paper', '米白纸张', '极简', '设计 · 纸张', '#e8dfd2', true, {
    provider: '项目内置生成',
    title: '米白纸张',
    pageUrl: '',
    license: '随项目发布',
    artist: 'annual-apps-studio',
  }),
  photo('design-shadow', '米色光影', '极简', '设计 · 光影', '#ddd0bd', true, {
    provider: '项目内置生成',
    title: '米色光影',
    pageUrl: '',
    license: '随项目发布',
    artist: 'annual-apps-studio',
  }),
]

export const BACKGROUNDS: PosterBackground[] = [
  ...PHOTO_LIBRARY,
  ...DESIGN_LIBRARY,
  {
    id: 'forest',
    name: '林间夜灯',
    family: '经典',
    kind: 'image',
    src: '/backgrounds/bg_forest.webp',
    base: '#0b1512',
    light: false,
  },
  {
    id: 'bay',
    name: '海湾暮色',
    family: '经典',
    kind: 'image',
    src: '/backgrounds/bg_bay.webp',
    base: '#1a2226',
    light: false,
  },
  {
    id: 'night',
    name: '城市夜眺',
    family: '经典',
    kind: 'image',
    src: '/backgrounds/bg_night.webp',
    base: '#0b1014',
    light: false,
  },
  {
    id: 'midnight',
    name: '午夜蓝',
    family: '经典',
    kind: 'css',
    css: `${STARS}, radial-gradient(110% 90% at 72% 8%, rgba(64,104,168,.55), transparent 62%), radial-gradient(80% 70% at 10% 92%, rgba(20,52,88,.6), transparent 70%), linear-gradient(160deg, #0c1930 0%, #070d1b 55%, #04070f 100%)`,
    base: '#070d1b',
    light: false,
  },
  {
    id: 'ink',
    name: '墨黑',
    family: '经典',
    kind: 'css',
    css: `${GRAIN}, radial-gradient(120% 100% at 50% 0%, #2a2d31 0%, #131517 52%, #050607 100%)`,
    base: '#101214',
    light: false,
  },
  {
    id: 'deepgreen',
    name: '深绿',
    family: '经典',
    kind: 'css',
    css: `${GRAIN}, radial-gradient(90% 70% at 20% 10%, rgba(52,110,86,.55), transparent 60%), linear-gradient(150deg, #0d2a22 0%, #061511 100%)`,
    base: '#08201a',
    light: false,
  },
  {
    id: 'paper',
    name: '米白纸',
    family: '极简',
    kind: 'css',
    css: `${PAPER_FIBER}, ${GRAIN}, radial-gradient(120% 100% at 20% 0%, #fbf7ee 0%, #f1ebdf 55%, #e7dfd0 100%)`,
    base: '#f1ebdf',
    light: true,
  },
  {
    id: 'cream',
    name: '奶油',
    family: '极简',
    kind: 'css',
    css: `${GRAIN}, radial-gradient(100% 80% at 25% 15%, #fff9ef 0%, #fbeed8 55%, #f3dfc2 100%)`,
    base: '#fbeed8',
    light: true,
  },
  {
    id: 'mist',
    name: '雾蓝',
    family: '极简',
    kind: 'css',
    css: `radial-gradient(90% 70% at 80% 10%, rgba(255,255,255,.9), transparent 60%), linear-gradient(145deg, #eef3f7 0%, #dfe9f0 55%, #cbd9e4 100%)`,
    base: '#dfe9f0',
    light: true,
  },
  {
    id: 'dawn',
    name: '晨光',
    family: '极简',
    kind: 'css',
    css: `radial-gradient(60% 55% at 82% 12%, rgba(255,244,206,.95), transparent 65%), linear-gradient(160deg, #fff3d8 0%, #fbd9b4 55%, #f3bd94 100%)`,
    base: '#fbd9b4',
    light: true,
  },
  {
    id: 'blush',
    name: '浅粉',
    family: '极简',
    kind: 'css',
    css: `${GRAIN}, radial-gradient(80% 60% at 20% 10%, #fff8fa 0%, #fbe4ec 55%, #f3cfdc 100%)`,
    base: '#fbe4ec',
    light: true,
  },
  {
    id: 'mint',
    name: '浅绿',
    family: '极简',
    kind: 'css',
    css: `${GRAIN}, radial-gradient(80% 70% at 25% 10%, #f6fcf3 0%, #e6f2e2 55%, #d3e6cd 100%)`,
    base: '#e6f2e2',
    light: true,
  },
  {
    id: 'snow',
    name: '雪山',
    family: '经典',
    kind: 'css',
    css: SNOW_SCENE,
    base: '#0d2237',
    light: false,
  },
  {
    id: 'coast',
    name: '海岸',
    family: '经典',
    kind: 'css',
    css: COAST_SCENE,
    base: '#39283f',
    light: false,
  },
  {
    id: 'woodland',
    name: '森林',
    family: '经典',
    kind: 'css',
    css: woodlandScene(),
    base: '#0b1a16',
    light: false,
  },
  {
    id: 'desert',
    name: '沙漠',
    family: '经典',
    kind: 'css',
    css: DESERT_SCENE,
    base: '#d99a5c',
    light: false,
  },
  {
    id: 'aurora',
    name: '极光',
    family: '经典',
    kind: 'css',
    css: AURORA_SCENE,
    base: '#071223',
    light: false,
  },
  {
    id: 'lake',
    name: '湖泊',
    family: '经典',
    kind: 'css',
    css: LAKE_SCENE,
    base: '#25414f',
    light: false,
  },
  {
    id: 'portrait',
    name: '插画人物',
    family: '人物',
    kind: 'css',
    css: PORTRAIT_SCENE,
    base: '#3a2838',
    light: false,
  },
  {
    id: 'silhouette',
    name: '落日剪影',
    family: '人物',
    kind: 'css',
    css: SILHOUETTE_SCENE,
    base: '#8a4a58',
    light: false,
  },
  {
    id: 'profile',
    name: '侧脸',
    family: '人物',
    kind: 'css',
    css: PROFILE_SCENE,
    base: '#eadcc9',
    light: true,
  },
  {
    id: 'mesh',
    name: '渐变',
    family: '抽象',
    kind: 'css',
    css: MESH_SCENE,
    base: '#2b1a4d',
    light: false,
  },
  {
    id: 'grain',
    name: '颗粒',
    family: '抽象',
    kind: 'css',
    css: `${GRAIN}, radial-gradient(100% 100% at 50% 0%, #26282b 0%, #141618 60%, #0a0b0c 100%)`,
    base: '#141618',
    light: false,
  },
  {
    id: 'glass',
    name: '玻璃',
    family: '抽象',
    kind: 'css',
    css: GLASS_SCENE,
    base: '#c3d5e2',
    light: true,
  },
  {
    id: 'starry',
    name: '星空',
    family: '经典',
    kind: 'css',
    css: STARRY_SCENE,
    base: '#050b18',
    light: false,
  },
  {
    id: 'violet',
    name: '暗紫',
    family: '经典',
    kind: 'css',
    css: `${GRAIN}, radial-gradient(100% 90% at 30% 10%, #4a2a6e 0%, #261543 52%, #0c0718 100%)`,
    base: '#1d1132',
    light: false,
  },
  {
    id: 'neon',
    name: '霓虹巷',
    family: '经典',
    kind: 'css',
    css: NEON_SCENE,
    base: '#07060f',
    light: false,
  },
  {
    id: 'bokeh',
    name: '光斑',
    family: '经典',
    kind: 'css',
    css: BOKEH_SCENE,
    base: '#04100f',
    light: false,
  },
  {
    id: 'sand',
    name: '暖沙',
    family: '极简',
    kind: 'css',
    css: SAND_SCENE,
    base: '#f4dfbf',
    light: true,
  },
  {
    id: 'stone',
    name: '灰白',
    family: '极简',
    kind: 'css',
    css: `${GRAIN}, radial-gradient(120% 100% at 20% 0%, #f5f5f2 0%, #e5e6e1 55%, #d4d6d0 100%)`,
    base: '#e5e6e1',
    light: true,
  },
  {
    id: 'sunset',
    name: '日落',
    family: '经典',
    kind: 'css',
    css: SUNSET_SCENE,
    base: '#8a3f57',
    light: false,
  },
  {
    id: 'mountmist',
    name: '山雾',
    family: '经典',
    kind: 'css',
    css: MIST_SCENE,
    base: '#c3d2d9',
    light: true,
  },
  {
    id: 'waves',
    name: '海浪',
    family: '经典',
    kind: 'css',
    css: WAVES_SCENE,
    base: '#0c2a3e',
    light: false,
  },
  {
    id: 'backfigure',
    name: '背影',
    family: '人物',
    kind: 'css',
    css: BACKFIGURE_SCENE,
    base: '#e8d2b6',
    light: true,
  },
  {
    id: 'halo',
    name: '光晕',
    family: '抽象',
    kind: 'css',
    css: `${GRAIN}, radial-gradient(55% 50% at 50% 45%, rgba(255,196,128,.9) 0%, rgba(122,74,120,.55) 40%, rgba(14,10,24,.96) 78%), linear-gradient(160deg, #191227, #070510)`,
    base: '#120c1d',
    light: false,
  },
  {
    id: 'ripple',
    name: '波纹',
    family: '抽象',
    kind: 'css',
    css: RIPPLE_SCENE,
    base: '#dcebf1',
    light: true,
  },
]

export const BACKGROUND_MAP = new Map(BACKGROUNDS.map((background) => [background.id, background]))

export function getBackground(id: string): PosterBackground {
  return BACKGROUND_MAP.get(id) ?? BACKGROUNDS[0]
}
