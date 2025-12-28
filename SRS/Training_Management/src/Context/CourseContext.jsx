// src/context/CourseContext.js
import React, { createContext, useContext, useState } from 'react';

const CourseContext = createContext();

export { CourseContext };

export function useCourseContext() {
  return useContext(CourseContext);
}

export function CourseProvider({ children }) {
  const [programs, setPrograms] = useState([
    { 
      id: '1', 
      name: 'React Fundamentals', 
      description: 'Learn React basics and components', 
      category: 'technical', 
      duration: '4 weeks', 
      level: 'Beginner', 
      instructorId: '1', 
      sessions: 'Mon/Wed 10:00 AM, Starting Jan 15', 
      materials: ['Introduction to React', 'Components and Props', 'State Management', 'Event Handling']
    },
    { 
      id: '2', 
      name: 'Advanced JavaScript', 
      description: 'Master advanced JS concepts', 
      category: 'technical', 
      duration: '6 weeks', 
      level: 'Advanced', 
      instructorId: '1', 
      sessions: 'Tue/Thu 2:00 PM, Starting Jan 20', 
      materials: ['Closures and Scope', 'Async Programming', 'ES6+ Features', 'Design Patterns']
    },
    { 
      id: '3', 
      name: 'Node.js Backend', 
      description: 'Build scalable backend applications', 
      category: 'technical', 
      duration: '8 weeks', 
      level: 'Intermediate', 
      instructorId: '2', 
      sessions: 'Mon/Wed/Fri 9:00 AM, Starting Feb 1', 
      materials: ['Node.js Basics', 'Express Framework', 'Database Integration', 'API Development']
    },
    { 
      id: '4', 
      name: 'Leadership Skills', 
      description: 'Develop leadership capabilities', 
      category: 'leadership', 
      duration: '3 weeks', 
      level: 'All Levels', 
      instructorId: '3', 
      sessions: 'Fridays 3:00 PM, Starting Jan 25', 
      materials: ['Leadership Styles', 'Team Management', 'Decision Making', 'Conflict Resolution']
    },
    { 
      id: '5', 
      name: 'Communication Excellence', 
      description: 'Improve communication skills', 
      category: 'soft-skills', 
      duration: '2 weeks', 
      level: 'All Levels', 
      instructorId: '4', 
      sessions: 'Tuesdays 11:00 AM, Starting Feb 5', 
      materials: ['Effective Communication', 'Presentation Skills', 'Active Listening', 'Written Communication']
    },
    { 
      id: '6', 
      name: 'Data Privacy & Security', 
      description: 'Learn data protection best practices', 
      category: 'compliance', 
      duration: '1 week', 
      level: 'All Levels', 
      instructorId: '4', 
      sessions: 'Daily 1:00 PM, Starting Jan 30', 
      materials: ['GDPR Compliance', 'Data Security', 'Privacy Policies', 'Risk Assessment']
    }
  ]);
  
  const [instructors] = useState([
    { id: '1', name: 'John Smith', email: 'john@company.com', expertise: 'Frontend Development' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', expertise: 'Backend Development' },
    { id: '3', name: 'Mike Wilson', email: 'mike@company.com', expertise: 'Leadership Training' },
    { id: '4', name: 'Lisa Brown', email: 'lisa@company.com', expertise: 'Soft Skills' }
  ]);
  
  const [progress, setProgress] = useState([]);
  
  const [enrollments, setEnrollments] = useState([]);
  
  const [materialProgress, setMaterialProgress] = useState([]);
  
  const [taskProgress, setTaskProgress] = useState([]);
  
  const [courseFeedback, setCourseFeedback] = useState([]);

  const enrollEmployee = (enrollment) => {
    const program = programs.find(p => p.id === enrollment.programId);
    const newEnrollment = {
      id: Date.now().toString(),
      employeeId: enrollment.employeeEmail,
      courseId: enrollment.programId,
      status: 'in-progress',
      tasks: program?.materials?.map((material, index) => ({
        id: `task-${enrollment.programId}-${index}`,
        title: material,
        isCompleted: false
      })) || [],
      progressPercent: 0,
      feedback: null,
      certificateApprovedByHr: false
    };
    setEnrollments(prev => [...prev, newEnrollment]);
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

  const trackMaterialView = (employeeEmail, programId, materialIndex) => {
    const progressId = `${employeeEmail}-${programId}-${materialIndex}`;
    setMaterialProgress(prev => {
      const existing = prev.find(p => p.id === progressId);
      if (existing) {
        return prev.map(p => p.id === progressId ? 
          { ...p, viewTime: p.viewTime + 30, lastViewed: new Date() } : p
        );
      } else {
        return [...prev, {
          id: progressId,
          employeeEmail,
          programId,
          materialIndex,
          viewTime: 30,
          lastViewed: new Date()
        }];
      }
    });
  };

  const getMaterialProgress = (employeeEmail, programId) => {
    return materialProgress.filter(p => p.employeeEmail === employeeEmail && p.programId === programId);
  };

  const updateTaskCompletion = (employeeId, courseId, taskId) => {
    setEnrollments(prev => prev.map(enrollment => {
      if (enrollment.employeeId === employeeId && enrollment.courseId === courseId) {
        const updatedTasks = enrollment.tasks.map(task => 
          task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        );
        const completedCount = updatedTasks.filter(task => task.isCompleted).length;
        const progressPercent = Math.round((completedCount / updatedTasks.length) * 100);
        const status = progressPercent === 100 ? 'completed' : 'in-progress';
        
        return {
          ...enrollment,
          tasks: updatedTasks,
          progressPercent,
          status
        };
      }
      return enrollment;
    }));
  };

  const getEnrollment = (employeeId, courseId) => {
    return enrollments.find(e => e.employeeId === employeeId && e.courseId === courseId);
  };

  const submitCourseFeedback = (employeeId, courseId, feedbackData) => {
    setEnrollments(prev => prev.map(enrollment => {
      if (enrollment.employeeId === employeeId && enrollment.courseId === courseId) {
        return {
          ...enrollment,
          feedback: feedbackData
        };
      }
      return enrollment;
    }));
  };

  const updateCertificateApproval = (enrollmentId, approved) => {
    setEnrollments(prev => prev.map(enrollment => {
      if (enrollment.id === enrollmentId) {
        return {
          ...enrollment,
          certificateApprovedByHr: approved,
          certificateStatus: approved ? 'approved' : 'denied'
        };
      }
      return enrollment;
    }));
  };

  const getEmployeeEnrollments = (employeeId) => {
    return enrollments.filter(e => e.employeeId === employeeId);
  };

  const getAllEnrollments = () => {
    return enrollments;
  };

  const calculateCompletionPercentage = (employeeId, courseId) => {
    const enrollment = getEnrollment(employeeId, courseId);
    return enrollment?.progressPercent || 0;
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
      materialProgress,
      taskProgress,
      courseFeedback,
      enrollEmployee, 
      cancelEnrollment, 
      updateProgress, 
      updateExistingProgress, 
      isEmployeeEnrolled,
      trackMaterialView,
      getMaterialProgress,
      calculateCompletionPercentage,
      updateTaskCompletion,
      getEnrollment,
      submitCourseFeedback,
      updateCertificateApproval,
      getEmployeeEnrollments,
      getAllEnrollments,
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
