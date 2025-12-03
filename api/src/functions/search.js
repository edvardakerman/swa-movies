const { app } = require("@azure/functions");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// GET /api/search?query={query}
app.http("search", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "search",
  handler: async (request, context) => {
    try {
      const url = new URL(request.url);
      const query = url.searchParams.get("query");

      if (!query) {
        return {
          status: 400,
          body: JSON.stringify({ error: "query parameter is required" }),
        };
      }

      const tmdbUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}`;
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
      context.error("Search error:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  },
});
