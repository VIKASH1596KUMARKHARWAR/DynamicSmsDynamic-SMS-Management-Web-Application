const CountryOperator = require('../models/CountryOperator');
const pool = require('../config/db'); // Import the connection pool

// Create a new country-operator pair
exports.createCountryOperator = async (req, res) => {
    const { country, operator, isHighPriority } = req.body; // Destructure request body

    try {
        const [result] = await pool.query('INSERT INTO CountryOperator (country, operator, isHighPriority) VALUES (?, ?, ?)', [country, operator, isHighPriority]); // Insert into the database
        res.status(201).json({ id: result.insertId, country, operator, isHighPriority }); // Return the created entry
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: 'Error creating country-operator pair' }); // Send an error response
    }
};

const countryOperatorPairs = [];

const addCountryOperator = (country, operator) => {
    countryOperatorPairs.push({ country, operator });
};

const getCountryOperators = () => {
    return countryOperatorPairs;
};

const updateCountryOperator = (oldCountry, oldOperator, newCountry, newOperator) => {
    const index = countryOperatorPairs.findIndex(pair => pair.country === oldCountry && pair.operator === oldOperator);
    if (index !== -1) {
        countryOperatorPairs[index] = { country: newCountry, operator: newOperator };
    }
};

const removeCountryOperator = (country, operator) => {
    const index = countryOperatorPairs.findIndex(pair => pair.country === country && pair.operator === operator);
    if (index !== -1) {
        countryOperatorPairs.splice(index, 1);
    }
};
