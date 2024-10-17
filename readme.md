# Healthcare Backend

This is a backend application for a healthcare management system built with Node.js, Express, and MongoDB.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (installed locally or use a cloud service)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. **Clone the repository:**
   cd healthcare-project

2. **Install dependencies:**
    cd backend and then npm install
    and then cd frontend and npm install

3. **Set up your MongoDB database:**
   - Ensure your MongoDB server is running locally or set up a cloud MongoDB instance.
   - Update the MongoDB connection string in `backend/index.js` if necessary:
    example mongoose.connect('mongodb://localhost:27017/newproject') 

## Running the Application

1. **Start the server:**
   cd backend and then npm start

2. **Access the API:**
   - The server will run on `http://localhost:5000` by default.
   - You can use tools like Postman or curl to interact with the API.

3  **Start the server:**
    cd frontend and then npm start

## Running Tests

This will execute the test suite using Jest.

## API Endpoints

Here are some of the available API endpoints:

- **Patients**
  - `GET /api/patients` - Get all patients
  - `POST /api/patientdetails` - Add a new patient
  - `GET /api/patients/:id` - Get a patient by ID

- **Authorization Requests**
  - `POST /api/authorization` - Create a new authorization request
  - `PATCH /api/authorizations/:id/approve` - Approve an authorization request
  - `PATCH /api/authorizations/:id/reject` - Reject an authorization request


