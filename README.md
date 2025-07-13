# 🐦 Custom Twitter — A Modern X Clone with React & Appwrite

> A sleek, full-featured Twitter (X) clone powered by **React**, **Redux Toolkit**, **Tailwind CSS**, and **Appwrite**. Tweet, edit, explore profiles, and share media — built for speed and simplicity.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Redux Toolkit](https://img.shields.io/badge/Redux--Toolkit-%40reduxjs%2Ftoolkit-purple?logo=redux)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06b6d4?logo=tailwindcss)
![Appwrite](https://img.shields.io/badge/Appwrite-BaaS-ff2d55?logo=appwrite)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

---

## 📌 Project Overview

**Custom Twitter** is a responsive, single-page social platform that mirrors the core experience of Twitter (X):

- 🔐 Authenticated user system
- 📝 Tweet posting (with image support)
- 👤 User profiles with update functionality
- 🧾 Tweet feed with real-time user content
- 🖼 Upload & display images via Appwrite storage

---

## 🔗 Live Preview

> 🚀 [https://your-vercel-app.vercel.app](https://your-vercel-app.vercel.app)

---

## ✨ Features at a Glance

| Feature                     | Description                                             |
|----------------------------|---------------------------------------------------------|
| 👥 Authentication          | Email/password sign up, login, logout via Appwrite     |
| 📝 Tweet System            | Create tweets (text + image)          |
| 📸 Image Upload            | Appwrite Storage integration for tweet/profile images   |
| 🧑 Profile Management      | View + edit user details (username, bio, avatar)        |
| 🧾 Public Feed             | See all tweets by all users                             |
| 🌐 Responsive Design       | Mobile-first with Tailwind CSS                          |
| ⚙️ State Management        | Redux Toolkit for global store                          |

---

## 🛠 Tech Stack

| Stack        | Description                            |
|--------------|----------------------------------------|
| **React**    | Component-based UI rendering           |
| **Redux**    | Scalable global state management       |
| **Tailwind** | Utility-first responsive styling       |
| **Appwrite** | Auth, database, and file storage BaaS  |
| **Vercel**   | Frontend deployment                    |

---

## 🗂 Folder Structure

```bash
src/
├── app/                # Redux store setup
├── components/         # UI components (Navbar, TweetCard, etc.)
├── pages/              # Routes (Home, Profile)
├── store/              # authSlice, feedSlice, etc.
├── appwrite/           # Appwrite service functions
└── App.jsx             # Root component
