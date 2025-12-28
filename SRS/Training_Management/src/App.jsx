import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';
import { CourseProvider } from './Context/CourseContext';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Login from './Components/Login';
import CertificationCard from './Components/CertificationCard';
import EmployeeDashBoard from './Components/EmployeeDashBoard';
import HRDashboard from './Components/HRDashboard';
import InstructorDashboard from './Components/InstructorDashboard';
import TrainingProgramList from './Components/TrainingProgramList';
import Course from './Components/Course';
import EnrollmentForm from './Components/EnrollmentForm';
import Reports from './Components/Reports';
import Students from './Components/Students';
import './App.css';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch(user.role) {
      case 'hr': return <Navigate to="/hr-dashboard" />;
      case 'instructor': return <Navigate to="/instructor-dashboard" />;
      case 'employee': return <Navigate to="/dashboard" />;
      default: return <Navigate to="/" />;
    }
  }
  
  return children;
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="App">
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Employee Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashBoard />
            </ProtectedRoute>
          } 
        />
        
        {/* HR Routes */}
        <Route 
          path="/hr-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <HRDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Instructor Routes */}
        <Route 
          path="/instructor-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/students" 
          element={
            <ProtectedRoute allowedRoles={['hr', 'instructor']}>
              <Students />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/course/:courseId" 
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <Course />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/enroll" 
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EnrollmentForm />
            </ProtectedRoute>
          } 
        />
        
        {/* Shared Routes */}
        <Route 
          path="/programs" 
          element={
            <ProtectedRoute>
              <TrainingProgramList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/certification" 
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <CertificationCard />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect based on role after login */}
        <Route 
          path="/redirect" 
          element={
            <ProtectedRoute>
              {user?.role === 'hr' ? <Navigate to="/hr-dashboard" /> :
               user?.role === 'instructor' ? <Navigate to="/instructor-dashboard" /> :
               <Navigate to="/dashboard" />}
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <Router>
          <AppContent />
        </Router>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
