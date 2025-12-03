# 🔐 Environment Variables Reference

Complete guide to all environment variables needed for this project.

## Overview

This project requires environment variables in two places:

1. **Frontend** (`.env` in root) - For Vite
2. **API** (`api/.env`) - For Azure Functions

## Frontend Environment Variables

### File: `.env` (root directory)

```env
# API endpoint for local development
VITE_API_BASE_URL=http://localhost:7071/api
```

### Notes:

- Prefix with `VITE_` to expose to browser
- In production, Azure Static Web Apps automatically routes `/api/*` to functions
- Change to production URL if needed: `VITE_API_BASE_URL=https://your-app.azurestaticapps.net/api`

## API Environment Variables

### File: `api/.env`

```env
# TMDB API Key (already provided)
TMDB_API_KEY=597eb24bc39938374c88361b49883eea

# Azure Storage Connection String (YOU NEED TO FILL THIS IN)
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=YOUR_ACCOUNT_NAME;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net
```

### Where to Get Each Value:

#### TMDB_API_KEY

✅ **Already provided**: `597eb24bc39938374c88361b49883eea`

You can also get your own key:

1. Sign up at https://www.themoviedb.org
2. Go to Settings → API
3. Request an API key

#### AZURE_STORAGE_CONNECTION_STRING

⚠️ **You need to provide this**

Get it from Azure Portal:

1. Go to https://portal.azure.com
2. Navigate to your Storage Account
3. Click **Access keys** (under Security + networking)
4. Click **Show keys**
5. Copy **Connection string** from key1 or key2

Or use Azure CLI:

```bash
az storage account show-connection-string \
  --name YOUR_STORAGE_ACCOUNT_NAME \
  --resource-group YOUR_RESOURCE_GROUP \
  --output tsv
```

## Azure Static Web Apps Configuration

When you deploy to Azure, set these in the Portal:

### Location: Azure Portal → Your Static Web App → Configuration

Add these application settings:

| Name                              | Value                              | Notes             |
| --------------------------------- | ---------------------------------- | ----------------- |
| `TMDB_API_KEY`                    | `597eb24bc39938374c88361b49883eea` | Already provided  |
| `AZURE_STORAGE_CONNECTION_STRING` | Your connection string             | From Azure Portal |

### How to Add:

1. Go to Azure Portal
2. Navigate to your Static Web App
3. Click **Configuration** (under Settings)
4. Click **+ Add**
5. Enter name and value
6. Click **OK**
7. Click **Save** at the top

## Optional: Azure Functions Local Settings

### File: `api/local.settings.json` (not in git)

Copy from `api/local.settings.json.example`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "TMDB_API_KEY": "597eb24bc39938374c88361b49883eea",
    "AZURE_STORAGE_CONNECTION_STRING": "your_connection_string_here"
  },
  "Host": {
    "CORS": "*",
    "CORSCredentials": false
  }
}
```

### Notes:

- This file is gitignored (for security)
- Same values as `api/.env`
- Used by Azure Functions Core Tools
- `AzureWebJobsStorage` can be left empty for local dev

## Environment Variables Summary

### ✅ Already Set Up

- `.env` (frontend) - Created with default value
- `api/.env` (backend) - Created with TMDB key

### ⚠️ You Need to Fill In

- `AZURE_STORAGE_CONNECTION_STRING` in `api/.env`

That's it! Just one value to add. 🎉

## Verification

To verify your environment variables are working:

### Frontend

```bash
npm run dev
# Should start without errors
```

### API

```bash
cd api
npm start
# Should start without errors
# Check http://localhost:7071/api/popular
```

## Troubleshooting

### "Cannot find module" errors

```bash
# Install dependencies
npm install
cd api && npm install
```

### "Connection string is invalid"

- Make sure the connection string is complete (one line, no breaks)
- Verify it starts with `DefaultEndpointsProtocol=https`
- Check for extra spaces at beginning/end

### "Property 'env' does not exist"

- TypeScript error that goes away after `npm install`
- Restart VS Code if it persists

### "TMDB API request failed"

- Verify the API key in `api/.env`
- Check your internet connection
- TMDB API might be temporarily down

### "Table does not exist"

- Create the `watchlist` table in Azure Storage
- Verify table name is exactly `watchlist` (lowercase)

## Security Best Practices

✅ **DO:**

- Keep `.env` files in `.gitignore` (already done)
- Use environment variables for secrets
- Rotate keys regularly

❌ **DON'T:**

- Commit `.env` files to git
- Share connection strings publicly
- Hardcode secrets in code

## Need Help?

- **Quick Setup**: See [QUICKSTART.md](./QUICKSTART.md)
- **Detailed Guide**: See [SETUP.md](./SETUP.md)
- **Azure Setup**: See [AZURE_STORAGE_SETUP.md](./AZURE_STORAGE_SETUP.md)

---

**Remember**: Only `AZURE_STORAGE_CONNECTION_STRING` needs to be filled in! Everything else is ready to go. 🚀
