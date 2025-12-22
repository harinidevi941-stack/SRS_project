
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import AddCourse from "./components/AddCourse";
import CourseList from "./components/CourseList";
import CourseDetails from "./components/CourseDetails";
import { CourseProvider } from "./context/CourseContext";
import "./App.css";


const App = () => {
  return (
    <CourseProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
        </Routes>
      </Router>
    </CourseProvider>
  );
};

export default App;
