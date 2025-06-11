import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "./Pages/Home";
import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";
import { About } from "./Pages/About";
import Contact from "./Pages/contact";

import { Register } from "./Pages/register";
import { Login } from "./Pages/Login";

import { Course } from "./Pages/Course";
import { Courses } from "./Pages/Courses";

import { StudentDashboard } from "./Pages/StudentDashboard";
import { AdminDashboard } from "./Pages/AdminDashboard";
import { InstructorDashboard } from "./Pages/instructorDashboard";

import { CourseCreate } from "./Pages/CourseCreate";
import { CourseUpdate } from "./Pages/CourseUpdate";
import { CourseEditor } from "./Pages/CourseEditor";
import { StudentCreate } from "./Pages/StudentCreate";
import { StudentUpdate } from "./Pages/StudentUpdate";
import { InstructorCreate } from "./Pages/InstructorCreate";
import { InstructorUpdate } from "./Pages/InstructorUpdate";
import CategoryCreate from "./Pages/CategoryCreate";
import CategoryUpdate from "./Pages/CategoryUpdate";
import { ModuleCreate } from "./Pages/ModuleCreate";
import { ModuleEdit } from "./Pages/ModuleUpdate";
import  LessonCreate  from "./Pages/LessonCreate";
import LessonUpdate from "./Pages/LessonUpdate";
import CreateQuestions from "./Pages/QuestionsCreate";
import {CourseViewer} from "./Pages/StudentCourse";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* //////////////////////////////////////////////////// */}
        <Route path="/courses" element={<Courses />} />
        {/* //all courses in a category */}
        <Route path="/course/:course_id" element={<Course />} />
        <Route path="/student_course/:courseId" element={<CourseViewer />} />
        {/* //single course */}
        {/* ////////////////////////////////////////////////////// */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ///////////////////////////////////////////////////////// */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        {/* ////////////////////////////////////////////////////////////////// */}
        <Route path="/course_create" element={<CourseCreate />} />
        <Route path="/course_update/:id" element={<CourseUpdate />} />
        <Route path="/course_editor/:courseId" element={<CourseEditor />} />
        <Route path="/category_create" element={<CategoryCreate />} />
        <Route path="/category_update/:id" element={<CategoryUpdate />} />
        <Route path="/module_create/:courseId" element={<ModuleCreate />} />
        <Route path="/module_update/:moduleId" element={<ModuleEdit />} />{" "}
        <Route path="/lesson_create/:moduleId" element={<LessonCreate />} />{" "}
        <Route path="/lesson_update/:lessonId" element={<LessonUpdate />} />{" "}
        <Route path="/questions_create/:quizId" element={<CreateQuestions />} />{" "}
        {/* ///////////////////////////////////////////////////////////////////////////////////////////// */}
        <Route path="/student_create" element={<StudentCreate />} />
        <Route path="/instructor_create" element={<InstructorCreate />} />
        <Route path="/student_update" element={<StudentUpdate />} />
        <Route path="/instructor_update" element={<InstructorUpdate />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
