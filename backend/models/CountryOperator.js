// models/CountryOperatorPair.js
const mongoose = require('mongoose');

const countryOperatorPairSchema = new mongoose.Schema({
    country: { type: String, required: true },
    operator: { type: String, required: true },
    highPriority: { type: Boolean, default: false },
    sessionId: { type: String, required: true }, // Link to the corresponding screen session
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CountryOperatorPair', countryOperatorPairSchema);
