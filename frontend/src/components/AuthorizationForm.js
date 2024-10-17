import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BASE_URL from '../config'; // Import the base URL
import { FileText, User, Calendar, Loader2, AlertCircle, ArrowLeft, Send } from 'lucide-react';

export default function AuthorizationForm() {
  const { id } = useParams();
  const [treatmentDetails, setTreatmentDetails] = useState('');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/patients/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPatient(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching patient details:', error);
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const authorizationRequest = {
      patientId: id,
      treatmentDetails,
      requestStatus: 'pending',
      patientName: patient?.name,
      patientAge: patient?.age,
    };

    fetch('http://localhost:5000/api/authorization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authorizationRequest),
    })
    .then(response => {
      if (response.ok) {
        alert('Authorization request submitted successfully!');
        navigate(`/patients/${id}`);
      } else {
        throw new Error('Error submitting authorization request');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error.message);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-500 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2" />
          Error fetching patient details: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-600">
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Authorization Request
          </h1>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Patient Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-sm text-gray-600">{patient?.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-sm text-gray-600">Age: {patient?.age}</span>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="treatmentDetails" className="block text-sm font-medium text-gray-700">
                Treatment Details
              </label>
              <textarea
                id="treatmentDetails"
                name="treatmentDetails"
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={treatmentDetails}
                onChange={(e) => setTreatmentDetails(e.target.value)}
                required
                placeholder="Enter detailed treatment information"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <button
                type="button"
                onClick={() => navigate(`/patients/${id}`)}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Patient
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
