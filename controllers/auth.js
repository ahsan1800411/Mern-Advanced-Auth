const User = require('../models/User');
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// register a user  /api/auth/register

exports.register = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new ErrorHandler('Please provide all fields', 400));
  }
  // check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler('User already exists', 400));
  } else {
    const user = await User.create({ username, email, password });
    sendToken(user, 201, res);
  }
});

// login user ==> /api/auth/login

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorHandler('User not found with this emal', 400));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid password', 400));
  }

  sendToken(user, 200, res);
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // Send Email to email provided but first check if user exists
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler('No email could not be sent', 404));
  }

  // Reset Token Gen and add to database hashed (private) version of token
  const resetToken = user.getResetPasswordToken();

  await user.save();

  // Create reset url to email to provided email
  const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

  // HTML Message
  const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message,
    });

    res.status(200).json({ success: true, data: 'Email Sent' });
  } catch (err) {
    console.log(err);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(new ErrorHandler('Email could not be sent', 500));
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Compare token in URL params to hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler('Invalid Token', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(201).json({
    success: true,
    data: 'Password Updated Success',
    token: user.getSignedJwtToken(),
  });
});
