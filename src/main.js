const L = window.L;
import {cities, routeCities, sources, videos, getCity, getPlace, getVideo, googleMapsUrl} from './data.js';
import {nearbyPanoramas, panoramaSearchUrl, panoramaxUrl, panoramaxCoverageUrl, mapillaryUrl, validPoint, distanceMeters} from './field-view.js';
import {videoEmbedUrl} from './video-library.js';

const app = document.getElementById('app');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const routeIndex = new Map(routeCities.map((c,i)=>[c.id,i]));
const locationCache = new Map();

const icons = {
  train:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="14" rx="4"/><path d="M8 7h8M8 11h3m2 0h3M8 21l2-4m6 4-2-4M7 21h10"/></svg>`,
  pin:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  play:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 7 8 5-8 5Z"/></svg>`,
  compass:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.3 4.7-4.7 2.3 2.3-4.7Z"/></svg>`,
  map:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></svg>`,
  external:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 5h6v6M19 5l-9 9"/><path d="M19 13v6H5V5h6"/></svg>`,
  book:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v17H6.5A2.5 2.5 0 0 0 4 22Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v17h5.5A2.5 2.5 0 0 1 20 22Z"/></svg>`,
  arrow:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>`,
  locate:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>`
};


const eventMeta = {
  'shanghai-office': {
    title:'상하이 임시정부 청사에서의 정부 활동과 한인애국단',
    query:'대한민국 임시정부 상하이 청사 한인애국단',
    videoIds:['founding','march-first','shanghai-2026','ebs-founding']
  },
  'hongkou': {
    title:'1932년 윤봉길 훙커우공원 의거',
    query:'윤봉길 훙커우공원 의거 1932',
    videoIds:['hongkou-kbs']
  },
  'hangzhou-office': {
    title:'윤봉길 의거 이후 항저우로 이동한 임시정부의 활동',
    query:'대한민국 임시정부 항저우 호변촌 윤봉길 의거 이후',
    videoIds:[]
  },
  'hangzhou-first': {
    title:'1932년 항저우 청태제2여사 판공처 설치',
    query:'대한민국 임시정부 청태제2여사 항저우 1932',
    videoIds:[]
  },
  'zhenjiang-site': {
    title:'1935~1937년 전장 시기 대한민국 임시정부 활동',
    query:'대한민국 임시정부 전장 진강 1935 1937',
    videoIds:[]
  },
  'changsha-nanmu': {
    title:'1938년 남목청 사건과 독립운동 단체 통합 논의',
    query:'남목청 사건 김구 피격 1938 창사',
    videoIds:[]
  },
  'changsha-office': {
    title:'창사 시기 대한민국 임시정부의 청사 활동',
    query:'대한민국 임시정부 창사 청사 시위안베이리',
    videoIds:[]
  },
  'guangzhou-office': {
    title:'1938년 광저우 동산백원 임시정부 청사 활동',
    query:'대한민국 임시정부 광저우 동산백원 1938',
    videoIds:[]
  },
  'liuzhou-office': {
    title:'류저우 시기 임시정부와 한국광복진선청년공작대 활동',
    query:'한국광복진선청년공작대 류저우 대한민국 임시정부',
    videoIds:[]
  },
  'liuzhou-residence': {
    title:'류저우 체류기 임시정부 요인들의 생활과 활동',
    query:'대한민국 임시정부 류저우 요인 생활 1938 1939',
    videoIds:[]
  },
  'qijiang-office': {
    title:'1939~1940년 치장 상승가 임시정부 활동',
    query:'대한민국 임시정부 치장 상승가 1939 1940',
    videoIds:[]
  },
  'qijiang-museum': {
    title:'치장 지역의 대한민국 임시정부 활동',
    query:'대한민국 임시정부 치장 역사',
    videoIds:[]
  },
  'chongqing-office': {
    title:'1940~1945년 충칭 연화지 임시정부 활동과 환국 준비',
    query:'대한민국 임시정부 충칭 연화지 환국 준비',
    videoIds:['uniform-history']
  },
  'chongqing-army': {
    title:'한국광복군 총사령부의 충칭 활동',
    query:'한국광복군 총사령부 충칭 추용로 37호',
    videoIds:['uniform-history']
  },
  'chongqing-village': {
    title:'충칭 투차오 한인촌의 임시정부 가족 공동생활',
    query:'충칭 투차오 한인촌 대한민국 임시정부 가족',
    videoIds:['jeong-jeonghwa']
  },
  'jiaxing-refuge': {
    title:'윤봉길 의거 이후 김구의 자싱 피난과 독립운동',
    query:'김구 자싱 피난처 윤봉길 의거 이후',
    videoIds:[]
  },
  'nanjing-region': {
    title:'1930년대 난징에서의 임시정부 요인 피난과 대중국 활동',
    query:'김구 난징 대한민국 임시정부 1930년대',
    videoIds:[]
  }
};

