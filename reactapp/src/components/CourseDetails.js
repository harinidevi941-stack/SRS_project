import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { CourseContext } from "../context/CourseContext";

const CourseDetails = () => {
  const { id } = useParams();
  const { courses, updateCourseStatus } = useContext(CourseContext);

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return <p>Course not found</p>;
  }

  const handleStatusChange = (e) => {
    updateCourseStatus(id, e.target.value);
  };

  return (
    <div>
      <h1>{course.name}</h1>
      <p>Duration: {course.duration}</p>
      <label>
        Status:
        <select
          aria-label="course-status-select"
          value={course.status}
          onChange={handleStatusChange}
        >
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </label>
    </div>
  );
};

export default CourseDetails;
