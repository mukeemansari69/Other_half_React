# Other Half Full-Stack App

This project now includes a React + Vite frontend and a Node.js + Express backend with:

- JWT-based login and registration
- Protected customer account dashboard
- Protected admin dashboard
- API-backed support requests
- API-backed newsletter signups
- API-backed quiz result saving
- Persistent local JSON storage for demo data

## Run the app

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Start the backend in another terminal:

```bash
npm run dev:server
```

Production-style backend start:

```bash
npm run start
```

Build the frontend:

```bash
npm run build
```

Lint the project:

```bash
npm run lint
```

## Environment

Copy `.env.example` to `.env` if you want to override defaults.

Default backend port: `4000`

Default frontend API base: `http://localhost:4000/api`

If login/register shows "Unable to reach the server right now", start the backend with:

```bash
npm run dev:server
```

If you use a non-default frontend origin, set `CLIENT_ORIGIN` as a comma-separated list.

## Demo credentials

Admin:

- Email: `admin@otherhalfpets.com`
- Password: `Admin@123`

Member:

- Email: `member@example.com`
- Password: `Member@123`

## Data storage

The backend stores runtime data in local app files by default:

- `app-data/db.json`
- `app-data/uploads/`

If an older `server/data/db.json` already exists, the server will continue using that legacy path until you move it.
These local files are ignored in git so demo/runtime changes stay local.

## Main routes

Frontend:

- `/login`
- `/register`
- `/account`
- `/admin`
- `/contact`
- `/quiz`

Backend:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/account/summary`
- `PATCH /api/account/profile`
- `POST /api/support/requests`
- `POST /api/newsletter/subscribe`
- `POST /api/quiz/submissions`
- `GET /api/admin/dashboard`
