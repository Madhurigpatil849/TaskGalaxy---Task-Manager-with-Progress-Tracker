# 🌌 TaskGalaxy - Task Manager with Progress Tracker

## 🎯 Overview

TaskGalaxy addresses the common struggle of managing daily tasks by providing a lightweight, user-friendly solution. It eliminates the complexity and cost of existing tools, offering a seamless way to add, edit, and complete tasks with motivating visual progress tracking—all while keeping your data securely stored on your device.

## ✨ Features

- **✅ CRUD Operations:** Easily **C**reate, **R**ead, **U**pdate, and **D**elete tasks.
- **📊 Visual Progress Bar:** Track your overall completion rate in real-time.
- **🎉 Achievement Celebration:** A fun confetti animation triggers when all tasks are completed!
- **🏷️ Priority & Tagging:** Organize tasks with **High, Medium, Low** priority (color-coded) and custom tags.
- **🔍 Filter & Sort:** View tasks by status (Active/Completed) and sort by Priority or Due Date.
- **📱 Fully Responsive:** A clean, dark-themed interface that works perfectly on both desktop and mobile devices.
- **💾 Local Storage:** Your tasks persist automatically between sessions—no account or backend needed.

## 🛠️ Technology Stack

This is a pure client-side application built with:

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Data Persistence:** Browser Local Storage API
- **Deployment:** GitHub Pages

## ⚙️ Algorithm & Logic

### I. Data Management & Persistence
- **Task Structure:** Each task is an object with `Title, Due Date, Priority, Notes, Tags,` and a `done` status.
- **Persistence:** Dedicated `saveToStorage()` and `loadFromStorage()` functions handle saving and retrieving the task array from Local Storage.

### II. Interactive Functionality
- **Progress Calculation:** The `renderProgress()` function dynamically calculates the ratio of completed tasks to total tasks and updates the progress bar.
- **Task Status Toggle:** The `toggleTaskStatus()` function updates a task's completion state and applies visual strikethrough.
- **Unified Modal:** A single, reusable modal component handles both adding new tasks and editing existing ones.

## 📈 Results

TaskGalaxy successfully delivers a **cost-effective, standalone, and engaging** task management experience. It demonstrates a robust implementation of core web technologies to solve a real-world problem, providing users with a powerful tool to enhance their personal productivity and time management.

## 🔮 Future Scope

- **🔗 Backend Integration:** Use Node.js to enable multi-device synchronization.
- **👤 User Authentication:** Secure personal data across different users.
- **📊 Admin Dashboard:** For scaled business use and advanced analytics.
- **🤖 AI-based Recommendations:** Implement smart task suggestions and scheduling.

## 📚 References

- [MDN Web Docs](https://developer.mozilla.org/) - For HTML, CSS, JavaScript, and Web Storage API.
- [Bootstrap v5.3](https://getbootstrap.com/) - For modern, responsive design concepts.
- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) - For the completion celebration effect.
- Project structure inspired by [NanthiniMoha/TNSDC-FWD-DIGITAL_PORTFOLIO](https://github.com/NanthiniMoha/TNSDC-FWD-DIGITAL_PORTFOLIO).
- Core task management principles from *"Task Management System (TMS): Key Components and Principles"*.

## 👩‍💻 Contributor

**Madhuri Gokul Patil**  
Usha Mittal Institute of Technology  
Department of Computer Science and Technology (B.Tech)

---

**⭐ If you found this project helpful, please give it a star!**
