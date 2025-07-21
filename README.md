# Habit Tracker Pro

## Introduction
Habit Tracker Pro is a full-stack web application designed to help users build and maintain positive habits. The app provides a clean interface for tracking daily habits, visualizing progress with statistics, and categorizing habits into different life areas. It solves the problem of inconsistent habit tracking by providing motivation through streaks, completion rates, and visual progress indicators.

## Project Type
Fullstack (React.js + Firebase)

## Deployed App
Frontend: https://dancing-pasca-74bc8d.netlify.app/  
Backend: Firebase Cloud Firestore (No direct URL)  
Authentication: Firebase Auth

## Directory Structure
habit-tracker/
├─ public/
├─ src/
│  ├─ components/      # Reusable UI components
│  ├─ context/         # Auth context
│  ├─ firebase/        # Firebase config
│  ├─ pages/           # Main views
│  ├─ App.js           # Main app component
│  └─ index.js         # Entry point
├─ .env.example        # Environment variables template
└─ package.json

## Video Walkthroughs
[App Features Demo and Codebase Walkthrough](https://drive.google.com/file/d/1B2TYl1CETpEFS0xRFYD0kC6oZ5oAhsGF/view?usp=sharing) (10 min) 

## Features
- **Habit Management**: Create, edit, and track daily habits
- **Progress Visualization**: Charts and statistics for habit completion
- **Streak Tracking**: Current and longest streak counters
- **Area Categorization**: Organize habits by life areas (Health, Work, etc.)
- **PDF Export**: Generate reports of your habit progress
- **Responsive Design**: Works on mobile and desktop
- **Authentication**: Secure user accounts with Firebase Auth

## Design Decisions
1. **Firebase Integration**: Chosen for real-time updates and easy authentication
2. **Minimalist UI**: Focus on habit completion with clean, distraction-free interface
3. **Progress Indicators**: Visual feedback (streaks, completion %) for motivation
4. **Mobile-first**: Priority given to mobile experience since habits are often tracked on-the-go

## Installation & Getting Started

### Prerequisites
- Node.js (v14+)
- Firebase account (for backend services)
- npm or yarn

### Setup
1. Clone the repository:
```bash
git clone https://github.com/Ankitk0101/habit-tracking
cd habit-tracker