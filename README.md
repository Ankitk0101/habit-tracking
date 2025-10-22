# Habit Tracker

**Live Demo:** [habit-traker-ankit-kumar.netlify.app](https://habit-traker-ankit-kumar.netlify.app)

**Habit Tracker Pro** is a modern productivity web app designed to help users **build, track, and analyze habits** with a clean, visual interface.
It empowers users to stay consistent, monitor streaks, and visualize daily or weekly progress.

---

## 🚀 Live Application

🌐 **Production URL:** [https://habit-traker-ankit-kumar.netlify.app](https://habit-traker-ankit-kumar.netlify.app)

🔑 **Test Feature Highlights:**

* Create new habits with custom categories
* Track daily or weekly progress
* Login with Firebase Authentication
* View live progress stats and streaks

---

## ✨ Features

### 🧭 Smart Habit Management

* Add, edit, and delete habits easily
* Visualize daily completion stats
* Categorize habits (Health, Learning, Fitness, Work)

### 📊 Progress & Insights

* Track your **current** and **longest** streaks
* Generate **PDF habit reports**
* Visual charts for completion and consistency

### 🔐 Authentication

* Firebase Authentication (Email/Password)
* Secure user data with Firestore
* Personal progress saved in real-time

### 🎨 User Interface

* Built with **React + Tailwind CSS**
* Clean, minimal, and responsive design
* Dark/light mode compatible

---

## 🛠 Tech Stack

### **Frontend**

* React 19 – Modern React with Hooks
* Tailwind CSS – Utility-first responsive design
* Context API – Global state management

### **Backend**

* Firebase Firestore – Real-time NoSQL database
* Firebase Authentication – User login and signup
* Firebase Hosting – Backend hosting and deployment

### **Deployment**

* **Frontend:** Netlify
* **Backend:** Firebase Cloud Firestore

---

## 📸 Application Preview

**🏠 Dashboard**

* Displays daily habits, streak stats, and performance charts

**➕ Add Habit**

* Create and categorize new habits easily

**📈 Progress Tracker**

* Visual charts to show completion trends and consistency

**🔒 Login & Auth**

* Firebase Auth with real-time sync and data protection

---

## ⚙️ Getting Started

### Prerequisites

* Node.js (v16 or later)
* Firebase Account
* npm or yarn

### Local Setup

```bash
# Clone the repository
git clone https://github.com/Ankitk0101/habit-tracking
cd habit-tracker

# Install dependencies
npm install

# Add your Firebase config in .env file
cp .env.example .env

# Start the application
npm start
```

**Access:**
Frontend → [http://localhost:3000](http://localhost:5173)

---

## 🧩 Environment Configuration

### **.env File**

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

---

## 🧠 Design Decisions

1. **Real-Time Updates:** Firebase ensures instant progress tracking.
2. **Minimalist UI:** Encourages focus and consistency.
3. **Visual Feedback:** Motivates users with progress visuals and streaks.
4. **Responsive Layout:** Seamless experience across devices.

---

## 🧱 Directory Structure

```
habit-tracker/
├─ public/
├─ src/
│  ├─ components/      # UI components
│  ├─ context/         # Auth context
│  ├─ firebase/        # Firebase configuration
│  ├─ pages/           # Dashboard, Login, etc.
│  ├─ App.js
│  └─ index.js
├─ .env.example
└─ package.json
```

---

## 🌱 Future Enhancements

* 🔔 Habit reminders & daily notifications
* 🤖 AI-based habit suggestions
* 👥 Multi-user analytics & team habit tracking

---

 
