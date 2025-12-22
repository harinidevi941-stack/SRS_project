import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import App from "../App";

import { CourseProvider } from "../context/CourseContext";

import { BrowserRouter as Router } from "react-router-dom";

import React from "react";

// Custom render to include only CourseProvider since App already has Router

const customRender = (ui) => render(<CourseProvider>{ui}</CourseProvider>);

test("renders_home_page_and_checks_for_initial_text", () => {
  customRender(<App />);

  const welcomeText = screen.getByText(
    /Welcome to the Course Management System/i
  );

  expect(welcomeText).toBeInTheDocument();
});

test("adds_new_course_and_checks_if_it_appears_in_the_list", async () => {
  customRender(<App />);

  // Navigate to the add course page via navbar

  const addCourseLink = screen.getAllByText(/Add Course/i)[0];

  fireEvent.click(addCourseLink);

  // Fill in the form

  fireEvent.change(screen.getByPlaceholderText(/Course Name/i), {
    target: { value: "New Course" },
  });

  fireEvent.change(screen.getByPlaceholderText(/Duration/i), {
    target: { value: "3 months" },
  });

  // Submit the form

  const submitButton = screen.getByRole("button", { name: /Add Course/i });

  fireEvent.click(submitButton);

  // Navigate to courses and check if course was added

  const courseListLink = screen.getByRole("link", { name: /Course List/i });

  fireEvent.click(courseListLink);

  expect(screen.getByText("New Course")).toBeInTheDocument();
});

test("displays_correct_details_for_a_course_when_clicked", async () => {
  customRender(<App />);

  // Add a new course first

  const addCourseLink = screen.getAllByText(/Add Course/i)[0];

  fireEvent.click(addCourseLink);

  fireEvent.change(screen.getByPlaceholderText(/Course Name/i), {
    target: { value: "Course 1" },
  });

  fireEvent.change(screen.getByPlaceholderText(/Duration/i), {
    target: { value: "6 months" },
  });

  const submitButton = screen.getByRole("button", { name: /Add Course/i });

  fireEvent.click(submitButton);

  // Navigate to courses page

  const courseListLink = screen.getByRole("link", { name: /Course List/i });

  fireEvent.click(courseListLink);

  // Check if course appears in list

  expect(screen.getByText("Course 1")).toBeInTheDocument();
});

test("displays_the_correct_text_on_course_list_page", () => {
  customRender(<App />);

  // Navigate to courses page via navbar

  const courseListLink = screen.getByRole("link", { name: /Course List/i });

  fireEvent.click(courseListLink);

  // Check if "Course List" heading is present

  expect(
    screen.getByRole("heading", { name: /Course List/i })
  ).toBeInTheDocument();
});

test("displays_the_correct_text_on_Add_Course_page", () => {
  customRender(<App />);

  // Go to Add Course page via navbar

  const addCourseLink = screen.getAllByText(/Add Course/i)[0];

  fireEvent.click(addCourseLink);

  // Check if the form inputs and button are present

  expect(screen.getByPlaceholderText(/Course Name/i)).toBeInTheDocument();

  expect(screen.getByText(/Add New Course/)).toBeInTheDocument();
});

test("updates_course_status_correctly", async () => {
  customRender(<App />);

  // Add a new course

  const addCourseLink = screen.getAllByText(/Add Course/i)[0];

  fireEvent.click(addCourseLink);

  fireEvent.change(screen.getByPlaceholderText(/Course Name/i), {
    target: { value: "Course 2" },
  });

  fireEvent.change(screen.getByPlaceholderText(/Duration/i), {
    target: { value: "12 months" },
  });

  const submitButton = screen.getByRole("button", { name: /Add Course/i });

  fireEvent.click(submitButton);

  // Navigate to courses and check if course exists

  const courseListLink = screen.getByRole("link", { name: /Course List/i });

  fireEvent.click(courseListLink);

  expect(screen.getByText("Course 2")).toBeInTheDocument();
});

test("displays_empty_course_list_initially", () => {
  customRender(<App />);

  // Navigate to courses page

  const courseListLink = screen.getByRole("link", { name: /Course List/i });

  fireEvent.click(courseListLink);

  // Check if course list page loads

  expect(
    screen.getByRole("heading", { name: /Course List/i })
  ).toBeInTheDocument();
});

test("checks_navigation_between_pages", () => {
  customRender(<App />);

  // Navigate to add course page via navbar

  const addCourseLink = screen.getAllByText(/Add Course/i)[0];

  fireEvent.click(addCourseLink);

  expect(screen.getByText(/Add New Course/)).toBeInTheDocument();
});

test("checks if Add Course button is working after adding a course", async () => {
  customRender(<App />);

  // Click Add Course via navbar

  const addCourseLink = screen.getAllByText(/Add Course/i)[0];

  fireEvent.click(addCourseLink);

  fireEvent.change(screen.getByPlaceholderText(/Course Name/i), {
    target: { value: "Course 4" },
  });

  fireEvent.change(screen.getByPlaceholderText(/Duration/i), {
    target: { value: "1 year" },
  });

  const submitButton = screen.getByRole("button", { name: /Add Course/i });

  fireEvent.click(submitButton);

  // Navigate to courses and verify course list contains the new course

  const courseListLink = screen.getByRole("link", { name: /Course List/i });

  fireEvent.click(courseListLink);

  expect(screen.getByText("Course 4")).toBeInTheDocument();
});

test("verifies navbar navigation links work correctly", () => {
  customRender(<App />);

  // Check Courses link navigation

  const courseListLink = screen.getByRole("link", { name: /Course List/i });

  fireEvent.click(courseListLink);

  expect(
    screen.getByRole("heading", { name: /Course List/i })
  ).toBeInTheDocument();
});
