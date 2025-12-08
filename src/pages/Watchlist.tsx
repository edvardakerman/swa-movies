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
      {/* Sticky Buttons */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-3 -mb-8 pt-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
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

        {/* Middle Section */}

        {/* X Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-white font-bold text-lg mx-auto">Watchlist</span>
      </div>

      <div className="max-w-2xl mx-auto px-3 py-6 overflow-x-hidden">
        {watchlist.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"}
            </p>

            {/* ✅ Centered 3-column grid with overflow safety */}
            <div className="w-full flex justify-center">
              <div className="grid grid-cols-3 gap-2 w-full justify-items-center">
                {watchlist.map((item) => (
                  <div
                    key={item.movieId}
                    className="min-w-0 w-full flex justify-center"
                  >
                    <MovieCard
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
                  </div>
                ))}
              </div>
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
