const L = window.L;
import {cities,routeCities,sources,videos,getCity,getPlace,getVideo,googleMapsUrl} from './data.js';
import {VIDEO_TOPICS,filterVideoCatalog,relatedVideos,videoEmbedUrl} from './video-library.js';
import {PANORAMAX_API,PANORAMAX_VIEWER,validPoint,panoramaSearchUrl,nearbyPanoramas,panoramaxUrl,mapillaryUrl,osmSearchUrl,nominatimSearchUrl,locationCandidates} from './field-view.js';

const locationCache=new Map();
let lastGeocodeAt=0, viewerPromise=null;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg = (path, viewBox='0 0 24 24') => `<svg viewBox="${viewBox}" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const icons = {
  map:svg('<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>'),
  pin:svg('<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>'),
  video:svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/>'),
  book:svg('<path d="M12 6C8 3 5 4 3 5v14c3-1 6-1 9 2 3-3 6-3 9-2V5c-2-1-5-2-9 1ZM12 6v15"/>'),
  arrow:svg('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
  external:svg('<path d="M13 5h6v6M19 5l-9 9"/><path d="M19 13v6H5V5h6"/>'),
  search:svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'),
  back:svg('<path d="m15 18-6-6 6-6"/>'),
  close:svg('<path d="M5 5l14 14M19 5 5 19"/>'),
  check:svg('<path d="m4 12 5 5L20 6"/>'),
  info:svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
  globe:svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18"/>'),
  compass:svg('<circle cx="12" cy="12" r="9"/><path d="m15 9-2 4-4 2 2-4z"/>'),
  layers:svg('<path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5"/>'),
  copy:svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>')
};
const icon = name => icons[name] || icons.info;
const initial = new URLSearchParams(location.hash.slice(1));
const startCity = getCity(initial.get('city')) || cities[0];
const startPlace = getPlace(startCity,initial.get('place')) || startCity.places[0];
const state = {cityId:startCity.id,placeId:startPlace.id,screen:'places',videoId:null,mediaStatus:'idle',mapMode:'all',viewToken:0,stageToken:0,viewPoint:null,viewName:'',viewPhoto:null,viewCandidates:[],selectingPoint:false,videoFilter:{query:'',city:'all',topic:'전체'},videoScope:'all'};
const city = () => getCity(state.cityId);
const place = () => getPlace(city(),state.placeId);
let map, cityMarkers=[], siteMarker=null, routeLine;
const mapPosition = c => c.center;

function sourceLink(id,label='자료 출처') {
  const source=sources[id];
  return source ? `<a class="source-link" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${icon('book')} <span>${esc(label)} · ${esc(source.label)}</span> ${icon('external')}</a>` : '';
}
function external(url,label,kind='secondary') {return `<a class="btn ${kind}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ${icon('external')}</a>`;}
function syncHash() {
  const params=new URLSearchParams({city:state.cityId,place:state.placeId});
  history.replaceState(null,'',`${location.pathname}${location.search}#${params}`);
}
function notify(text) {
  const node=document.getElementById('toast');
  node.textContent=text;node.classList.add('show');
  clearTimeout(notify.timer);notify.timer=setTimeout(()=>node.classList.remove('show'),3500);
}
function renderNav() {
  document.getElementById('app')?.classList.toggle('videos-active',state.screen==='videos');
  document.querySelectorAll('[data-screen]').forEach(button=>{
    const active=state.screen===button.dataset.screen;
    button.classList.toggle('active',active);
    button.setAttribute('aria-current',active?'page':'false');
  });
}
function renderCities() {
  document.getElementById('route-list').innerHTML=routeCities.map((c,i)=>`
    <button class="city-choice ${c.id===state.cityId?'active':''}" data-city="${c.id}" aria-pressed="${c.id===state.cityId}">
      <span class="route-number">${String(i+1).padStart(2,'0')}</span><span class="city-choice-label"><strong>${esc(c.name)}</strong><small>${esc(c.period)} · ${esc(c.en)}</small></span>${icon('arrow')}
    </button>`).join('');
  document.getElementById('related-cities').innerHTML=cities.filter(c=>c.kind==='related').map(c=>`<button class="related-city ${c.id===state.cityId?'active':''}" data-city="${c.id}">${esc(c.name)} <span>${esc(c.en)}</span></button>`).join('');
}
function renderMapHeading() {
  const c=city();
  document.getElementById('map-eyebrow').textContent=c.kind==='route'?`THE JOURNEY · ${String(c.order).padStart(2,'0')} / 08`:'RELATED FOOTSTEPS';
  document.getElementById('map-title').textContent=state.mapMode==='all'?'도시를 따라, 역사를 만나다':`${c.name}의 발자취`;
  document.getElementById('map-subtitle').textContent=state.mapMode==='all'?'1919년 상하이에서 1945년 충칭까지. 지도와 도시 목록을 눌러 탐색하세요.':c.summary;
  document.getElementById('map-mode').textContent=state.mapMode==='all'?'전체 경로 보기':'선택한 도시';
}
function renderPlaces() {
  const c=city(), p=place();
  document.getElementById('detail-root').innerHTML=`
    <div class="detail-heading"><div><p class="eyebrow">SELECTED DESTINATION</p><h2>${esc(c.name)} <span class="hanja">${esc(c.hanja)}</span></h2><p class="muted">${esc(c.en)} · ${esc(c.period)}</p></div><span class="seal-small">${c.kind==='route'?'거점':'관련'}</span></div>
    <p class="city-summary">${esc(c.summary)}</p>
    <div class="detail-section-title"><span>역사 현장</span><span class="count">${c.places.length}곳</span></div>
    <div class="place-list">${c.places.map((s,i)=>`<button class="place-choice ${s.id===p.id?'active':''}" data-place="${s.id}" aria-pressed="${s.id===p.id}"><span class="place-index">${String(i+1).padStart(2,'0')}</span><span class="place-choice-label"><strong>${esc(s.name)}</strong><small>${esc(s.type)} · ${esc(s.period)}</small></span>${icon('arrow')}</button>`).join('')}</div>
    <article class="place-detail"><div class="place-detail-top"><span class="eyebrow">HISTORIC PLACE</span><span class="type-tag">${esc(p.type)}</span></div><h3>${esc(p.name)}</h3><p class="local-name">${esc(p.local)}</p><p class="place-description">${esc(p.description)}</p><div class="address-row">${icon('pin')}<span>${esc(p.address)}</span></div><p class="accuracy-note">${icon('info')} ${esc(p.accuracy)}</p>${sourceLink(p.source)}
      <div class="place-actions"><button class="btn primary" data-action="streetview">${icon('compass')} 무료 360° 사진 찾기</button>${external(osmSearchUrl(p.query),'OpenStreetMap에서 찾기')}</div>
    </article>
    <section class="media-section" aria-labelledby="media-title"><div class="section-head"><div><p class="eyebrow">EXPLORE THE PLACE</p><h3 id="media-title">현장 둘러보기</h3></div><span class="live-tag">360°</span></div><div id="media-stage" class="media-stage"></div><p class="media-help">Panoramax의 공개 사진을 검색합니다. 360° 사진이 확인된 경우에만 회전·확대할 수 있으며, 당시 건물을 복원한 3D 모델은 아닙니다.</p></section>
    <section class="related-video"><div class="section-head"><h3>관련 영상 보기</h3><button class="text-action" data-action="videos">전체 영상 ${icon('arrow')}</button></div><div class="mini-videos">${relatedVideos(videos,c,p).map(v=>`<button class="mini-video" data-video="${esc(v.id)}"><img src="${videoThumb(v)}" alt="" loading="lazy"/><span><strong>${esc(v.title)}</strong><small>${esc(v.publisher)}</small></span>${icon('arrow')}</button>`).join('')}</div><button class="btn video-more" data-action="videos">${icon('video')} 전체 ${videos.length}편 둘러보기</button></section>`;
  renderMedia();
}
function freeViewActions(p){
  return `<div class="stage-actions"><button class="btn primary" data-action="streetview">${icon('compass')} 위치 다시 검색</button><button class="btn" data-action="choose-map-point">${icon('pin')} 지도에서 위치 지정</button>${external(osmSearchUrl(p.query),'OSM 주소 검색')}${external(googleMapsUrl(p),'Google Maps 웹에서 찾기')}${external(mapillaryUrl(state.viewPoint||city().center),'Mapillary 사진 지도')}</div>`;
}
function renderMedia() {
  const stage=document.getElementById('media-stage');if(!stage)return;
  if(state.mediaStatus==='loading'){stage.innerHTML=`<div class="stage-message"><span class="spinner" aria-hidden="true"></span><strong>공개 자료를 검색하고 있습니다</strong><p>위치와 실제 360° 사진 제공 여부를 확인합니다.</p></div>`;return;}
  if(state.mediaStatus==='ready')return;
  const p=place();
  if(state.mediaStatus==='candidates'){
    stage.innerHTML=`<div class="stage-message"><strong>지도 검색 위치를 확인하세요</strong><p>아래는 무료 주소 검색의 후보입니다. 역사적 건물의 정확한 위치로 검증된 것은 아닙니다.</p><div class="location-candidates">${state.viewCandidates.map((item,i)=>`<button class="location-candidate" data-candidate="${i}"><strong>${esc(item.name)}</strong><small>이 위치 주변의 공개 사진 찾기 →</small></button>`).join('')}</div>${freeViewActions(p)}</div>`;return;
  }
  const message=state.mediaStatus==='unavailable'?'검색한 위치 주변에서 공개 360° 사진을 찾지 못했습니다.':'공개 사진 서비스에 연결하지 못했습니다. 잠시 뒤 다시 시도하거나 외부 지도를 이용하세요.';
  const body=state.mediaStatus==='idle'?'API 키와 결제 없이 공개 360° 사진을 찾아봅니다. 위치가 불확실하면 지도 검색 후보를 먼저 확인합니다.':message;
  stage.innerHTML=`<div class="stage-message"><div class="stage-emblem">${icon('compass')}</div><strong>${state.mediaStatus==='idle'?'무료 현장 둘러보기':'거리뷰 안내'}</strong><p>${esc(body)}</p>${freeViewActions(p)}</div>`;
}
function videoThumb(v){return v.provider==='youtube'&&/^[\w-]{11}$/.test(v.videoId)?'https://i.ytimg.com/vi/'+v.videoId+'/hqdefault.jpg':null;}
function videoCard(v){
 const thumb=videoThumb(v);
 return `<article class="video-card" data-video-card="${esc(v.id)}">
   <button class="video-thumbnail" data-video="${esc(v.id)}" aria-label="${esc(v.title)} 재생">${thumb?`<img src="${thumb}" alt="" loading="lazy" decoding="async"/>`:''}<span class="play-badge">${icon('video')}</span><span class="video-duration">${esc(v.year||v.topic)}</span></button>
   <div class="video-info"><div class="video-meta"><span>${esc(v.topic)}</span><span>${esc(v.year||'자료 영상')}</span></div><h3>${esc(v.title)}</h3><p class="video-publisher">${esc(v.publisher)}</p><p>${esc(v.description)}</p><div class="video-actions"><button class="btn primary" data-video="${esc(v.id)}">${icon('video')} 여기서 재생</button>${external(v.url,'원본 영상','secondary')}</div></div>
 </article>`;
}
function renderVideoCards(){
 const result=filterVideoCatalog(videos,state.videoFilter);
 const list=document.getElementById('video-library');if(!list)return;
 list.innerHTML=result.length?result.map(videoCard).join(''):'<div class="video-empty"><strong>일치하는 영상이 없습니다.</strong><p>검색어를 바꾸거나 전체 목록으로 돌아가 보세요.</p><button class="btn" data-action="reset-video-filters">필터 초기화</button></div>';
 document.getElementById('video-count').textContent=`${result.length}편 / 전체 ${videos.length}편`;
 document.querySelectorAll('[data-video-topic]').forEach(button=>{const active=button.dataset.videoTopic===state.videoFilter.topic;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
}
function renderVideoLibrary(){
 const chosen=getVideo(state.videoId);
 const root=document.getElementById('detail-root');
 root.innerHTML=`<section class="video-hub" aria-labelledby="videos-title">
  <div class="video-hub-heading"><div><p class="eyebrow">HISTORY VIDEO ARCHIVE</p><h2 id="videos-title">관련 영상 보기</h2><p>여러 역사 영상을 스크롤하며 둘러보세요. 썸네일을 누르면 이곳에서 재생하고, 원본 버튼은 제공자 사이트로 연결됩니다.</p></div><span class="video-total">${videos.length}<small>VIDEOS</small></span></div>
  <div class="video-toolbar"><label class="video-search">${icon('search')}<span class="sr-only">영상 검색</span><input id="video-search" type="search" placeholder="제목, 인물, 주제로 검색" value="${esc(state.videoFilter.query)}" autocomplete="off"/></label><label class="video-city-label"><span class="sr-only">도시별 영상</span><select id="video-city"><option value="all">모든 도시</option>${cities.map(c=>`<option value="${c.id}" ${state.videoFilter.city===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label><button class="btn" data-action="reset-video-filters">초기화</button></div>
  <div class="video-topics" role="group" aria-label="영상 주제">${VIDEO_TOPICS.map(t=>`<button class="video-topic" data-video-topic="${t}" aria-pressed="${state.videoFilter.topic===t}">${t}</button>`).join('')}</div>
  <p class="video-results" id="video-count" role="status" aria-live="polite"></p>
  <div class="video-hub-body"><div class="video-library" id="video-library"></div>
   <aside class="video-player-panel" id="video-player-panel"><div class="section-head"><h3>선택한 영상</h3><span class="live-tag">PLAYER</span></div><div id="video-player" class="video-player"></div><div id="video-player-info"></div><div class="more-video-links"><p>더 다양한 영상을 찾고 싶다면 공식 채널에서 계속 둘러볼 수 있습니다.</p>${external('https://www.youtube.com/@imjung0411/videos','기념관 공식 채널','secondary')}${external('https://www.youtube.com/results?search_query='+encodeURIComponent('대한민국 임시정부 역사 다큐'),'YouTube에서 더 찾기','secondary')}</div></aside>
  </div></section>`;
 renderVideoCards();
 if(chosen)showVideo(chosen.id);else renderVideoPlaceholder();
}
function renderVideoPlaceholder(){
 const player=document.getElementById('video-player');if(!player)return;
 player.innerHTML=`<div class="stage-message"><div class="stage-emblem">${icon('video')}</div><strong>보고 싶은 영상을 선택하세요</strong><p>목록에서 썸네일이나 여기서 재생 버튼을 누르면 플레이어가 열립니다.</p></div>`;
 document.getElementById('video-player-info').innerHTML='<p class="video-player-hint">영상은 선택할 때만 불러옵니다. 제공자가 삽입 재생을 제한하면 원본 사이트에서 시청하세요.</p>';
}
function showVideo(id){
 const v=getVideo(id);if(!v)return;
 state.videoId=id;
 const player=document.getElementById('video-player');if(!player)return;
 const embed=videoEmbedUrl(v);
 if(embed){player.innerHTML=`<iframe title="${esc(v.title)}" src="${esc(embed)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>`;}
 else{player.innerHTML=`<div class="stage-message"><strong>외부 사이트에서 시청할 수 있습니다.</strong>${external(v.url,'원본 영상 열기','primary')}</div>`;}
 document.getElementById('video-player-info').innerHTML=`<div class="player-info"><span class="video-meta">${esc(v.topic)} · ${esc(v.year||'자료 영상')}</span><h4>${esc(v.title)}</h4><p>${esc(v.publisher)}</p>${external(v.url,'원본 영상 바로가기','primary')}<p class="muted tiny">실제 영상의 현재 공개·임베드 허용 여부는 제공자 설정에 따라 달라집니다.</p></div>`;
 document.querySelectorAll('[data-video-card]').forEach(card=>card.classList.toggle('selected',card.dataset.videoCard===id));
}
function renderSources() {
  document.getElementById('detail-root').innerHTML=`<div class="detail-heading"><div><p class="eyebrow">ARCHIVE & GUIDE</p><h2>자료와 이용 안내</h2><p class="muted">역사를 확인하고, 현장을 정확하게 찾기</p></div></div><div class="guide-content"><h3>이 지도는 무엇을 보여주나요?</h3><p>임시정부의 주요 이동 경로와 관련 피난 거점을 구분했습니다. 지도상의 도시 연결선은 역사적 이동의 흐름을 설명하는 선이며 실제 도로·철도·피난 경로를 정확하게 재현한 것은 아닙니다.</p><h3>거리뷰와 지도 위치</h3><p>기본 지도는 OpenStreetMap, 위치 후보 검색은 Nominatim, 공개 파노라마는 Panoramax를 사용합니다. Google Maps API 키·결제 설정은 필요하지 않습니다. 위치 후보는 역사적 주소의 검증된 좌표가 아니며, 사진이 없을 때 다른 장소의 사진을 대신 보여주지 않습니다. 지도에서 직접 위치를 지정할 수도 있습니다. Mapillary와 Google Maps는 외부 웹사이트 링크만 제공합니다.</p><h3>영상 이용</h3><p>영상은 원본 제공자의 임베드 플레이어를 사용하며, 재생 제한이 있으면 원본 사이트에서 시청할 수 있습니다. 영상 파일을 복제하거나 별도 서버에 재업로드하지 않습니다.</p><h3>참고 자료</h3><div class="source-list">${Object.entries(sources).map(([id,s])=>sourceLink(id,s.label)).join('')}</div><h3>프로젝트 정보</h3><p>교육·탐구용 웹앱입니다. 관람 시간, 현재 건물 보존 상태, 접근 가능 여부는 방문 전 현지 운영기관에 다시 확인해 주세요. 제공된 태극기 이미지는 사용자가 제공한 디자인 참고 자료입니다.</p></div>`;
}
function renderDetail() {
  if(state.screen==='places')renderPlaces();
  else if(state.screen==='videos')renderVideoLibrary();
  else renderSources();
  renderNav();
}
function switchScreen(screen) {
  if(!['places','videos','sources'].includes(screen))return;
  state.stageToken++;
  state.screen=screen;state.videoId=null;state.mediaStatus='idle';state.viewPoint=null;state.viewPhoto=null;state.viewCandidates=[];state.selectingPoint=false;
  if(screen==='videos')state.videoFilter={query:'',city:'all',topic:'전체'};
  renderDetail();
  if(screen==='places'&&map)requestAnimationFrame(()=>map.invalidateSize?.());
  document.getElementById('detail-root').scrollTop=0;
}
function selectCity(id,focus=true) {
  const c=getCity(id);if(!c)return;
  state.cityId=id;state.placeId=c.places[0].id;state.screen='places';state.videoId=null;state.mediaStatus='idle';state.stageToken++;state.viewPoint=null;state.viewPhoto=null;state.viewCandidates=[];state.selectingPoint=false;state.viewPoint=null;state.viewPhoto=null;state.viewCandidates=[];state.selectingPoint=false;
  state.videoFilter={query:'',city:'all',topic:'전체'};
  state.mapMode='city';syncHash();renderCities();renderMapHeading();renderDetail();refreshMarkers();
  if(map)requestAnimationFrame(()=>map.invalidateSize?.());
  if(focus&&map)map.flyTo(c.center,c.zoom,{duration:.75});
  document.getElementById('detail-root').scrollTop=0;
}
function selectPlace(id) {
  const p=getPlace(city(),id);if(!p)return;
  state.placeId=id;state.mediaStatus='idle';state.stageToken++;state.viewPoint=null;state.viewPhoto=null;state.viewCandidates=[];state.selectingPoint=false;state.videoId=null;
  syncHash();renderDetail();refreshMarkers();
}
function drawMap() {
  map=L.map('map',{zoomControl:false,worldCopyJump:true,scrollWheelZoom:false,preferCanvas:true});
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'}).addTo(map);
  let tileError=false;
  tiles.on('tileerror',()=>{if(!tileError){tileError=true;document.getElementById('map-status').textContent='지도 배경을 불러오지 못했습니다. 인터넷 연결을 확인하세요.';document.getElementById('map-status').hidden=false;}});
  L.control.zoom({position:'bottomright'}).addTo(map);
  const line=routeCities.map(c=>c.center);
  routeLine=L.polyline(line,{color:'#b63c3b',weight:2.5,opacity:.86,dashArray:'5 9',lineCap:'round',interactive:false}).addTo(map);
  refreshMarkers();fitRoute(false);
  map.on('click',event=>{if(!state.selectingPoint)return;state.selectingPoint=false;const point=[event.latlng.lat,event.latlng.lng];showSitePosition(point,'사용자가 선택한 탐색 위치');searchPanoramas(point,'지도에서 지정한 위치');});
}
function refreshMarkers() {
  if(!map)return;
  cityMarkers.forEach(marker=>marker.remove());cityMarkers=[];
  cities.forEach(c=>{
    const selected=c.id===state.cityId;
    const html=`<div class="map-marker ${selected?'selected':''} ${c.kind==='related'?'related':''}"><span class="marker-dot"></span><span class="marker-label">${esc(c.name)}</span></div>`;
    const marker=L.marker(c.center,{icon:L.divIcon({className:'marker-container',html,iconSize:[100,42],iconAnchor:[50,21]}),title:`${c.name} · ${c.period}`,alt:`${c.name} 도시 선택`,keyboard:true,zIndexOffset:selected?1000:0}).addTo(map);
    marker.on('click',()=>selectCity(c.id));cityMarkers.push(marker);
  });
  if(siteMarker){siteMarker.remove();siteMarker=null;}
}
function fitRoute(animate=true) {
  state.mapMode='all';renderMapHeading();
  if(map)map.fitBounds(L.latLngBounds(routeCities.map(c=>c.center)),{padding:[36,36],maxZoom:6,animate});
}
async function geocodeCandidates(query,center){
  const cacheKey=query+'|'+center.join(',');
  if(locationCache.has(cacheKey))return locationCache.get(cacheKey);
  // The public Nominatim service is called only after a user action, never for autocomplete or bulk geocoding.
  const wait=Math.max(0,1100-(Date.now()-lastGeocodeAt));if(wait)await delay(wait);
  lastGeocodeAt=Date.now();
  const response=await fetch(nominatimSearchUrl(query),{headers:{Accept:'application/json'}});
  if(!response.ok)throw new Error('GEOCODING_UNAVAILABLE');
  const rows=await response.json();
  const candidates=locationCandidates(rows,center);
  locationCache.set(cacheKey,candidates);
  return candidates;
}
function loadPanoramaxViewer(){
  if(customElements.get('pnx-photo-viewer'))return Promise.resolve();
  if(!viewerPromise){viewerPromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src=PANORAMAX_VIEWER;script.async=true;
    const timer=setTimeout(()=>{cleanup();reject(new Error('VIEWER_TIMEOUT'));},20000);
    function cleanup(){clearTimeout(timer);script.onerror=null;}
    script.onerror=()=>{cleanup();reject(new Error('VIEWER_LOAD_FAILED'));};
    script.onload=()=>customElements.whenDefined('pnx-photo-viewer').then(()=>{cleanup();resolve();},reject);
    document.head.appendChild(script);
  }).catch(error=>{viewerPromise=null;throw error;});}
  return viewerPromise;
}
function showSitePosition(position,name) {
  if(siteMarker){siteMarker.remove();siteMarker=null;}
  siteMarker=L.circleMarker(position,{radius:8,color:'#ffffff',weight:2,fillColor:'#214d70',fillOpacity:1}).addTo(map);
  siteMarker.bindTooltip(`${name} · 지도 검색 위치`,{direction:'top'}).openTooltip();
  map.flyTo(position,16,{duration:.7});
}
async function openStreetView(){
  const p=place(),c=city(),token=++state.stageToken;
  state.selectingPoint=false;
  if(validPoint(p.location)){searchPanoramas(p.location,p.name);return;}
  state.mediaStatus='loading';renderMedia();
  try{
    const candidates=await geocodeCandidates(p.query,c.center);
    if(token!==state.stageToken||state.screen!=='places')return;
    state.viewCandidates=candidates;
    state.mediaStatus=candidates.length?'candidates':'unavailable';renderMedia();
  }catch(error){if(token!==state.stageToken)return;state.mediaStatus='error';renderMedia();}
}
async function searchPanoramas(point,name){
  if(!validPoint(point))return;
  const token=++state.stageToken;
  state.viewPoint=point;state.viewName=name;state.viewPhoto=null;state.mediaStatus='loading';renderMedia();
  try{
    const response=await fetch(panoramaSearchUrl(point),{headers:{Accept:'application/geo+json, application/json'}});
    if(!response.ok)throw new Error('IMAGERY_UNAVAILABLE');
    const result=await response.json();
    const photos=nearbyPanoramas(result.features,point);
    if(token!==state.stageToken||state.screen!=='places')return;
    if(!photos.length){state.mediaStatus='unavailable';renderMedia();return;}
    const photo=photos[0];state.viewPhoto=photo;
    await loadPanoramaxViewer();
    if(token!==state.stageToken||state.screen!=='places')return;
    const stage=document.getElementById('media-stage');if(!stage)return;
    state.mediaStatus='ready';
    stage.innerHTML=`<div class="pano-header"><span>Panoramax · 공개 360° 사진</span>${external(panoramaxUrl(photo),'원본 사진','secondary')}</div><div class="pano-container"><pnx-photo-viewer endpoint="${PANORAMAX_API}" sequence="${esc(photo.collection)}" picture="${esc(photo.id)}" url-parameters="false" lang="ko" style="display:block;width:100%;height:100%"></pnx-photo-viewer></div><p class="pano-note">${esc(name)} 주변에서 검색된 현재 사진입니다. 역사적 건물의 원형이나 내부를 재현한 것이 아닙니다.</p>${freeViewActions(place())}`;
    showSitePosition([photo.geometry.coordinates[1],photo.geometry.coordinates[0]],'공개 사진 촬영 위치');
  }catch(error){if(token!==state.stageToken)return;state.mediaStatus='error';renderMedia();}
}
function chooseMapPoint(){
  state.selectingPoint=true;state.mediaStatus='idle';renderMedia();
  notify('지도에서 탐색할 위치를 클릭하세요. 정확한 역사 위치인지는 별도로 확인해야 합니다.');
  if(map)map.flyTo(city().center,city().zoom,{duration:.5});
}
function copyCurrentLink(){
  const url=location.href;
  if(navigator.clipboard?.writeText)navigator.clipboard.writeText(url).then(()=>notify('현재 장소 링크를 복사했습니다.')).catch(()=>notify('복사할 수 없습니다. 주소창의 링크를 이용해 주세요.'));
  else notify('주소창의 링크를 복사해 주세요.');
}
function buildShell() {
  document.getElementById('app').innerHTML=`
    <header class="topbar"><div class="brand"><div class="brand-symbol" aria-hidden="true"><span></span></div><div><p class="brand-kicker">DIGITAL HISTORY ATLAS</p><h1>대한민국 임시정부 <em>발자취 찾기</em></h1><p class="brand-subtitle">기억이 걸어온 길, 오늘의 대한민국이 되다</p></div></div><div class="topbar-actions"><img class="flag-reference" src="./public/flag-reference.jpg" alt="제공된 태극기 참고 이미지"/><span class="archive-label">1919 — 1945 · 무료 탐색</span><button class="header-btn" data-action="copy" title="현재 장소 링크 복사">${icon('copy')}<span>공유</span></button></div></header>
    <div class="workspace"><aside class="sidebar"><div class="sidebar-top"><p class="sidebar-label">EXPLORE THE ARCHIVE</p><nav class="main-nav" aria-label="탐색 메뉴"><button data-screen="places" class="active">${icon('map')}<span>발자취 지도</span></button><button data-screen="videos">${icon('video')}<span>관련 영상 보기</span></button><button data-screen="sources">${icon('book')}<span>자료 · 이용 안내</span></button></nav></div><div class="sidebar-scroll"><div class="sidebar-heading"><span>임시정부 이동 경로</span><span>08</span></div><div id="route-list" class="route-list"></div><div class="sidebar-heading related-heading"><span>관련 피난 거점</span><span>02</span></div><div id="related-cities" class="related-list"></div></div><div class="sidebar-footer"><div class="footer-seal">記</div><p>낯선 땅에서도<br/>독립의 뜻을 이어가다.</p><small>교육용 역사 탐색 프로젝트</small></div></aside>
    <main class="map-column"><div class="map-heading"><div><p id="map-eyebrow" class="eyebrow"></p><h2 id="map-title"></h2><p id="map-subtitle"></p></div><button class="btn outline" data-action="all">${icon('layers')} 전체 경로</button></div><div class="map-frame"><div id="map" role="application" aria-label="대한민국 임시정부 주요 도시 지도"></div><div class="map-top-note"><span class="map-dot"></span><span id="map-mode">전체 경로 보기</span></div><div id="map-status" class="map-status" hidden></div><div class="map-legend"><span><i class="legend-route"></i>임시정부 이동 흐름</span><span><i class="legend-related"></i>관련 피난 거점</span></div></div><div class="map-footer"><span>${icon('info')} 도시 표시는 탐색용 중심점이며, 붉은 선은 실제 이동로의 정밀 복원이 아닙니다.</span><span>지도 데이터 © OpenStreetMap</span></div></main>
    <aside class="detail-column" aria-label="선택한 도시와 사적지 정보"><div id="detail-root" class="detail-scroll"></div></aside></div><div id="toast" class="toast" role="status" aria-live="polite"></div>`;
}
function registerEvents() {
  document.addEventListener('input',event=>{if(event.target.id==='video-search'){state.videoFilter.query=event.target.value;renderVideoCards();}});
  document.addEventListener('change',event=>{if(event.target.id==='video-city'){state.videoFilter.city=event.target.value;renderVideoCards();}});
  document.addEventListener('click',event=>{
    const button=event.target.closest('button[data-screen],button[data-city],button[data-place],button[data-video],button[data-action],button[data-video-topic],button[data-candidate]');if(!button)return;
    if(button.dataset.screen){switchScreen(button.dataset.screen);return;}
    if(button.dataset.videoTopic){state.videoFilter.topic=button.dataset.videoTopic;renderVideoCards();return;}
    if(button.dataset.city){selectCity(button.dataset.city);return;}
    if(button.dataset.place){selectPlace(button.dataset.place);return;}
    if(button.dataset.candidate!==undefined){const candidate=state.viewCandidates[Number(button.dataset.candidate)];if(candidate)searchPanoramas(candidate.point,candidate.name);return;}
    if(button.dataset.video){
      const id=button.dataset.video;
      if(state.screen!=='videos')switchScreen('videos');
      showVideo(id);
      document.getElementById('video-player-panel')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});return;
    }
    const action=button.dataset.action;
    if(action==='all')fitRoute();
    else if(action==='streetview')openStreetView();
    else if(action==='choose-map-point')chooseMapPoint();
    else if(action==='videos')switchScreen('videos');
    else if(action==='reset-video-filters'){state.videoFilter={query:'',city:'all',topic:'전체'};renderVideoLibrary();}
    else if(action==='copy')copyCurrentLink();
  });
  window.addEventListener('hashchange',()=>{
    const params=new URLSearchParams(location.hash.slice(1)),c=getCity(params.get('city'));
    if(c){selectCity(c.id);if(getPlace(c,params.get('place')))selectPlace(params.get('place'));}
  });
}
function init(){buildShell();renderCities();renderMapHeading();renderDetail();if(L)drawMap();else document.getElementById('map').innerHTML='<div class="map-fallback">지도 라이브러리를 불러오지 못했습니다. 도시 목록과 역사 정보는 계속 사용할 수 있습니다. 인터넷 연결을 확인한 뒤 새로고침해 주세요.</div>';registerEvents();}
init();
