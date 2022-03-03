/**
 * User Validation Rules
 */

 const { body } = require('express-validator');
 const models = require('../models');
 

 const createRules = [
     body('email').exists().isLength({ min: 3 }).isEmail().custom(async value => {
         const email = await new models.User({ email: value }).fetch({ require: false });
         if (email) {
             return Promise.reject("Email already exists.");
         }
 
         return Promise.resolve();
     }),
     body('password').exists().isLength({ min: 4 }),
     body('first_name').exists().isLength({ min: 2 }),
     body('last_name').exists().isLength({ min: 2 }),
 ];
 
 /**
  * Update User validation rules
  *
  * Required: -
  * Optional: password, first_name, last_name
  */
 const updateRules = [
     body('password').optional().isLength({ min: 4 }),
     body('first_name').optional().isLength({ min: 2 }),
     body('last_name').optional().isLength({ min: 2 }),
 ];
 
 module.exports = {
     createRules,
     updateRules,
 }
