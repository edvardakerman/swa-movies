# Movie App - Azure Static Web Apps Project Requirements

## Project Overview
Build a modern movie discovery and watchlist application using React + Vite, deployed as an Azure Static Web App with Azure Functions backend and Azure Table Storage for data persistence.

## Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API or Zustand
- **HTTP Client**: Fetch API or Axios

### Backend
- **Runtime**: Azure Functions (Node.js 20)
- **API Type**: HTTP Triggers
- **Authentication**: Azure Static Web Apps (GitHub OAuth)

### Database
- **Storage**: Azure Storage Account - Table Storage
- **Tables**: 
  - `users` (PartitionKey: email, RowKey: userId)
  - `watchlist` (PartitionKey: userId, RowKey: movieId)

### External API
- **TMDB API v3**: For movie data
- API Key: `597eb24bc39938374c88361b49883eea`
- Base URL: `https://api.themoviedb.org/3`

## Features Required

### 1. Authentication
- GitHub OAuth via Azure Static Web Apps built-in authentication
- Protected routes (redirect to login if not authenticated)
- User profile display in header
- Sign out functionality

### 2. Dashboard Page (`/`)
**Layout**: Mobile-first, dark theme (gray-950 background)

**Sections** (in order):
1. **Header**
   - Logo/Title: 🎬 Movies
   - User avatar (right side)
   - Sign Out button
   - Sticky top, z-index 50

2. **Welcome Message**
   - "Welcome, [FirstName]!"
   - Subtitle: "Discover your favorite movies"

3. **Search Section**
   - Search input with icon
   - Real-time search (debounced 500ms)
   - Display up to 6 results in 3-column grid
   - Show: poster, title, rating, year

4. **My Watchlist** (if not empty)
   - Horizontal scrolling carousel
   - "See All" link → `/watchlist`
   - Movie count badge
   - Movie cards: 110px width, consistent sizing

5. **Popular Movies**
   - Horizontal scrolling carousel
   - "See All" link → `/popular`
   - Same card design as watchlist

6. **Info Cards** (3 columns)
   - GitHub (purple theme)
   - Azure Table (blue theme)
   - TMDB (green theme)

### 3. Movie Detail Page (`/movie/:id`)
**Content**:
- Full-width backdrop image with gradient overlay
- Back button (top left)
- Movie title with bookmark button (top right)
- Tagline (if available)
- Rating, year, runtime
- Genre badges
- Overview text
- Embedded YouTube trailer (if available)
- Recommended movies carousel (up to 10)

**Bookmark Button**:
- Toggle add/remove from watchlist
- Filled bookmark icon when in watchlist
- Show loading spinner during action

### 4. Popular Movies Page (`/popular`)
- Header with back button
- 3-column grid layout
- "Load More" button for pagination
- Fetch 20 movies per page from TMDB
- Show "Page X of Y"
- Disable button at end with "You've reached the end"

### 5. Watchlist Page (`/watchlist`)
- Header with back button
- Display all user's watchlist movies in 3-column grid
- Show count: "X movies"
- Empty state:
  - 📭 icon
  - "Your watchlist is empty"
  - "Browse Movies" button → dashboard

## Design System

### Colors (Dark Theme)
```css
Background: #030712 (gray-950)
Cards: #1f2937 (gray-800)
Borders: #374151 (gray-700)
Text Primary: #ffffff (white)
Text Secondary: #9ca3af (gray-400)
Accent: #3b82f6 (blue-500)
Success: #10b981 (green-500)
```

### Layout
- Max width: 672px (max-w-2xl)
- Padding: 12px (px-3)
- Gap: 8px (gap-2)
- Border radius: 8px (rounded-lg)

### Typography
- Headers: font-bold, text-lg to text-2xl
- Body: text-sm to text-base
- Small text: text-xs

### Movie Card Component
- Width: 110px fixed
- Aspect ratio: 2:3 (poster)
- Rounded corners: rounded-md
- Shadow: shadow-lg
- Hover: scale-105 transform
- Rating badge: top-right, ⭐ icon
- Title: 2-line clamp, text-xs
- Year: text-[10px], gray-400

## Azure Functions API Endpoints

### Authentication
All functions should validate user via `x-ms-client-principal` header from Static Web Apps.

### Required Functions

#### 1. `GET /api/watchlist`
- Get user's watchlist from Table Storage
- Return array of watchlist items with movie metadata
- Sort by addedAt (descending)

#### 2. `POST /api/watchlist`
- Add movie to user's watchlist
- Body: `{ movieId, title, posterPath, backdropPath, releaseDate, voteAverage }`
- Check for duplicates
- Return success + updated watchlist

#### 3. `DELETE /api/watchlist?movieId={id}`
- Remove movie from watchlist
- Return success + updated watchlist

