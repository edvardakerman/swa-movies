const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

// Helper to get user ID from request headers
function getUserId(request) {
  const clientPrincipal = request.headers.get("x-ms-client-principal");
  if (!clientPrincipal) {
    // For local development with SWA CLI, return a default user ID
    // In production, this would properly get the authenticated user
    const isDevelopment = process.env.NODE_ENV !== "production";
    if (isDevelopment) {
      return "local-dev-user"; // Use a consistent ID for local testing
    }
    return null;
  }
  const decoded = Buffer.from(clientPrincipal, "base64").toString("utf-8");
  const principal = JSON.parse(decoded);
  return principal.userId;
}

// GET /api/watchlist - Get user's watchlist
app.http("getWatchlist", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "watchlist",
  handler: async (request, context) => {
    try {
      const userId = getUserId(request);

      // If not authenticated, return empty watchlist
      if (!userId) {
        return {
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]),
        };
      }

      const tableClient = TableClient.fromConnectionString(
        STORAGE_CONNECTION_STRING,
        "watchlist"
      );

      const entities = tableClient.listEntities({
        queryOptions: { filter: `PartitionKey eq '${userId}'` },
      });

      const watchlist = [];
      for await (const entity of entities) {
        watchlist.push({
          movieId: parseInt(entity.rowKey),
          title: entity.title,
          posterPath: entity.posterPath,
          backdropPath: entity.backdropPath,
          releaseDate: entity.releaseDate,
          voteAverage: entity.voteAverage,
          addedAt: entity.addedAt,
        });
      }

      // Sort by addedAt descending
      watchlist.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(watchlist),
      };
    } catch (error) {
      context.error("Get watchlist error:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  },
});

// POST /api/watchlist - Add movie to watchlist
app.http("addToWatchlist", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "watchlist",
  handler: async (request, context) => {
    try {
      const userId = getUserId(request);

      // If not authenticated, return 401
      if (!userId) {
        return {
          status: 401,
          body: JSON.stringify({ error: "User not authenticated" }),
        };
      }

      const body = await request.json();
      const {
        movieId,
        title,
        posterPath,
        backdropPath,
        releaseDate,
        voteAverage,
      } = body;

      if (!movieId || !title) {
        return {
          status: 400,
          body: JSON.stringify({ error: "movieId and title are required" }),
        };
      }

      const tableClient = TableClient.fromConnectionString(
        STORAGE_CONNECTION_STRING,
        "watchlist"
      );

      // Check if already exists
      try {
        await tableClient.getEntity(userId, movieId.toString());
        return {
          status: 409,
          body: JSON.stringify({ error: "Movie already in watchlist" }),
        };
      } catch (err) {
        // Entity doesn't exist, proceed with insert
      }

      const entity = {
        partitionKey: userId,
        rowKey: movieId.toString(),
        title,
        posterPath: posterPath || null,
        backdropPath: backdropPath || null,
        releaseDate: releaseDate || "",
        voteAverage: voteAverage || 0,
        addedAt: new Date().toISOString(),
      };

      await tableClient.createEntity(entity);

      // Return updated watchlist
      const entities = tableClient.listEntities({
        queryOptions: { filter: `PartitionKey eq '${userId}'` },
      });

      const watchlist = [];
      for await (const entity of entities) {
        watchlist.push({
          movieId: parseInt(entity.rowKey),
          title: entity.title,
          posterPath: entity.posterPath,
          backdropPath: entity.backdropPath,
          releaseDate: entity.releaseDate,
          voteAverage: entity.voteAverage,
          addedAt: entity.addedAt,
        });
      }

      watchlist.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(watchlist),
      };
    } catch (error) {
      context.error("Add to watchlist error:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  },
});

// DELETE /api/watchlist?movieId={id} - Remove movie from watchlist
app.http("removeFromWatchlist", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "watchlist",
  handler: async (request, context) => {
    try {
      const userId = getUserId(request);

      // If not authenticated, return 401
      if (!userId) {
        return {
          status: 401,
          body: JSON.stringify({ error: "User not authenticated" }),
        };
      }

      const url = new URL(request.url);
      const movieId = url.searchParams.get("movieId");

      if (!movieId) {
        return {
          status: 400,
          body: JSON.stringify({ error: "movieId is required" }),
        };
      }

      const tableClient = TableClient.fromConnectionString(
        STORAGE_CONNECTION_STRING,
        "watchlist"
      );

      await tableClient.deleteEntity(userId, movieId);

      // Return updated watchlist
      const entities = tableClient.listEntities({
        queryOptions: { filter: `PartitionKey eq '${userId}'` },
      });

      const watchlist = [];
      for await (const entity of entities) {
        watchlist.push({
          movieId: parseInt(entity.rowKey),
          title: entity.title,
          posterPath: entity.posterPath,
          backdropPath: entity.backdropPath,
          releaseDate: entity.releaseDate,
          voteAverage: entity.voteAverage,
          addedAt: entity.addedAt,
        });
      }

      watchlist.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(watchlist),
      };
    } catch (error) {
      context.error("Remove from watchlist error:", error);
      return {
        status: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  },
});
