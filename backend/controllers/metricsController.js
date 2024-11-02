const Metrics = require('../models/Metrics');


// Add metrics
exports.addMetrics = async (req, res) => {
    const { countryOperatorId, successRate, errorCount } = req.body;
    const newMetric = new Metrics({ countryOperatorId, successRate, errorCount });
    
    try {
        await newMetric.save();
        res.status(201).json(newMetric);
    } catch (err) {
        res.status(500).json({ message: 'Error adding metrics' });
    }
};


const pool = require('../config/db'); // Import the connection pool

// Fetch SMS metrics
exports.getMetrics = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM SmsMetrics ORDER BY timestamp DESC'); // Execute the query
        res.json(rows); // Send the result back as JSON
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error fetching metrics' }); // Send an error response
    }
};
