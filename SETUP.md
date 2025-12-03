# 🚀 Setup Instructions

Follow these steps to get your Movies app running locally and deployed to Azure.

## Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install API dependencies
cd api
npm install
cd ..
```

## Step 2: Create Azure Storage Account

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource** → **Storage account**
3. Fill in the details:
   - **Resource group**: Create new or use existing
   - **Storage account name**: Choose a unique name (e.g., `swamovies123`)
   - **Region**: Choose closest to you
   - **Performance**: Standard
   - **Redundancy**: LRS (Locally-redundant storage)
4. Click **Review + Create** → **Create**

## Step 3: Create Tables in Azure Storage

1. In your Storage Account, go to **Data storage** → **Tables**
2. Click **+ Table** and create:
   - Table name: `watchlist`
3. Click **+ Table** and create:
   - Table name: `users` (optional)

## Step 4: Get Your Connection String

1. In your Storage Account, go to **Security + networking** → **Access keys**
2. Click **Show keys**
3. Copy **Connection string** from key1 or key2

## Step 5: Fill in Environment Variables

Open `api/.env` and paste your connection string:

```env
TMDB_API_KEY=597eb24bc39938374c88361b49883eea
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=YOUR_ACCOUNT;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net
```

## Step 6: Run Locally

### Option A: Run Separately

```bash
# Terminal 1 - Frontend (runs on port 3000)
npm run dev

# Terminal 2 - API (runs on port 7071)
cd api
npm start
```

Then open http://localhost:3000

### Option B: Use Azure Static Web Apps CLI (Recommended)

```bash
# Install the CLI globally
npm install -g @azure/static-web-apps-cli

# Run the app (runs on port 4280)
swa start http://localhost:3000 --api-location ./api
```

Then open http://localhost:4280

> **Note**: With Option B, you get the full authentication experience locally.

## Step 7: Test the Application

Since authentication is required, you'll need to deploy to Azure first to test fully. For local testing:

1. Temporarily disable authentication in `staticwebapp.config.json`
2. Or use the SWA CLI with mocked auth

## Step 8: Deploy to Azure Static Web Apps

### Create Static Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource** → Search for **Static Web Apps**
3. Click **Create**
4. Fill in the details:
   - **Resource group**: Use the same as your storage account
   - **Name**: `swa-movies` (or your preferred name)
   - **Plan type**: Free
   - **Region**: Choose closest to you
   - **Deployment details**:
     - Source: **GitHub**
     - Sign in to GitHub
     - Select your repository
     - Branch: `main`
     - Build presets: **Custom**
     - App location: `/`
     - Api location: `api`
     - Output location: `dist`
5. Click **Review + Create** → **Create**

### Configure Environment Variables in Azure

1. Go to your Static Web App in Azure Portal
2. Click **Configuration** (under Settings)
3. Click **+ Add** and add:
   - Name: `TMDB_API_KEY`
   - Value: `597eb24bc39938374c88361b49883eea`
4. Click **+ Add** again:
   - Name: `AZURE_STORAGE_CONNECTION_STRING`
   - Value: Paste your connection string
5. Click **Save**

### Configure GitHub OAuth

1. In your Static Web App, go to **Role management**
2. Click **Invite** and choose GitHub
3. Follow the instructions to set up GitHub OAuth

## Step 9: Push Your Code

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/swa-movies.git

# Push to GitHub
git push -u origin main
```

GitHub Actions will automatically build and deploy your app!

## Step 10: Access Your App

1. Go to your Static Web App in Azure Portal
2. Copy the **URL** (e.g., https://happy-sea-123.azurestaticapps.net)
3. Open it in your browser
4. You'll be redirected to GitHub to authenticate
5. After authentication, you can use the app!

## Troubleshooting

### "Cannot read property 'env' of undefined"

- Make sure you've installed dependencies: `npm install`
- Restart your dev server

### "Failed to fetch watchlist"

- Check that your Azure Storage connection string is correct in `api/.env`
- Make sure the `watchlist` table exists in your storage account
- Check the browser console for error details

### "Authentication not working locally"

- Use the Azure Static Web Apps CLI: `swa start`
- Or temporarily disable auth in `staticwebapp.config.json` for local dev

### "API returns 500 error"

- Check Azure Functions logs in terminal
- Verify TMDB API key is correct
- Ensure all environment variables are set

### "Movies not loading"

- Check browser console for errors
- Verify TMDB API key in `api/.env`
- Check that the API is running on port 7071

## Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review the [PROJECT_REQUIREMENTS.md](./PROJECT_REQUIREMENTS.md) for specifications
- Open an issue on GitHub

---

Happy coding! 🎬✨
