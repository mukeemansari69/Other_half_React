# Other Half Full-Stack App

This project now includes a React + Vite frontend and a Node.js + Express backend with:

- JWT-based login and registration
- Protected customer account dashboard
- Protected admin dashboard
- API-backed support requests
- SMTP-backed admin email delivery for Contact Us requests when mail env vars are configured
- API-backed newsletter signups
- API-backed quiz result saving
- API-backed purchased-product reviews
- MongoDB Atlas-backed app storage

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
The backend auto-loads `.env` and `.env.local` at startup.

Default backend port: `4000`

Default frontend API base: `http://localhost:4000/api`

MongoDB:

- Set `MONGODB_URI` to your Atlas connection string.
- Set `MONGODB_DB_NAME` to the database name you want the app to use.
- On the first successful Atlas connection, the server will import existing local `app-data/db.json` or `server/data/db.json` data if present, then remove those local JSON database files.

Production safety:

- Set a strong `JWT_SECRET` before deploying.
- Set `MONGODB_URI` and `MONGODB_DB_NAME` before starting the backend.
- Demo seeding is disabled automatically in production unless `ENABLE_DEMO_SEEDING=true`.
- Create the first live admin with `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD`.
- If the frontend is hosted on a different origin, set `CLIENT_ORIGIN` explicitly.

If login/register shows "Unable to reach the server right now", start the backend with:

```bash
npm run dev:server
```

If you use a non-default frontend origin, set `CLIENT_ORIGIN` as a comma-separated list.

Contact Us email delivery:

- Support requests are always saved in the backend dashboard.
- To also send them to the admin inbox, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM`.
- Optional notification inbox vars: `SUPPORT_NOTIFICATION_EMAIL` or `ADMIN_NOTIFICATION_EMAIL`.
- If SMTP is missing, the UI now shows that the request was saved but admin email is still pending configuration.

Recurring subscriptions:

- One-time orders can use Stripe card checkout or the UPI fallback.
- Auto-renewing subscriptions require `STRIPE_SECRET_KEY` because recurring billing is created through Stripe Checkout in subscription mode.
- To sync first-time confirmations, renewals, cancellations, and next billing dates back into the app and admin dashboard, also set `STRIPE_WEBHOOK_SECRET` and point Stripe webhooks to `/api/payments/stripe/webhook`.
- Recommended Stripe events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `invoice.paid`, `customer.subscription.updated`, and `customer.subscription.deleted`.

## Demo credentials

Admin:

- Email: `admin@otherhalfpets.com`
- Password: `Admin@123`

Member:

- Email: `member@example.com`
- Password: `Member@123`

## Data storage

Application data is stored in MongoDB Atlas through `MONGODB_URI`.

- Main app data lives in the Atlas database configured by `MONGODB_DB_NAME`.
- File uploads still live locally in `app-data/uploads/` unless you override `APP_UPLOADS_DIR`.
- If older local JSON database files exist, the backend migrates them into Atlas on first successful startup and removes the old local JSON files afterward.

## Main routes

Frontend:

- `/login`
- `/register`
- `/account`
- `/admin`
- `/review`
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
- `POST /api/payments/create-checkout-session`
- `POST /api/payments/stripe/confirm-session`
- `POST /api/payments/stripe/webhook`
- `GET /api/reviews`
- `GET /api/reviews/eligible`
- `POST /api/reviews`
- `POST /api/newsletter/subscribe`
- `POST /api/quiz/submissions`
- `GET /api/admin/dashboard`
