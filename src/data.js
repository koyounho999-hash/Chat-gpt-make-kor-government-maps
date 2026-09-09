// Historical source URLs are kept beside the records so they can be reviewed.
// A city-level location is NEVER represented as a surveyed building coordinate.
export const sources = {
  overview: {label:'국가기록원 · 대한민국임시정부', url:'https://theme.archives.go.kr/next/koreaOfRecord/koreaGovernment.do'},
  history: {label:'공훈전자사료관 · 임시정부의 시기별 활동', url:'https://e-gonghun.mpva.go.kr/user/IndepCrusaderDetail.do?goTocode=20003&indepMeritSeq=1404'},
  shanghai: {label:'국가보훈부 · 상하이 청사 재개관', url:'https://mpva.go.kr/mpva/selectBbsNttView.do?bbsNo=16&integrDeptCode=&key=77&nttNo=4918&pageIndex=1&searchCnd=all&searchCtgry=&searchKrwd='},
  hangzhou: {label:'지역N문화 · 대한민국 임시정부의 만리역정', url:'https://ncms.nculture.org/independence-movement/story/11363'},
  jiaxing: {label:'국가보훈부 · 김구 피난처', url:'https://www.mpva.go.kr/mpva/selectBbsNttBnfcView.do?integrDeptCode=&key=81&nttNo=60287&pageIndex=1326&searchCnd=all&searchCtgry=&searchKrwd='},
  changsha: {label:'후난성 문사연구관 · 남목청 6호', url:'https://css.hunan.gov.cn/css/tslm/hxws/wssy/201603/wssw_17/201612/t20161227_3772166.html'},
  guangzhou: {label:'외교부 · 광저우 임시정부 청사 소재지 확인', url:'https://www.mofa.go.kr/www/brd/m_4080/view.do?page=850&pitem=10&seq=364125'},
  liuzhou: {label:'공훈전자사료관 · 임시정부 사람들의 활동', url:'https://e-gonghun.mpva.go.kr/user/IndepCrusaderDetail.do?goTocode=20003&mngNo=8311'},
  qijiang: {label:'충칭시 치장구 인민대표대회 · 임시정부 유적', url:'https://www.qjrdw.gov.cn/web/article/1446092201397477376/web/content_1446092201397477376.html'},
  chongqing: {label:'국립대한민국임시정부기념관 · 충칭의 한국광복군 사적지', url:'https://www.nmkpg.go.kr/webzine/story/cn.do?rid=228'},
  return: {label:'대한민국역사박물관 · 1945년의 임시정부', url:'https://archive.much.go.kr/1945/storytelling_2'},
  videos: {label:'국립대한민국임시정부기념관 · 사적지와 기념 공간 강연', url:'https://www.nmkpg.go.kr/main/board/1/208/board_view.do'}
};