const eventVideoCatalog = {
  'hongkou-kbs': {
    provider:'youtube',
    url:'https://www.youtube.com/watch?v=6QPZB2hNUOY',
    id:'hongkou-kbs',
    title:'훙커우공원 의거 당시 현장',
    publisher:'KBS · 역사저널 그날',
    description:'1932년 윤봉길 의사의 훙커우공원 의거를 다루는 영상 자료입니다.',
    videoId:'6QPZB2hNUOY',
    topic:'사건 영상'
  }
};

function eventForPlace(p){
  return eventMeta[p?.id] || {
    title:`${p?.name || '선택 장소'}에서의 독립운동 활동`,
    query:`${p?.name || ''} 대한민국 임시정부 독립운동`.trim(),
    videoIds:[]
  };
}
function getEventVideo(id){
  return eventVideoCatalog[id] || getVideo(id);
}
function youtubeSearchUrl(query){
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
function placeStreetVideoSearchUrl(c,p){
  return youtubeSearchUrl(`${c.name} ${p.name} 현재 모습 현장`);
}

const state = {
  cityId:'shanghai',
  placeId:'shanghai-office',
  point:null,
  pointLabel:'',
  pointAccuracy:'',
  videoId:null,
  panoStatus:'idle',
  panoPhoto:null,
  panoRadius:null,
  requestToken:0,
  transitioning:false,
  youtubeRequestToken:0
};

const youtubeCache = new Map();

let map;
let cityLayer;
let placeMarker;
let routeLine;

const city = () => getCity(state.cityId) || cities[0];
const place = () => getPlace(city(), state.placeId) || city().places[0];

function googleStreetViewUrl(point){
  if(!validPoint(point)) return null;
  const [lat,lon]=point;
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(`${lat},${lon}`)}`;
}

function sourceLink(p){
  const source = sources[p.source] || sources[city().source];
  return source ? `<a class="source-link" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${icons.book}<span>${esc(source.label)}</span>${icons.external}</a>` : '';
}

function relatedForPlace(c,p){
  const meta=eventForPlace(p);
  return (meta.videoIds||[]).map(getEventVideo).filter(Boolean);
}


function renderIntro(){
  document.body.classList.add('intro-open');
  app.innerHTML=`
    <section class="intro-screen">
      <div class="intro-orbit intro-orbit-a"></div>
      <div class="intro-orbit intro-orbit-b"></div>

      <article class="intro-card">
        <div class="intro-symbol">
          <img src="./public/flag-reference.jpg" alt="" />
        </div>

        <p class="intro-period">1919 — 1945</p>
        <h1>대한민국 임시정부<br><span>발자취 찾기</span></h1>
        <p class="intro-copy">임시정부가 머문 도시와 독립운동 활동 장소를 지도에서 살펴보고, 현재 모습과 관련 영상까지 함께 확인해 보세요.</p>

        <div class="intro-route" aria-hidden="true">
          <span class="intro-station"></span>
          <span class="intro-line"></span>
          <span class="intro-train">${icons.train}</span>
          <span class="intro-line"></span>
          <span class="intro-station end"></span>
        </div>

        <div class="intro-cities">
          ${routeCities.map(c=>`<span>${esc(c.name)}</span>`).join('')}
        </div>

        <button class="intro-start" data-action="start-app">
          <span>시작하기</span>${icons.arrow}
        </button>

        <div class="intro-features">
          <span>${icons.map} 지도</span>
          <span>${icons.pin} 장소 정보</span>
          <span>${icons.compass} 360° 현장</span>
          <span>${icons.play} 관련 영상</span>
        </div>
      </article>
    </section>`;

  app.querySelector('[data-action="start-app"]')?.addEventListener('click', async (event)=>{
    const button=event.currentTarget;
    if(button.disabled)return;
    button.disabled=true;
    document.querySelector('.intro-card')?.classList.add('leaving');
    await new Promise(resolve=>setTimeout(resolve,420));
    document.body.classList.remove('intro-open');
    renderShell();
  });
}

function renderShell(){
  const c=city(),p=place();
  app.innerHTML=`
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark"><img src="./public/flag-reference.jpg" alt="" /></div>
          <div>
            <h1>대한민국 임시정부 발자취 찾기</h1>
          </div>
        </div>
        <div class="top-actions">
          <span class="trip-chip">${icons.train}<b>${esc(c.name)}</b></span>
          <a class="plain-link" href="${esc(sources.overview.url)}" target="_blank" rel="noopener noreferrer">자료 출처 ${icons.external}</a>
        </div>
      </header>

      <div class="rail-strip" aria-label="임시정부 이동 도시">
        <div class="rail-scroll">
          ${routeCities.map((stop,i)=>`
            <button class="rail-stop ${stop.id===c.id?'active':''}" data-city="${stop.id}">
              <span class="stop-number">${String(i+1).padStart(2,'0')}</span>
              <span class="stop-dot">${stop.id===c.id?icons.train:''}</span>
              <strong>${esc(stop.name)}</strong>
              <small>${esc(stop.period)}</small>
            </button>`).join('')}
        </div>
      </div>

      <main class="workspace">
        <aside class="activity-panel">
          <div class="city-card">
            <div class="city-card-top"><span class="station-label">현재 도시</span><span>${esc(c.hanja)} · ${esc(c.en)}</span></div>
            <h2>${esc(c.name)}</h2>
            <p>${esc(c.summary)}</p>
          </div>
          <div class="panel-title">
            <div><span>이 도시의 독립운동 활동</span><strong>${c.places.length}곳</strong></div>
            <small>활동을 누르면 해당 장소와 상세 정보가 함께 표시됩니다.</small>
          </div>
          <div class="activity-list">
            ${c.places.map((item,i)=>`
              <button class="activity-card ${item.id===p.id?'active':''}" data-place="${item.id}">
                <span class="activity-index">${String(i+1).padStart(2,'0')}</span>
                <span class="activity-copy"><strong>${esc(item.name)}</strong><small>${esc(item.type)} · ${esc(item.period)}</small></span>
                <span class="activity-go">${icons.arrow}</span>
              </button>`).join('')}
          </div>
          
        </aside>

        <section class="map-panel">
          <div class="map-toolbar">
            <div><span class="eyebrow">지도</span><h2>${esc(c.name)} · ${esc(p.name)}</h2></div>
            <button class="soft-btn" data-action="fit-route">${icons.map} 전체 이동 경로</button>
          </div>
          <div class="map-wrap">
            <div id="map" aria-label="임시정부 발자취 지도"></div>
            <div class="map-ticket">
              <span class="ticket-hole"></span>
              <div><small>선택 장소</small><strong>${esc(p.name)}</strong><span id="map-point-label">${state.pointLabel?esc(state.pointLabel):'위치를 확인하는 중'}</span></div>
              ${icons.train}
            </div>
          </div>
        </section>

        <aside class="detail-panel">
          ${placePanelMarkup(c,p)}
        </aside>
      </main>
    </div>`;

  bindEvents();
  initMap();
  renderDetailDynamic();
}

function nextStationMarkup(c){
  const idx=routeIndex.get(c.id);
  const next=routeCities[idx+1];
  if(!next)return `<span>마지막 도시</span><strong>1945 · 환국</strong><small>중국 내 이동 경로의 마지막 도시입니다.</small>`;
  return `<span>다음 도시</span><strong>${esc(next.name)} · ${esc(next.en)}</strong><small>${esc(next.period)}</small>`;
}

function placePanelMarkup(c,p){
  const event=eventForPlace(p);
  const related=relatedForPlace(c,p);
  const currentVideo=getEventVideo(state.videoId) || related[0] || null;
  state.videoId=currentVideo?.id || null;
  const searchUrl=youtubeSearchUrl(event.query);
  const streetVideoUrl=placeStreetVideoSearchUrl(c,p);
  return `
    <div class="detail-scroll">
      <article class="place-card">
        <div class="place-head">
          <div class="place-type-row"><span class="place-type">${esc(p.type)}</span><span>${esc(p.period)}</span></div>
          <h2>${esc(p.name)}</h2>
          <p class="local-name">${esc(p.local)}</p>
          <div class="place-actions">
            <a class="action-pill primary" href="${esc(googleMapsUrl(p))}" target="_blank" rel="noopener noreferrer">${icons.pin} Google 지도</a>
            <button class="action-pill" data-action="refocus">${icons.locate} 지도에서 위치</button>
          </div>
        </div>

        <div class="info-rows">
          <div class="info-row"><span>${icons.pin}</span><div><small>주소</small><strong>${esc(p.address)}</strong></div></div>
          <div class="info-row event-row"><span>${icons.train}</span><div><small>이 장소에서 있었던 일</small><strong class="event-title">${esc(event.title)}</strong><p>${esc(p.description)}</p></div></div>
          <div class="info-row"><span>${icons.compass}</span><div><small>위치 확인</small><strong id="accuracy-text">${esc(p.accuracy)}</strong></div></div>
        </div>
        ${sourceLink(p)}
      </article>

      <section class="media-zone">
        <div class="section-heading"><div><span class="eyebrow">현재 모습</span><h3>장소 정보와 360° 화면</h3></div><span class="live-badge">현장 자료</span></div>
        <div class="media-grid">
          <article class="viewer-card">
            <div class="viewer-title"><strong>360° 현장 프리뷰</strong><span id="pano-state-label">위치 확인 중</span></div>
            <div id="pano-stage" class="pano-stage">${loadingMarkup('장소 위치를 확인하고 있습니다')}</div>
          </article>
          <article class="featured-video-card">
            <div class="viewer-title"><strong>이 장소의 사건·활동 영상</strong><span id="featured-video-source">${currentVideo?esc(currentVideo.publisher):'YouTube 검색'}</span></div>
            <div id="featured-video">${featuredVideoMarkup(currentVideo,event)}</div>
          </article>
        </div>
        <div class="media-quick-links">
          <a href="${esc(searchUrl)}" target="_blank" rel="noopener noreferrer">${icons.play}<span><b>YouTube에서 직접 검색</b><small>${esc(event.query)}</small></span>${icons.external}</a>
          <a href="${esc(streetVideoUrl)}" target="_blank" rel="noopener noreferrer">${icons.compass}<span><b>현재 장소 영상 찾기</b><small>현장 모습과 주변 영상 검색</small></span>${icons.external}</a>
        </div>
      </section>

      <section class="video-section">
        <div class="section-heading"><div><span class="eyebrow">영상</span><h3>${esc(event.title)}</h3></div><span id="youtube-result-count">검색 중</span></div>
        <div id="youtube-results" class="youtube-results">
          ${youtubeLoadingMarkup(event)}
        </div>
      </section>
    </div>`;
}


function youtubeLoadingMarkup(event){
  return `<div class="youtube-loading"><span class="loader"></span><div><strong>YouTube에서 관련 영상을 찾는 중</strong><p>${esc(event.query)}</p></div></div>`;
}

function youtubeResultCardMarkup(v,index=0){
  const thumb=v.thumbnail || (v.videoId?`https://i.ytimg.com/vi/${encodeURIComponent(v.videoId)}/hqdefault.jpg`:'');
  return `<button class="youtube-result-card ${index===0?'active':''}" data-youtube-video="${esc(v.videoId)}" data-youtube-index="${index}">
    <span class="youtube-thumb" style="${thumb?`background-image:url('${esc(thumb)}')`:''}"><i>${icons.play}</i></span>
    <span class="youtube-result-copy"><strong>${esc(v.title)}</strong><small>${esc(v.channelTitle||'YouTube')}</small></span>
  </button>`;
}

