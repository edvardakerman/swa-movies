# 🔐 GitHub SSO Setup Guide

Follow these steps to enable GitHub authentication for local development.

## Step 1: Create GitHub OAuth App

1. **Go to GitHub Developer Settings**:

   - Visit: https://github.com/settings/developers
   - Click **"OAuth Apps"** in the left sidebar
   - Click **"New OAuth App"** button

2. **Register your OAuth application**:

   | Field                      | Value                                               |
   | -------------------------- | --------------------------------------------------- |
   | Application name           | `Movies App (Local Dev)`                            |
   | Homepage URL               | `http://localhost:4280`                             |
   | Authorization callback URL | `http://localhost:4280/.auth/login/github/callback` |

   > **Note**: Port 4280 is the default port for Azure Static Web Apps CLI

3. **Click "Register application"**

4. **Save your credentials**:
   - **Client ID**: Visible at the top of the page (copy it)
   - Click **"Generate a new client secret"**
   - **Client Secret**: Copy it immediately (shown only once!)

---

## Step 2: Install Azure Static Web Apps CLI

```bash
npm install -g @azure/static-web-apps-cli
```

Verify installation:

```bash
swa --version
```

---

## Step 3: Configure Your Credentials

Open the file `swa-cli.config.env` in the root directory and fill in your credentials:

```env
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=paste_your_client_id_here
GITHUB_CLIENT_SECRET=paste_your_client_secret_here

# API Environment Variables
TMDB_API_KEY=597eb24bc39938374c88361b49883eea
AZURE_STORAGE_CONNECTION_STRING=paste_your_azure_connection_string_here
```

**Replace**:

- `paste_your_client_id_here` → Your GitHub Client ID
- `paste_your_client_secret_here` → Your GitHub Client Secret
- `paste_your_azure_connection_string_here` → Your Azure Storage connection string

---

## Step 4: Run the App with Authentication

Instead of running `npm run dev`, use the SWA CLI:

```bash
npm run swa
```

Or manually:

```bash
swa start http://localhost:3000 --run "npm run dev" --api-location ./api
```

The app will now run on **http://localhost:4280** (not 3000!)

---

## Step 5: Test Authentication

1. **Open your browser**: http://localhost:4280
2. **You should see**: The login page with "Sign in with GitHub" button
3. **Click the button**: You'll be redirected to GitHub
4. **Authorize the app**: Grant permission to your OAuth app
5. **You're redirected back**: Now authenticated and can see the dashboard!

---

## 🎯 What Each Port Does

| Port     | Purpose                                      |
| -------- | -------------------------------------------- |
| **3000** | Vite dev server (frontend only, no auth)     |
| **7071** | Azure Functions API (backend only)           |
| **4280** | SWA CLI (frontend + API + authentication) ✅ |

---

## 🔧 Troubleshooting

### "Port 4280 is already in use"

Kill the process:

```bash
lsof -ti:4280 | xargs kill -9
```

### "GitHub OAuth callback error"

- Check your callback URL is exactly: `http://localhost:4280/.auth/login/github/callback`
- Make sure you're accessing the app at `http://localhost:4280` (not 3000)

### "Client secret is invalid"

- Regenerate the secret in GitHub
- Update `swa-cli.config.env` with the new secret

### "Cannot read authentication"

- Ensure `swa-cli.config.env` exists and has correct values
- Check the file is in the root directory (not in `api/`)

### API not working

- Make sure your Azure Storage connection string is in `swa-cli.config.env`
- The SWA CLI reads environment variables from this file

---

## 📝 File Checklist

Make sure these files exist and are configured:

- ✅ `swa-cli.config.json` - SWA CLI configuration (already created)
- ✅ `swa-cli.config.env` - Your GitHub OAuth credentials (you need to fill this)
- ✅ `staticwebapp.config.json` - Routes and authentication config (already created)
- ✅ `.gitignore` - Includes `swa-cli.config.env` to prevent committing secrets

---

## 🚀 Quick Start Commands

```bash
# First time setup
npm install -g @azure/static-web-apps-cli
npm install

# Fill in swa-cli.config.env with your credentials

# Run with authentication
npm run swa

# Open in browser
open http://localhost:4280
```

---

## 🔒 Security Notes

- ✅ `swa-cli.config.env` is in `.gitignore` - secrets won't be committed
- ✅ Use different OAuth apps for development and production
- ✅ Never share your Client Secret
- ✅ Regenerate secrets if accidentally exposed

---

## 📚 Additional Resources

- [Azure SWA CLI Docs](https://azure.github.io/static-web-apps-cli/)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Azure SWA Authentication](https://learn.microsoft.com/en-us/azure/static-web-apps/authentication-authorization)

---

**Need help?** Check the troubleshooting section above or review the Azure SWA CLI documentation.
