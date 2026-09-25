# Home Decor Buyer Finder

A full-stack web app that helps **home decor sellers** in the United States find potential **buyers**
(retailers, boutiques, interior designers, distributors) that match their product category and state,
and email those buyers directly from the dashboard.

Built with the **MERN** stack: MongoDB, Express, React (Vite), Node.js.

---

## How it works (project overview)

1. A seller **registers/logs in** (JWT auth).
2. The seller **adds a product** (category, price, US state, description, image).
3. The app's **matching service** ranks buyers from the buyer database by:
   - `+2` if the buyer is interested in the product's category
   - `+1` if the buyer is located in the same US state (lower shipping friction)
4. The seller **selects buyers** and clicks **Send Email** — the backend uses **Nodemailer**
   to email each selected buyer a formatted pitch about the product, and logs every send
   in `EmailLog` for the seller's dashboard history.
5. `server/services/buyerService.js` also has a plug-in point (`BUYER_API_URL` / `BUYER_API_KEY`
   in `.env`) so you can wire in a real external B2B/business-directory API to pull in live
   buyer leads — the app works fully with the local seeded buyer database if you leave this blank.

---

## Folder Structure

```
home-decor-buyer-finder/
├── client/    → React (Vite) frontend
└── server/    → Node/Express/MongoDB backend
```

---

## 1. Backend Setup (server/)

```bash
cd server
npm install
```

Edit `server/.env`:
- `MONGO_URI` — your local MongoDB or MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` — SMTP credentials for sending real emails.
  For Gmail: turn on 2-Step Verification, then create an **App Password** at
  https://myaccount.google.com/apppasswords and use that as `EMAIL_PASS`.

Seed sample U.S. buyers into the database (recommended before first run):

```bash
npm run seed
```

Start the API server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## 2. Frontend Setup (client/)

```bash
cd client
npm install
cp .env.example .env   # adjust VITE_API_URL if needed
npm run dev
```

The app runs at `http://localhost:5173`.

---

## 3. Using the App

1. Go to `http://localhost:5173`, click **Register**, and create a seller account.
2. Click **Add Product**, fill in the product details, and save.
3. You'll be taken to the **Buyers** page, showing buyers ranked by match score.
4. Select buyers and click **Send Email to N Buyer(s)**.
5. Check `Dashboard` for a log of all emails sent.

---

## API Endpoints Summary

| Method | Endpoint                       | Description                           |
|--------|---------------------------------|----------------------------------------|
| POST   | /api/auth/register              | Create seller account                  |
| POST   | /api/auth/login                 | Login                                  |
| GET    | /api/auth/me                    | Get logged-in profile                  |
| POST   | /api/products                   | Add product                            |
| GET    | /api/products                   | List seller's products                 |
| PUT    | /api/products/:id                | Update product                        |
| DELETE | /api/products/:id                | Delete product                        |
| GET    | /api/buyers                     | List all buyers                        |
| GET    | /api/buyers/match/:productId    | Get ranked matching buyers for product |
| POST   | /api/buyers                     | Manually add a buyer lead              |
| POST   | /api/emails/send                | Email selected buyers about a product  |
| GET    | /api/emails/logs                | Get email send history                 |

---

## Notes for your internship submission

- Replace the placeholder secrets in `server/.env` before running — **never commit real secrets**.
- The buyer-matching logic lives in `server/services/matchingService.js` — a good place to explain
  your "algorithm" in a viva/demo.
- The email-sending logic lives in `server/services/emailService.js` (Nodemailer) and
  `server/controllers/emailController.js`.
- `npm run seed` (inside `server/`) populates realistic sample U.S. buyers so the demo works
  without needing a paid external API.
