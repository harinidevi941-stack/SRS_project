// src/context/CourseContext.js
import React, { createContext, useContext, useState } from 'react';

const CourseContext = createContext();

export function useCourseContext() {
  return useContext(CourseContext);
}

export function CourseProvider({ children }) {
  const [programs, setPrograms] = useState([
    { id: '1', name: 'React Fundamentals', description: 'Learn React basics and components', category: 'technical', duration: '4 weeks', level: 'Beginner', instructorId: null },
    { id: '2', name: 'Advanced JavaScript', description: 'Master advanced JS concepts', category: 'technical', duration: '6 weeks', level: 'Advanced', instructorId: null },
    { id: '3', name: 'Node.js Backend', description: 'Build scalable backend applications', category: 'technical', duration: '8 weeks', level: 'Intermediate', instructorId: null },
    { id: '4', name: 'Leadership Skills', description: 'Develop leadership capabilities', category: 'leadership', duration: '3 weeks', level: 'All Levels', instructorId: null },
    { id: '5', name: 'Communication Excellence', description: 'Improve communication skills', category: 'soft-skills', duration: '2 weeks', level: 'All Levels', instructorId: null },
    { id: '6', name: 'Data Privacy & Security', description: 'Learn data protection best practices', category: 'compliance', duration: '1 week', level: 'All Levels', instructorId: null }
  ]);
  
  const [instructors] = useState([
    { id: '1', name: 'John Smith', email: 'john@company.com', expertise: 'Frontend Development' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', expertise: 'Backend Development' },
    { id: '3', name: 'Mike Wilson', email: 'mike@company.com', expertise: 'Leadership Training' },
    { id: '4', name: 'Lisa Brown', email: 'lisa@company.com', expertise: 'Soft Skills' }
  ]);
  
  const [progress, setProgress] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const enrollEmployee = (enrollment) => {
    setEnrollments(prev => [...prev, enrollment]);
  };

  const cancelEnrollment = (id) => {
    setEnrollments(prev => prev.filter(e => e.id !== id));
  };

  const updateProgress = (record) => {
    setProgress(prev => [...prev, record]);
  };

  const updateExistingProgress = (updatedRecord) => {
    setProgress(prev => prev.map(p => 
      p.id === updatedRecord.id ? updatedRecord : p
    ));
  };

  const isEmployeeEnrolled = (email, programId) => {
    return enrollments.some(e => e.employeeEmail === email && e.programId === programId);
  };

  const createProgram = (program) => {
    const newProgram = { ...program, id: Date.now().toString() };
    setPrograms(prev => [...prev, newProgram]);
  };

  const updateProgram = (updatedProgram) => {
    setPrograms(prev => prev.map(p => p.id === updatedProgram.id ? updatedProgram : p));
  };

  const deleteProgram = (programId) => {
    setPrograms(prev => prev.filter(p => p.id !== programId));
  };

  const assignInstructor = (programId, instructorId) => {
    setPrograms(prev => prev.map(p => 
      p.id === programId ? { ...p, instructorId } : p
    ));
  };

  const initializeData = () => {
    // Initialize any additional data if needed
  };

  return (
    <CourseContext.Provider value={{ 
      programs, 
      instructors,
      progress, 
      enrollments, 
      enrollEmployee, 
      cancelEnrollment, 
      updateProgress, 
      updateExistingProgress, 
      isEmployeeEnrolled,
      createProgram,
      updateProgram,
      deleteProgram,
      assignInstructor,
      initializeData 
    }}>
      {children}
    </CourseContext.Provider>
  );
}
