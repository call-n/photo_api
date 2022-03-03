const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'ajkaramba' }});
});

router.use('/albums', auth.validateJwtToken, require('./album'));
router.use('/photos', auth.validateJwtToken, require('./photo'));

router.use('/', require('./user'));

module.exports = router;
