const { body, validationResult } = require('express-validator');

class Validator {
  static validateRegister() {
    return [
      body('username').notEmpty().withMessage('Username is required'),
      body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[!@#$%^&*]/).withMessage('Password must contain a special character')
    ];
  }

  static validateLogin() {
    return [
      body('username').notEmpty().withMessage('Username is required'),
      body('password').notEmpty().withMessage('Password is required')
    ];
  }

  static Errors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
}

module.exports = Validator;
