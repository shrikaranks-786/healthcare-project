import './App.css';
import Patientlist from './components/Patientlist';
import PatientDetails from './components/PatientDetails'; // Import PatientDetails component
import AuthorizationForm from './components/AuthorizationForm'; // Import AuthorizationForm component
import AuthorizationsList from './components/AuthorizationsList'; // Import AuthorizationsList component
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import AddPatient from './components/AddPatient'; // Import AddPatient component

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Patientlist />} />
        <Route path="/patients/:id" element={<PatientDetails />} /> {/* Add route for PatientDetails */}
        <Route path='/add-patient' element={<AddPatient />} />
        <Route path="/patients/:id/authorize" element={<AuthorizationForm />} /> {/* Add route for AuthorizationForm */}
        <Route path="/authorizations" element={<AuthorizationsList />} /> {/* Add route for AuthorizationsList */}
      </Routes>
    </div>
  );
}

export default App;
