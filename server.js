const express = require('express');
const connectDatabase = require('./config/database');
require('dotenv').config({ path: './config.env' });
const authRoutes = require('./routes/auth');
const privateRoutes = require('./routes/private');
const errorMiddleware = require('./middlewares/errors');

const app = express();

// middlewares
app.use(express.json());

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/private', privateRoutes);

// Connect Database

connectDatabase();

app.use(errorMiddleware);
const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log('server is running on port 5000');
});

// Handle unhandled promise rejections  //  to handle the error
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
