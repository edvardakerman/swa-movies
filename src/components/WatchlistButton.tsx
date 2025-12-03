import { useState, useEffect } from "react";
import { watchlistApi } from "../utils/api";
import type { WatchlistRequest } from "../types";

interface WatchlistButtonProps {
  movie: WatchlistRequest;
  onToggle?: (inWatchlist: boolean) => void;
}

export const WatchlistButton = ({ movie, onToggle }: WatchlistButtonProps) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWatchlistStatus();
  }, [movie.movieId]);

  const checkWatchlistStatus = async () => {
    try {
      const watchlist = await watchlistApi.getWatchlist();
      const isInWatchlist = watchlist.some(
        (item) => item.movieId === movie.movieId
      );
      setInWatchlist(isInWatchlist);
    } catch (error) {
      console.error("Failed to check watchlist status:", error);
    }
  };

  const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      if (inWatchlist) {
        await watchlistApi.removeFromWatchlist(movie.movieId);
        setInWatchlist(false);
        onToggle?.(false);
      } else {
        await watchlistApi.addToWatchlist(movie);
        setInWatchlist(true);
        onToggle?.(true);
      }
    } catch (error) {
      console.error("Failed to toggle watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors disabled:opacity-50"
      title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      {loading ? (
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg
          className="w-6 h-6"
          fill={inWatchlist ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      )}
    </button>
  );
};
