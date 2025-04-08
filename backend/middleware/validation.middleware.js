const { body, validationResult } = require('express-validator');

class Validator {
  static validate(validationRules) {
    return [
      ...validationRules,
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      }
    ];
  }

  // You can define specific validation rules here
  static validateRegister() {
    return Validator.validate([
      body('username').notEmpty().withMessage('Username is required'),
      body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[!@#$%^&*]/).withMessage('Password must contain a special character')
    ]);
  }

  static validateLogin() {
    return Validator.validate([
      body('name').notEmpty().withMessage('Username is required'),
      body('password').notEmpty().withMessage('Password is required')
    ]);
  }

  static validateInput() {
    return Validator.validate([
      body('title').notEmpty().withMessage('Title is required'),
      body('descriptio').notEmpty().withMessage('Description is required')
    ]);
  }
}

module.exports = Validator;