function youtubeFeaturedMarkup(v){
  if(!v)return '';
  const embed=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.videoId)}?rel=0`;
  const url=`https://www.youtube.com/watch?v=${encodeURIComponent(v.videoId)}`;
  return `<div class="video-frame"><iframe src="${esc(embed)}" title="${esc(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>
    <div class="video-caption"><strong>${esc(v.title)}</strong><p>${esc(v.channelTitle||'YouTube')} · YouTube 검색 결과</p><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">YouTube에서 보기 ${icons.external}</a></div>`;
}

function youtubeFallbackMarkup(event,message=''){
  const url=youtubeSearchUrl(event.query);
  return `<div class="youtube-fallback">
    <span class="youtube-fallback-icon">${icons.play}</span>
    <div><strong>앱 안에서 검색 결과를 불러오지 못했습니다.</strong>
    <p>${esc(message || 'YouTube 검색 연결을 확인해 주세요.')}</p>
    <a href="${esc(url)}" target="_blank" rel="noopener noreferrer">YouTube 검색 결과 열기 ${icons.external}</a></div>
  </div>`;
}

async function loadYouTubeRecommendations(c,p){
  const target=document.getElementById('youtube-results');
  if(!target)return;
  const event=eventForPlace(p);
  const cacheKey=p.id;
  const token=++state.youtubeRequestToken;

  if(youtubeCache.has(cacheKey)){
    renderYouTubeRecommendations(youtubeCache.get(cacheKey),event);
    return;
  }

  target.innerHTML=youtubeLoadingMarkup(event);
  const count=document.getElementById('youtube-result-count');
  if(count)count.textContent='검색 중';

  try{
    const url=new URL('/api/generate',window.location.origin);
    url.searchParams.set('q',event.query);
    url.searchParams.set('limit','6');
    const res=await fetch(url,{headers:{Accept:'application/json'}});
    const payload=await res.json().catch(()=>({}));
    if(token!==state.youtubeRequestToken || p.id!==place().id)return;

    if(!res.ok){
      const msg=payload?.code==='YOUTUBE_API_KEY_MISSING'
        ?'YouTube API 키가 아직 Vercel에 설정되지 않았습니다.'
        :(payload?.error || 'YouTube 검색 요청에 실패했습니다.');
      target.innerHTML=youtubeFallbackMarkup(event,msg);
      if(count)count.textContent='검색 연결 필요';
      return;
    }

    const items=Array.isArray(payload.items)?payload.items:[];
    youtubeCache.set(cacheKey,items);
    renderYouTubeRecommendations(items,event);
  }catch(_){
    if(token!==state.youtubeRequestToken)return;
    target.innerHTML=youtubeFallbackMarkup(event,'네트워크 연결을 확인해 주세요.');
    if(count)count.textContent='검색 연결 확인';
  }
}

