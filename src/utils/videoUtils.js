/**
 * videoUtils.js — Helper utilities for parsing, embedding, and displaying videos
 */

/**
 * Parse any video URL (YouTube, Vimeo, Google Drive, or direct MP4/WebM)
 * and return structured playback & metadata details.
 */
export function parseVideoSource(url) {
  if (!url || typeof url !== 'string') {
    return {
      type: 'direct',
      id: null,
      embedUrl: '',
      defaultThumbnail: '',
      isEmbeddable: false,
    };
  }

  const trimmed = url.trim();

  // 1. YouTube Shorts: youtube.com/shorts/{id}
  const ytShortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (ytShortsMatch) {
    const id = ytShortsMatch[1];
    return {
      type: 'youtube',
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      defaultThumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      isEmbeddable: true,
    };
  }

  // 2. YouTube Standard: youtube.com/watch?v={id}, youtu.be/{id}, youtube.com/embed/{id}
  const ytStandardMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytStandardMatch) {
    const id = ytStandardMatch[1];
    return {
      type: 'youtube',
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
      defaultThumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      isEmbeddable: true,
    };
  }

  // 3. Vimeo: vimeo.com/{id}
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    return {
      type: 'vimeo',
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`,
      defaultThumbnail: '',
      isEmbeddable: true,
    };
  }

  // 4. Google Drive: drive.google.com/file/d/{id}/view, etc.
  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    const id = driveMatch[1];
    return {
      type: 'drive',
      id,
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      defaultThumbnail: `https://lh3.googleusercontent.com/d/${id}`,
      isEmbeddable: true,
    };
  }

  // 5. Direct MP4 / WebM / HTML5 playable video
  const isDirectVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) || trimmed.startsWith('blob:') || trimmed.startsWith('data:video');
  return {
    type: isDirectVideo ? 'direct' : 'direct',
    id: null,
    embedUrl: trimmed,
    defaultThumbnail: '',
    isEmbeddable: false, // will use HTML5 <video> tag
  };
}

/**
 * Checks if a string looks like a valid video URL
 */
export function isValidVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:video') ||
    trimmed.startsWith('blob:')
  );
}
