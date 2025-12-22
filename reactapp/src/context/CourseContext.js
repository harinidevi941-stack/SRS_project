import React, { createContext, useState } from "react";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);  // empty list initially

  const addCourse = (course) => {
    setCourses((prev) => [...prev, course]);   // append new course
  };

  const updateCourseStatus = (id, newStatus) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: newStatus } : c
      )
    );
  };

  return (
    <CourseContext.Provider
      value={{ courses, addCourse, updateCourseStatus }}
    >
      {children}
    </CourseContext.Provider>
  );
};
