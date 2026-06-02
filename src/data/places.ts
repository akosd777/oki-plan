/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Place, TravelStyleInfo, StyleTestQuestion } from '../types';

export const SAMPLE_PLACES: Place[] = [
  {
    id: '1',
    name: '츄라우미 수족관',
    category: '관광지',
    region: '북부',
    description: '세계에서 두 번째로 큰 아쿠아리움으로, 거대한 고래상어와 쥐가오리가 눈앞에서 투명하게 헤엄치는 \'흑潮의 바다\' 수조가 대표 명소입니다.',
    image: 'https://picsum.photos/seed/churaumi/600/400',
    recommendedDuration: '2시간 30분',
    averageCost: 21800, // 약 2,180엔 상당 원화
    tags: ['가족인기', '상징적', '실내코스']
  },
  {
    id: '2',
    name: '만좌모',
    category: '관광지',
    region: '중부',
    description: '\'만 명이 앉아도 충족할 벌판\'이라는 고사와 코끼리 코 형상의 바위벽, 에메랄드빛 바다가 만든 기이한 천혜의 절벽 경관입니다.',
    image: 'https://picsum.photos/seed/manzamo/600/400',
    recommendedDuration: '1시간',
    averageCost: 1000, // 입장료 약 100엔
    tags: ['풍경맛집', '노을명소', '인생샷']
  },
  {
    id: '3',
    name: '아메리칸 빌리지',
    category: '관광지',
    region: '중부',
    description: '미국 캘리포니아 해안 도시 감성을 살려 형성된 스트리트 몰. 아기자기한 이국적 상점들과 선셋 비치의 몽환적인 저녁 노을로 유명합니다.',
    image: 'https://picsum.photos/seed/americanvillage/600/400',
    recommendedDuration: '3시간',
    averageCost: 0,
    tags: ['야경명소', '쇼핑천국', '이국적']
  },
  {
    id: '4',
    name: '코우리 대교 & 쉬림프 웨건',
    category: '관광지',
    region: '북부',
    description: '양옆으로 옥시메 바다 에메랄드 물빛을 가르며 달리는 2km 길이의 장쾌한 드라이브 코스. 끝자락에 위치한 맛있는 버터 마늘 새우 구이 시식은 필수입니다.',
    image: 'https://picsum.photos/seed/kouri/600/400',
    recommendedDuration: '2시간',
    averageCost: 15000,
    tags: ['드라이브', '데이트코스', '새우맛집']
  },
  {
    id: '5',
    name: '슈리성',
    category: '관광지',
    region: '남부',
    description: '류큐 왕국의 찬란했던 번영을 한눈에 볼 수 있는 한색 짙은 독특한 붉은 성채. 주변 돌담길과 류큐 고택들의 돌담 유적이 깊은 감성을 풍깁니다.',
    image: 'https://picsum.photos/seed/shuri/600/400',
    recommendedDuration: '1시간 30분',
    averageCost: 4000,
    tags: ['역사탐방', '류큐유산', '포토스팟']
  },
  {
    id: '6',
    name: '비세 Fukugi 가로수길',
    category: '관광지',
    region: '북부',
    description: '태풍을 막기 위해 심어진 수천 그루의 울창한 후쿠기(복나무) 가로수가 터널을 이루는 고즈넉한 대안길. 피톤치드 세례와 조용한 모래 자갈길 산책을 즐겨보세요.',
    image: 'https://picsum.photos/seed/fukugi/600/400',
    recommendedDuration: '1시간',
    averageCost: 5000, // 자전거 대여료 포함
    tags: ['힐링산책', '자전거길', '인생사진']
  },
  {
    id: '7',
    name: '오키나와 월드',
    category: '관광지',
    region: '남부',
    description: '동양 최대 규모이자 30만 년 역사의 신비로운 석회 종유동굴 \'교쿠센도\'와 민속 전통 음악인 에이샤 공연 무대를 고루 갖춘 전통 컬처 파크입니다.',
    image: 'https://picsum.photos/seed/okinawaworld/600/400',
    recommendedDuration: '2시간',
    averageCost: 20000,
    tags: ['대동굴', '민속공연', '가족단위']
  },
  {
    id: '8',
    name: '국제거리 (코쿠사이도리)',
    category: '관광지',
    region: '남부',
    description: '나하 최대의 번화가이자 기적의 1마일로 불리는 쇼핑 거리. 기념품 숍, 오키나와 로컬 푸드 야타이(포장마차 거리)로 밤늦게까지 사람들의 온기로 활기찹니다.',
    image: 'https://picsum.photos/seed/kokusaidori/600/400',
    recommendedDuration: '2시간 30분',
    averageCost: 0,
    tags: ['기념품', '실비야시장', '도심중심']
  },
  {
    id: '9',
    name: '시마부타야',
    category: '음식점',
    region: '중부',
    description: '오키나와 토종 흑돼지 \'아구\' 요리 전문점. 편백나무 찜기에서 육즙 가득하게 쪄내어 담백하며 참깨 소스와의 환상 궁합을 자랑하는 특산 미식입니다.',
    image: 'https://picsum.photos/seed/shimabutaya/600/400',
    recommendedDuration: '1시간 30분',
    averageCost: 35000,
    tags: ['아구흑돼지', '편백찜', '중부맛집']
  },
  {
    id: '10',
    name: '우후야 (아열대 고택 맛집)',
    category: '음식점',
    region: '북부',
    description: '100년 명가를 복원한 전통 가옥 식당. 작은 폭포 정원에서 물소리를 들으며 오동통한 오키나와식 메밀 소바와 흑돼지 생갈비 전골을 멋스럽게 즐길 수 있습니다.',
    image: 'https://picsum.photos/seed/ufuya/600/400',
    recommendedDuration: '1시간 30분',
    averageCost: 22000,
    tags: ['고택감성', '폭포소리', '오키나와소바']
  },
  {
    id: '11',
    name: '플리퍼 스테이크',
    category: '음식점',
    region: '북부',
    description: '추라우미 수족관 근교에 위치한 로컬 수제안심 스테이크 강자. 아주 수수한 수제 가마가 만든 향긋한 하우스 소스와 살살 녹는 질 좋은 안심살이 조화롭습니다.',
    image: 'https://picsum.photos/seed/flipper/600/400',
    recommendedDuration: '1시간',
    averageCost: 28000,
    tags: ['가성비고기', '현지인맛집', '겉바속촉']
  },
  {
    id: '12',
    name: '88스테이크 (국제거리점)',
    category: '음식점',
    region: '남부',
    description: '미군 기지 정서에서 퍼져나간 오키나와의 대표적인 올드스쿨 스테이크 하우스. 소박하지만 육즙 가득 거대 안심과 꽃등심을 한국인 취향의 마늘 가득 특제 소스로 제공합니다.',
    image: 'https://picsum.photos/seed/steak88/600/400',
    recommendedDuration: '1시간',
    averageCost: 30000,
    tags: ['아메리칸식', '육즙가득', '클래식']
  },
  {
    id: '13',
    name: '요미탄 도자기마을 토카토카',
    category: '카페',
    region: '중부',
    description: '도자기를 굽는 수제 공방들이 옹기종기 모인 요미탄 카페. 높은 고도에서 에메랄드빛 해변 선을 바라보며 시원한 오키나와 라떼와 흑설탕 디저트를 즐길 수 있습니다.',
    image: 'https://picsum.photos/seed/tokatoka/600/400',
    recommendedDuration: '1시간 30분',
    averageCost: 8000,
    tags: ['도자기감성', '오션뷰', '수제도넛']
  },
  {
    id: '14',
    name: '세나가지마 우미카지 테라스',
    category: '카페',
    region: '남부',
    description: '공항에서 15분 거리에 있는 온천섬의 지중해풍 흰색 계단식 테라스 타운. 시원한 파도와 고막을 흔드는 우렁찬 비행기 이착륙 소리가 오코노미 선셋과 함께 환상적인 전율을 선사합니다.',
    image: 'https://picsum.photos/seed/umikaji/600/400',
    recommendedDuration: '2시간',
    averageCost: 12000,
    tags: ['비행기뷰', '지중해풍', '수플레팬케이크']
  },
  {
    id: '15',
    name: '숲속 야치문 카페 반야',
    category: '카페',
    region: '북부',
    description: '아열대 밀림 깊은 언덕에 위치해 독특한 기와지붕과 나무 마루가 마음을 정화시켜주는 숲속 찻집. 시원하고 고요한 자연의 새소리를 벗 삼아 차를 내려마십니다.',
    image: 'https://picsum.photos/seed/banya/600/400',
    recommendedDuration: '1시간 30분',
    averageCost: 7000,
    tags: ['아열대숲', '고요한차실', '자연주의']
  },
  {
    id: '16',
    name: '푸른동굴 스노클링 체험',
    category: '레저',
    region: '중부',
    description: '동중국해 마에다 곶 아래, 햇빛 반사로 물이 천연 형광 블루색으로 찬란하게 발광하는 동굴 잠수 투어. 물고기들에게 먹이를 주는 환상적인 스노클링 경험입니다.',
    image: 'https://picsum.photos/seed/bluecave/600/400',
    recommendedDuration: '2시간',
    averageCost: 45000,
    tags: ['푸른동굴', '스노클링', '물고기먹이']
  },
  {
    id: '17',
    name: '비치 클럽 레저 (제트스키&바나나)',
    category: '레저',
    region: '북부',
    description: '세세코 섬 해변의 눈부신 모래사장 위에서 모터보트, 패러세일링, 오키나와 초고속 제트스키를 타고 오키나와의 푸른 하늘로 솟구치며 속도감을 가득 음미합니다.',
    image: 'https://picsum.photos/seed/jetski/600/400',
    recommendedDuration: '1시간 30분',
    averageCost: 55000,
    tags: ['해양레포츠', '날아갈듯', '짜릿함']
  },
  {
    id: '18',
    name: '바다 횡단 메가 집라인',
    category: '레저',
    region: '중부',
    description: '올드 오키나와 해안선 리조트를 연결하는 250미터 길이의 대형 해상 로프 하강 레저. 허공에서 양날을 펼치고 짙푸른 산호초 해변 상공을 활강하는 아찔한 쾌감!',
    image: 'https://picsum.photos/seed/zipline/600/400',
    recommendedDuration: '1시간',
    averageCost: 35000,
    tags: ['공중활강', '스릴만점', '바다전경']
  },
  {
    id: '19',
    name: '세나가지마 투명 카약',
    category: '레저',
    region: '남부',
    description: '카약 밑바닥이 온통 투과 유리막으로 덮여 수심 깊은 산호초군과 오색 열대어의 움직임을 바닥을 내려다보며 투명하게 관찰하는 평온하고도 신기한 체험입니다.',
    image: 'https://picsum.photos/seed/kayak/600/400',
    recommendedDuration: '1시간 30분',
    averageCost: 28000,
    tags: ['투명카약', '바다탐정', '아이랑함께']
  },
  {
    id: '20',
    name: '나고 파인애플 파크 카트',
    category: '레저',
    region: '북부',
    description: '\'파인애플\' 모양의 귀엽고 앙증맞은 자동 자율주행 카트를 올라타고 광활하게 우거진 아열대 식물원과 실제 파인애플 밭 사이사이를 보물찾기하듯 탐험하는 신나는 코스입니다.',
    image: 'https://picsum.photos/seed/pineapple/600/400',
    recommendedDuration: '1시간 30분',
    averageCost: 12000,
    tags: ['귀여운카트', '과일시식', '어린이저격']
  }
];

