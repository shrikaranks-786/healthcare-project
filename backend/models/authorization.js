const mongoose = require('mongoose');

const authorizationRequestSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    treatmentDetails: { type: String, required: true },
    requestStatus: { type: String, required: true, enum: ['pending', 'approved', 'denied'] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    patientName: { type: String, required: true }, // Add patient name
    patientAge: { type: Number, required: true }, // Add patient age
});

// Create the AuthorizationRequest model
const AuthorizationRequest = mongoose.model('AuthorizationRequest', authorizationRequestSchema);

module.exports = AuthorizationRequest;
