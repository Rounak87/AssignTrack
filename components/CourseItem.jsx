import React from "react";
import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";

export default function CourseItem({
  course,
  onSelect,
  onEdit,
  onDelete,
  progress,
  isSelected,
}) {
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(course);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Delete course "${course.title}"? This will remove all its assignments.`
      )
    ) {
      onDelete(course.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{
        opacity: 1,
        scale: isSelected ? 1.003 : 1,
        y: 0,
        boxShadow: isSelected
          ? "0 0 16px 2px rgba(34,211,238,0.14)"
          : "0 0 0 transparent",
      }}
      exit={{ opacity: 0, scale: 0.97, y: 20 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(course.id)}
      className={`mb-4 p-5 border rounded-lg shadow cursor-pointer transition ${
        isSelected
          ? "border-cyan-500 bg-cyan-900 z-20"
          : "border-gray-700 bg-gray-800 hover:shadow-md"
      }`}
      style={{
        position: isSelected ? "relative" : "static",
        zIndex: isSelected ? 20 : "auto",
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold truncate text-gray-200">
          {course.title}
        </h2>
        <div className="space-x-2 flex-shrink-0">
          <button
            onClick={handleEdit}
            aria-label={`Edit course ${course.title}`}
            className="px-3 py-1 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            aria-label={`Delete course ${course.title}`}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <ProgressBar progress={progress} />
      <div className="text-sm mt-2 text-gray-400">
        {progress.toFixed(0)}% completed
      </div>
    </motion.div>
  );
}
