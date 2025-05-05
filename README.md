
<p align="center">
  <img src="https://capsule-render.vercel.app/api?text=Melodify♬⋆.˚&animation=fadeIn&type=waving&color=gradient&height=100"/>
</p>

# 🎧 Melodify - A Full-Stack Spotify Clone

Melodify is a full-featured music streaming web application inspired by Spotify, built with the **MERN** stack. It offers real-time interactions, media management, an admin dashboard, and a modern, responsive UI using the latest web technologies.

---

## 🚀 Features

- 🎵 Play, pause, skip, and browse music tracks  
- 🔊 Adjustable volume slider  
- 💬 Real-time chat between users (Socket.io)  
- 👁️ View what other users are listening to live  
- 🟢 Online/offline user presence  
- 👨🏼‍💼 Admin dashboard to manage albums and songs  
- 📊 Analytics dashboard for usage insights  
- ☁️ Cloud-based media storage (Cloudinary)  
- 🔐 Authentication via Clerk  
- 💻 Modern UI using `shadcn/ui` components  
- ⚡ Blazing fast frontend built with React + Vite

---

## 🛠 Tech Stack

| Layer       | Technology               |
|-------------|--------------------------|
| Frontend    | React.js, Vite, shadcn/ui |
| Backend     | Node.js, Express.js       |
| Database    | MongoDB (Atlas)           |
| Real-Time   | Socket.io                 |
| Auth        | Clerk                     |
| Media       | Cloudinary API            |
| Hosting     | Vercel (frontend), Render/Heroku (backend)

---

## 📸 Screenshots

> _Add screenshots here to show the UI and key features._

---

## 📦 Installation

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account
- Cloudinary and Clerk accounts (API keys required)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/melodify.git
cd melodify
```

2. Install dependencies
```bash
# For backend
cd server
npm install

# For frontend
cd ../client
npm install
```

3. Create .env files
Set up environment variables for both backend and frontend. Include keys for:

MongoDB URI

Clerk API keys

Cloudinary credentials

Socket.io config

4. Start the app
```bash
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev

```
📂 Project Structure
```bash
melodify/
├── client/         # React frontend (Vite)
├── server/         # Express backend
├── README.md
```

📄 License


This project is for educational purposes and does not include any licensed commercial content.
You are free to modify and reuse the code under the MIT License.