export const TRAVEL_STYLES: Record<string, TravelStyleInfo> = {
  healing: {
    type: 'healing',
    name: '힐링형 (Healing Planner)',
    slogan: '복잡한 머리를 식히고 파도 소리에 쉼표를 찍는 안식형 여정',
    description: '오키나와의 시원한 바람이 전해지는 비세 후쿠기 가로수길을 한적하게 걸으며 깊게 호흡합니다. 낮에는 눈앞에 에메랄드빛 오션뷰가 가득 펼쳐진 카페에서 수플레 펜케이크를 먹고 저녁에는 붉어지는 시나리오를 보며 온천욕을 하는 잔잔하고 평화가 온전히 보존된 슬로우 힐링을 선호합니다.',
    recommendedPlaces: ['6', '13', '14', '15'],
    keyEmoji: '🧘',
    colorClass: 'from-emerald-400 via-teal-500 to-teal-600',
    bgHex: '#E6F4EA',
    textHex: '#137333',
    courseSummary: 'Day 1: 남부 우미카지 테라스 ➡️ Day 2: 중부 만좌모 & 요미탄 카페 토카토카 ➡️ Day 3: 북부 비세 후쿠기 가로수길 산책 & 야치문 숲속 반야'
  },
  foodie: {
    type: 'foodie',
    name: '미식가형 (Gourmet Foodie)',
    slogan: '아구 흑돼지에서 육즙 가득 스테이크까지 오감을 점령하는 푸드 트립',
    description: '여행에서 가장 귀중하고 행복한 순간은 마법 같은 입속 첫 입의 떨림이라고 믿습니다. 오키나와 로컬 특산 아구 흑돼지 샤브샤브의 담백함, 고색창연한 우후야 100년 전통가옥의 시원한 폭포소리 옆 오동통한 온소바, 그리고 미군 주둔 역사에서 가득 번성해 한국인 입맛을 자극하는 소고기 스테이크 노포 원정을 떠납니다.',
    recommendedPlaces: ['9', '10', '11', '12'],
    keyEmoji: '🍴',
    colorClass: 'from-amber-400 via-orange-500 to-orange-600',
    bgHex: '#FEF7E0',
    textHex: '#B06000',
    courseSummary: 'Day 1: 국제거리 88스테이크 저녁 ➡️ Day 2: 편백나무 찜 시마부타야 ➡️ Day 3: 폭포수 고택 옆 우후야 소바 정식 & 코우리 쉬림프 웨건'
  },
  explorer: {
    type: 'explorer',
    name: '탐험가형 (Active Explorer)',
    slogan: '랜드마크 구석구석, 류큐 왕국 역사와 자연 명승지 도장 점령',
    description: '세계 2위 규모의 츄라우미 고래상어는 물론 드높은 만좌모 절벽에 발자국을 남기고, 슈리성 붉은 기와의 기품 아래 류큐 독립 군주의 옛 숨결을 상상해보는 대장정. 드넓은 30만 년 동양 최대 석회동굴 교쿠센도의 웅장함에 찬탄하며 바지런히 인생 사진 필름을 채우는 열정 탐험가입니다.',
    recommendedPlaces: ['1', '2', '4', '5', '7'],
    keyEmoji: '🧭',
    colorClass: 'from-blue-400 via-indigo-500 to-indigo-600',
    bgHex: '#E8F0FE',
    textHex: '#1A73E8',
    courseSummary: 'Day 1: 류큐 슈리성 투어 및 석회 대용동굴 오키나와 월드 ➡️ Day 2: 중부 만좌모 ➡️ Day 3: 북부 츄라우미 수족관 관람 후 드라이브'
  },
  activity: {
    type: 'activity',
    name: '액티비티형 (Adventure Fanatic)',
    slogan: '바다 깊이 다이빙부터 상공 비행까지 아드레날린 폭발 익스트림',
    description: '빛나는 형광 형체로 황홀하게 어보를 자아내는 신비의 마에다 곶 푸른동굴 속에 뛰어들고, 장엄한 남중국 바다 상공 위 250m 해상 빨간 실선 줄 하나에 의지해 활강하는 메가 집라인을 가르며 소리를 지릅니다! 지루할 틈 없이 심장의 시동을 켜둔 채 세세코 해변 질주 카트로 끝내 액티브함의 활력으로 채웁니다.',
    recommendedPlaces: ['16', '17', '18', '20'],
    keyEmoji: '🏄',
    colorClass: 'from-pink-400 via-rose-500 to-rose-600',
    bgHex: '#FCE8E6',
    textHex: '#C5221F',
    courseSummary: 'Day 1: 남부 투명 카약 타기 ➡️ Day 2: 푸른동굴 스노클링 잠수 & 해상 메가 집라인 하강 ➡️ Day 3: 북부 비치 카트 & 제트스키 레이싱 어벤저'
  }
};

