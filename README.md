# AI Study Planner 🎓✨
> **A Modern, Professional, Student-Friendly Adaptive Study Scheduling Platform**

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-indigo.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Overview

**AI Study Planner** helps students create a personalised, intelligent study plan powered by an adaptive AI planning engine. It analyses enrolled subjects, exam proximity, assignment deadlines, available study hours, difficult topics, and previous marks to generate a smart daily schedule and interactive timetable.

Unlike static planners, **AI Study Planner** dynamically re-adjusts when real life happens: missed sessions, shifted exam dates, new assignments, or finishing topics early.

---

## 🚀 Key Features

### 1. 🧠 Intelligent AI Planning Logic
- **Weighted Multi-Factor Algorithm**:
  - **Exam Proximity**: Subjects with upcoming exams within 7 days receive higher allocation and urgency alerts.
  - **Previous Performance**: Lower past marks trigger dedicated deep-work blocks and spaced formula revision.
  - **Subject Difficulty**: Balanced with student strengths to avoid burnout.
  - **Spaced Repetition & Health Breaks**: Interleaves 45–60 minute focus blocks with 10–15 minute hydration and stretch intervals.
  - **Student Time Preferences**: Schedules high-priority deep work during preferred peak concentration hours (Morning, Afternoon, Evening, Night).

### 2. ⚡ Dynamic Real-Time Re-planning
- **Missed a Session?** Automatically redistributes missed topics into upcoming revision buffers.
- **Exam Date Shifted?** Instantly recalculates priority rankings and timetable weights.
- **New Assignment Added?** Allocates a dedicated preparation block before the deadline.
- **Topic Completed Early?** Grants a bonus recovery break or advances the next priority.

### 3. 📅 Interactive Calendar (Weekly & Monthly)
- Color-coded views for **Study Sessions**, **Exams**, **Assignment Deadlines**, **Revision**, and **Breaks**.
- Click any date to view detailed scheduled activities and deadlines.

### 4. 📚 Comprehensive Subjects Hub
- Dynamic cards displaying:
  - Previous Mark (with low-mark warnings)
  - Difficulty Level (`High`, `Medium`, `Low`)
  - Exam Countdown (e.g. *5 days remaining*)
  - Progress percentage & topics completed
  - Identified difficult topics chips

### 5. 🤖 Interactive "AI Study Assistant" Chatbot
- Quick prompt pills:
  - *“What should I study today?”*
  - *“I have only 2 hours. Make a study plan.”*
  - *“My Mathematics exam is in 5 days. What should I focus on?”*
  - *“Give me a revision plan.”*
  - *“When should I take breaks?”*
- Contextual replies that understand your active profile and offer 1-click **“Apply to Timetable”** actions.

### 6. 📊 Progress Analytics & Gamification
- Visual weekly study hours distribution bar chart.
- Subject-wise curriculum coverage bars.
- 7-Day study streak tracker with milestone badges (`3-Day Starter`, `7-Day Scholar`, `14-Day Champion`, `30-Day Master`).
- Exam preparation readiness score.

### 7. ⏱️ Focus & Pomodoro Timer
- Built-in study timer supporting **25m Focus**, **50m Deep Work**, and **5m/15m Breaks**.
- Audio chimes and celebratory confetti when focus sessions are completed!

### 8. 🔔 Smart Notifications & Dark Mode
- Real-time reminder drawer for imminent exam dates, assignments, and study slots.
- Full light/dark mode support with smooth transitions.
- Offline `localStorage` persistence with pre-loaded realistic sample data.

---

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS (with custom blue/purple gradients, glassmorphism, and animations)
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, Tailwind Transitions
- **Bundler**: Vite
- **Storage**: LocalStorage API

---

## 💻 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/pavithran8072-bit/pavithran123.git

# Navigate to project directory
cd pavithran123

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your web browser.

### Production Build

```bash
npm run build
```

The optimized production output will be generated in the `dist/` directory.

---

## 📝 Demo Walkthrough

1. **Home**: Review key metrics in the visual dashboard and click **"Create My Study Plan"**.
2. **AI Generator**: Enter student goals and subjects (e.g. Mathematics 55% mark, 5 days remaining) and click **"Generate AI Study Plan"**.
3. **Planner**: Check off tasks, test the Pomodoro focus timer, reorder sessions, or test the **Dynamic Re-planning** simulation buttons in the top banner.
4. **Calendar**: Toggle between Weekly and Monthly calendar views and click any day to inspect tasks.
5. **AI Assistant**: Click on prompt pills like *"I have only 2 hours"* and apply the condensed plan directly to your schedule.
6. **Progress**: Inspect weekly study hours, subject mastery, and study streak badges.

---

## 📄 License
MIT License. Created for students to study smarter and achieve academic excellence.
