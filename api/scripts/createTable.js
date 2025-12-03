const { TableServiceClient } = require("@azure/data-tables");

// Get connection string from environment
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) {
  console.error('❌ Error: AZURE_STORAGE_CONNECTION_STRING environment variable is not set');
  console.log('Please set it in your environment or api/local.settings.json');
  process.exit(1);
}

async function createTable() {
  try {
    const serviceClient =
      TableServiceClient.fromConnectionString(connectionString);

    console.log("Creating 'watchlist' table...");
    await serviceClient.createTable("watchlist");
    console.log("✅ Table 'watchlist' created successfully!");
  } catch (error) {
    if (error.statusCode === 409) {
      console.log("ℹ️  Table 'watchlist' already exists");
    } else {
      console.error("❌ Error creating table:", error.message);
      throw error;
    }
  }
}

createTable();
