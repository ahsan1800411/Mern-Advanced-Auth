const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.getPrivateData = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: 'You are succussfully get access to the website',
  });
});
