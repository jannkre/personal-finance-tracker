# Copilot Instructions for Personal Finance Tracker

Welcome to the Personal Finance Tracker codebase! This document provides essential guidelines for AI coding agents to be productive in this project. Please follow these instructions to maintain consistency and quality.

## Project Overview

The Personal Finance Tracker is a modern web application for tracking income, expenses, and savings goals. It features:
- A React-based frontend with TypeScript.
- A mocked Express backend using in-memory data.
- Tailwind CSS for styling.
- Chart.js for data visualization.

## Key Components

### Frontend
- **Location**: `frontend/`
- **Framework**: React with TypeScript
- **Structure**:
  - `src/components/`: Reusable UI components (e.g., `Button.tsx`, `Modal.tsx`).
  - `src/pages/`: Page-level components (e.g., `Dashboard.tsx`, `Transactions.tsx`).
  - `src/context/`: Context providers (e.g., `AuthContext.tsx`).
  - `src/hooks/`: Custom hooks (e.g., `useApi.ts`).
  - `src/lib/`: Utility functions (e.g., `api.ts`).

### Backend
- **Location**: `backend/`
- **Framework**: Express.js
- **Structure**:
  - `src/server.js`: Main server file.
  - `src/mockData.js`: In-memory data store.
  - `src/middleware.js`: Middleware functions.
  - `src/types.js`: Type definitions.

## Development Workflow

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd personal-finance-tracker
   ```
2. Install dependencies:
   ```bash
   npm run install:all
   ```

### Running the Application
- Start both frontend and backend:
  ```bash
  npm run dev
  ```
- Start only the frontend:
  ```bash
  npm run dev:frontend
  ```
- Start only the backend:
  ```bash
  npm run dev:backend
  ```

### Testing
- Frontend tests are located in `frontend/src/` and use Jest.
- Run tests with:
  ```bash
  npm test
  ```

## Project-Specific Conventions

1. **State Management**: Use React Context API for global state (e.g., `AuthContext.tsx`).
2. **Styling**: Use Tailwind CSS classes directly in components.
3. **API Communication**: Use `useApi.ts` for all API calls.
4. **Component Structure**: Follow the atomic design principle:
   - Atoms: Basic UI elements (e.g., `Button.tsx`, `Input.tsx`).
   - Molecules: Combinations of atoms (e.g., `TransactionForm.tsx`).
   - Organisms: Complex components (e.g., `TransactionTable.tsx`).

## Integration Points

- **Frontend to Backend**: The frontend communicates with the mocked backend via REST API calls. Use `lib/api.ts` for consistent API interactions.
- **Authentication**: Simulated in the backend. Refer to `src/context/AuthContext.tsx` for frontend integration.

## External Dependencies

- **React**: UI library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Chart.js**: Data visualization.
- **Express.js**: Backend framework.

## Tips for AI Agents

- When adding new components, follow the atomic design principle.
- Ensure all API calls are routed through `useApi.ts`.
- Maintain TypeScript types in `frontend/src/types/` and `backend/src/types.js`.
- Write tests for new features and place them alongside the relevant files.

---

Feel free to update this document as the project evolves!