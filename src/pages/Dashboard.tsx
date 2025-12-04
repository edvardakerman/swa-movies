import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { movieApi, watchlistApi } from "../utils/api";
import { MovieSearch } from "../components/MovieSearch";
import { MovieCard } from "../components/MovieCard";
import type { Movie, WatchlistItem } from "../types";

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [popularData, watchlistData] = await Promise.all([
        movieApi.getPopular(1),
        watchlistApi.getWatchlist(),
      ]);
      setPopularMovies(popularData.results.slice(0, 10));
      setWatchlist(watchlistData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFirstName = () => {
    if (!user) return "Guest";
    const nameClaim = user.claims?.find((c) => c.typ === "name");
    if (nameClaim) {
      const firstName = nameClaim.val.split(" ")[0];
      return firstName;
    }
    return user.userDetails.split("@")[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 py-6 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Welcome, {getFirstName()}!
        </h2>
        <p className="text-gray-400">Discover your favorite movies</p>
      </div>

      {/* Search Section */}
      <section>
        <MovieSearch />
      </section>

      {/* My Watchlist */}
      {watchlist.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              My Watchlist
              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                {watchlist.length}
              </span>
            </h3>
            <Link
              to="/watchlist"
              className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
            >
              See All →
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {watchlist.slice(0, 10).map((item) => (
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
        </section>
      )}

      {/* Popular Movies */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">Popular Movies</h3>
          <Link
            to="/popular"
            className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
          >
            See All →
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Profile & Sign Out Section */}
      {/* Profile & Sign Out Section */}
      <section className="pt-6 border-t border-gray-800 flex flex-col items-center space-y-3">
        <img
          src="/apple-touch-icon.png"
          alt="Movies app icon"
          className="w-14 h-14 rounded-xl"
        />

        <div className="text-center">
          <p className="text-[11px] text-gray-400">Signed in as</p>
          <p className="text-sm text-white font-semibold">{getFirstName()}</p>
        </div>

        <button
          onClick={signOut}
          className="px-4 py-1.5 rounded-md border border-black text-black text-xs font-semibold bg-white transition-colors"
        >
          Sign Out
        </button>
      </section>
    </div>
  );
};
