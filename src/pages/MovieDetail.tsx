import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieApi } from "../utils/api";
import {
  getBackdropUrl,
  formatReleaseDate,
  formatRuntime,
  getYouTubeEmbedUrl,
  getYouTubeWatchUrl,
} from "../utils/tmdb";
import { WatchlistButton } from "../components/WatchlistButton";
import { MovieCard } from "../components/MovieCard";
import type { Movie, Video } from "../types";

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      loadMovieData(parseInt(id));
    }
  }, [id]);

  const loadMovieData = async (movieId: number) => {
    setLoading(true);
    try {
      const [movieData, videosData, recsData] = await Promise.all([
        movieApi.getMovie(movieId),
        movieApi.getVideos(movieId),
        movieApi.getRecommendations(movieId),
      ]);

      setMovie(movieData);

      // Find official trailer or first video
      const officialTrailer = videosData.results?.find(
        (v: Video) => v.type === "Trailer" && v.official && v.site === "YouTube"
      );
      const firstVideo = videosData.results?.[0];
      setTrailer(officialTrailer || firstVideo || null);

      setRecommendations(recsData.results?.slice(0, 10) || []);
    } catch (error) {
      console.error("Failed to load movie data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-2xl mx-auto px-3 py-6 text-center">
        <p className="text-gray-400">Movie not found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Backdrop with gradient */}
      <div className="relative h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Bookmark button */}
        <div className="absolute top-4 right-4">
          <WatchlistButton
            movie={{
              movieId: movie.id,
              title: movie.title,
              posterPath: movie.poster_path,
              backdropPath: movie.backdrop_path,
              releaseDate: movie.release_date,
              voteAverage: movie.vote_average,
            }}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 py-6 space-y-6">
        {/* Movie Info */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white">{movie.title}</h1>

          {movie.tagline && (
            <p className="text-sm text-gray-400 italic">"{movie.tagline}"</p>
          )}

          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
            <span>{formatReleaseDate(movie.release_date)}</span>
            {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800 text-white text-xs rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-300 leading-relaxed">
            {movie.overview}
          </p>
        </div>

        {/* Trailer */}
        {trailer && (
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Trailer</h2>
            {videoError ? (
              <div className="aspect-video rounded-lg bg-gray-800 flex flex-col items-center justify-center p-6 text-center">
                <svg
                  className="w-16 h-16 text-gray-600 mb-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
                <p className="text-gray-400 mb-4">
                  This video cannot be embedded
                </p>
                <a
                  href={getYouTubeWatchUrl(trailer.key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Watch on YouTube
                </a>
              </div>
            ) : (
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={getYouTubeEmbedUrl(trailer.key)}
                  title={trailer.name}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  onError={() => setVideoError(true)}
                />
              </div>
            )}
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white">You May Also Like</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {recommendations.map((rec) => (
                <MovieCard key={rec.id} movie={rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
