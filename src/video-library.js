// Pure catalog helpers. No external requests or fabricated video IDs.
export const VIDEO_TOPICS = ['전체','사적지 탐방','역사 강의','인물과 생활','현장 기록'];
export function filterVideoCatalog(videos,{query='',city='all',topic='전체'}={}) {
 const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return videos.filter(v=>{
  if(city!=='all' && !v.cityIds?.includes(city))return false;
  if(topic!=='전체' && v.topic!==topic)return false;
  const text=[v.title,v.publisher,v.description,v.topic].join(' ').toLocaleLowerCase();
  return words.every(word=>text.includes(word));
 });
}
export function relatedVideos(videos,city,place){
 const ids=new Set(place?.videoIds||[]);
 return videos.filter(v=>ids.has(v.id)||v.cityIds?.includes(city?.id));
}
export function videoEmbedUrl(video){
 if(video.provider==='youtube' && /^[\w-]{11}$/.test(video.videoId))return 'https://www.youtube-nocookie.com/embed/'+video.videoId+'?rel=0';
 if(video.provider==='vimeo' && /^\d+$/.test(video.videoId))return 'https://player.vimeo.com/video/'+video.videoId;
 return null;
}
