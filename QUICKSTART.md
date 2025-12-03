# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## 🎯 What You Need

1. **Azure Storage Connection String** - Get this from Azure Portal
2. **10 minutes** - To set everything up

## 🚀 Fast Track Setup

### Step 1: Get Azure Storage Connection String (2 min)

1. Go to https://portal.azure.com
2. Find your Storage Account (or create one)
3. Click **Access keys** → **Show keys**
4. Copy the **Connection string**

### Step 2: Fill in Environment Variable (30 sec)

Open `api/.env` and paste your connection string:

```env
TMDB_API_KEY=597eb24bc39938374c88361b49883eea
AZURE_STORAGE_CONNECTION_STRING=paste_your_connection_string_here
```

### Step 3: Create the Table (1 min)

In Azure Portal:

1. Go to your Storage Account
2. Click **Tables** → **+ Table**
3. Name: `watchlist`
4. Click **OK**

### Step 4: Install Dependencies (2 min)

```bash
npm install
cd api
npm install
cd ..
```

### Step 5: Run the App (30 sec)

```bash
# Terminal 1
npm run dev

# Terminal 2
cd api && npm start
```

Open http://localhost:3000 🎉

## 📱 What You'll See

Since authentication is required and only works in production:

- Locally: You'll see a login redirect
- In Production: Full GitHub OAuth flow

To test locally without auth, temporarily modify `staticwebapp.config.json` (see SETUP.md).

## 🌐 Deploy to Azure (Optional)

Want to deploy right away?

1. Push to GitHub:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Create Azure Static Web App:

   - Go to Azure Portal
   - Create "Static Web App"
   - Connect your GitHub repo
   - Set build config:
     - App: `/`
     - API: `api`
     - Output: `dist`

3. Add environment variables in Azure Portal:

   - `TMDB_API_KEY`: `597eb24bc39938374c88361b49883eea`
   - `AZURE_STORAGE_CONNECTION_STRING`: your connection string

4. Wait 2-3 minutes for deployment
5. Access your app URL! 🚀

## 🎬 What You Get

✨ A fully functional movie app with:

- Movie search and discovery
- Personal watchlist
- Detailed movie pages with trailers
- GitHub authentication
- Cloud-hosted database
- Serverless API

## 📚 Learn More

- **Detailed Setup**: See [SETUP.md](./SETUP.md)
- **Azure Guide**: See [AZURE_STORAGE_SETUP.md](./AZURE_STORAGE_SETUP.md)
- **Full Docs**: See [README.md](./README.md)
- **Summary**: See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

## 💡 Pro Tips

- Use the Azure Static Web Apps CLI for better local dev experience:

  ```bash
  npm install -g @azure/static-web-apps-cli
  swa start http://localhost:3000 --api-location ./api
  ```

- Monitor your Azure Functions logs for debugging

- Check browser console for frontend errors

## ❓ Having Issues?

1. **API not working?**

   - Check connection string in `api/.env`
   - Verify `watchlist` table exists
   - Check API terminal for errors

2. **Movies not loading?**

   - Verify TMDB API key
   - Check browser console
   - Ensure API is running

3. **TypeScript errors?**
   - Run `npm install`
   - Restart VS Code

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for full troubleshooting.

---

**Ready?** Let's go! 🎬✨
