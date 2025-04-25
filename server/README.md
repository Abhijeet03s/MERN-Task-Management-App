# Task Management Application Server
This is a simple Task Management Application built using Node.js, Express, and Supabase.

## Tech Stack Used:
- Node.js
- Express.js
- Supabase (PostgreSQL)

## Setup Instructions:

1. Create a `.env` file in the server directory based on `.sample.env`
2. Set up your Supabase project:
   - Create a new project at [Supabase](https://supabase.com)
   - Get your Supabase URL and anon key from the project dashboard
   - Add them to your `.env` file
3. Set up your database schema:
   - Use the SQL in `config/supabase-schema.sql` in the Supabase SQL editor
4. Install dependencies:
   ```
   npm install
   ```
5. Start the server:
   ```
   npm run dev
   ```

## Routes:

1. ### Todo routes:

- GET All Todos
  > localhost:4000/get_todos

- GET Todo
  > localhost:4000/get_todo/:todoId

- CREATE Todo
  > localhost:4000/create_todo

- EDIT Todo
  > localhost:4000/edit_todo/:todoId

- DELETE Todo
  > localhost:4000/delete_todo/:todoId

--------------------------------------

2. ### Task routes:

- GET Tasks for Todo
  > localhost:4000/get_tasks/:todoId

- CREATE Task
  > localhost:4000/create_task/:todoId

- EDIT Task
  > localhost:4000/edit_task/:todoId

- DELETE Task
  > localhost:4000/delete_task/:todoId

--------------------------------------

3. ### Search routes:

- Search Todos and Tasks
  > localhost:4000/search

## Authentication
The server currently uses a simplified authentication system. In production, you should implement proper authentication using Supabase Auth.