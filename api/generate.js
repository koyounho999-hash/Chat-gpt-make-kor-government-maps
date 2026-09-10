export default async function handler(request, response) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (request.method !== 'GET') {
    return response.status(405).json({
      error: 'GET 요청만 지원합니다.'
    });
  }

  // API 키는 코드에 직접 쓰지 않고
  // Vercel의 YOUTUBE_API_KEY 환경 변수에서 읽습니다.
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return response.status(503).json({
      code: 'YOUTUBE_API_KEY_MISSING',
      error: 'YOUTUBE_API_KEY 환경 변수가 설정되지 않았습니다.'
    });
  }

  const q = String(request.query?.q || '').trim().slice(0, 180);
  const requestedLimit = Number(request.query?.limit || 6);
  const maxResults = Math.max(
    1,
    Math.min(Number.isFinite(requestedLimit) ? requestedLimit : 6, 8)
  );

  if (!q) {
    return response.status(400).json({
      error: '검색어가 필요합니다.'
    });
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('type', 'video');
  url.searchParams.set('q', q);
  url.searchParams.set('maxResults', String(maxResults));
  url.searchParams.set('order', 'relevance');
  url.searchParams.set('safeSearch', 'strict');
  url.searchParams.set('videoEmbeddable', 'true');
  url.searchParams.set('relevanceLanguage', 'ko');
  url.searchParams.set('regionCode', 'KR');
  url.searchParams.set('key', apiKey);

  try {
    const youtubeResponse = await fetch(url, {
      headers: { Accept: 'application/json' }
    });

    const data = await youtubeResponse.json();

    if (!youtubeResponse.ok) {
      return response.status(youtubeResponse.status).json({
        error: data?.error?.message || 'YouTube 검색 API 요청에 실패했습니다.'
      });
    }

    const items = (data.items || [])
      .filter(item => item?.id?.videoId)
      .map(item => ({
        videoId: item.id.videoId,
        title: item.snippet?.title || '제목 없음',
        channelTitle: item.snippet?.channelTitle || 'YouTube',
        description: item.snippet?.description || '',
        thumbnail:
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.default?.url ||
          '',
        publishedAt: item.snippet?.publishedAt || ''
      }));

    // 같은 검색 결과를 잠시 캐시해 불필요한 API 호출을 줄입니다.
    response.setHeader(
      'Cache-Control',
      's-maxage=3600, stale-while-revalidate=86400'
    );

    return response.status(200).json({
      query: q,
      items
    });
  } catch (error) {
    return response.status(500).json({
      error: 'YouTube 검색 서버에 연결하지 못했습니다.'
    });
  }
}
