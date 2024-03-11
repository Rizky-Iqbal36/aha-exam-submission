import React from "react";
import { Routes, Route } from "react-router-dom";

import AuthProvider from "./app/context/AuthProvider";
import PrivateRoute from "./app/context/PrivateRoute";

import LandingPage from "./pages/landingPage";
import Dashboard from "./pages/dashboard";
import Onboard from "./pages/onboard";
import Profile from "./pages/profile";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboard" element={<Onboard />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
