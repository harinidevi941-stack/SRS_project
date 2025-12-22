
import React, { useContext } from "react";
import { CourseContext } from "../context/CourseContext";

const CourseStatus = ({ course }) => {
  const { updateCourseStatus } = useContext(CourseContext);

  const handleStatusChange = () => {
    const newStatus = course.status === "Pending" ? "Active" : "Pending";
    updateCourseStatus(course.id, newStatus);
  };

  return (
    <div>
      <p>
        <strong>Status:</strong> {course.status}
      </p>
      <button onClick={handleStatusChange}>Toggle Status</button>
    </div>
  );
};

export default CourseStatus;
