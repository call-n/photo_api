/**
 * Album Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');


const createRules = [
	body('title').exists().isLength({ min: 3 }),
];

const createRulesAlbumPhoto = [
	body('photo_id').exists(),
];

const updateRules = [
	body('title').optional().isLength({ min: 3 }),
];

module.exports = {
	createRules,
	createRulesAlbumPhoto,
	updateRules,
}