function renderYouTubeRecommendations(items,event){
  const target=document.getElementById('youtube-results');
  const count=document.getElementById('youtube-result-count');
  if(!target)return;

  if(!items.length){
    target.innerHTML=youtubeFallbackMarkup(event,'이 검색어로 표시할 영상이 없습니다.');
    if(count)count.textContent='검색 결과 없음';
    return;
  }

  target.innerHTML=`<div class="youtube-result-grid">${items.map(youtubeResultCardMarkup).join('')}</div>`;
  if(count)count.textContent=`${items.length}개 결과`;

  const first=items[0];
  const featured=document.getElementById('featured-video');
  const source=document.getElementById('featured-video-source');
  if(first && featured){
    featured.innerHTML=youtubeFeaturedMarkup(first);
    if(source)source.textContent=first.channelTitle||'YouTube';
  }

  target.querySelectorAll('[data-youtube-video]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const index=Number(btn.dataset.youtubeIndex||0);
      const item=items[index];
      if(!item)return;
      const featured=document.getElementById('featured-video');
      const source=document.getElementById('featured-video-source');
      if(featured)featured.innerHTML=youtubeFeaturedMarkup(item);
      if(source)source.textContent=item.channelTitle||'YouTube';
      target.querySelectorAll('.youtube-result-card').forEach(x=>x.classList.toggle('active',x===btn));
      document.querySelector('.featured-video-card')?.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  });
}

