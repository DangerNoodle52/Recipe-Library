const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userController = require('./controllers/userController');
const recipeController = require('./controllers/recipeController');

dotenv.config();
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Session secret:', process.env.SESSION_SECRET);
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());

// Serve static files from the dist folder
// app.use(express.static(path.resolve(__dirname, "../dist"))),
console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI); // this its undefined - fixed :)

app.use(
  session({
    // secret key for session encryption
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    // don't fore resave of session
    resave: false,
    // don't save empty session
    saveUninitialized: false,
    // cookie age
    cookie: { maxAge: 3600000, secure: false },
    store: MongoStore.create({
      // mongodb connection uri
      mongoUrl: process.env.MONGODB_URI,
      // session collection name in mongodb
      collectionName: 'sessions',
    }),
  })
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// GET request

// Root
app.get('/', (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
});

app.get('/recipes', recipeController.getRecipes, (req, res) => {
  return res.status(200).send(res.locals.recipes);
});

app.get('/savedRecipes');

app.get('/search/:title', recipeController.searchRecipesByName, (req, res) => {
  return res.status(200).send(res.locals.recipebyName);
});

// POST request

// Sign up route with response
app.post('/createUser', userController.createUser, (req, res) => {
  const { email } = res.locals.newUser;

  console.log(`${email} signed up successfully`);
  return res.status(200).send(res.locals.newUser);
});

// Log in route with response
app.post('/verifyUser', userController.verifyUser, (req, res) => {
  return res.status(200).send(res.locals.user);
});

// Verify the current session to pass UserId information
app.get('/current-user', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.status(200).json({ userId: req.session.userId });
});

// server route to check if the user is logged in
app.get('/isLoggedIn', (req, res) => {
  if (req.session && req.session.userId) {
    return res.status(200).json({ loggedIn: true });
  }
  return res.status(200).json({ loggedIn: false });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  if (err) {
    return res.status(500).json({ error: 'Failed to log out' });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  }
});

// Global handler
app.use((err, req, res, next) => {
  console.error(err.log || err.message);
  res
    .status(err.status || 500)
    .send({ error: err.message || 'An unexpected error occurred' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
