/**
 * Photo Validation Rules
 */

const { body } = require('express-validator');
const models = require('../models');
 

const createRules = [
    body('title').exists().isLength({ min: 3 }),
    body('url').exists().isURL(),
    body('comment').exists().isLength({ min: 3}),
];
 
const getRules = [
   body('photoId').exists(),
]

const updateRules = [
   body('title').optional().isLength({ min: 3}),
   body('url').optional().isURL(),
   body('comment').optional().isLength({ min: 3}),
];
 
module.exports = {
    createRules,
    getRules,
    updateRules,
}
 