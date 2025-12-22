import React, { useContext } from "react";
import { CourseContext } from "../context/CourseContext";
import { useNavigate } from "react-router-dom";

const CourseList = () => {
  const { courses } = useContext(CourseContext);
  const navigate = useNavigate();

  return (
    <div>
      <h1>Course List</h1>
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <button
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                {course.name}
              </button>
              <span> - {course.status}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => navigate("/add-course")}
      >
        Add Course
      </button>
    </div>
  );
};

export default CourseList;
