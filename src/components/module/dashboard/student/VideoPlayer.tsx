interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  // Validate video URL
  if (!videoUrl || videoUrl.trim() === '') {
    return (
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center p-6">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 font-medium">No video available</p>
            <p className="text-gray-500 text-sm mt-1">This lesson does not have a video yet</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle different video URL formats (YouTube and Google Drive)
  const getEmbedUrl = (url: string) => {
    // If already an embed URL, return as is
    if (url.includes('embed') || url.includes('preview')) {
      return url;
    }

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : new URLSearchParams(new URL(url).search).get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Google Drive
    if (url.includes('drive.google.com')) {
      // Extract file ID from various Google Drive URL formats
      let fileId = '';
      
      if (url.includes('/file/d/')) {
        fileId = url.split('/file/d/')[1]?.split('/')[0];
      } else if (url.includes('id=')) {
        fileId = new URLSearchParams(new URL(url).search).get('id') || '';
      }
      
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    // Return original URL if no conversion needed
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <div className="aspect-video">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}