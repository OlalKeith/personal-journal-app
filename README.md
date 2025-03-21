# Personal Journal App

## Tech Stack
- **Frontend**: Next.js (with TypeScript)
- **Backend**: Next.js API Routes (GraphQL)
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken + bcrypt)
- **ORM**: Prisma
- **Testing**: Jest + React Testing Library + Cypress

## Project Setup

### Prerequisites
Ensure you have the following installed:
- Node.js (LTS version recommended)
- PostgreSQL

### Installation Steps
1. **Clone the repository**
   ```sh
   git clone [repo-url]
   cd personal-journal-app
   ```

2. **Initialize a Next.js project with TypeScript**
   ```sh
   npx create-next-app@latest personal-journal-app --typescript
   cd personal-journal-app
   ```

3. **Install dependencies**
   ```sh
   npm install @prisma/client graphql @apollo/client jsonwebtoken bcrypt dotenv
   ```

4. **Set up Prisma**
   ```sh
   npx prisma init
   ```

5. **Set up environment variables**
   Create a `.env` file in the root directory and add:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/journal"
   NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
   ```

6. **Run database migrations**
   ```sh
   npx prisma migrate dev --name init
   ```

7. **Start the development server**
   ```sh
   npm run dev
   ```

8. **Run tests**
   ```sh
   npm run test
   ```

### Project Structure
```
├── prisma/          # Database schema and migrations
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Next.js pages
│   ├── graphql/     # GraphQL schema and resolvers
│   ├── lib/         # Utility functions
│   ├── tests/       # Test cases
│   └── styles/      # Global styles
├── public/          # Static assets
├── .env             # Environment variables
├── package.json     # Dependencies and scripts
└── README.md        # Project documentation
```

