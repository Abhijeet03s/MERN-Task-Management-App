# Todo App Client

This is the frontend for the Todo App. It's built with React, Vite, and uses Supabase for authentication and data storage.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the client directory with the following variables:
   ```
   VITE_BACKEND_URL=http://localhost:4000
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project details.

3. Start the development server:
   ```
   npm run dev
   ```

## Features

- User authentication with Supabase
- Create, read, update, and delete todos
- Add tasks to todos
- Mark tasks as complete
- Modern UI with Tailwind CSS

## Project Structure

- `src/components/`: React components
- `src/context/`: Context providers (AuthContext)
- `src/services/`: API and Supabase services
- `src/assets/`: Static assets
- `src/firebase/`: Firebase configuration (legacy, will be removed)

## Dependencies

- React
- React Router
- Supabase
- Axios
- Tailwind CSS 