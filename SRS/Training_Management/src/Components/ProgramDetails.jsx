// src/components/ProgramDetails.js
import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CourseContext } from "../Context/CourseContext";
import "./ProgramDetails.css";

function ProgramDetails() {
  const { id } = useParams();                 // /programs/:id
  const navigate = useNavigate();
  const { programs } = useContext(CourseContext);

  const program = programs.find((p) => p.id === id);

  if (!program) {
    return (
      <div className="program-details">
        <h2>Program not found</h2>
        <button onClick={() => navigate("/programs")}>Back to Programs</button>
      </div>
    );
  }

  return (
    <div className="program-details">
      <h2>{program.name}</h2>
      <p><strong>Duration:</strong> {program.duration}</p>
      <p><strong>Description:</strong> {program.description}</p>

      {/* You can extend later with instructor, schedule, etc. */}

      <div className="details-actions">
        <button onClick={() => navigate("/programs")}>
          Back to Programs
        </button>
        <button
          onClick={() =>
            navigate("/enroll", { state: { programId: program.id } })
          }
        >
          Enroll in this Program
        </button>
      </div>
    </div>
  );
}

export default ProgramDetails;
