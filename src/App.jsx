import React, { useState, useEffect, useRef } from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";

import CourseForm from "../components/CourseForm.jsx";
import AssignmentForm from "../components/AssignmentForm.jsx";
import CourseItem from "../components/CourseItem.jsx";
import AssignmentItem from "../components/AssignmentItem.jsx";

function App() {
  // Load courses from localStorage
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem("courseReminderData");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load selected course ID from localStorage
  const [selectedCourseId, setSelectedCourseId] = useState(() => {
    try {
      const saved = localStorage.getItem("selectedCourseId");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState(null);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("courseReminderData", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("selectedCourseId", JSON.stringify(selectedCourseId));
  }, [selectedCourseId]);

  // Ensure a valid course is always selected
  useEffect(() => {
    if (courses.length > 0 && !courses.find((c) => c.id === selectedCourseId)) {
      setSelectedCourseId(courses[0].id);
    }
    if (courses.length === 0) {
      setSelectedCourseId(null);
    }
  }, [courses, selectedCourseId]);

  // Calculate course progress
  const calculateProgress = (course) => {
    if (!course.assignments || course.assignments.length === 0) return 0;
    const completedCount = course.assignments.filter(
      (a) => a.status === "completed"
    ).length;
    return (completedCount / course.assignments.length) * 100;
  };

  const handleAddCourse = (data) => {
    const newCourse = {
      id: uuidv4(),
      title: data.title,
      assignments: [],
    };
    setCourses([...courses, newCourse]);
    setShowCourseForm(false);
    setSelectedCourseId(newCourse.id);
  };

  const handleEditCourse = (data) => {
    setCourses(
      courses.map((c) =>
        c.id === courseToEdit.id ? { ...c, title: data.title } : c
      )
    );
    setCourseToEdit(null);
    setShowCourseForm(false);
  };

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
    if (selectedCourseId === id) setSelectedCourseId(null);
  };

  const handleSelectCourse = (id) => {
    setSelectedCourseId(id);
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const handleAddAssignment = (data) => {
    const newAssignment = {
      id: uuidv4(),
      title: data.title,
      dueDate: data.dueDate,
      status: data.status,
    };
    setCourses(
      courses.map((c) =>
        c.id === selectedCourseId
          ? { ...c, assignments: [...(c.assignments || []), newAssignment] }
          : c
      )
    );
    setShowAssignmentForm(false);
  };

  const handleEditAssignment = (data) => {
    setCourses(
      courses.map((c) => {
        if (c.id === selectedCourseId) {
          return {
            ...c,
            assignments: c.assignments.map((a) =>
              a.id === assignmentToEdit.id ? { ...a, ...data } : a
            ),
          };
        }
        return c;
      })
    );
    setAssignmentToEdit(null);
    setShowAssignmentForm(false);
  };

  const handleDeleteAssignment = (id) => {
    setCourses(
      courses.map((c) =>
        c.id === selectedCourseId
          ? { ...c, assignments: c.assignments.filter((a) => a.id !== id) }
          : c
      )
    );
  };

  const handleAssignmentStatusChange = (id, newStatus) => {
    setCourses(
      courses.map((c) => {
        if (c.id === selectedCourseId) {
          return {
            ...c,
            assignments: c.assignments.map((a) =>
              a.id === id ? { ...a, status: newStatus } : a
            ),
          };
        }
        return c;
      })
    );
  };

  // Notification system for upcoming assignments
  const notifiedAssignments = useRef(new Set());

  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    if (Notification.permission === "granted" && selectedCourse) {
      selectedCourse.assignments.forEach((assignment) => {
        if (
          assignment.status !== "completed" &&
          !notifiedAssignments.current.has(assignment.id)
        ) {
          const dueDate = parseISO(assignment.dueDate);
          const now = new Date();
          const diff = differenceInCalendarDays(dueDate, now);
          if (diff === 1) {
            new Notification(
              `Reminder: "${assignment.title}" is due tomorrow in "${selectedCourse.title}"`
            );
            notifiedAssignments.current.add(assignment.id);
          }
        }
      });
    }
  }, [selectedCourse]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="sticky top-0 bg-gray-900 shadow-md z-10 p-6 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-extrabold mb-1 text-cyan-400 select-none"
        >
          AssignTrack
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-lg text-cyan-300 font-semibold select-none"
        >
          Track your courses, assignments, deadlines, and progress.
        </motion.p>
      </header>

      <main className="flex flex-1 flex-col md:flex-row gap-8 p-6 pt-4 pb-0 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Courses Pane */}
        <section className="md:w-1/3 bg-gray-800 p-6 pb-1 rounded-xl shadow-lg flex flex-col h-[calc(100vh-200px)] relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-teal-400">Courses</h2>
            <motion.button
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.06 }}
              onClick={() => {
                setCourseToEdit(null);
                setShowCourseForm(true);
              }}
              className="px-4 py-1.5 bg-cyan-600 rounded-xl text-white font-semibold hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 transition"
              aria-label="Add new course"
            >
              + Add
            </motion.button>
          </div>
          {courses.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 flex-grow flex items-center justify-center"
            >
              No courses added yet.
            </motion.p>
          )}
          <div className="overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-cyan-600 scrollbar-track-gray-700 relative">
            <AnimatePresence>
              {courses.map((course) => (
                <CourseItem
                  key={course.id}
                  course={course}
                  onSelect={handleSelectCourse}
                  onEdit={(c) => {
                    setCourseToEdit(c);
                    setShowCourseForm(true);
                  }}
                  onDelete={handleDeleteCourse}
                  progress={calculateProgress(course)}
                  isSelected={selectedCourseId === course.id}
                />
              ))}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {showCourseForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 40 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center rounded-xl z-20"
              >
                <CourseForm
                  initialData={courseToEdit}
                  onSubmit={courseToEdit ? handleEditCourse : handleAddCourse}
                  onCancel={() => {
                    setShowCourseForm(false);
                    setCourseToEdit(null);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Assignments Pane */}
        <section className="md:w-2/3 bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col h-[calc(100vh-200px)] relative">
          {selectedCourse ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold truncate max-w-xs md:max-w-full text-teal-400">
                  {selectedCourse.title} - Assignments
                </h2>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.06 }}
                  onClick={() => {
                    setAssignmentToEdit(null);
                    setShowAssignmentForm(true);
                  }}
                  className="px-4 py-2 bg-teal-600 rounded-md text-white font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-1 transition"
                  aria-label="Add new assignment"
                >
                  + Add
                </motion.button>
              </div>
              {selectedCourse.assignments.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 flex-grow flex items-center justify-center"
                >
                  No assignments added yet.
                </motion.p>
              )}
              <ul className="overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-gray-700">
                <AnimatePresence>
                  {selectedCourse.assignments.map((assignment) => (
                    <AssignmentItem
                      key={assignment.id}
                      assignment={assignment}
                      onEdit={(a) => {
                        setAssignmentToEdit(a);
                        setShowAssignmentForm(true);
                      }}
                      onDelete={handleDeleteAssignment}
                      onStatusChange={handleAssignmentStatusChange}
                    />
                  ))}
                </AnimatePresence>
              </ul>
              <AnimatePresence>
                {showAssignmentForm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: 40 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center rounded-xl z-20"
                  >
                    <AssignmentForm
                      initialData={assignmentToEdit}
                      onSubmit={
                        assignmentToEdit
                          ? handleEditAssignment
                          : handleAddAssignment
                      }
                      onCancel={() => {
                        setShowAssignmentForm(false);
                        setAssignmentToEdit(null);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 mt-20 text-lg select-none"
            >
              Select a course to view assignments.
            </motion.p>
          )}
        </section>
      </main>

      <footer className="sticky bottom-0 bg-gray-900 text-gray-500 text-center py-4 select-none">
        &copy; Your Assignment Reminder App 😉
      </footer>
    </div>
  );
}

export default App;
