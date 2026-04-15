# PetPlus Full-Stack App

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

Payments and store rules:

- Checkout runs through Razorpay.
- Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` on the backend before testing checkout.
- Store currency is `INR`.
- Shipping is `₹49` when the cart subtotal is below `₹500`, and free for carts above `₹500`.
- Product messaging and storefront defaults are localized for India.

## Deployment

Recommended production setup:

1. Build the frontend with `npm run build`.
2. Keep the generated `dist/` folder on the server.
3. Start the backend with `npm run start`.
4. Let Express serve both the API and the built frontend from the same service.

Required backend env vars before production start:

- `NODE_ENV=production`
- `JWT_SECRET`
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `BOOTSTRAP_ADMIN_EMAIL`
- `BOOTSTRAP_ADMIN_PASSWORD`

Recommended env vars for a live domain:

- `CLIENT_ORIGIN=https://your-frontend-domain.com,https://www.your-frontend-domain.com`
- `VITE_SITE_URL=https://www.your-frontend-domain.com`
- `VITE_API_BASE_URL=https://your-api-domain.com/api`

If you deploy frontend and backend separately:

1. Build the frontend with `npm run build`.
2. Host `dist/` on your frontend provider.
3. Deploy the Node backend separately.
4. Set `CLIENT_ORIGIN` on the backend to your frontend URL.
5. Set `VITE_API_BASE_URL` on the frontend to the backend API URL.
6. Confirm `/api/health` works before testing login, checkout, or admin routes.

Production notes:

- The server will fail fast in production if `JWT_SECRET` is missing or still using the dev default.
- The server will fail fast in production if no admin user can be bootstrapped.
- If Razorpay credentials are missing, checkout stays disabled.
- If Cloudinary is not configured and `ALLOW_LOCAL_UPLOAD_STORAGE` is not enabled, support attachments stay disabled in production.

## Demo credentials

Admin:

- Email: `admin@PetPlus.co.in`
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
- `POST /api/payments/create-order`
- `POST /api/payments/razorpay/verify-payment`
- `GET /api/reviews`
- `GET /api/reviews/eligible`
- `POST /api/reviews`
- `POST /api/newsletter/subscribe`
- `POST /api/quiz/submissions`
- `GET /api/admin/dashboard`
