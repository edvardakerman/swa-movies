import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { watchlistApi } from "../utils/api";
import { MovieCard } from "../components/MovieCard";
import type { WatchlistItem } from "../types";

export const Watchlist = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    try {
      const data = await watchlistApi.getWatchlist();
      setWatchlist(data);
    } catch (error) {
      console.error("Failed to load watchlist:", error);
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-950 border-b border-gray-700">
        <div className="max-w-2xl mx-auto px-3 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
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
          <h1 className="text-xl font-bold text-white">My Watchlist</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 py-6">
        {watchlist.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {watchlist.map((item) => (
                <MovieCard
                  key={item.movieId}
                  movie={{
                    id: item.movieId,
                    title: item.title,
                    poster_path: item.posterPath,
                    backdrop_path: item.backdropPath,
                    release_date: item.releaseDate,
                    vote_average: item.voteAverage,
                    overview: "",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="text-6xl">📭</div>
            <h2 className="text-xl font-bold text-white">
              Your watchlist is empty
            </h2>
            <p className="text-gray-400 text-center">
              Start adding movies to keep track of what you want to watch
            </p>
            <Link
              to="/"
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
