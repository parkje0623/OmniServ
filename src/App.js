import './App.css';
import { auth, db } from './firebase';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { UserProvider } from './context/UserContext';
import { SubContentProvider } from './context/SubContentContext';
import { AutoLogoutProvider } from "./context/AutoLogoutContext";
import Layout from './components/Layout';
import AutoLogout from "./components/AutoLogout";
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Movie from './pages/Movie';
import Ecomm from './pages/Ecomm';
import Calculator from './pages/Calculator';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Setting from './pages/Setting';

function App() {
  return (
    <UserProvider>
      <SubContentProvider>
        <AutoLogoutProvider>
          <Router>
            <Layout>
              <AutoLogout />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/movie' element={<Movie />} />
                <Route path='/ecomm' element={<Ecomm />} />
                <Route path='/calculator' element={<Calculator />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/signin' element={<SignIn />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/setting' element={<Setting />} />
              </Routes>
            </Layout>
          </Router>
        </AutoLogoutProvider>
      </SubContentProvider>
    </UserProvider>
  );
}

export default App;
