const { app } = require("@azure/functions");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// GET /api/movie/{id}
app.http("movie", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "movie/{id}",
  handler: async (request, context) => {
    try {
      const id = request.params.id;

      const tmdbUrl = `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&include_video=true`;
      const response = await fetch(tmdbUrl);

      if (!response.ok) {
        throw new Error("TMDB API request failed");
      }

      const data = await response.json();

      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    } catch (error) {
      context.error("Movie details error:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  },
});

// GET /api/movie/{id}/videos
app.http("movieVideos", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "movie/{id}/videos",
  handler: async (request, context) => {
    try {
      const id = request.params.id;

      const tmdbUrl = `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`;
      const response = await fetch(tmdbUrl);

      if (!response.ok) {
        throw new Error("TMDB API request failed");
      }

      const data = await response.json();

      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    } catch (error) {
      context.error("Movie videos error:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  },
});

// GET /api/movie/{id}/recommendations
app.http("movieRecommendations", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "movie/{id}/recommendations",
  handler: async (request, context) => {
    try {
      const id = request.params.id;

      const tmdbUrl = `${TMDB_BASE_URL}/movie/${id}/recommendations?api_key=${TMDB_API_KEY}&include_adult=true`;
      const response = await fetch(tmdbUrl);

      if (!response.ok) {
        throw new Error("TMDB API request failed");
      }

      const data = await response.json();

      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    } catch (error) {
      context.error("Movie recommendations error:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  },
});
