# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal Finance Tracker is a full-stack React application with a mocked backend. The project uses a monorepo structure with separate frontend and backend packages.

**Tech Stack:**
- Frontend: React 19 with TypeScript, Tailwind CSS, React Query, React Router
- Backend: Express.js with in-memory mock data (no database)
- Charts: Recharts library
- UI Components: Headless UI, Heroicons

## Development Commands

**Starting the application:**
```bash
# Install all dependencies
npm run install:all

# Start both frontend (port 3000) and backend (port 5001) concurrently
npm run dev

# Start individual services
npm run dev:frontend  # React dev server
npm run dev:backend   # Express mock server
```

**Build and test:**
```bash
# Build frontend for production
npm run build

# Run frontend tests
cd frontend && npm test

# Production start (backend only)
npm start
```

## Architecture

### Frontend Structure
- **Pages**: Dashboard, Transactions, Accounts, Categories, SavingsGoals, Settings, Login/Register
- **Context Providers**: AuthContext (authentication state), ToastContext (notifications)
- **API Layer**: React Query for data fetching with retry logic and auth error handling
- **Routing**: Protected/Public route wrappers with automatic redirects
- **UI Components**: Custom components in `components/ui/` using Tailwind and Headless UI

### Backend Structure (Mock API)
- **In-memory data store**: All data stored in JavaScript arrays in `mockData.js`
- **Authentication**: Simple token-based auth with mock JWT tokens
- **CRUD operations**: Full REST API for accounts, categories, transactions, savings goals
- **Data relationships**: Accounts/categories/transactions linked by user_id, transactions include account/category details
- **Auto-balance updates**: Account balances automatically updated when transactions are created/modified

### Key Files
- `frontend/src/App.tsx`: Main app with routing and provider setup
- `frontend/src/types/index.ts`: Comprehensive TypeScript definitions
- `frontend/src/lib/api.ts`: API client configuration
- `backend/src/server.js`: Main Express server with all routes
- `backend/src/mockData.js`: In-memory data store and utility functions

### Data Flow
1. Frontend uses React Query for API calls with automatic retries
2. API calls go through `lib/api.ts` with auth headers
3. Backend validates auth tokens and user ownership
4. Mock data stored in arrays, modified directly without persistence
5. Related data (account names, category colors) joined in API responses

## Development Notes

- Backend runs on port 5001 to avoid conflicts
- Frontend proxy configured for API calls to backend
- Authentication uses mock tokens - all requests require auth except login/register
- Account balances automatically update when transactions are modified
- No database - data resets on server restart
- TypeScript strict mode enabled with comprehensive type definitions