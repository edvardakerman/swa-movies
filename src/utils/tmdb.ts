// TMDB image URLs
const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

// Fallback images
const POSTER_FALLBACK = "/posterFallback.svg";
const BACKDROP_FALLBACK = "/backDropFallback.svg";

// Get poster URL with fallback
export const getPosterUrl = (posterPath: string | null): string => {
  if (!posterPath) return POSTER_FALLBACK;
  return `${TMDB_POSTER_BASE_URL}${posterPath}`;
};

// Get backdrop URL with fallback
export const getBackdropUrl = (backdropPath: string | null): string => {
  if (!backdropPath) return BACKDROP_FALLBACK;
  return `${TMDB_BACKDROP_BASE_URL}${backdropPath}`;
};

// Format release date
export const formatReleaseDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.getFullYear().toString();
};

// Format runtime
export const formatRuntime = (minutes: number | undefined): string => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Format rating
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

// Get YouTube embed URL
export const getYouTubeEmbedUrl = (videoKey: string): string => {
  return `https://www.youtube.com/embed/${videoKey}?rel=0&modestbranding=1`;
};

// Get YouTube watch URL as fallback
export const getYouTubeWatchUrl = (videoKey: string): string => {
  return `https://www.youtube.com/watch?v=${videoKey}`;
};

// Debounce function for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
