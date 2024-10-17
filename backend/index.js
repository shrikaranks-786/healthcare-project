const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Patient = require('./models/patient'); // Ensure this path is correct
const AuthorizationRequest = require('./models/authorization'); // Import the AuthorizationRequest model

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb+srv://shrikaranks:JATNrZb9IeDkLIQ4@cluster0.fch4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Route to get patients
app.get('/api/patients', (req, res) => {
    Patient.find()
    .then(patients => res.json(patients))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Route to add a patient
app.post('/api/patientdetails', (req, res) => {
    console.log('Received request:', req.body); // Log the request body
    const { name, age, medicalHistory, treatmentPlan } = req.body;
    const newPatient = new Patient({ name, age, medicalHistory, treatmentPlan });
    newPatient.save()
        .then(() => res.status(201).json('Patient added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});


// Route to get a patient by ID
app.get('/api/patients/:id', (req, res) => {
    const { id } = req.params; // Get the patient ID from the request parameters
    Patient.findById(id)
        .then(patient => {
            if (!patient) {
                return res.status(404).json('Patient not found'); // Return 404 if no patient was found
            }
            res.json(patient); // Return the patient details
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Route to create an authorization request
app.post('/api/authorization', (req, res) => {
    const { patientId, treatmentDetails, requestStatus, patientName, patientAge } = req.body;

    const newAuthorizationRequest = new AuthorizationRequest({
        patientId,
        treatmentDetails,
        requestStatus,
        patientName,
        patientAge,
    });

    newAuthorizationRequest.save()
        .then(() => res.status(201).json('Authorization request created!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Route to get all authorizations or filter by patient ID
app.get('/api/authorizations', (req, res) => {
    const { patientId } = req.query; // Get patientId from query parameters
    const query = patientId ? { patientId } : {}; // Create a query object

    AuthorizationRequest.find(query)
        .then(authorizations => res.json(authorizations))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Route to approve an authorization
app.patch('/api/authorizations/:id/approve', (req, res) => {
    const { id } = req.params;
    AuthorizationRequest.findByIdAndUpdate(id, { requestStatus: 'approved' }, { new: true })
        .then(updatedAuth => res.json(updatedAuth))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Route to reject an authorization
app.patch('/api/authorizations/:id/reject', (req, res) => {
    const { id } = req.params;
    AuthorizationRequest.findByIdAndUpdate(id, { requestStatus: 'denied' }, { new: true })
        .then(updatedAuth => res.json(updatedAuth))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});






