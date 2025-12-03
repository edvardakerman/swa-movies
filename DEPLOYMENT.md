# Azure Deployment Guide

## Prerequisites
- Azure account with an active subscription
- GitHub repository with your code pushed

## Step 1: Create Azure Static Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Static Web App" and click Create
4. Fill in the details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use `movies-rg`
   - **Name**: `swa-movies-app` (or your preferred name)
   - **Plan type**: Free
   - **Region**: Choose closest to you (e.g., West Europe)
   - **Deployment source**: GitHub
   - Click "Sign in with GitHub"
   - Select your repository: `edvardakerman/swa-movies`
   - Select branch: `main`
   - **Build Presets**: Choose "Custom"
   - **App location**: `/`
   - **Api location**: `api`
   - **Output location**: `dist`

5. Click "Review + create" then "Create"
6. Wait for deployment (2-3 minutes)

## Step 2: Get the Deployment Token

1. After creation, go to your Static Web App resource
2. In the left menu, click "Overview"
3. Click "Manage deployment token"
4. Copy the token (you'll need this for GitHub)

## Step 3: Configure GitHub Secrets

1. Go to your GitHub repository: https://github.com/edvardakerman/swa-movies
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret" and add these secrets:

   **Secret 1:**
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: [Paste the deployment token from Step 2]

   **Secret 2:**
   - Name: `TMDB_API_KEY`
   - Value: `597eb24bc39938374c88361b49883eea`

   **Secret 3:**
   - Name: `AZURE_STORAGE_CONNECTION_STRING`
   - Value: [Your Azure Storage connection string from Azure Portal → Storage Account → Access keys]

## Step 4: Deploy

1. Commit and push your code:
   ```bash
   git add .
   git commit -m "Add GitHub Actions workflow for Azure deployment"
   git push origin main
   ```

2. The GitHub Action will automatically run
3. Go to "Actions" tab in your GitHub repo to watch the deployment
4. Wait for the workflow to complete (usually 2-5 minutes)

## Step 5: Configure GitHub OAuth for Production

1. In Azure Portal, go to your Static Web App
2. Click "Authentication" in the left menu
3. Under "Identity providers", GitHub should already be configured
4. Note your production URL (e.g., `https://swa-movies-app.azurestaticapps.net`)

5. Go to GitHub: https://github.com/settings/developers
6. Create a NEW OAuth App (separate from local development):
   - **Application name**: `Movies App Production`
   - **Homepage URL**: Your SWA URL from step 4
   - **Authorization callback URL**: `https://swa-movies-app.azurestaticapps.net/.auth/login/github/callback`
   - Click "Register application"

7. Back in Azure Portal → Your Static Web App:
   - Click "Configuration" → "Application settings"
   - You don't need to add OAuth secrets - Azure SWA handles GitHub auth automatically!

## Step 6: Access Your App

1. Go to your Static Web App in Azure Portal
2. Click "Overview"
3. Click the URL (e.g., `https://swa-movies-app.azurestaticapps.net`)
4. Your app should be live!

## Automatic Deployments

Every time you push to the `main` branch, GitHub Actions will automatically:
1. Build your React app
2. Deploy to Azure Static Web Apps
3. Deploy your Azure Functions
4. Update the live site

## Troubleshooting

### Build Fails
- Check the GitHub Actions logs in the "Actions" tab
- Ensure all secrets are correctly set

### Functions Not Working
- Check that `AZURE_STORAGE_CONNECTION_STRING` and `TMDB_API_KEY` are set in GitHub Secrets
- Verify the `api` folder structure is correct

### Authentication Issues
- Check that the OAuth app callback URL matches your SWA URL exactly
- Azure SWA handles GitHub auth automatically - no manual provider configuration needed

## Custom Domain (Optional)

1. In Azure Portal → Your Static Web App
2. Click "Custom domains"
3. Click "Add custom domain"
4. Follow the instructions to verify and configure your domain

## Monitoring

- View logs in Azure Portal → Your Static Web App → "Log Stream"
- Monitor Function executions in "Functions" section
- Check Application Insights for detailed metrics
