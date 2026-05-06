import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import StoreOwnerDashboard from './pages/StoreOwnerDashboard'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
          <Route
            path="/dashboard"
            element={<UserDashboard />}
          />
          <Route
            path="/store-owner"
            element={<StoreOwnerDashboard />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
