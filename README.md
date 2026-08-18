# DailyTracker

Full-stack Daily Task Tracker:

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Authentication: JWT + bcrypt
- Frontend hosting: Netlify
- Backend hosting: Render (recommended)

## 1. Local frontend

```bash
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

## 2. Local backend

Open a second terminal:

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/dailytracker?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Run:

```bash
npm run dev
```

## 3. MongoDB Atlas

Create a MongoDB Atlas cluster, create a database user, allow the server IP/network access, and copy the application's connection string into `MONGODB_URI`.

Do not put the MongoDB connection string in React or in `VITE_*` variables.

## 4. Netlify

After deploying the backend, set the Netlify environment variable:

```text
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

Then redeploy the frontend.

## 5. Render

Create a Web Service from the `server` folder/repository.

Build command:

```text
npm install
```

Start command:

```text
npm start
```

Environment variables:

```text
MONGODB_URI=...
JWT_SECRET=...
CLIENT_URL=https://YOUR-NETLIFY-SITE.netlify.app
```

The backend should expose:

```text
GET /api/health
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
GET /api/tasks
POST /api/tasks
PATCH /api/tasks/:id
DELETE /api/tasks/:id
```