function loadingMarkup(text){
  return `<div class="viewer-message"><span class="loader"></span><strong>${esc(text)}</strong><p>잠시만 기다려 주세요.</p></div>`;
}

function eventSearchMarkup(event){
  const url=youtubeSearchUrl(event.query);
  return `<a class="event-search-card" href="${esc(url)}" target="_blank" rel="noopener noreferrer">
    <span class="event-search-icon">${icons.play}</span>
    <span><small>YouTube 검색어</small><strong>${esc(event.title)}</strong><p>${esc(event.query)}</p></span>
    ${icons.external}
  </a>`;
}
function featuredVideoMarkup(v,event){
  if(!v)return `<div class="featured-search">${eventSearchMarkup(event)}<p>관련 없는 일반 영상은 대신 표시하지 않습니다. 이 장소에서 있었던 사건·활동으로 검색한 결과를 확인할 수 있습니다.</p></div>`;
  const embed=videoEmbedUrl(v);
  if(!embed)return `<div class="viewer-message"><strong>${esc(v.title)}</strong><a class="wide-link" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">원본 영상 열기 ${icons.external}</a></div>`;
  return `<div class="video-frame"><iframe src="${esc(embed)}" title="${esc(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>
    <div class="video-caption"><strong>${esc(v.title)}</strong><p>${esc(v.description)}</p><a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">YouTube에서 보기 ${icons.external}</a></div>`;
}

