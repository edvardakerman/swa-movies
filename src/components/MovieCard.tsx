import { Link } from "react-router-dom";
import { getPosterUrl, formatReleaseDate, formatRating } from "../utils/tmdb";
import type { Movie } from "../types";
import { memo } from "react";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = memo(({ movie }: MovieCardProps) => {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="relative block w-[110px] flex-shrink-0 group"
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden shadow-lg transform transition-transform group-hover:scale-105">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {movie.vote_average > 0 && (
          <div className="absolute top-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <span>⭐</span>
            <span>{formatRating(movie.vote_average)}</span>
          </div>
        )}
      </div>
      <div className="mt-1">
        <h3 className="text-xs font-medium text-white line-clamp-2">
          {movie.title}
        </h3>
        {movie.release_date && (
          <p className="text-[10px] text-gray-400 mt-0.5">
            {formatReleaseDate(movie.release_date)}
          </p>
        )}
      </div>
    </Link>
  );
});

MovieCard.displayName = "MovieCard";
