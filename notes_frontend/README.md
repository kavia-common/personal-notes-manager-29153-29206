# Personal Notes Frontend (React)

Modern React frontend for the Personal Notes application, styled with the Ocean Professional theme.

## Features
- Authentication (Login/Register) with JWT
- Notes CRUD UI (create, edit, delete)
- Search and pagination
- Protected routes with react-router
- API client with Authorization header and 401 handling
- Ocean Professional design (primary #2563EB, secondary #F59E0B)
- Accessible forms and controls

## Getting Started

1. Install dependencies
   npm install

2. Configure environment
   Copy `.env.example` to `.env` and set:
   REACT_APP_API_BASE_URL=http://localhost:3001

3. Run the app
   npm start

Open http://localhost:3000 in your browser.

## Environment Variables
- REACT_APP_API_BASE_URL: Base URL of the FastAPI backend (must include protocol and port).

## API Contract Assumptions
- POST /auth/register { email, password } -> { token, user? }
- POST /auth/login { email, password } -> { token, user? }
- GET /notes?search=&page=&page_size= -> { items: [...], total } or array
- POST /notes { title, content }
- PUT /notes/{id} { title, content }
- DELETE /notes/{id}

If your backend differs, adjust src/api/client.js endpoints accordingly.

## Security Notes
- JWT is stored in memory, with localStorage fallback to persist across reloads.
- On 401, the app clears credentials and redirects to /login.

## Styling
- CSS is defined in src/styles/theme.css
- Colors:
  - Primary: #2563EB
  - Secondary: #F59E0B
  - Background: #f9fafb
  - Surface: #ffffff
  - Text: #111827
  - Error: #EF4444
