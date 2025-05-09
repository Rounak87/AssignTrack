import React, { useState } from "react";
import { motion } from "framer-motion";

export default function CourseForm({ onSubmit, onCancel, initialData }) {
  const [title, setTitle] = useState(initialData?.title || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Course title cannot be empty");
      return;
    }
    onSubmit({ title: title.trim() });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="m-2 p-6 border border-gray-700 rounded-4xl bg-gray-900 shadow-md max-w-full"
    >
      <h3 className="text-xl font-semibold mb-4 text-center text-teal-400">
        {initialData ? "Edit Course" : "Add Course"}
      </h3>

      <label className="block mb-2 font-medium text-gray-300">
        Course Title
      </label>
      <input
        type="text"
        className="border border-gray-600 rounded-md w-full p-2 mb-6 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter course title"
        autoFocus
      />

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
