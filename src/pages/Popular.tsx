import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { movieApi } from "../utils/api";
import { MovieCard } from "../components/MovieCard";
import type { Movie } from "../types";

export const Popular = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadMovies(1);
  }, []);

  const loadMovies = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await movieApi.getPopular(pageNum);
      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }
      setPage(pageNum);
      setTotalPages(Math.min(data.total_pages, 5)); // Limit to 5 pages
    } catch (error) {
      console.error("Failed to load popular movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      loadMovies(page + 1);
    }
  };

  const isLastPage = page >= totalPages;

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
        <span className="text-white font-bold text-lg mx-auto">
          Popular Movies
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-3 py-6 space-y-6 overflow-x-hidden">
        {/* Movie Grid */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-3 gap-2 w-full justify-items-center">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="min-w-0 w-full flex justify-center"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        {movies.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </p>

            {!isLastPage ? (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Load More"
                )}
              </button>
            ) : (
              <p className="text-sm text-gray-400">You've reached the end</p>
            )}
          </div>
        )}

        {loading && movies.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};
