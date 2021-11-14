// create and send token and save in the cookie

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
  });
};
module.exports = sendToken;
