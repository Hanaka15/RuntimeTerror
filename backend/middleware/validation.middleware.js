const { body, validationResult } = require('express-validator');

const types = ['multiple_choice', 'slider', 'rank', 'preference'];

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

  // Add specific validation rules here
  static validateSignup() {
    return Validator.validate([
      body('username').trim().notEmpty().withMessage('Username is required'),
      body('email').trim().notEmpty().isEmail(),
      body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[!@#$%^&*]/).withMessage('Password must contain a special character')
    ]);
  }

  static validateLogin() {
    return Validator.validate([
      body('email').trim().notEmpty().isEmail().withMessage('Email is required'),
      body('password').trim().notEmpty().withMessage('Password is required')
    ]);
  }

  static validateInput() {
    return Validator.validate([
      body('title').notEmpty().withMessage('Title is required'),
      body('description').notEmpty().withMessage('Description is required'),
      //validate questions and their content 
      body('questions.*.type')
        .isIn(types)
        .withMessage('Invalid question type'),
      body('questions.*')
        .notEmpty()
        .withMessage('Question empty')
    ]);
  }
}

module.exports = Validator;
