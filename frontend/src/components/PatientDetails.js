import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../config'; // Import the base URL
import { Loader2, AlertCircle, Stethoscope, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom'; // or the appropriate library
import { FaPlusCircle } from 'react-icons/fa'; // Font Awesome

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [authorizations, setAuthorizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/api/patients/${id}`),
      fetch(`${BASE_URL}/api/authorizations?patientId=${id}`)
    ])
      .then(([patientRes, authRes]) => Promise.all([patientRes.json(), authRes.json()]))
      .then(([patientData, authData]) => {
        setPatient(patientData);
        setAuthorizations(authData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, [id]);

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
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Patient Details</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
        {patient ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-xl sm:text-2xl font-bold leading-6 text-gray-900">{patient.name}</h2>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2 text-gray-400" />
                    Age
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.age}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                    Medical History
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.medicalHistory}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                    Treatment Plan
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{patient.treatmentPlan}</dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <Link to={`/patients/${id}/authorize`}>
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center">
                  <FaPlusCircle className="w-5 h-5 mr-2" />
                  Request Authorization
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No patient found.</p>
        )}

        <div className="mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Authorization Status</h2>
          {authorizations.length === 0 ? (
            <p className="text-center text-gray-500">No authorization requests found.</p>
          ) : (
            <ul className="bg-white shadow overflow-hidden sm:rounded-lg">
              {authorizations.map((auth, index) => (
                <li key={auth._id} className={`px-4 py-5 sm:px-6 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="flex items-center mb-2">
                    <Stethoscope className="w-5 h-5 mr-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-500">Treatment Details:</p>
                  </div>
                  <p className="ml-7 text-sm text-gray-900">{auth.treatmentDetails}</p>
                  <div className="flex items-center mt-2">
                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                    <p className="text-sm font-medium text-gray-500">Status:</p>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      auth.requestStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                      auth.requestStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {auth.requestStatus}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
