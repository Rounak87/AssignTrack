import React from "react";
import { format, isBefore, differenceInCalendarDays, parseISO } from "date-fns";
import { motion } from "framer-motion";

// Assignment status options
const STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function AssignmentItem({ assignment, onEdit, onDelete, onStatusChange }) {
  const today = new Date();
  const dueDate = parseISO(assignment.dueDate);
  const daysDiff = differenceInCalendarDays(dueDate, today);

  // Set background and border colors based on due date and completion status
  let bgColor = "";
  let borderColor = "";
  if (assignment.status !== "completed") {
    if (isBefore(dueDate, today)) {
      bgColor = "bg-red-900";
      borderColor = "border-red-700";
    } else if (daysDiff <= 3) {
      bgColor = "bg-yellow-900";
      borderColor = "border-yellow-700";
    }
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className={`p-4 mb-3 rounded-lg flex justify-between items-center border shadow-sm transition-colors ${bgColor} ${borderColor}`}
    >
      <div>
        <div className="font-semibold text-lg text-gray-200">
          {assignment.title}
        </div>
        <div className="text-sm text-gray-400">
          Due: {format(dueDate, "MMM dd, yyyy")}
        </div>

        {/* Status selector */}
        <div className="mt-1 flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-300">Status:</label>
          <select
            value={assignment.status}
            onChange={(e) => onStatusChange(assignment.id, e.target.value)}
            className="border border-gray-600 rounded-md p-1 text-sm bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-x-3 flex-shrink-0">
        <button
          onClick={() => onEdit(assignment)}
          aria-label={`Edit assignment ${assignment.title}`}
          className="px-3 py-1 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1 transition"
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (
              window.confirm(
                `Delete assignment "${assignment.title}"? This action cannot be undone.`
              )
            ) {
              onDelete(assignment.id);
            }
          }}
          aria-label={`Delete assignment ${assignment.title}`}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </motion.li>
  );
}
