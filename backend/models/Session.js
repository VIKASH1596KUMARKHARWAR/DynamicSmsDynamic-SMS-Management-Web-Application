// models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    countryOperatorPairId: { type: mongoose.Schema.Types.ObjectId, ref: 'CountryOperatorPair' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
