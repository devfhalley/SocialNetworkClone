# Facebook Clone

A fully-featured Facebook clone with news feed, user profiles, and social interactions built with React and Express.

![Facebook Clone Screenshot](./screenshot.png)

## Features

- **User Authentication**: Register and login to access the platform
- **News Feed**: View posts from friends in chronological order
- **User Profiles**: Browse user profiles with profile and cover photos
- **Social Interactions**: Like, comment, and share posts
- **Friend System**: Send/accept friend requests and manage friend list
- **Responsive Design**: Works on mobile, tablet, and desktop

## Requirements

- Node.js (version 18.x or later)
- PostgreSQL (version 14.x or later)
- npm or yarn

## Installation

### Windows

1. **Install Node.js**
   - Download and install from [nodejs.org](https://nodejs.org/)
   - Verify installation with `node -v` and `npm -v`

2. **Install PostgreSQL**
   - Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)
   - During installation, take note of your password and port (default is 5432)
   - Add PostgreSQL bin directory to your PATH

3. **Clone and Set Up the Repository**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/facebook-clone.git
   cd facebook-clone

   # Install dependencies
   npm install
   ```

4. **Set Up the Database**
   ```bash
   # Create a new database
   createdb facebook_clone

   # Configure environment variables in a .env file
   echo "DATABASE_URL=postgres://yourusername:yourpassword@localhost:5432/facebook_clone" > .env
   ```

5. **Start the Application**
   ```bash
   # Start the development server
   npm run dev
   ```

### Linux (Ubuntu/Debian)

1. **Install Node.js**
   ```bash
   # Using apt
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Verify installation
   node -v
   npm -v
   ```

2. **Install PostgreSQL**
   ```bash
   # Using apt
   sudo apt-get update
   sudo apt-get install postgresql postgresql-contrib

   # Start PostgreSQL service
   sudo systemctl start postgresql
   sudo systemctl enable postgresql

   # Create a database user (optional)
   sudo -u postgres createuser --interactive
   
   # Create a database
   sudo -u postgres createdb facebook_clone
   ```

3. **Clone and Set Up the Repository**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/facebook-clone.git
   cd facebook-clone

   # Install dependencies
   npm install
   ```

4. **Set Up the Database**
   ```bash
   # Configure environment variables in a .env file
   echo "DATABASE_URL=postgres://yourusername:yourpassword@localhost:5432/facebook_clone" > .env
   ```

5. **Start the Application**
   ```bash
   # Start the development server
   npm run dev
   ```

## Dependencies

### Frontend
- React (UI library)
- Wouter (routing)
- TanStack React Query (data fetching)
- Zod (schema validation)
- React Hook Form (form handling)
- Tailwind CSS (styling)
- ShadCN UI (component library)
- Lucide React (icons)
- Date-fns (date formatting)

### Backend
- Express (web server)
- Drizzle ORM (database ORM)
- PostgreSQL (database)
- Passport (authentication)
- TypeScript (type checking)

## Development

### Folder Structure

- `client/src/` - Frontend React application
  - `components/` - Reusable UI components
  - `pages/` - Page components
  - `hooks/` - Custom React hooks
  - `lib/` - Utility functions
  - `types/` - TypeScript type definitions

- `server/` - Backend Express server
  - `routes.ts` - API routes
  - `storage.ts` - Database access layer
  - `db.ts` - Database connection
  - `seed.ts` - Seed data functions

- `shared/` - Shared code between frontend and backend
  - `schema.ts` - Database schema and types

### Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the production application
- `npm run start` - Start the production server

## License

MIT