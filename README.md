# 📘 AssignTrack

**A sleek and intuitive web app to help students track their courses, assignments, deadlines, and progress — with timely notifications to keep you on schedule.**

---

## 🚀 About The Project

AssignTrack is built to help students stay organized by keeping all course-related information in one place. With automatic notifications and a clean user interface, the app ensures students never miss a deadline again. Whether you're managing a heavy course load or just want to track your progress, AssignTrack has you covered.

---

## ✨ Features

- 📚 Add, edit, and delete courses and assignments
- ✅ Track assignment status: Not Started, In Progress, Completed
- 📊 Visual progress bars showing course completion percentage
- 🔔 Browser notifications that alert users when assignment deadlines are near
- 📱 Responsive design with smooth animations for a modern user experience

---

## 🛠 Built With

- ⚛️ [React.js](https://reactjs.org/) (with Hooks)
- 💨 [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- 🎞 [Framer Motion](https://www.framer.com/motion/) — For smooth animations
- 📅 [date-fns](https://date-fns.org/) — For reliable date handling
- 🌐 Browser Notifications API

---

## 🔔 How Notifications Work

AssignTrack requests permission from the user to send browser notifications. Once permission is granted, the app checks for upcoming assignments and automatically sends a reminder **1 day before the due date**. This helps students stay on top of their tasks and avoid last-minute rushes.

---

## 📦 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/assigntrack.git
   cd assigntrack
