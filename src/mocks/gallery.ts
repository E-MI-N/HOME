export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  date: string;
  url: string;
  isLandscape: boolean;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: '첫 번째 초상',
    description: '아라엘의 공식 캐릭터 일러스트. 알케마 협회 시절 복장.',
    tags: ['공식', '전신', '초상'],
    date: '2025.08',
    url: 'https://readdy.ai/api/search-image?query=beautiful%20dark%20fantasy%20half-elf%20female%20mage%20with%20long%20silver%20white%20hair%20deep%20violet%20eyes%20wearing%20elaborate%20black%20robes%20gold%20rune%20embroidery%20standing%20ancient%20temple%20dramatic%20purple%20gold%20lighting%20mystical%20atmosphere%20full%20body%20portrait%20highly%20detailed%20digital%20illustration%20fantasy%20art%20professional&width=600&height=600&seq=gal001&orientation=squarish',
    isLandscape: false,
  },
  {
    id: 2,
    title: '고대 도서관',
    description: '에레노아 숲 깊은 곳의 금지된 도서관에서 고대 문자를 해독하는 장면.',
    tags: ['배경', '서사', '도서관'],
    date: '2025.09',
    url: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20female%20mage%20silver%20white%20hair%20in%20ancient%20magical%20library%20surrounded%20by%20floating%20glowing%20tomes%20scrolls%20candlelight%20blue%20magical%20glow%20intricate%20bookshelves%20tall%20ceiling%20mysterious%20atmosphere%20highly%20detailed%20digital%20art%20fantasy%20environment%20beautiful%20lighting%20professional&width=600&height=600&seq=gal002&orientation=squarish',
    isLandscape: false,
  },
  {
    id: 3,
    title: '망각의 주문',
    description: '금지 마법을 시전하는 전투 장면. 협회와의 마지막 대치.',
    tags: ['전투', '마법', '드라마틱'],
    date: '2025.10',
    url: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20half-elf%20female%20mage%20silver%20hair%20dramatically%20casting%20void%20magic%20swirling%20dark%20purple%20black%20energy%20powerful%20spell%20dynamic%20action%20pose%20storm%20ruins%20background%20cinematic%20lighting%20highly%20detailed%20fantasy%20battle%20art%20digital%20illustration&width=800&height=500&seq=gal003&orientation=landscape',
    isLandscape: true,
  },
  {
    id: 4,
    title: '은빛 시선',
    description: '아라엘 클로즈업 초상. 처음으로 공개한 얼굴 중심 일러스트.',
    tags: ['클로즈업', '초상', '감성'],
    date: '2025.11',
    url: 'https://readdy.ai/api/search-image?query=closeup%20portrait%20elegant%20dark%20fantasy%20half-elf%20female%20silver%20white%20hair%20violet%20glowing%20eyes%20mysterious%20expression%20subtle%20smile%20delicate%20gold%20jewelry%20ethereal%20soft%20atmospheric%20bokeh%20background%20painterly%20detailed%20illustration%20fantasy%20character%20art%20beautiful%20quality&width=600&height=600&seq=gal004&orientation=squarish',
    isLandscape: false,
  },
  {
    id: 5,
    title: '폐허 순례',
    description: '잊혀진 마을의 폐허를 기록하는 여정 중.',
    tags: ['배경', '여정', '감성'],
    date: '2025.12',
    url: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20female%20mage%20silver%20white%20hair%20walking%20ancient%20overgrown%20stone%20ruins%20twilight%20dark%20flowing%20cloak%20billowing%20glowing%20magical%20runes%20carved%20walls%20atmospheric%20misty%20moonlight%20highly%20detailed%20landscape%20digital%20art%20fantasy%20atmospheric%20beautiful&width=800&height=500&seq=gal005&orientation=landscape',
    isLandscape: true,
  },
  {
    id: 6,
    title: '별빛 명상',
    description: '별이 쏟아지는 밤, 기억의 파편들을 정리하는 시간.',
    tags: ['감성', '명상', '야경'],
    date: '2026.01',
    url: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20half-elf%20female%20mage%20meditating%20under%20starry%20night%20sky%20floating%20cross-legged%20ancient%20stone%20floor%20glowing%20magical%20constellation%20patterns%20emanating%20from%20hands%20deep%20atmospheric%20background%20stars%20galaxies%20peaceful%20mystical%20detailed%20fantasy%20illustration&width=600&height=600&seq=gal006&orientation=squarish',
    isLandscape: false,
  },
  {
    id: 7,
    title: '각인 의식',
    description: '시간의 각인 마법을 공간에 새기는 의식.',
    tags: ['마법', '의식', '드라마틱'],
    date: '2026.01',
    url: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20female%20mage%20performing%20ancient%20magical%20ritual%20in%20glowing%20inscribed%20magic%20circle%20carved%20stone%20floor%20ethereal%20silver%20purple%20light%20particles%20swirling%20dramatic%20overhead%20angle%20dark%20ancient%20temple%20atmosphere%20detailed%20fantasy%20digital%20illustration%20professional%20quality&width=600&height=600&seq=gal007&orientation=squarish',
    isLandscape: false,
  },
  {
    id: 8,
    title: '폐허의 별빛 — 파티',
    description: 'TRPG 캠페인 「폐허의 별빛」 파티 단체 일러스트.',
    tags: ['TRPG', '파티', '단체'],
    date: '2026.02',
    url: 'https://readdy.ai/api/search-image?query=group%20dark%20fantasy%20adventurers%20female%20mage%20silver%20white%20hair%20surrounded%20by%20diverse%20party%20warrior%20rogue%20cleric%20standing%20before%20massive%20ancient%20glowing%20gate%20epic%20composition%20dramatic%20cloudy%20sky%20detailed%20landscape%20illustration%20fantasy%20art%20cinematic%20high%20quality&width=800&height=500&seq=gal008&orientation=landscape',
    isLandscape: true,
  },
  {
    id: 9,
    title: '가면무도회',
    description: '잠입 임무 중 가면무도회에 참석한 아라엘.',
    tags: ['이벤트', '드레스업', 'TRPG'],
    date: '2026.03',
    url: 'https://readdy.ai/api/search-image?query=elegant%20dark%20fantasy%20half-elf%20female%20mage%20masquerade%20ball%20silver%20hair%20pinned%20gold%20ornaments%20formal%20dark%20evening%20gown%20magical%20embroidery%20gold%20half%20mask%20sophisticated%20candlelit%20grand%20ballroom%20mysterious%20guests%20fantasy%20atmosphere%20beautiful%20detailed%20art&width=600&height=600&seq=gal009&orientation=squarish',
    isLandscape: false,
  },
];

export const galleryTags = ['전체', '공식', '초상', '전신', '배경', '서사', '전투', '마법', '드라마틱', '감성', '명상', '야경', 'TRPG', '파티', '이벤트'];
