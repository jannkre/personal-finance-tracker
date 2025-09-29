# Personal Finance Tracker

A modern, clean personal finance tracking web application built with React and a lightweight mocked backend.

## Features

- 📊 Track income, expenses, and savings goals
- 📈 Beautiful charts and financial insights
- 🎨 Clean, modern interface inspired by Notion and Mint
- 📱 Responsive design for all devices
- ⚡ Fast and delightful user experience

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Mocked Express API (in-memory data)
- **Charts**: Chart.js  
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd personal-finance-tracker
```

2. Install dependencies for all packages
```bash
npm run install:all
```

3. Start the development servers
```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) servers.

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend
- `npm run dev:backend` - Start only the backend
- `npm run build` - Build the frontend for production
- `npm run install:all` - Install dependencies for all packages

## Project Structure

```
personal-finance-tracker/
├── frontend/          # React application
├── backend/           # Mocked Express API server
│   └── src/
│       ├── server.js      # Main server file
│       ├── mockData.js    # In-memory data store
│       ├── middleware.js  # Simple middleware
│       └── types.js       # Type definitions
├── README.md
└── package.json
```

## Development

The application uses a monorepo structure with separate frontend and backend packages. The backend now uses a simple mocked API with in-memory data, making it much lighter and easier to develop with. Both can be developed simultaneously using the provided scripts.

### Backend Features

The mocked backend provides:
- 🚀 Lightweight in-memory data storage
- 🔄 Full CRUD operations for all entities
- 🔐 Simple authentication simulation
- 📊 Same API interface as the original backend
- ⚡ No database setup required

## License

MIT