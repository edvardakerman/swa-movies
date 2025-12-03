# Azure Storage Quick Setup Guide

## Get Your Connection String Fast

### Method 1: Azure Portal (Web)

1. Visit https://portal.azure.com
2. Navigate to your Storage Account
3. Left menu: **Security + networking** → **Access keys**
4. Click **Show keys**
5. Copy **Connection string** from key1

### Method 2: Azure CLI (Command Line)

```bash
# Login to Azure
az login

# List your storage accounts
az storage account list --output table

# Get connection string (replace YOUR_STORAGE_ACCOUNT_NAME and YOUR_RESOURCE_GROUP)
az storage account show-connection-string \
  --name YOUR_STORAGE_ACCOUNT_NAME \
  --resource-group YOUR_RESOURCE_GROUP \
  --query connectionString \
  --output tsv
```

## Connection String Format

Your connection string should look like this:

```
DefaultEndpointsProtocol=https;AccountName=swamovies123;AccountKey=abc123xyz...==;EndpointSuffix=core.windows.net
```

## Where to Paste It

Open `api/.env` and paste it:

```env
TMDB_API_KEY=597eb24bc39938374c88361b49883eea
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=swamovies123;AccountKey=abc123xyz...==;EndpointSuffix=core.windows.net
```

## Create Tables

### Azure Portal Method

1. In your Storage Account → **Data storage** → **Tables**
2. Click **+ Table**
3. Name: `watchlist`
4. Click **OK**

### Azure CLI Method

```bash
# Set your connection string as environment variable
export AZURE_STORAGE_CONNECTION_STRING="your_connection_string_here"

# Create watchlist table
az storage table create --name watchlist

# Verify table was created
az storage table list --output table
```

### Azure Storage Explorer (GUI Tool)

1. Download [Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/)
2. Connect to your storage account
3. Right-click **Tables** → **Create Table**
4. Name: `watchlist`

## Verify It's Working

Run this command after filling in your `.env`:

```bash
cd api
node -e "const { TableClient } = require('@azure/data-tables'); const client = TableClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING, 'watchlist'); client.listEntities().next().then(() => console.log('✅ Connection successful!')).catch(e => console.error('❌ Connection failed:', e.message));"
```

You should see: `✅ Connection successful!`

## Common Issues

### "The specified resource does not exist"

- Make sure you created the `watchlist` table

### "Server failed to authenticate the request"

- Check that your connection string is complete and correct
- Make sure there are no extra spaces or line breaks

### "Cannot find module '@azure/data-tables'"

- Run `npm install` in the `api` folder

---

**Next Step**: Run `npm run dev` to start the frontend and `cd api && npm start` to start the API!
