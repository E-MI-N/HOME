export interface TrpgSession {
  id: number;
  sessionNumber: number;
  title: string;
  date: string;
  summary: string;
  highlights: string[];
  image: string;
  status: '완료' | '예정';
}

export interface TrpgCampaign {
  id: number;
  title: string;
  titleEn: string;
  system: string;
  status: '진행 중' | '완료' | '준비 중';
  startDate: string;
  endDate?: string;
  description: string;
  gm: string;
  playerCount: number;
  image: string;
  sessions: TrpgSession[];
}

export const campaigns: TrpgCampaign[] = [
  {
    id: 1,
    title: '폐허의 별빛',
    titleEn: 'Stars Among Ruins',
    system: 'D&D 5e',
    status: '진행 중',
    startDate: '2025.10.05',
    description: '30년 전 갑작스럽게 사라진 고대 도시 "에세르"의 진실을 파헤치는 캠페인. 아라엘은 이 도시와 관련된 기억 조작의 흔적을 쫓아 파티에 합류하게 된다.',
    gm: 'DM 별빛',
    playerCount: 4,
    image: 'https://readdy.ai/api/search-image?query=epic%20dark%20fantasy%20ancient%20ruined%20magical%20city%20under%20starlit%20night%20sky%20broken%20towers%20reclaimed%20by%20nature%20ethereal%20floating%20lights%20atmospheric%20cinematic%20deep%20dark%20purple%20gold%20color%20palette%20fantasy%20environment%20concept%20art%20highly%20detailed%20wide%20shot&width=900&height=420&seq=trpgbanner01&orientation=landscape',
    sessions: [
      {
        id: 1,
        sessionNumber: 1,
        title: '첫 만남과 폐허의 도시',
        date: '2025.10.05',
        summary: '에레노아 항구 도시의 한 술집에서 파티원들과 처음 만났다. 각자 다른 목적으로 "에세르"를 찾고 있음을 알게 되었고, 일단 협력하기로 결정. 도시 외곽 폐허에서 망각 마법의 흔적을 처음 발견했다.',
        highlights: ['루카스 (팔라딘)와 첫 만남', '망각 마법 흔적 최초 발견', '폐허 초입에서 언데드 3마리 처치'],
        image: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20adventurers%20gathering%20smoky%20atmospheric%20tavern%20candlelight%20hooded%20cloaked%20figures%20wooden%20table%20with%20maps%20weapons%20scrolls%20mysterious%20mood%20warm%20interior%20lighting%20detailed%20fantasy%20illustration&width=500&height=300&seq=trpgs01&orientation=landscape',
        status: '완료',
      },
      {
        id: 2,
        sessionNumber: 2,
        title: '고탑의 비밀',
        date: '2025.11.02',
        summary: '에세르 도시 중심부에 위치한 고탑을 탐색했다. 탑 꼭대기에서 협회의 기억 은폐 프로젝트에 관한 결정적 문서를 발견. 아라엘이 문서를 해독하는 동안, 루카스가 야경대를 막아주었다.',
        highlights: ['협회 기밀 문서 발견', 'INT 판정 대성공 (자연 20)', '루카스와 첫 의미 있는 대화'],
        image: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20adventurers%20exploring%20ancient%20tall%20stone%20tower%20at%20night%20spiral%20staircase%20glowing%20magical%20orb%20top%20dramatic%20vertical%20composition%20purple%20magical%20glow%20atmospheric%20mysterious%20detailed%20illustration%20fantasy&width=500&height=300&seq=trpgs02&orientation=landscape',
        status: '완료',
      },
      {
        id: 3,
        sessionNumber: 3,
        title: '망각의 주문',
        date: '2025.12.14',
        summary: '탑에서 얻은 정보를 바탕으로 협회 요원 추적. 접선 장소에서 협회 마법사와 전투. 아라엘이 "기억의 실"을 사용해 요원의 기억을 추출했으나, 이후 일시적인 기억 혼선 발생.',
        highlights: ['기억의 실 실전 첫 사용', '기억 혼선 부작용 (WIS 판정 실패)', '미아 (드루이드)에게 첫 속내 공개'],
        image: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20mage%20silver%20hair%20casting%20memory%20manipulation%20magic%20silver%20light%20tendrils%20ghostly%20figures%20dramatic%20void%20memory%20magic%20purple%20white%20ethereal%20energy%20atmosphere%20detailed%20fantasy%20digital%20illustration&width=500&height=300&seq=trpgs03&orientation=landscape',
        status: '완료',
      },
      {
        id: 4,
        sessionNumber: 4,
        title: '에세르의 심장부',
        date: '2026.01.18',
        summary: '도시 중심부 지하로 진입. 30년 전 실험의 실제 규모를 확인했다. 기억이 각인된 수백 개의 마법석 발견. 아라엘은 이 마법석들을 해방시키기로 결정하지만, 협회의 인형이 된 옛 스승과 조우한다.',
        highlights: ['마법석 군집 발견 (기억 각인 392개)', '옛 스승 마리엘 재회', '파티 전원 HP 위기, 탈출 성공'],
        image: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20battle%20ancient%20underground%20ruins%20adventurers%20fighting%20magical%20constructs%20guardian%20golems%20dramatic%20magical%20explosions%20energy%20cinematic%20composition%20highly%20detailed%20digital%20fantasy%20art%20intense%20atmosphere&width=500&height=300&seq=trpgs04&orientation=landscape',
        status: '완료',
      },
      {
        id: 5,
        sessionNumber: 5,
        title: '선택의 날',
        date: '2026.04 예정',
        summary: '옛 스승을 구출하는 것이 가능한지, 협회에 정면으로 맞설 것인지, 아니면 증거를 갖고 도망칠 것인지. 다음 세션에서 중요한 선택을 해야 할 것 같다.',
        highlights: ['옛 스승 마리엘 구출 여부 결정', '협회 본부 습격 또는 도주', '아라엘 개인 퀘스트 분기점'],
        image: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20dramatic%20confrontation%20gothic%20cathedral%20hall%20adventurers%20facing%20ancient%20powerful%20archmage%20glowing%20magical%20artifacts%20tense%20standoff%20ornate%20architecture%20candlelit%20high%20ceiling%20atmosphere%20epic%20fantasy%20illustration&width=500&height=300&seq=trpgs05&orientation=landscape',
        status: '예정',
      },
    ],
  },
  {
    id: 2,
    title: '붉은 달의 예언',
    titleEn: 'Prophecy of the Crimson Moon',
    system: 'D&D 5e',
    status: '완료',
    startDate: '2025.03.20',
    endDate: '2025.08.10',
    description: '붉은 달이 뜨는 날 세계가 멸망한다는 예언을 막기 위한 단기 캠페인. 아라엘은 예언서를 해독하는 역할로 참가했다.',
    gm: 'DM 밤하늘',
    playerCount: 3,
    image: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20dramatic%20blood%20red%20crimson%20full%20moon%20over%20ancient%20dark%20forest%20silhouetted%20twisted%20trees%20ominous%20atmosphere%20dark%20red%20sky%20glowing%20magic%20runes%20stones%20ground%20level%20cinematic%20fantasy%20landscape%20art%20highly%20detailed%20wide&width=900&height=420&seq=trpgbanner02&orientation=landscape',
    sessions: [
      {
        id: 6,
        sessionNumber: 1,
        title: '예언서의 첫 페이지',
        date: '2025.03.20',
        summary: '고대 예언서를 발견하고 해독을 시작한 첫 세션.',
        highlights: ['예언서 발견 및 해독 시작', '붉은 달 사제단과 첫 접촉'],
        image: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20ancient%20prophecy%20glowing%20red%20runes%20book%20open%20stone%20altar%20candlelight%20mysterious%20robed%20figures%20in%20shadows%20old%20library%20dramatic%20atmosphere%20fantasy%20illustration%20detailed&width=500&height=300&seq=trpgs06&orientation=landscape',
        status: '완료',
      },
      {
        id: 7,
        sessionNumber: 2,
        title: '붉은 달 사제단',
        date: '2025.05.11',
        summary: '사제단의 본거지에 잠입. 예언의 진상을 파악하기 시작했다.',
        highlights: ['사제단 본거지 잠입', '예언의 왜곡된 의도 파악'],
        image: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20adventurers%20infiltrating%20mysterious%20crimson%20robed%20cult%20ritual%20underground%20stone%20chamber%20eerie%20red%20torchlight%20ominous%20symbols%20walls%20tension%20stealth%20atmosphere%20fantasy%20illustration%20detailed&width=500&height=300&seq=trpgs07&orientation=landscape',
        status: '완료',
      },
      {
        id: 8,
        sessionNumber: 3,
        title: '예언의 끝',
        date: '2025.08.10',
        summary: '최종 대결. 붉은 달의 예언이 인간이 만든 거짓임을 밝히고 사제단을 해산시켰다.',
        highlights: ['최종 보스 전투', '예언 진상 규명', '성공적인 엔딩'],
        image: 'https://readdy.ai/api/search-image?query=dark%20fantasy%20climactic%20final%20battle%20under%20blood%20red%20moon%20sky%20ancient%20stone%20temple%20dramatic%20magic%20explosions%20heroes%20victorious%20against%20dark%20priest%20lord%20cinematic%20epic%20composition%20highly%20detailed%20fantasy%20digital%20art&width=500&height=300&seq=trpgs08&orientation=landscape',
        status: '완료',
      },
    ],
  },
];