function videoCardMarkup(v,active){
  const thumb=v.provider==='youtube'&&v.videoId?`https://i.ytimg.com/vi/${encodeURIComponent(v.videoId)}/hqdefault.jpg`:'';
  return `<button class="video-card ${active?'active':''}" data-video="${v.id}">
    <span class="thumb" style="${thumb?`background-image:url('${thumb}')`:''}"><i>${icons.play}</i><em>${esc(v.topic)}</em></span>
    <span class="video-copy"><strong>${esc(v.title)}</strong><small>${esc(v.publisher)}</small></span>
  </button>`;
}

function renderDetailDynamic(){
  const c=city(),p=place();
  const panel=document.querySelector('.detail-panel');
  if(panel)panel.innerHTML=placePanelMarkup(c,p);
  bindDetailEvents();
  resolveSelectedPlace();
  loadYouTubeRecommendations(c,p);
}

function bindEvents(){
  app.querySelectorAll('[data-city]').forEach(btn=>btn.addEventListener('click',()=>selectCity(btn.dataset.city)));
  app.querySelectorAll('[data-place]').forEach(btn=>btn.addEventListener('click',()=>selectPlace(btn.dataset.place)));
  app.querySelector('[data-action="fit-route"]')?.addEventListener('click',fitRoute);
  bindDetailEvents();
}

function bindDetailEvents(){
  app.querySelectorAll('[data-video]').forEach(btn=>btn.addEventListener('click',()=>selectVideo(btn.dataset.video)));
  app.querySelector('[data-action="refocus"]')?.addEventListener('click',()=>focusPoint(true));
}


function showMoveTransition(targetName,meta=''){
  let overlay=document.getElementById('place-transition');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.id='place-transition';
    overlay.className='place-transition';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML=`
    <div class="transition-card" role="status" aria-live="polite">
      <div class="transition-route">
        <span class="transition-start"></span>
        <span class="transition-track"></span>
        <span class="transition-vehicle">${icons.train}</span>
        <span class="transition-end"></span>
      </div>
      <strong>${esc(targetName)}로 이동 중</strong>
      ${meta?`<p>${esc(meta)}</p>`:''}
      <div class="transition-progress"><span></span></div>
    </div>`;
  requestAnimationFrame(()=>overlay.classList.add('show'));
}

function hideMoveTransition(){
  const overlay=document.getElementById('place-transition');
  if(!overlay)return;
  overlay.classList.remove('show');
  setTimeout(()=>overlay.remove(),220);
}

async function selectCity(id){
  const c=getCity(id); if(!c || state.transitioning)return;
  if(id===state.cityId)return;

  state.transitioning=true;
  showMoveTransition(c.name,c.period);
  await new Promise(resolve=>setTimeout(resolve,2000));

  state.cityId=id;
  state.placeId=c.places[0]?.id;
  state.point=null;
  state.pointLabel='';
  state.videoId=null;
  state.panoStatus='idle';
  state.panoPhoto=null;
  state.transitioning=false;
  hideMoveTransition();
  renderShell();
}



async function selectPlace(id){
  const p=getPlace(city(),id); if(!p || state.transitioning)return;
  if(id===state.placeId){
    focusPoint(true);
    return;
  }

  state.transitioning=true;
  showMoveTransition(p.name,`${city().name} · ${p.period}`);
  await new Promise(resolve=>setTimeout(resolve,2000));

  state.placeId=id; state.point=null; state.pointLabel=''; state.videoId=null; state.panoStatus='idle'; state.panoPhoto=null;
  state.transitioning=false;
  hideMoveTransition();

  document.querySelectorAll('.activity-card').forEach(b=>b.classList.toggle('active',b.dataset.place===id));
  const panel=document.querySelector('.detail-panel');
  if(panel)panel.innerHTML=placePanelMarkup(city(),p);
  bindDetailEvents();
  resolveSelectedPlace();
  loadYouTubeRecommendations(city(),p);
  if(window.innerWidth<980)panel?.scrollIntoView({behavior:'smooth',block:'start'});
}

