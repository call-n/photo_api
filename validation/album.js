/**
 * Album Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');

/**
 * Create Album validation rules
 *
 * Required: title
 * Optional: -
 */
const createRules = [
	body('title').exists().isLength({ min: 4 }),
	body('user_id').exists(),
];

const createRulesAlbumPhoto = [
	body('album_id').exists(),
	body('photo_id').exists(),
];

/**
 * Update Album validation rules
 *
 * Required: -
 * Optional: title
 */
const updateRules = [
	body('title').optinal().isLength({ min: 4 }),
];

module.exports = {
	createRules,
	createRulesAlbumPhoto,
	updateRules,
}
