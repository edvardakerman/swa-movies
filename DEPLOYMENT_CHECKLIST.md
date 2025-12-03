# 📋 Deployment Checklist

Use this checklist to ensure everything is set up correctly before and after deployment.

## ✅ Before Running Locally

- [ ] Node.js 18+ is installed (`node --version`)
- [ ] npm is installed (`npm --version`)
- [ ] Created Azure Storage Account
- [ ] Created `watchlist` table in Azure Storage
- [ ] Copied Azure Storage connection string
- [ ] Pasted connection string in `api/.env`
- [ ] Verified TMDB API key is in `api/.env`
- [ ] Ran `npm install` in root directory
- [ ] Ran `npm install` in `api` directory

## ✅ Local Development Test

- [ ] Frontend starts successfully (`npm run dev`)
- [ ] API starts successfully (`cd api && npm start`)
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:7071/api (Azure Functions)
- [ ] No console errors in browser
- [ ] No errors in API terminal

## ✅ Before Deploying to Azure

- [ ] Code pushed to GitHub repository
- [ ] All changes committed
- [ ] `.env` files are in `.gitignore` (they are!)
- [ ] Created Azure Static Web App resource
- [ ] Connected GitHub repository to Azure
- [ ] Configured build settings:
  - App location: `/`
  - Api location: `api`
  - Output location: `dist`

## ✅ After Deploying to Azure

- [ ] GitHub Actions workflow completed successfully
- [ ] Added `TMDB_API_KEY` to Azure SWA Configuration
- [ ] Added `AZURE_STORAGE_CONNECTION_STRING` to Azure SWA Configuration
- [ ] Configured GitHub as authentication provider
- [ ] Can access the deployed URL
- [ ] GitHub OAuth login works
- [ ] Dashboard loads after login
- [ ] Search functionality works
- [ ] Can view movie details
- [ ] Can add movies to watchlist
- [ ] Can remove movies from watchlist
- [ ] Watchlist page displays saved movies
- [ ] Popular movies page loads
- [ ] Pagination works on popular page
- [ ] Trailers play on movie detail page
- [ ] Recommendations show on movie detail page

## 🐛 Troubleshooting Checklist

If something doesn't work, check:

### Frontend Issues

- [ ] All dependencies installed? (`npm install`)
- [ ] `.env` file exists with `VITE_API_BASE_URL`?
- [ ] Browser console shows no errors?
- [ ] Using latest Chrome/Firefox/Safari?

### API Issues

- [ ] API dependencies installed? (`cd api && npm install`)
- [ ] `api/.env` file exists?
- [ ] Connection string is complete (no line breaks)?
- [ ] Tables exist in Azure Storage?
- [ ] API running on port 7071?
- [ ] Check API terminal for errors

### Azure Deployment Issues

- [ ] GitHub Actions succeeded?
- [ ] Environment variables set in Azure Portal?
- [ ] Authentication provider configured?
- [ ] Build output location set to `dist`?
- [ ] Check Azure Portal logs for errors

### Authentication Issues

- [ ] GitHub OAuth app created?
- [ ] Callback URLs configured correctly?
- [ ] Logged out and tried logging in again?
- [ ] Cleared browser cookies?

## 📝 Post-Deployment Tasks

- [ ] Test all features in production
- [ ] Share app URL with team/users
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)
- [ ] Enable Application Insights (optional)
- [ ] Set up staging environment (optional)

## 🎉 Success Criteria

Your app is successfully deployed when:

✅ Users can sign in with GitHub
✅ Dashboard loads with popular movies
✅ Search returns movie results
✅ Movie details page displays all information
✅ Users can add/remove movies from watchlist
✅ Watchlist persists across sessions
✅ All pages are mobile-responsive
✅ No console errors
✅ Fast load times (< 3 seconds)

---

**Need Help?** Check PROJECT_SUMMARY.md, SETUP.md, or AZURE_STORAGE_SETUP.md
