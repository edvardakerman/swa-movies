const { app } = require("@azure/functions");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// GET /api/popular?page={page}
app.http("popular", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "popular",
  handler: async (request, context) => {
    try {
      const url = new URL(request.url);
      const page = url.searchParams.get("page") || "1";

      const tmdbUrl = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&include_adult=true`;
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
      context.error("Popular movies error:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  },
});
