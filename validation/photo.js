/**
 * Photo Validation Rules
 */

 const { body } = require('express-validator');
 const models = require('../models');
 
 /**
  * Create Photo validation rules
  *
  * Required: title
  * Optional: -
  */
 const createRules = [
     body('title').exists().isLength({ min: 4 }),
     body('url').exists().isLength({ min: 4 }).isURL(),
     body('comment').exists().isLength({ min: 4 }),
     body('user_id').exists(),
 ];
 
 /**
  * Update Photo validation rules
  *
  * Required: -
  * Optional: title
  */
 const updateRules = [
    body('title').optional(),
    body('url').optional().isURL(),
    body('comment').optional(),
    body('user_id').optional(),
 ];
 
 module.exports = {
     createRules,
     updateRules,
 }
 