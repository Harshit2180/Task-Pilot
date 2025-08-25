# 📝 Task Pilot - Task Management System

**Task Pilot** is a comprehensive task management application built with the MERN stack. It allows users to track their tasks and progress, while admins can manage teams, assign tasks, and generate detailed reports. The app features role-based dashboards, automated status updates, interactive charts, and report downloads for efficient productivity management.

> 🚀 Live Demo: [https://taskpilot-8oyf.onrender.com](https://taskpilot-8oyf.onrender.com)

---

## ✨ Features

### 👤 Authentication

* Secure login/signup using **JWT**
* Role-based access: **User** and **Admin**

### 📋 User Functionality

* View assigned tasks on a personal dashboard
* Track task progress and priorities
* Access attachments related to tasks
* Interactive visualization of task status using **Recharts** (pie & bar charts)

### 🧑‍💼 Admin Functionality

* Assign tasks to team members and update task details
* Track completion progress across multiple users
* Generate downloadable reports using **ExcelJS**:
  * **All Users Task Report**
  * **Detailed Task Report**
* Manage team members and monitor their performance

### 📱 UI & Responsiveness

* Mobile-responsive design for seamless access on desktop, tablet, and mobile
* Dashboard insights with visual charts for quick task analysis

---

## 🛠 Tech Stack

* **Frontend**: React, Recharts
* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Authentication**: JWT (JSON Web Tokens)
* **Reporting**: ExcelJS
* **Deployment**: Render (Full Stack)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Harshit2180/Task-Pilot.git
cd Task-Pilot
```

### Backend Setup

```bash
cd Backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

### 🔐 Environment Variables

Create a `.env` file in the **Backend** directory and add the following variables:

```env
MONGO_URI = your_mongodb_connection_string
SECRET_KEY = your_jwt_secret
ADMIN_INVITE_TOKEN = your_6_digit_code
PORT = 8000
```
## 🐞 Known Issues / Limitations

- 📷 Signup fails when uploading a profile picture; users can successfully sign up only if no profile image is provided.

> This issue is known and will be resolved in upcoming updates. Feel free to contribute or raise an issue in the repository!



## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

