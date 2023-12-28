import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/signup';
import Home from './Pages/Home';
import { AuthProvider } from './Pages/AuthContext';
import EditProfile from './Pages/Profile/EditProfile';
import ViewProfile from './Pages/Profile/ViewProfile';
import Explore from './Pages/Models/Explore';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from '@vercel/analytics/react';
import Viewmodels from './Pages/Models/viewmodels';
import UserDetails from './Pages/Profile/UserDetails';
import NotFound from './Pages/404';
import Infermodel from './Pages/Models/infermodel';
import AdminPage from './Pages/adminpage';

const App = () => {
  return (
    <div className="App bg-gray-900 min-h-screen text-white">
      <SpeedInsights />
      <Analytics />
      <AuthProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/ViewProfile" element={<ViewProfile />} />
          <Route path="/Explore" element={<Explore />} />
          <Route path="/Models" element={<Viewmodels />} />
          <Route path="/user/:username" element={<UserDetails/>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/model/:modeltokenid" element={<Infermodel />} />
          <Route path="/admin" element={<AdminPage />} />

        </Routes>
      </AuthProvider>

    </div>
  );
};

export default App;
