const express = require('express');
const { getMetrics, addMetrics } = require('../controllers/metricsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getMetrics);
router.post('/', authMiddleware, addMetrics);

module.exports = router;
