const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');

router.get('/:width/:height/:greyscale', catController);
router.get('/:width/:height', catController);

module.exports = router;