function selectVideo(id){
  const v=getEventVideo(id);if(!v)return;
  state.videoId=id;
  const featured=document.getElementById('featured-video');if(featured)featured.innerHTML=featuredVideoMarkup(v);
  document.querySelectorAll('.video-card').forEach(b=>b.classList.toggle('active',b.dataset.video===id));
  document.querySelector('.featured-video-card')?.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function initMap(){
  const target=document.getElementById('map');if(!target||!L)return;
  if(map){map.remove();map=null;}
  map=L.map(target,{zoomControl:false,attributionControl:true}).setView([29.8,115.5],5);
  L.control.zoom({position:'bottomright'}).addTo(map);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
  cityLayer=L.layerGroup().addTo(map);
  routeLine=L.polyline(routeCities.map(c=>c.center),{color:'#d95c53',weight:3,opacity:.72,dashArray:'8 10'}).addTo(map);
  routeCities.forEach((c,i)=>{
    const marker=L.marker(c.center,{icon:L.divIcon({className:'station-marker-wrap',html:`<button class="station-marker ${c.id===state.cityId?'active':''}" data-map-city="${c.id}" aria-label="${esc(c.name)}"><span>${i+1}</span></button>`,iconSize:[34,34],iconAnchor:[17,17]})}).addTo(cityLayer);
    marker.on('click',()=>selectCity(c.id));
  });
  map.flyTo(city().center,city().zoom,{duration:.75});
  setTimeout(()=>map?.invalidateSize(),120);
}

function fitRoute(){
  if(!map)return;
  map.fitBounds(L.latLngBounds(routeCities.map(c=>c.center)),{padding:[45,45]});
}

function focusPoint(animated=false){
  if(!map)return;
  const point=validPoint(state.point)?state.point:city().center;
  map.flyTo(point,validPoint(state.point)?16:city().zoom,{duration:animated?.75:.3});
  if(placeMarker)placeMarker.openPopup();
}

function setPlaceMarker(point,label){
  if(!map||!validPoint(point))return;
  if(placeMarker)placeMarker.remove();
  placeMarker=L.marker(point,{icon:L.divIcon({className:'place-pin-wrap',html:`<div class="place-pin">${icons.pin}</div>`,iconSize:[42,48],iconAnchor:[21,44]})}).addTo(map);
  placeMarker.bindPopup(`<div class="map-popup"><small>${esc(city().name)} · ${esc(place().period)}</small><strong>${esc(place().name)}</strong><span>${esc(label)}</span></div>`).openPopup();
  map.flyTo(point,16,{duration:.8});
}

async function geocodePlace(p,c){
  if(validPoint(p.location))return {point:p.location,label:p.address,accuracy:p.accuracy};
  if(locationCache.has(p.id))return locationCache.get(p.id);
  const queries=[p.query,p.address,`${p.name} ${c.name}`].filter(Boolean);
  for(const query of queries){
    try{
      const u=new URL('https://nominatim.openstreetmap.org/search');
      u.searchParams.set('q',query);u.searchParams.set('format','jsonv2');u.searchParams.set('limit','5');u.searchParams.set('accept-language','ko,zh,en');
      const res=await fetch(u,{headers:{Accept:'application/json'}});
      if(!res.ok)continue;
      const rows=await res.json();
      const choices=rows.map(r=>({point:[Number(r.lat),Number(r.lon)],label:r.display_name||query})).filter(r=>validPoint(r.point));
      choices.sort((a,b)=>distanceMeters(c.center,a.point)-distanceMeters(c.center,b.point));
      const near=choices.find(x=>distanceMeters(c.center,x.point)<45000) || choices[0];
      if(near){
        const result={point:near.point,label:near.label,accuracy:'주소 검색 결과를 기준으로 현재 위치를 표시했습니다.'};
        locationCache.set(p.id,result);return result;
      }
    }catch(_){/* try next query */}
  }
  const fallback={point:c.center,label:`${c.name} 중심 위치`,accuracy:'정확한 건물 좌표를 자동 확인하지 못해 도시 중심을 표시합니다.'};
  locationCache.set(p.id,fallback);return fallback;
}

async function resolveSelectedPlace(){
  const token=++state.requestToken;
  const c=city(),p=place();
  setPanoLoading('360° 자료를 확인하고 있습니다');
  const result=await geocodePlace(p,c);
  if(token!==state.requestToken||p.id!==place().id)return;
  state.point=result.point;state.pointLabel=result.label;state.pointAccuracy=result.accuracy;
  document.getElementById('map-point-label')?.replaceChildren(document.createTextNode(result.label));
  const accuracy=document.getElementById('accuracy-text');if(accuracy)accuracy.textContent=`${p.accuracy} · ${result.accuracy}`;
  setPlaceMarker(result.point,result.label);
  await loadPanorama(result.point,result.label,token);
}

function setPanoLoading(text){
  const stage=document.getElementById('pano-stage');if(stage)stage.innerHTML=loadingMarkup(text);
  const label=document.getElementById('pano-state-label');if(label)label.textContent='검색 중';
}

async function loadPanorama(point,label,token){
  const stage=document.getElementById('pano-stage');if(!stage||!validPoint(point))return;
  const radii=[160,450,900,1500];
  try{
    for(const radius of radii){
      const res=await fetch(panoramaSearchUrl(point,radius),{headers:{Accept:'application/geo+json, application/json'}});
      if(!res.ok)continue;
      const payload=await res.json();
      const found=nearbyPanoramas(payload.features,point,radius);
      if(token!==state.requestToken)return;
      if(found.length){
        const photo=found[0];
        state.panoStatus='ready';state.panoPhoto=photo;state.panoRadius=radius;
        renderPanorama(photo,point,label);return;
      }
    }
    if(token!==state.requestToken)return;
    renderPanoramaFallback(point,label);
  }catch(_){
    if(token===state.requestToken)renderPanoramaFallback(point,label);
  }
}

async function renderPanorama(photo,point,label){
  const stage=document.getElementById('pano-stage');if(!stage)return;
  const coords=[photo.geometry.coordinates[1],photo.geometry.coordinates[0]];
  const meters=Math.round(distanceMeters(point,coords));
  const googlePano=googleStreetViewUrl(point);
  const original=panoramaxUrl(photo);
  stage.innerHTML=`
    <div class="panorama-live">
      <iframe class="panorama-frame" src="${esc(original)}" title="${esc(place().name)} 주변 360° 사진" loading="eager" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
      <div class="pano-floating"><span>360°</span><small>${meters}m 주변 촬영</small></div>
      <a class="pano-open" href="${esc(original)}" target="_blank" rel="noopener noreferrer">크게 보기 ${icons.external}</a>
    </div>
    <div class="viewer-footer">
      <p>${esc(label)} 기준 가장 가까운 공개 360° 사진입니다. 현재 촬영 자료이며 과거 모습을 복원한 화면은 아닙니다.</p>
      <div>${googlePano?`<a href="${esc(googlePano)}" target="_blank" rel="noopener noreferrer">Google Street View ${icons.external}</a>`:''}<a href="${esc(original)}" target="_blank" rel="noopener noreferrer">Panoramax ${icons.external}</a></div>
    </div>`;
  const stateLabel=document.getElementById('pano-state-label');if(stateLabel)stateLabel.textContent=`${meters}m 주변`;
}

function renderPanoramaFallback(point,label){
  const stage=document.getElementById('pano-stage');if(!stage)return;
  const googlePano=googleStreetViewUrl(point);
  const coverage=panoramaxCoverageUrl(point,16);
  const maps=googleMapsUrl(place());
  const mapillary=mapillaryUrl(point);
  stage.innerHTML=`
    <div class="street-fallback">
      <div class="street-visual"><span class="big-compass">${icons.compass}</span><div><strong>이 지점에서 바로 표시할 공개 360° 사진이 확인되지 않았습니다.</strong><p>${esc(label)}</p></div></div>
      <p class="fallback-note">360° 자료가 실제로 존재하는 경우에만 프리뷰할 수 있습니다. 다른 장소의 사진을 이 위치의 화면처럼 대신 표시하지 않습니다.</p>
      <div class="street-buttons">
        ${googlePano?`<a class="street-btn primary" href="${esc(googlePano)}" target="_blank" rel="noopener noreferrer">${icons.compass}<span><b>Google Street View 확인</b><small>이 좌표에 제공되는 360° 화면 확인</small></span>${icons.external}</a>`:''}
        <a class="street-btn" href="${esc(coverage)}" target="_blank" rel="noopener noreferrer">${icons.map}<span><b>Panoramax 주변 확인</b><small>주변 공개 360° 촬영 위치 보기</small></span>${icons.external}</a>
        <a class="street-btn" href="${esc(mapillary)}" target="_blank" rel="noopener noreferrer">${icons.compass}<span><b>Mapillary 주변 사진</b><small>현재 거리 사진 자료 확인</small></span>${icons.external}</a>
        <a class="street-btn" href="${esc(maps)}" target="_blank" rel="noopener noreferrer">${icons.pin}<span><b>Google 지도</b><small>장소 정보와 주변 사진 보기</small></span>${icons.external}</a>
      </div>
    </div>`;
  const stateLabel=document.getElementById('pano-state-label');if(stateLabel)stateLabel.textContent='360° 자료 확인';
}


renderIntro();
