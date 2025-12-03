# 🎬 Movies - Azure Static Web Apps

A modern movie discovery and watchlist application built with React, Vite, Azure Functions, and Azure Table Storage.

## ✨ Features

- 🔐 **GitHub OAuth Authentication** via Azure Static Web Apps
- 🎥 **Movie Discovery** - Browse popular movies from TMDB
- 🔍 **Real-time Search** - Find movies with debounced search
- 📚 **Personal Watchlist** - Save movies to watch later
- 📱 **Mobile-First Design** - Responsive dark theme UI
- 🎬 **Movie Details** - View trailers, ratings, and recommendations
- ☁️ **Azure Cloud Powered** - Serverless functions and table storage

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router v6** for navigation
- **Zustand** for state management

### Backend

- **Azure Functions** (Node.js 20) for API
- **Azure Table Storage** for data persistence
- **TMDB API** for movie data

## 📋 Prerequisites

- Node.js 18+ and npm
- Azure account
- Azure Static Web Apps CLI
- Azure Functions Core Tools v4
- TMDB API key (provided: `597eb24bc39938374c88361b49883eea`)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/swa-movies.git
cd swa-movies
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install API dependencies
cd api
npm install
cd ..
```

### 3. Set Up Environment Variables

Create `.env` in the root directory:

```env
VITE_API_BASE_URL=http://localhost:7071/api
```

Create `api/.env`:

```env
TMDB_API_KEY=597eb24bc39938374c88361b49883eea
AZURE_STORAGE_CONNECTION_STRING=your_connection_string_here
```

### 4. Set Up Azure Storage

1. Create an Azure Storage Account in the Azure Portal
2. Create two tables:
   - `watchlist` - For storing user watchlist items
   - `users` - For storing user profiles (optional)
3. Copy the connection string to your `api/.env` file

### 5. Run Development Server

**Option A: Run separately**

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - API
cd api
npm start
```

**Option B: Use Azure SWA CLI (recommended)**

```bash
npm install -g @azure/static-web-apps-cli
swa start http://localhost:3000 --api-location ./api
```

Visit `http://localhost:4280` in your browser.

## 📁 Project Structure

```
swa-movies/
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Header.tsx
│   │   ├── MovieCard.tsx
│   │   ├── MovieSearch.tsx
│   │   └── WatchlistButton.tsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx
│   │   ├── MovieDetail.tsx
│   │   ├── Popular.tsx
│   │   └── Watchlist.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom hooks
│   │   └── useAuth.ts
│   ├── utils/             # Utility functions
│   │   ├── api.ts
│   │   └── tmdb.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── api/                   # Azure Functions
│   ├── watchlist.js      # Watchlist CRUD operations
│   ├── search.js         # Movie search
│   ├── popular.js        # Popular movies
│   ├── movie.js          # Movie details, videos, recommendations
│   ├── host.json
│   └── package.json
├── public/               # Static assets
│   ├── posterFallback.svg
│   └── backDropFallback.svg
├── staticwebapp.config.json
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔌 API Endpoints

### Watchlist

- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add movie to watchlist
- `DELETE /api/watchlist?movieId={id}` - Remove from watchlist

### Movies (TMDB Proxy)

- `GET /api/search?query={query}` - Search movies
- `GET /api/popular?page={page}` - Get popular movies
- `GET /api/movie/{id}` - Get movie details
- `GET /api/movie/{id}/videos` - Get movie trailers
- `GET /api/movie/{id}/recommendations` - Get recommendations

## 🌐 Deploying to Azure

### 1. Create Azure Static Web App

```bash
# Using Azure CLI
az staticwebapp create \
  --name swa-movies \
  --resource-group your-resource-group \
  --source https://github.com/your-username/swa-movies \
  --location "East US 2" \
  --branch main \
  --app-location "/" \
  --api-location "api" \
  --output-location "dist"
```

### 2. Configure Environment Variables in Azure Portal

Navigate to your Static Web App → Configuration → Add:

```
TMDB_API_KEY=597eb24bc39938374c88361b49883eea
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
```

### 3. Enable GitHub OAuth

1. Go to Azure Portal → Static Web App → Authentication
2. Add GitHub as identity provider
3. Configure OAuth app in GitHub settings

### 4. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

GitHub Actions will automatically build and deploy your app.

## 🎨 Design System

### Colors

- Background: `#030712` (gray-950)
- Cards: `#1f2937` (gray-800)
- Borders: `#374151` (gray-700)
- Text Primary: `#ffffff` (white)
- Text Secondary: `#9ca3af` (gray-400)
- Accent: `#3b82f6` (blue-500)

### Layout

- Max width: 672px (`max-w-2xl`)
- Padding: 12px (`px-3`)
- Gap: 8px (`gap-2`)
- Border radius: 8px (`rounded-lg`)

### Movie Card

- Width: 110px fixed
- Aspect ratio: 2:3 (poster)
- Hover: scale-105

## 🔒 Authentication Flow

1. User visits app → Redirected to `/login`
2. `/login` rewrites to `/.auth/login/github`
3. User authenticates with GitHub
4. Azure Static Web Apps creates session
5. User info available via `/.auth/me`
6. API requests include `x-ms-client-principal` header

## 📊 Azure Table Storage Schema

### Watchlist Table

```
PartitionKey: userId (string)
RowKey: movieId (string)
title: string
posterPath: string | null
backdropPath: string | null
releaseDate: string
voteAverage: number
addedAt: timestamp (ISO string)
```

## 🐛 Troubleshooting

### API Not Working

- Check Azure Storage connection string
- Ensure tables are created
- Verify TMDB API key

### Authentication Issues

- Configure GitHub OAuth app
- Check Static Web App authentication settings
- Clear browser cookies

### Build Errors

- Delete `node_modules` and reinstall
- Check Node.js version (18+)
- Verify all dependencies are installed

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Contact

For questions or issues, please open a GitHub issue.

---

Built with ❤️ using Azure Static Web Apps
