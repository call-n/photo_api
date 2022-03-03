const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');


const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await models.User.login(email, password);
	if (!user) {
		return res.status(401).send({
			status: 'fail',
			data: 'Authentication failed.',
		});
	}

	const payload = {
		sub: user.get('email'),
		user_id: user.get('id'),
		name: user.get('first_name') + ' ' + user.get('last_name'),
	}

	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
	});

	const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1w',
	});

	return res.send({
		status: 'success',
		data: {
			access_token,
			refresh_token,
		}
	});
}

const refresh = (req, res) => {
	try {
		const payload = jwt.verify(req.body.token, process.env.REFRESH_TOKEN_SECRET);

		delete payload.iat;
		delete payload.exp;

		const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
		});

		return res.send({
			status: 'success',
			data: {
				access_token,
			}
		});

	} catch (error) {
		return res.status(401).send({
			status: 'fail',
			data: 'Invalid token',
		});
	}

}

const register = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	const validData = matchedData(req);

	console.log("The validated data:", validData);

	try {
		validData.password = await bcrypt.hash(validData.password, models.User.hashSaltRounds);

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when hashing the password.',
		});
		throw error;
	}

	try {
		const user = await new models.User(validData).save();
		
		res.send({
			status: 'success',
			data: {
				user,
			},
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new user.',
		});
		throw error;
	}
}

module.exports = {
	login,
	refresh,
	register,
}