#### 4. `GET /api/search?query={query}`
- Forward search to TMDB API
- Return up to 6 results
- Cache for 5 minutes (optional)

#### 5. `GET /api/popular?page={page}`
- Fetch popular movies from TMDB
- Default page = 1
- Return full TMDB response (including total_pages)

#### 6. `GET /api/movie/{id}`
- Fetch movie details from TMDB
- Return movie details object

#### 7. `GET /api/movie/{id}/videos`
- Fetch movie videos from TMDB
- Return first official trailer or first video

#### 8. `GET /api/movie/{id}/recommendations`
- Fetch recommended movies from TMDB
- Return up to 10 recommendations

## Azure Table Storage Schema

### Users Table
```
PartitionKey: email (string)
RowKey: userId (guid)
name: string
image: string (avatar URL)
githubId: string
createdAt: timestamp
```

### Watchlist Table
```
PartitionKey: userId (guid)
RowKey: movieId (number as string)
title: string
posterPath: string | null
backdropPath: string | null
releaseDate: string
voteAverage: number
addedAt: timestamp
```

## Environment Variables

### Local Development (`.env`)
```
VITE_API_BASE_URL=http://localhost:7071/api
TMDB_API_KEY=597eb24bc39938374c88361b49883eea
AZURE_STORAGE_CONNECTION_STRING=<your-connection-string>
```

### Azure Static Web Apps (Portal Configuration)
```
TMDB_API_KEY=597eb24bc39938374c88361b49883eea
AZURE_STORAGE_CONNECTION_STRING=<your-connection-string>
```

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── MovieCard.tsx
│   │   ├── MovieSearch.tsx
│   │   ├── WatchlistButton.tsx
│   │   └── Header.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── MovieDetail.tsx
│   │   ├── Popular.tsx
│   │   └── Watchlist.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── utils/
│   │   ├── api.ts
│   │   └── tmdb.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── api/
│   ├── watchlist/
│   │   ├── get.ts
│   │   ├── post.ts
│   │   └── delete.ts
│   ├── search.ts
│   ├── popular.ts
│   ├── movie.ts
│   ├── videos.ts
│   └── recommendations.ts
├── public/
│   ├── posterFallback.jpeg
│   └── backDropFallback.jpg
├── staticwebapp.config.json
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Static Web Apps Configuration

### `staticwebapp.config.json`
```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    },
    {
      "route": "/login",
      "rewrite": "/.auth/login/github"
    },
    {
      "route": "/logout",
      "rewrite": "/.auth/logout"
    },
    {
      "route": "/*",
      "allowedRoles": ["authenticated"],
      "statusCode": 401,
      "rewrite": "/login"
    }
  ],
  "responseOverrides": {
    "401": {
      "redirect": "/login",
      "statusCode": 302
    }
  },
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "/*.{css,scss,js,png,gif,ico,jpg,svg}"]
  }
}
```

## Key Implementation Notes

1. **Authentication Flow**:
   - Use `/.auth/me` endpoint to get user info
   - Store user in React Context
   - Redirect unauthenticated users to `/login`

2. **Watchlist Data**:
   - Store movie metadata in Table Storage to avoid extra TMDB API calls
   - When displaying watchlist, use stored data directly
   - No need to fetch from TMDB unless viewing detail page

3. **Performance**:
   - Lazy load images with loading="lazy"
   - Debounce search input (500ms)
   - Cache TMDB popular movies (1 hour)
   - Use React.memo for MovieCard component

4. **Mobile First**:
   - All designs optimized for mobile screens first
   - Max width container (672px) for larger screens
   - Touch-friendly button sizes (min 44px)
   - Horizontal scrolling with snap points

5. **Error Handling**:
   - Show loading spinners during API calls
   - Display error messages for failed operations
   - Graceful fallbacks for missing images
   - Empty states for no results

## Deployment Steps

1. Create Azure Storage Account
2. Create Static Web App in Azure Portal
3. Connect GitHub repository
4. Configure GitHub OAuth provider
5. Add environment variables in Portal
6. Deploy via GitHub Actions (auto-configured)

## Success Criteria

- ✅ User can sign in with GitHub
- ✅ Dashboard loads popular movies and search works
- ✅ User can add/remove movies from watchlist
- ✅ Watchlist persists across sessions
- ✅ All pages are mobile-responsive
- ✅ Dark theme applied consistently
- ✅ Movie details page shows trailer and recommendations
- ✅ Pagination works on popular movies page
- ✅ App deployed to Azure Static Web Apps
- ✅ No TypeScript errors
- ✅ Fast load times (< 3s for dashboard)

## Additional Features (Optional)

- Search history
- Movie ratings/reviews
- Share watchlist
- Advanced filters (genre, year, rating)
- Infinite scroll instead of "Load More"
- PWA support
- Dark/light mode toggle
