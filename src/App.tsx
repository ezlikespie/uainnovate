import { connectAuthEmulator, getAuth } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import {
  connectFirestoreEmulator,
  initializeFirestore,
} from 'firebase/firestore';

import './App.css';

import AuthProvider from './shared/AuthProvider';
import ProtectedComponent from './shared/ProtectedComponent';
import RestrictedComponent from './shared/RestrictedComponent';
import CandidateSelfRegister from './views/Dashboard/CandidateSelfRegister';
import Dashboard from './views/Dashboard/Dashboard';
import Employees from './views/Employees/Employees';
import Home from './views/Home/Home';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import ThankYou from './views/ThankYou/ThankYou';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Firebase initialization
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = initializeFirestore(firebaseApp, {});
if (
  import.meta.env.VITE_ENVIRONMENT !== undefined &&
  import.meta.env.VITE_ENVIRONMENT === 'dev'
) {
  connectAuthEmulator(auth, import.meta.env.VITE_DEV_AUTH_URL);
  connectFirestoreEmulator(firestore, '127.0.0.1', 8080, {});
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route
            path='/employees'
            element={
              <RestrictedComponent>
                <Employees />
              </RestrictedComponent>
            }
          />
          <Route
            path='/dashboard'
            element={
              <ProtectedComponent>
                <Dashboard />
              </ProtectedComponent>
            }
          />
          <Route path='/self-register' element={<CandidateSelfRegister />} />
          <Route path='/thank-you' element={<ThankYou />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
