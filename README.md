# DailyTracker

Full-stack Daily Task Tracker:

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Authentication: JWT + bcrypt
- Frontend hosting: Netlify
- Backend hosting: Render

 MongoDB Atlas

Create a MongoDB Atlas cluster, create a database user, allow the server IP/network access, and copy the application's connection string into `MONGODB_URI`.

Do not put the MongoDB connection string in React or in `VITE_*` variables.

Netlify

After deploying the backend, set the Netlify environment variable:


Then redeploy the frontend.

Render

Create a Web Service from the `Backend` folder/repository.

