# 🚀 HireHive

### A Full-Stack Freelancing Marketplace

> Connecting **clients** and **freelancers** with powerful tools like real-time messaging, GraphQL APIs, and seamless file sharing.

---

## 🌟 Overview

**HireHive** is a modern freelancing platform inspired by real-world marketplaces.
It enables users to **post jobs, submit proposals, collaborate, and communicate in real-time**.

Built with a scalable architecture using **Node.js, React, GraphQL, and PostgreSQL**, it delivers a smooth and interactive user experience.

---

## ✨ Features

🔐 **Authentication & Roles**

* Secure login/signup
* Role-based access (Client / Freelancer)

💼 **Job Marketplace**

* Post jobs
* Search & filter jobs
* Apply with proposals

💬 **Real-Time Messaging**

* Chat between clients and freelancers
* Socket-based live updates

🔔 **Notifications**

* Instant alerts for messages, proposals, updates

📁 **File Uploads**

* Upload portfolios and deliverables
* Stored securely on server

⭐ **Reviews & Ratings**

* Feedback system after project completion

⚡ **GraphQL API**

* Efficient data fetching
* Structured schema & resolvers

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* GraphQL
* Sequelize ORM
* PostgreSQL

### Frontend

* React.js
* Tailwind CSS
* Socket.io (Real-time features)

---

## 📁 Project Structure

```
HireHive/
│
├── backend/        # Server-side code
│   ├── src/
│   ├── models/
│   ├── migrations/
│   ├── seeders/
│
├── frontend/       # React app
│   ├── src/
│   ├── components/
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 1. Clone Repository

```bash
git clone https://github.com/your-username/hirehive.git
cd hirehive
```

---

### 🔹 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hirehive_dev
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_secret
```

Run database:

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Start server:

```bash
npm run dev
```

---

### 🔹 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```
REACT_APP_API_URL=http://localhost:4000
```

Run app:

```bash
npm start
```

---

## 🧪 Running Tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

---

## 🔄 GraphQL API

* Schema: `backend/src/graphql/typeDefs.js`
* Resolvers: `backend/src/graphql/resolvers.js`
* Endpoint: `http://localhost:4000/graphql`

---

## 📡 Real-Time Features

* Powered by **WebSockets**
* Enables:

  * Live chat
  * Instant notifications

---

## 📂 File Uploads

* Stored in:

```
backend/uploads/
```

* Supports:

  * Portfolio uploads
  * Project deliverables

---

## 🧠 Development Tips

* Use **nodemon** for auto-reload
* Restart frontend after changing `.env`
* Check logs for GraphQL errors

---

## 🐛 Troubleshooting

❌ Database not connecting
✔ Check PostgreSQL is running and credentials are correct

❌ Migration errors
✔ Run:

```bash
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

❌ Port already in use
✔ Change `PORT` in `.env`

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Anshu Dhawan**

---

## 💡 Future Improvements

* Payment integration 💳
* AI-based job recommendations 🤖
* Mobile app 📱

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
