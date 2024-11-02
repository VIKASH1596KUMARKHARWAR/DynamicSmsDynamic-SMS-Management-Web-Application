const express = require('express');
const { getAllOperators, createOrUpdateOperator } = require('../controllers/countryOperatorController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAllOperators);
router.post('/', authMiddleware, createOrUpdateOperator);

module.exports = router;
