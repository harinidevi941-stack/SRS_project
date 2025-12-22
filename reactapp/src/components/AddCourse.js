// src/components/AddCourse.js
import React, { useContext, useState } from "react";
import { CourseContext } from "../context/CourseContext";

const AddCourse = () => {
  const { addCourse } = useContext(CourseContext);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !duration.trim()) return;

    const newCourse = {
      id: Date.now().toString(),
      name,
      duration,
      status: "Pending",
    };
    addCourse(newCourse);
    setName("");
    setDuration("");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Add New Course</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Course Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <button type="submit">Add Course</button>
      </form>
    </div>
  );
};

export default AddCourse;