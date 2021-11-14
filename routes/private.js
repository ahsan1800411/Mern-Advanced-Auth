const router = require('express').Router();

const { getPrivateData } = require('../controllers/private');
const { isAuthenticatedUser } = require('../middlewares/auth');
router.route('/').get(isAuthenticatedUser, getPrivateData);

module.exports = router;
