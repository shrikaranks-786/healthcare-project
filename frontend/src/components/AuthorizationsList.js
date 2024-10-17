import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config'; // Import the base URL
import { Loader2, AlertCircle, CheckCircle, XCircle, FileText, User, Calendar, ArrowLeft } from 'lucide-react';

export default function AuthorizationsList() {
  const [authorizations, setAuthorizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/authorizations`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setAuthorizations(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching authorizations:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleApproval = (id) => {
    fetch(`http://localhost:5000/api/authorizations/${id}/approve`, {
      method: 'PATCH',
    })
    .then(response => {
      if (response.ok) {
        setAuthorizations(authorizations.map(auth => 
          auth._id === id ? { ...auth, requestStatus: 'approved' } : auth
        ));
      } else {
        throw new Error('Error approving authorization');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error.message);
    });
  };

  const handleRejection = (id) => {
    fetch(`http://localhost:5000/api/authorizations/${id}/reject`, {
      method: 'PATCH',
    })
    .then(response => {
      if (response.ok) {
        setAuthorizations(authorizations.map(auth => 
          auth._id === id ? { ...auth, requestStatus: 'denied' } : auth
        ));
      } else {
        throw new Error('Error rejecting authorization');
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
          Error fetching authorizations: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 mr-2 text-blue-500" />
            Authorization Requests
          </h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Back to Home
          </button>
        </div>
        {authorizations.length === 0 ? (
          <p className="text-center text-gray-500 bg-white shadow rounded-lg p-4 sm:p-6">No authorization requests found.</p>
        ) : (
          <ul className="space-y-4">
            {authorizations.map(auth => (
              <li key={auth._id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-4">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <User className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">Patient ID: {auth.patientId}</span>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      auth.requestStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      auth.requestStatus === 'denied' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {auth.requestStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 flex items-start sm:items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400 mt-1 sm:mt-0" />
                    <span className="flex-1">Treatment Details: {auth.treatmentDetails}</span>
                  </p>
                  {auth.requestStatus === 'pending' && (
                    <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleApproval(auth._id)}
                        className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition ease-in-out duration-150"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejection(auth._id)}
                        className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