export const cities = [
  {id:'shanghai',name:'상하이',en:'Shanghai',hanja:'上海',period:'1919–1932',kind:'route',order:1,center:[31.2304,121.4737],zoom:13,summary:'1919년 4월 11일 임시정부가 수립된 출발점. 민주공화국의 제도를 세우고 독립운동을 조직했습니다.',source:'overview',places:[
    {id:'shanghai-office',name:'대한민국 임시정부 청사',local:'大韩民国临时政府旧址',period:'1926–1932',type:'복원 청사',address:'중국 상하이시 황푸구 마당로 306로 4호 (黄浦区马当路306弄4号)',query:'大韩民国临时政府旧址 马当路306弄4号 上海',location:null,accuracy:'주소 확인 · 지도 좌표는 검색으로 확인',description:'임시정부가 상하이에서 가장 오래 사용한 청사로, 한인애국단의 조직과 독립운동 준비가 이루어진 곳입니다. 현재의 기념관은 옛 건물을 복원하여 1993년 공개했습니다. 1919년 최초 청사와는 다른 건물입니다.',source:'shanghai',videoIds:['founding','sites','march-first','shanghai-2026','ebs-founding']},
    {id:'hongkou',name:'훙커우공원 의거 현장',local:'鲁迅公园（原虹口公园）',period:'1932. 4. 29.',type:'역사 현장',address:'중국 상하이시 훙커우구 쓰촨베이로 2288호, 루쉰공원',query:'鲁迅公园 2288 四川北路 上海',location:null,accuracy:'현 공원 위치 · 당시 행사의 정확한 지점은 별도 확인 필요',description:'윤봉길 의사의 의거가 일어난 옛 훙커우공원입니다. 의거 이후 임시정부에 대한 일본의 추적이 강화되면서 임시정부 요인들은 상하이를 떠나 피난하게 되었습니다.',source:'history',videoIds:['sites','lives','shanghai-2026']}
  ]},
  {id:'hangzhou',name:'항저우',en:'Hangzhou',hanja:'杭州',period:'1932–1935',kind:'route',order:2,center:[30.2741,120.1551],zoom:13,summary:'상하이를 떠난 뒤 임시정부가 청사를 옮기며 조직을 유지한 도시입니다.',source:'hangzhou',places:[
    {id:'hangzhou-office',name:'호변촌 임시정부 청사',local:'大韩民国临时政府杭州旧址纪念馆',period:'1930년대',type:'복원 기념관',address:'중국 항저우시 상청구 장생로 55호 (上城区长生路55号)',query:'大韩民国临时政府杭州旧址纪念馆 长生路55号',location:null,accuracy:'현주소 확인 · 실제 좌표는 검색으로 확인',description:'임시정부가 항저우에서 사용한 호변촌 23호 청사를 복원한 기념관입니다. 2007년 개관했으며 상하이 이후의 임시정부 활동을 살펴볼 수 있습니다.',source:'hangzhou',videoIds:['lives','sites','heritage-forum']},
    {id:'hangzhou-first',name:'청태제2여사 청사 터',local:'清泰第二旅舍旧址',period:'1932년',type:'옛터 · 위치 추정',address:'중국 항저우시 연안로 205호 일대 (延安路205号附近)',query:'延安路205号 杭州',location:null,accuracy:'옛 건물 멸실 · 일대 위치만 추정',description:'1932년 5월 임시정부가 항저우에 도착해 처음 청사를 마련한 곳입니다. 원래 건물은 사라졌으며, 현재 위치는 문헌을 바탕으로 일대를 추정한 것입니다.',source:'hangzhou',videoIds:['sites']}
  ]},
  {id:'zhenjiang',name:'전장',en:'Zhenjiang',hanja:'鎭江',period:'1935–1937',kind:'route',order:3,center:[32.1878,119.4250],zoom:12,summary:'임시정부가 이동기에도 정부 조직을 유지하며 활동한 거점입니다.',source:'history',places:[
    {id:'zhenjiang-site',name:'전장 임시정부 활동 관련 지역',local:'镇江 韩国临时政府活动史料',period:'1935–1937',type:'관련 지역 · 정확한 청사 위치 미확정',address:'중국 장쑤성 전장시',query:'镇江 大韩民国临时政府 史料陈列馆',location:null,accuracy:'도시 수준 위치만 표시 · 청사 건물 좌표 미확정',description:'임시정부는 1935년부터 전장으로 활동 거점을 옮겼습니다. 이 항목은 전장 시기의 역사 자료를 탐색하기 위한 것이며, 확인되지 않은 특정 건물을 청사라고 표시하지 않습니다.',source:'history',videoIds:['sites','lives']}
  ]},
  {id:'changsha',name:'창사',en:'Changsha',hanja:'長沙',period:'1937–1938',kind:'route',order:4,center:[28.2282,112.9388],zoom:13,summary:'전시 피난 속에서도 독립운동 단체의 연합과 대외 선전 활동을 이어간 도시입니다.',source:'changsha',places:[
    {id:'changsha-nanmu',name:'남목청 6호 활동 옛터',local:'大韩民国临时政府（长沙）活动旧址 · 楠木厅6号',period:'1937–1938',type:'보존 역사 건물',address:'중국 창사시 카이푸구 차오쭝제 남목청 6호 (开福区楠木厅6号)',query:'大韩民国临时政府 长沙 活动旧址 楠木厅6号',location:null,accuracy:'현주소 확인 · 좌표는 검색으로 확인',description:'김구를 비롯한 독립운동가들이 활동한 건물입니다. 독립운동 단체의 통합 논의가 이루어진 장소로, 창사 시기의 어려움과 한중 협력의 역사를 보여줍니다.',source:'changsha',videoIds:['lives','sites']},
    {id:'changsha-office',name:'시위안베이리 임시정부 청사 관련 지역',local:'西园北里 赵恒惕公馆',period:'1937–1938',type:'관련 지역 · 위치 확인 필요',address:'중국 창사시 시위안베이리 일대',query:'长沙 西园北里 赵恒惕公馆 韩国临时政府',location:null,accuracy:'옛 공관의 현 위치 미확정',description:'당시 후난성 정부가 임시정부가 사용할 수 있도록 마련한 공관과 관련된 지역입니다. 남목청 6호와 동일한 청사라고 단정하지 않고 별도로 구분했습니다.',source:'changsha',videoIds:['sites']}
  ]},
  {id:'guangzhou',name:'광저우',en:'Guangzhou',hanja:'廣州',period:'1938',kind:'route',order:5,center:[23.1291,113.2644],zoom:13,summary:'1938년 여름 임시정부가 청사를 마련하고 전쟁 중 피난을 이어간 도시입니다.',source:'guangzhou',places:[
    {id:'guangzhou-office',name:'동산백원 임시정부 청사',local:'东山柏园 · 恤孤院路12号',period:'1938. 7–9.',type:'현존 건물 · 위치 고증',address:'중국 광저우시 휼고원로 12호 (恤孤院路12号)',query:'东山柏园 恤孤院路12号 广州',location:null,accuracy:'외교부가 현주소 확인 · 좌표는 검색으로 확인',description:'임시정부가 1938년 7월 22일부터 9월 19일까지 사용한 청사입니다. 한중 공동 조사와 독립기념관의 고증을 거쳐 2017년 현재 건물의 위치가 공식 발표되었습니다.',source:'guangzhou',videoIds:['lives','sites']}
  ]},
  {id:'liuzhou',name:'류저우',en:'Liuzhou',hanja:'柳州',period:'1938–1939',kind:'route',order:6,center:[24.3264,109.4281],zoom:13,summary:'임시정부가 머무는 동안 청년공작대의 문화·선전 활동이 활발했던 도시입니다.',source:'liuzhou',places:[
    {id:'liuzhou-office',name:'낙군사 임시정부 활동 전시관',local:'柳州大韩民国临时政府抗日斗争活动陈列馆 · 乐群社',period:'1938–1939',type:'역사 전시관',address:'중국 광시좡족자치구 류저우시 낙군사',query:'柳州大韩民国临时政府抗日斗争活动陈列馆 乐群社',location:null,accuracy:'시설명 확인 · 주소 및 좌표는 지도 검색',description:'류저우 시기의 임시정부 활동을 전시하는 공간입니다. 당시 임시정부는 이 도시에서 조직을 유지했고 한국광복진선청년공작대는 문화·선전 활동을 전개했습니다.',source:'liuzhou',videoIds:['lives','sites']},
    {id:'liuzhou-residence',name:'랴오레이 공관 관련 지역',local:'廖磊公馆',period:'1938–1939',type:'관련 거주지',address:'중국 류저우시',query:'柳州 廖磊公馆 韩国临时政府',location:null,accuracy:'관련 건물 위치 별도 확인 필요',description:'류저우 체류기의 임시정부 요인 거주와 관련된 공관입니다. 현재 관람 가능 여부와 건물의 정확한 지번은 확인이 필요합니다.',source:'liuzhou',videoIds:['lives']}
  ]},
  {id:'qijiang',name:'치장',en:'Qijiang',hanja:'綦江',period:'1939–1940',kind:'route',order:7,center:[29.0281,106.6510],zoom:13,summary:'충칭으로 이동하기 전 임시정부가 조직과 활동을 정비한 거점입니다.',source:'qijiang',places:[
    {id:'qijiang-office',name:'상승가 임시정부 청사 옛터',local:'上升街27号、30号旧址',period:'1939–1940',type:'멸실 옛터',address:'중국 충칭시 치장구 상승가 27·30호 옛터',query:'綦江 上升街27号 30号 韩国临时政府旧址',location:null,accuracy:'옛 건물 멸실 · 현재 지점 확인 필요',description:'치장 시기 임시정부가 사용한 사무 공간과 관련된 옛터입니다. 현지 자료에 따르면 옛 건물들은 도시 정비 과정에서 사라졌으므로 당시 건물의 실물이나 내부를 볼 수 있다고 안내하지 않습니다.',source:'qijiang',videoIds:['lives','sites']},
    {id:'qijiang-museum',name:'치장박물관 · 임시정부 전시',local:'綦江博物馆',period:'1939–1940 관련 자료',type:'현대 전시관',address:'중국 충칭시 치장구 치장박물관',query:'綦江博物馆',location:null,accuracy:'현대 박물관 · 당시 임시정부 청사는 아님',description:'치장 지역의 역사와 임시정부 활동을 함께 살펴볼 수 있는 박물관입니다. 역사 현장과 현대 전시시설을 구분하여 표시합니다.',source:'qijiang',videoIds:['sites']}
  ]},
  {id:'chongqing',name:'충칭',en:'Chongqing',hanja:'重慶',period:'1940–1945',kind:'route',order:8,center:[29.5630,106.5516],zoom:13,summary:'임시정부의 마지막 중국 거점. 한국광복군 창설과 독립 국가 건설 준비가 이어졌습니다.',source:'return',places:[
    {id:'chongqing-office',name:'연화지 임시정부 청사',local:'大韩民国临时政府旧址 · 莲花池',period:'1940–1945',type:'복원 기념관',address:'중국 충칭시 위중구 연화지 청사 (渝中区莲花池)',query:'重庆 大韩民国临时政府旧址 莲花池',location:null,accuracy:'현 기념관 위치 · 좌표는 검색으로 확인',description:'임시정부가 충칭에서 사용한 마지막 청사로, 광복 이후 환국을 준비한 역사적 공간입니다. 현재는 복원된 기념관으로 당시의 활동을 소개합니다.',source:'return',videoIds:['founding','sites','uniform-history','heritage-forum']},
    {id:'chongqing-army',name:'한국광복군 총사령부 옛터',local:'韩国光复军总司令部旧址',period:'1942–1945',type:'복원 역사 건물',address:'중국 충칭시 위중구 추용로 37호 (渝中区邹容路37号)',query:'韩国光复军总司令部旧址 邹容路37号 重庆',location:null,accuracy:'현주소 확인 · 좌표는 검색으로 확인',description:'1942년 총사령부가 옮겨온 곳입니다. 옛 신생로 45호가 도로명과 지번 변경을 거쳐 추용로 37호가 되었으며, 현재 건물은 2019년 복원되었습니다. 초기 광복군 창설 장소와는 구분됩니다.',source:'chongqing',videoIds:['lives','sites','uniform-history']},
    {id:'chongqing-village',name:'투차오 한인촌 관련 지역',local:'土桥 韩国人村',period:'1940년대',type:'거주 지역 · 옛 건물 멸실',address:'중국 충칭시 투차오 일대',query:'重庆 土桥 韩国人村 临时政府',location:null,accuracy:'구역 수준 위치 · 옛 건물 대부분 멸실',description:'임시정부 요인과 가족들이 공동생활을 하던 한인 거주 지역입니다. 현재의 도시 모습은 당시와 다르며, 이 항목은 역사적 생활공간의 의미를 소개합니다.',source:'return',videoIds:['lives','jeong-jeonghwa']}
  ]},
  {id:'jiaxing',name:'자싱',en:'Jiaxing',hanja:'嘉興',period:'1932년 이후',kind:'related',center:[30.7539,120.7585],zoom:13,summary:'윤봉길 의거 이후 김구 등 임시정부 요인들이 피신하며 독립운동을 이어간 지역입니다.',source:'jiaxing',places:[
    {id:'jiaxing-refuge',name:'김구 피난처',local:'金九避难处 · 梅湾街76号',period:'1932년 이후',type:'복원 피난처',address:'중국 저장성 자싱시 매만가 76호 (梅湾街76号)',query:'金九避难处 梅湾街76号 嘉兴',location:null,accuracy:'현주소 확인 · 좌표는 검색으로 확인',description:'윤봉길 의거 이후 김구가 일제의 추적을 피해 머문 곳입니다. 중국인 저보성 일가와 주변 사람들의 도움이 임시정부 요인들의 피난과 활동을 뒷받침했습니다.',source:'jiaxing',videoIds:['lives','sites','jeong-jeonghwa']}
  ]},
  {id:'nanjing',name:'난징',en:'Nanjing',hanja:'南京',period:'1930년대',kind:'related',center:[32.0603,118.7969],zoom:12,summary:'김구 등 임시정부 요인들의 피난과 대중국 외교 활동이 이어진 관련 거점입니다.',source:'history',places:[
    {id:'nanjing-region',name:'난징 임시정부 요인 활동 관련 지역',local:'南京 韩国独立运动相关史迹',period:'1930년대',type:'관련 지역 · 정확한 장소 미확정',address:'중국 장쑤성 난징시',query:'南京 金九 韩国临时政府 史迹',location:null,accuracy:'도시 수준 위치만 표시',description:'임시정부 요인들은 상하이를 떠난 뒤 난징과 자싱 등을 오가며 피난과 외교 활동을 이어갔습니다. 이 항목은 관련 자료를 탐색하는 도시 수준의 안내이며 특정 건물의 현존 여부를 단정하지 않습니다.',source:'history',videoIds:['sites','lives','heritage-forum']}
  ]}
];

