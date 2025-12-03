import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movieApi } from "../utils/api";
import {
  getBackdropUrl,
  formatReleaseDate,
  formatRuntime,
  getYouTubeEmbedUrl,
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

  useEffect(() => {
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
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={getYouTubeEmbedUrl(trailer.key)}
                title={trailer.name}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
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
