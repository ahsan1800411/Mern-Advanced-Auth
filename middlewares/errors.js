const ErrorHandler = require('../utils/ErrorHandler');

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Handling Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((err) => err.message);
    error = new ErrorHandler(message, 400);
  }

  //     // handling mongoose duplicate  key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    error = new ErrorHandler(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error',
  });
};
