import type { WatchlistItem, WatchlistRequest } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Helper function to get headers
const getHeaders = () => ({
  "Content-Type": "application/json",
});

// Watchlist API
export const watchlistApi = {
  // Get user's watchlist
  async getWatchlist(): Promise<WatchlistItem[]> {
    const response = await fetch(`${API_BASE_URL}/watchlist`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch watchlist");
    }
    return response.json();
  },

  // Add movie to watchlist
  async addToWatchlist(movie: WatchlistRequest): Promise<WatchlistItem[]> {
    const response = await fetch(`${API_BASE_URL}/watchlist`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(movie),
    });
    if (!response.ok) {
      throw new Error("Failed to add to watchlist");
    }
    return response.json();
  },

  // Remove movie from watchlist
  async removeFromWatchlist(movieId: number): Promise<WatchlistItem[]> {
    const response = await fetch(
      `${API_BASE_URL}/watchlist?movieId=${movieId}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to remove from watchlist");
    }
    return response.json();
  },
};

// Movie API (proxied through Azure Functions)
export const movieApi = {
  // Search movies
  async search(query: string) {
    const response = await fetch(
      `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`,
      {
        headers: getHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to search movies");
    }
    return response.json();
  },

  // Get popular movies
  async getPopular(page: number = 1) {
    const response = await fetch(`${API_BASE_URL}/popular?page=${page}`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch popular movies");
    }
    return response.json();
  },

  // Get movie details
  async getMovie(id: number) {
    const response = await fetch(`${API_BASE_URL}/movie/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }
    return response.json();
  },

  // Get movie videos
  async getVideos(id: number) {
    const response = await fetch(`${API_BASE_URL}/movie/${id}/videos`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch movie videos");
    }
    return response.json();
  },

  // Get movie recommendations
  async getRecommendations(id: number) {
    const response = await fetch(
      `${API_BASE_URL}/movie/${id}/recommendations`,
      {
        headers: getHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }
    return response.json();
  },
};

// Auth API
export const authApi = {
  // Get current user info from Azure Static Web Apps
  async getCurrentUser() {
    try {
      const response = await fetch("/.auth/me");
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data.clientPrincipal;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
    }
  },
};