export const STYLE_TEST_QUESTIONS: StyleTestQuestion[] = [
  {
    id: 1,
    question: '나만의 휴가를 상상해볼까요? 이번 오키나와 여행에 당신이 동경하는 숙소 타입은?',
    options: [
      { text: '조용한 전용 프라이빗 비치를 낀 아주 평화로운 오션뷰 럭셔리 리조트', type: 'healing' },
      { text: '내부에 다양한 해양 레저 상품 및 스노클링 강습 패키지가 있는 액티비티형 리조트', type: 'activity' },
      { text: '중부 아메리칸 빌리지나 시내 국제거리에 인접해 근처 맛집 도보 5분이 보장되는 호텔', type: 'foodie' },
      { text: '일정에 따라 동선을 탄력적으로 짜기 좋은 북부와 남부를 이어주는 교통 요지의 깔끔한 비즈니스 호텔', type: 'explorer' }
    ]
  },
  {
    id: 2,
    question: '오키나와에 막 도착한 오후! 렌터카 핸들을 잡은 뒤 가장 처음 차창에 흐르는 오키나와 바다를 만난다면?',
    options: [
      { text: '차를 그늘진 야자수 밑에 세워놓고 음악을 크게 튼 뒤 고요하게 에메랄드파도를 음미한다.', type: 'healing' },
      { text: '당장 구명조끼부터 수거해와 시원하게 다이빙 스노클링이나 서핑을 할 수 있는지 안전 기지를 물색해둔다.', type: 'activity' },
      { text: '지나가기 전에 미리 별점 등록해 둔 오키나와 전통 소바 맛집 대기 줄이 긴지 주차장을 훑는다.', type: 'foodie' },
      { text: '근처에 있는 슈리성 역사지구나 유명 해안 절벽 전망대 매표소 마감 시간을 가늠하며 고고씽한다.', type: 'explorer' }
    ]
  },
  {
    id: 3,
    question: '친구가 "내일은 어디 갈까?"라고 일정을 묻습니다. 당신의 대답에 가까운 유형은?',
    options: [
      { text: '"글쎄, 일단 일어나서 날씨 좋으면 예쁜 카페 가서 멍 때리다가 천천히 정해보자."', type: 'healing' },
      { text: '"내일은 명물 아구 샤브샤브 점심하고, 우후야 폭포 소바를 지나 스테이크 저녁까지 3대 맛집 정복의 날!"', type: 'foodie' },
      { text: '"오전 9시 츄라우미 가고, 오후엔 만좌모랑 코우리대교를 다 건너야 해! 알찬 드라이브 기획 완료했어."', type: 'explorer' },
      { text: '"내일 아침 10시 푸른동굴 스노클링 예약에 이어서 오후엔 해변 집라인 런칭하는 극한 코스야! 준비 완료?!"', type: 'activity' }
    ]
  },
  {
    id: 4,
    question: '오키나와 바닷가 해안 언덕을 넘던 중 발견한 예쁜 도자기 공방 마을과 고요한 산책로를 발견했다면?',
    options: [
      { text: '마음이 따스해지는 기와지붕 아래 전통 차실에서 고요하게 여유를 만끽하는 1시간을 산책한다.', type: 'healing' },
      { text: '도자기로 만든 유명 사자 인형 \'시사\'의 역사와 공방의 류큐 기법이 어떤 문화재인지 궁금하여 해설판을 찬찬히 정독한다.', type: 'explorer' },
      { text: '수제 흑설탕 도넛과 현지 과일 아이스크림 시식점이 귀퉁이에 있는지 코를 킁킁거린다.', type: 'foodie' },
      { text: '여기서 언덕 아래 해변까지 내리막에서 탈 수 있는 카트나 오토바이 렌탈 숍 유무를 확인한다.', type: 'activity' }
    ]
  },
  {
    id: 5,
    question: '여행에서 가장 실망스러운 순간은 무엇일까요?',
    options: [
      { text: '일정이 지나칠 정도로 바쁘고 빡빡해서 피로만 가득 쌓이고 쉴 시간이 턱없이 부족할 때', type: 'healing' },
      { text: '인기 식당이라 해서 오래 줄 섰는데 맛이 평균 이하이고 비싸서 혀가 속상해질 때', type: 'foodie' },
      { text: '어떤 지역의 유서 깊은 성곽이나 수족관이 생각보다 규모가 작아 더 이상 볼거리가 없을 때', type: 'explorer' },
      { text: '파도가 세서 계획한 스노클링 잠수나 짚라인 익스트림 레저 스포츠가 갑자기 올스톱 취소될 때', type: 'activity' }
    ]
  },
  {
    id: 6,
    question: '오키나와 특유의 전통 가옥 100년 역사를 복원한 전통 맛집 \'우후야\'의 입구에 마주한다면?',
    options: [
      { text: '흘러내리는 폭포 정원 소리를 고요히 명상하며 오래 머무를 수 있는 조용한 마루 구석 명당을 원한다.', type: 'healing' },
      { text: '특산 아구 안심돈카츠와 전통 소바 세트의 고명, 특제 육수의 깊이를 진지하게 감상하며 맛을 정밀 시식한다.', type: 'foodie' },
      { text: '이 전통 가동이 어떻게 예전 폭격에서 무너지지 않고 보존되어 왔는지 건축 문양과 역사 전시를 카메라에 담는다.', type: 'explorer' },
      { text: '식사를 신속하게 만끽한 뒤 다 음미하기도 전에 주변 열대 고목 정원에 하이킹 코스가 있나 달릴 채비를 한다.', type: 'activity' }
    ]
  },
  {
    id: 7,
    question: '오키나와의 저녁, 환상적인 핑크빛 하늘의 매직아워 선셋이 아메리칸 빌리지 해변을 뒤덮을 때 나의 리액션은?',
    options: [
      { text: '따뜻한 일몰의 여운을 가만히 앉아 조망하며 사랑하는 사람들과 고운 눈맞춤을 하고 묵직한 내면 치유를 경험한다.', type: 'healing' },
      { text: '선셋 비치가 배경이자 야자수가 우뚝 선 가장 인물 및 배경 구도가 미학적인 지점을 찾느라 카메라 셔터를 쉴 새 없이 정밀 조준해 촬영한다.', type: 'explorer' },
      { text: '노을도 시원하지만 타코라이스, 멕시칸 칩을 시원한 오리온 생맥주에 곁들일 해변 펍 야외 명당 착석에 심혈을 기울인다.', type: 'foodie' },
      { text: '노을빛을 뒤로하고 해변 패들보트를 저어 바다 한가운데 일몰과 전력 하이파이브하러 질주한다.', type: 'activity' }
    ]
  },
  {
    id: 8,
    question: '오키나와 쇼핑 메카 돈키호테나 로컬 시장에서 내가 사려 하는 첫 번째 쇼핑 아이템은?',
    options: [
      { text: '일상의 긴장을 릴렉스 해줄 심신안정 라벤더 꽃차 팩이나 향기 감성 로컬 입욕제', type: 'healing' },
      { text: '오키나와 소바 인스턴트 백, 자색고구마 타르트 과자, 미야코지마 눈꽃 소금 사탕 등 온통 먹을거리 선물 세트', type: 'foodie' },
      { text: '액막이 수호신 귀여운 시사 장식품, 슈리성 한정판 전통 수공예 엽서와 마그넷 배지', type: 'explorer' },
      { text: '강렬한 아열대 태양을 가를 스포츠 선글라스, 초강력 물놀이 방수팩이나 아쿠아 레저 전용 아대를 구매한다.', type: 'activity' }
    ]
  },
  {
    id: 9,
    question: '여행 중 만난 갑작스러운 소나기로 한 시간 정도 실내에 묶였다. 나의 선택은?',
    options: [
      { text: '카페에서 똑똑 떨어지는 빗소리를 가만히 바라보며 독서나 일기, 조용한 낮잠에 빠져 쾌재를 부른다.', type: 'healing' },
      { text: '주변 로컬 마켓의 미니 푸드 코너로 잽싸게 이동해 지마미(땅콩) 두부나 따뜻한 수제 만두를 맛본다.', type: 'foodie' },
      { text: '비가 오는 날 가기 좋은 오키나와 현립박물관이나 츄라우미 수족관의 심해 탐사 역사 다큐 상영실을 뒤져본다.', type: 'explorer' },
      { text: '비 오는 틈새 실내 카트장 레이싱을 달리거나 미치도록 익사이팅한 볼링 펍이나 액티브 다트바를 돌파한다.', type: 'activity' }
    ]
  },
  {
    id: 10,
    question: '나에게 오키나와란 어떤 가치를 선물해주는 최고의 여행지인가요?',
    options: [
      { text: '일상 속 번아웃된 마음에 찬란한 초록 빛깔 쉼표를 안겨주는 은신처이자 따스한 힐링 기지', type: 'healing' },
      { text: '에메랄드 바다에서 쾌청하게 몸을 사리지 않고 놀며 짜릿한 추억을 가득 새기는 액티브 플레이그라운드', type: 'activity' },
      { text: '새롭고 이국적인 세계의 역사적 사실과 대자연의 풍경 자산을 실감 나게 탐독하는 지적 모험의 무대', type: 'explorer' },
      { text: '오리온 생맥주 거품과 잊지 못할 안심 스테이크, 향토 고택 미식이 있는 맛있는 인생 식탁', type: 'foodie' }
    ]
  }
];