export const videos = [
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/watch?v=Z0t2WJVKV3U",
    "id": "founding",
    "title": "우리나라 최초의 민주공화제 정부 : 대한민국 임시정부",
    "publisher": "국립대한민국임시정부기념관",
    "description": "임시정부의 수립과 민주공화국의 출발을 소개하는 전시 영상입니다.",
    "videoId": "Z0t2WJVKV3U",
    "topic": "역사 강의",
    "cityIds": [
      "shanghai"
    ],
    "source": "https://www.youtube.com/watch?v=Z0t2WJVKV3U",
    "year": "",
    "provenance": "기존 목록"
  },
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/watch?v=98tizlOtoQo",
    "id": "lives",
    "title": "대한민국 임시정부 사람들의 삶",
    "publisher": "국립대한민국임시정부기념관",
    "description": "임시정부 사람들의 생활과 독립운동을 살펴보는 전시 영상입니다.",
    "videoId": "98tizlOtoQo",
    "topic": "인물과 생활",
    "cityIds": [],
    "source": "https://www.youtube.com/watch?v=98tizlOtoQo",
    "year": "",
    "provenance": "기존 목록"
  },
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/watch?v=ci2fZlMVpdk",
    "id": "sites",
    "title": "대한민국 임시정부 사적지와 기념 공간",
    "publisher": "국립대한민국임시정부기념관",
    "description": "황선익 교수의 제2회 임시정부사 콜로키움. 여러 사적지와 기념 공간을 다룹니다.",
    "videoId": "ci2fZlMVpdk",
    "topic": "사적지 탐방",
    "cityIds": [],
    "source": "https://www.nmkpg.go.kr/main/board/1/208/board_view.do",
    "year": "2022",
    "provenance": "공식 행사 안내"
  },
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/watch?v=yMxyCe7_Ats",
    "id": "interview",
    "title": "우리가 기억해야 할 '대한민국 임시정부'",
    "publisher": "B tv · 영광의 역사 희망찬 미래",
    "description": "김희곤의 인터뷰를 통해 임시정부의 역사적 의미를 살펴봅니다.",
    "videoId": "yMxyCe7_Ats",
    "topic": "역사 강의",
    "cityIds": [],
    "source": "https://www.youtube.com/watch?v=yMxyCe7_Ats",
    "year": "",
    "provenance": "기존 목록"
  },
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/watch?v=bgOi3Pkrdxo",
    "id": "march-first",
    "title": "3·1운동과 대한민국 임시정부",
    "publisher": "국립대한민국임시정부기념관",
    "description": "김용달 전 한국독립운동사연구소 소장의 제1회 임시정부사 콜로키움.",
    "videoId": "bgOi3Pkrdxo",
    "topic": "역사 강의",
    "cityIds": [
      "shanghai"
    ],
    "source": "https://www.history.go.kr/board/boardDetail.do?itemId=000000013743&itemIndex=2&menuId=000000000424&totalCount=5662",
    "year": "2022",
    "provenance": "공식 행사 안내"
  },
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/watch?v=xi-JcT7uv7U",
    "id": "uniform-history",
    "title": "한국광복군 군복으로 풀어보는 대한민국 임시정부사",
    "publisher": "국립대한민국임시정부기념관",
    "description": "김정민 교수의 제4회 임시정부사 콜로키움. 복식 자료를 통해 당시의 역사를 살펴봅니다.",
    "videoId": "xi-JcT7uv7U",
    "topic": "역사 강의",
    "cityIds": [
      "chongqing"
    ],
    "source": "https://www.history.go.kr/board/boardDetail.do?itemId=000000014048&itemIndex=1&menuId=000000000424&totalCount=5879",
    "year": "2022",
    "provenance": "공식 행사 안내"
  },
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/watch?v=2oHADJclobE",
    "id": "heritage-forum",
    "title": "국외 독립운동사적지 보존방안 전문가 포럼 Highlights",
    "publisher": "국외 독립운동사적지 보존방안 전문가 포럼",
    "description": "국외 독립운동 사적지의 보존과 활용을 다룬 전문가 포럼의 주요 장면입니다.",
    "videoId": "2oHADJclobE",
    "topic": "사적지 탐방",
    "cityIds": [],
    "source": "https://www.ykausa.org/bbs/board.php?bo_table=LosAngeles&wr_id=303",
    "year": "2023",
    "provenance": "행사 영상 소개"
  },
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/watch?v=bsKxkg6P7jc",
    "id": "accessible-tour",
    "title": "서대문형무소역사관·임시정부기념관 역사탐방",
    "publisher": "서울시장애인복지시설협회 · 서경덕 교수팀",
    "description": "정준하와 서경덕 교수가 역사 공간과 편의시설을 함께 소개하는 수어·자막 역사탐방 영상입니다.",
    "videoId": "bsKxkg6P7jc",
    "topic": "사적지 탐방",
    "cityIds": [],
    "source": "https://womannews.net/detail.php?number=383589&thread=22r12r01",
    "year": "2024",
    "provenance": "영상 공개 보도"
  },
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/watch?v=oaXhTOJvHGY",
    "id": "shanghai-2026",
    "title": "대한민국 임시정부 상하이 청사 100년 기념식",
    "publisher": "대한민국 청와대 · 영상으로 만나는 대통령",
    "description": "2026년 1월 7일 상하이 청사 방문과 기념식 기록입니다. 현장 전시 설명과 독립운동 관련 역사 소개가 포함되어 있습니다.",
    "videoId": "oaXhTOJvHGY",
    "topic": "현장 기록",
    "cityIds": [
      "shanghai"
    ],
    "source": "https://www.president.go.kr/videos/BzHLajsK",
    "year": "2026",
    "provenance": "공식 영상·원본 확인"
  },
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/watch?v=kY88P1R7Asg",
    "id": "kim-dongsam",
    "title": "정의부와 일송 김동삼 선생 학술대회",
    "publisher": "일송 김동삼 선생 기념사업회",
    "description": "정의부 조직 100주년을 기념하여 김동삼 선생의 독립운동을 재조명한 학술대회 기록입니다.",
    "videoId": "kY88P1R7Asg",
    "topic": "인물과 생활",
    "cityIds": [],
    "source": "https://www.youtongnews.com/bbs/board.php?bo_table=09_1&wr_id=13892",
    "year": "2024",
    "provenance": "행사 영상 공개"
  },
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/watch?v=CaZspQL8538",
    "id": "ebs-founding",
    "title": "대한민국 임시정부의 수립과정은?",
    "publisher": "EBS 사회탐구 한국사",
    "description": "임시정부 수립 과정을 짧게 복습할 수 있는 한국사 교육 영상입니다.",
    "videoId": "CaZspQL8538",
    "topic": "역사 강의",
    "cityIds": [
      "shanghai"
    ],
    "source": "https://thisfre.tistory.com/m/531",
    "year": "",
    "provenance": "교육 영상 링크 아카이브"
  },
  {
    "provider": "youtube",
    "url": "https://www.youtube.com/watch?v=PMbYzRBg1kw",
    "id": "jeong-jeonghwa",
    "title": "한국의 유산 · 정정화",
    "publisher": "KBS 한국의 유산",
    "description": "임시정부 사람들의 생활과 독립운동을 지원했던 정정화의 삶을 소개하는 영상입니다.",
    "videoId": "PMbYzRBg1kw",
    "topic": "인물과 생활",
    "cityIds": [],
    "source": "https://thisfre.tistory.com/1907",
    "year": "",
    "provenance": "영상 링크 아카이브"
  }
];

export const routeCities = cities.filter(city => city.kind === 'route').sort((a,b) => a.order-b.order);
export const getCity = id => cities.find(city => city.id === id);
export const getPlace = (city,id) => city?.places.find(place => place.id === id);
export const getVideo = id => videos.find(video => video.id === id);
export const googleMapsUrl = place => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.query || place.address)}`;
