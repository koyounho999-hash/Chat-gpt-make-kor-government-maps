// Public, read-only imagery. No Google Maps SDK, API key, or paid geocoding.
export const PANORAMAX_API = 'https://api.panoramax.xyz/api';
export const PANORAMAX_VIEWER = 'https://cdn.jsdelivr.net/npm/@panoramax/web-viewer@5.2.0/build/cjs/index_photoviewer.js';
export const SEARCH_RADIUS_METERS = 200;
export function validPoint(point) {
  return Array.isArray(point) && point.length === 2 && point.every(Number.isFinite) && Math.abs(point[0]) <= 90 && Math.abs(point[1]) <= 180;
}
export function distanceMeters(a,b) {
  if(!validPoint(a)||!validPoint(b))return Infinity;
  const r=Math.PI/180, dLat=(b[0]-a[0])*r, dLon=(b[1]-a[1])*r;
  const h=Math.sin(dLat/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dLon/2)**2;
  return 12742000*Math.asin(Math.min(1,Math.sqrt(h)));
}
export function panoramaSearchUrl(point,radius=SEARCH_RADIUS_METERS) {
  if(!validPoint(point))throw new Error('INVALID_POINT');
  const lat=point[0],lon=point[1];
  const dLat=radius/111320,dLon=radius/(111320*Math.max(.01,Math.cos(lat*Math.PI/180)));
  const u=new URL(PANORAMAX_API+'/search');
  u.searchParams.set('bbox',[lon-dLon,lat-dLat,lon+dLon,lat+dLat].join(','));
  u.searchParams.set('limit','50');
  return u.href;
}
export function isPanorama(feature) {
  const p=feature?.properties||{};
  const orientation=p['pers:interior_orientation']||{};
  return Number(orientation.field_of_view)>=359 || ['equirectangular','spherical'].includes(p['geovisio:type']);
}
export function nearbyPanoramas(features,point,radius=SEARCH_RADIUS_METERS) {
  return (Array.isArray(features)?features:[]).filter(f=>{
    const coordinates=f?.geometry?.coordinates;
    const pos=[coordinates?.[1],coordinates?.[0]];
    return isPanorama(f)&&typeof f.id==='string'&&typeof f.collection==='string'&&distanceMeters(point,pos)<=radius;
  }).sort((a,b)=>distanceMeters(point,[a.geometry.coordinates[1],a.geometry.coordinates[0]])-distanceMeters(point,[b.geometry.coordinates[1],b.geometry.coordinates[0]]));
}
export function panoramaxUrl(photo){
  const u=new URL('https://api.panoramax.xyz/');
  u.searchParams.set('pic',photo.id);u.searchParams.set('focus','pic');return u.href;
}
export function mapillaryUrl(point){
  const u=new URL('https://www.mapillary.com/app/');
  if(validPoint(point)){u.searchParams.set('lat',String(point[0]));u.searchParams.set('lng',String(point[1]));u.searchParams.set('z','17');}
  return u.href;
}
export function osmSearchUrl(query){
  const u=new URL('https://www.openstreetmap.org/search');u.searchParams.set('query',query);return u.href;
}
export function nominatimSearchUrl(query){
  const u=new URL('https://nominatim.openstreetmap.org/search');
  u.searchParams.set('q',query);u.searchParams.set('format','jsonv2');u.searchParams.set('limit','5');u.searchParams.set('addressdetails','0');return u.href;
}
export function locationCandidates(rows,center,maxDistance=30000){
  return (Array.isArray(rows)?rows:[]).map(row=>({point:[Number(row.lat),Number(row.lon)],name:String(row.display_name||''),type:String(row.type||'')})).filter(row=>validPoint(row.point)&&distanceMeters(center,row.point)<=maxDistance);
}
