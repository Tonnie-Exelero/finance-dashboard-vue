# Financial Dashboard

A responsive dashboard application for visualizing financial data with a Vue.js frontend and Node.js GraphQL API backend.

## Features

- Interactive financial dashboard with responsive design
- Dark/light mode toggle with system preference detection
- Summary cards showing key financial metrics
- Interactive charts for revenue trends and expense breakdown
- Transactions table with filtering and pagination
- GraphQL API with PostgreSQL database
- Fully modular and maintainable TypeScript codebase
- State management with Pinia
- SASS for modular styling

## Tech Stack

### Frontend

- Vue.js 3 with Composition API
- TypeScript for type safety
- Pinia for state management
- Vite as the build tool
- SASS for modular styling
- Tailwind CSS for utility styling
- Chart.js and vue-chartjs for data visualization
- Apollo Client for GraphQL integration
- Lucide Vue for icons

### Backend

- Node.js with TypeScript
- Apollo Server for GraphQL API
- PostgreSQL for data storage
- GraphQL for API queries and mutations

### Development Tools

- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- Vitest for unit testing
- Yarn workspaces for monorepo management
- Docker and Docker Compose for containerization

## Project Structure

The project is organized as a monorepo with Yarn workspaces.

## Design Decisions

### TypeScript Integration

The project uses TypeScript throughout both frontend and backend to ensure type safety and improve developer experience:

1. **Type Definitions**: Shared type definitions for data models ensure consistency between frontend and backend.

2. **Type Safety**: All functions, components, and API endpoints are properly typed to catch errors at compile time.

3. **IDE Support**: TypeScript provides better IDE support with autocompletion and inline documentation.

### State Management with Pinia

The project uses Pinia for state management, which offers several advantages:

1. **TypeScript Support**: Pinia has excellent TypeScript support out of the box.

2. **Composition API**: Pinia works seamlessly with Vue 3's Composition API.

3. **Modular Stores**: State is organized into modular stores for different features (dashboard, transactions, settings).

4. **DevTools Integration**: Pinia integrates with Vue DevTools for better debugging.

### SASS Architecture

The project uses a modular SASS architecture to organize styles:

1. **7-1 Pattern**: Styles are organized using a modified 7-1 pattern (abstracts, base, components, layout, pages, themes, vendors).

2. **Variables and Mixins**: Global variables and mixins are defined in the abstracts folder and imported where needed.

3. **Component-Specific Styles**: Each component has its own scoped styles, with global styles defined in the appropriate SASS files.

4. **Dark Mode Support**: Dark mode is implemented using CSS variables and a .dark class on the root element.

### Modular Architecture

The project follows a modular architecture to ensure maintainability and separation of concerns:

1. **Component-Based Design**: The frontend is built with reusable Vue components that each have a single responsibility.

2. **Composables Pattern**: Vue 3 composables are used to extract and reuse stateful logic across components.

3. **Service Layer**: GraphQL queries and database operations are abstracted into service layers.

4. **Repository Pattern**: Database operations are encapsulated in repository modules.

## Getting Started

### Prerequisites

- Node.js (v20.9+)
- Yarn package manager
- Docker and Docker Compose (optional)
- PostgreSQL database (if not using Docker)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Tonnie-Exelero/finance-dashboard-vue.git
cd finance-dashboard-vue
```

2. Install dependencies:

```bash
nvm use

yarn install
```

3. Set up environment variables:

```bash
PGHOST=localhost
PGPORT=5432
PGDATABASE=financial_dashboard
PGUSER=postgres
PGPASSWORD=your_password
PORT=4000
```

4. Start project:

```bash
# Start both frontend and backend
yarn dev

# Or start them separately
yarn dev:client
yarn dev:server

# Run using Docker
docker-compose up -d
```

5. Type checking:

```bash
yarn type-check
```

6. Linting and Formatting:

```bash
# Run linting
yarn lint

# Format code
yarn format
```

7. Testing:

```bash
yarn test

# Run frontend tests
yarn workspace financial-dashboard-client test

# Run backend tests
yarn workspace financial-dashboard-server test
```

8. Deployment:

```bash
# Build the frontend and backend
yarn build

# Start the production server
yarn start
```

9. Deploy with Docker:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```
