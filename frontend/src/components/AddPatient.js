import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BASE_URL from '../config' // Import the base URL
import { UserPlus, User, Calendar, FileText, Clipboard, ArrowLeft } from 'lucide-react'

export default function AddPatient() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    medicalHistory: '',
    treatmentPlan: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch(`${BASE_URL}/api/patientdetails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (response.ok) {
        navigate('/')
      } else {
        console.error('Error submitting form')
      }
    })
    .catch(error => console.error('Error:', error))
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-600">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <UserPlus className="w-6 h-6 mr-2" />
            Enter Patient Details
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center">
                <User className="w-5 h-5 mr-1 text-gray-400" />
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="w-5 h-5 mr-1 text-gray-400" />
                Age
              </label>
              <input
                type="number"
                name="age"
                id="age"
                placeholder="Age"
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 flex items-center">
                <FileText className="w-5 h-5 mr-1 text-gray-400" />
                Medical History
              </label>
              <textarea
                name="medicalHistory"
                id="medicalHistory"
                rows={3}
                placeholder="Brief medical history"
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="treatmentPlan" className="block text-sm font-medium text-gray-700 flex items-center">
                <Clipboard className="w-5 h-5 mr-1 text-gray-400" />
                Treatment Plan
              </label>
              <textarea
                name="treatmentPlan"
                id="treatmentPlan"
                rows={3}
                placeholder="Proposed treatment plan"
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
