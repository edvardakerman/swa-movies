// Movie interfaces based on TMDB API
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count?: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  original_language?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  key: string;
  site: string;
  type: string;
  name: string;
  official: boolean;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// User interfaces for Azure Static Web Apps auth
export interface User {
  userId: string;
  userDetails: string; // email
  userRoles: string[];
  claims?: ClientPrincipalClaim[];
  identityProvider: string;
}

export interface ClientPrincipalClaim {
  typ: string;
  val: string;
}

export interface ClientPrincipal {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
  claims: ClientPrincipalClaim[];
}

// Watchlist interfaces for Azure Table Storage
export interface WatchlistItem {
  movieId: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  addedAt: string;
}

export interface WatchlistRequest {
  movieId: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
