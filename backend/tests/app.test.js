const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Patient = require('../models/patient');
const AuthorizationRequest = require('../models/authorization');

app.use(cors());
app.use(express.json());

// Connect to MongoDB for testing
beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/newproject_test', { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clear the database before each test
beforeEach(async () => {
    await Patient.deleteMany({});
    await AuthorizationRequest.deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

// Route to get patients
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Route to add a patient
app.post('/api/patientdetails', async (req, res) => {
    const { name, age, medicalHistory, treatmentPlan } = req.body;
    const newPatient = new Patient({ name, age, medicalHistory, treatmentPlan });
    try {
        await newPatient.save();
        res.status(201).json('Patient added!');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Route to get a patient by ID
app.get('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json('Patient not found');
        }
        res.json(patient);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Route to create an authorization request
app.post('/api/authorization', async (req, res) => {
    const { patientId, treatmentDetails, requestStatus, patientName, patientAge } = req.body;
    const newAuthorizationRequest = new AuthorizationRequest({ patientId, treatmentDetails, requestStatus, patientName, patientAge });
    try {
        await newAuthorizationRequest.save();
        res.status(201).json('Authorization request created!');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Test cases
describe('Patient Routes', () => {
    it('should add a patient', async () => {
        const response = await request(app)
            .post('/api/patientdetails')
            .send({
                name: 'John Doe',
                age: 30,
                medicalHistory: 'None',
                treatmentPlan: 'Regular checkup',
            });
        expect(response.statusCode).toBe(201);
        expect(response.body).toBe('Patient added!');
    });

    it('should get all patients', async () => {
        await Patient.create({
            name: 'John Doe',
            age: 30,
            medicalHistory: 'None',
            treatmentPlan: 'Regular checkup',
        });

        const response = await request(app).get('/api/patients');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });

    it('should get a patient by ID', async () => {
        const patient = await Patient.create({
            name: 'John Doe',
            age: 30,
            medicalHistory: 'None',
            treatmentPlan: 'Regular checkup',
        });

        const response = await request(app).get(`/api/patients/${patient._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('John Doe');
    });

    it('should return 404 for a non-existing patient', async () => {
        const response = await request(app).get('/api/patients/60d5ec49f1b2c8b1f8c8e8e8');
        expect(response.statusCode).toBe(404);
        expect(response.body).toBe('Patient not found');
    });
});

describe('Authorization Routes', () => {
    it('should create an authorization request', async () => {
        const patient = await Patient.create({
            name: 'John Doe',
            age: 30,
            medicalHistory: 'None',
            treatmentPlan: 'Regular checkup',
        });

        const response = await request(app)
            .post('/api/authorization')
            .send({
                patientId: patient._id,
                treatmentDetails: 'Surgery required',
                requestStatus: 'pending',
                patientName: 'John Doe',
                patientAge: 30,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toBe('Authorization request created!');
    });
});
