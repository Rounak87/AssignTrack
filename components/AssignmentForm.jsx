import React, { useState } from "react";
import { motion } from "framer-motion";

// Options for assignment status
const STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function AssignmentForm({ onSubmit, onCancel, initialData }) {
  // Form state initialization
  const [title, setTitle] = useState(initialData?.title || "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [status, setStatus] = useState(initialData?.status || "not_started");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Assignment title cannot be empty");
      return;
    }
    if (!dueDate) {
      alert("Please select a due date");
      return;
    }
    onSubmit({ title: title.trim(), dueDate, status });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="m-4 p-6 border border-gray-700 rounded-4xl bg-gray-900 shadow-md w-full max-w-md"
    >
      <h3 className="text-xl font-semibold mb-4 text-center text-teal-400">
        {initialData ? "Edit Assignment" : "Add Assignment"}
      </h3>

      {/* Assignment title input */}
      <label className="block mb-2 font-medium text-gray-300">
        Assignment Title
      </label>
      <input
        type="text"
        className="border border-gray-600 rounded-md w-full p-2 mb-4 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter assignment title"
        autoFocus
      />

      {/* Due date input */}
      <label className="block mb-2 font-medium text-gray-300">Due Date</label>
      <input
        type="date"
        className="border border-gray-600 rounded-md w-full p-2 mb-4 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      {/* Status dropdown */}
      <label className="block mb-2 font-medium text-gray-300">Status</label>
      <select
        className="border border-gray-600 rounded-md w-full p-2 mb-6 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Action buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 transition"
        >
          Save
        </button>
      </div>
    </motion.form>
  );
}
