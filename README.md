# 🏡 WanderLust – Airbnb-like Listing Web Application

WanderLust is a full-stack web application inspired by Airbnb that allows users to create, view, edit, and delete property listings with image uploads and secure user authentication.

The project demonstrates real-world backend and frontend integration using **Node.js, Express, MongoDB**, and modern web development tools.

## 🚀 Features

- 🔐 User Authentication & Authorization (Login / Signup)
- 🏘️ Create, Read, Update & Delete (CRUD) property listings
- 📸 Image upload with cloud storage
- 🛡️ Secure sessions and protected routes
- ✅ Form validation and error handling
- 🌐 Dynamic UI rendering
- 📱 Responsive design using Bootstrap

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- Bootstrap
- EJS (Embedded JavaScript Templates)

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose)

### Other Tools & Libraries
- Passport.js – Authentication
- Express Session – Session management
- Multer – File uploads
- Cloudinary – Image storage
- Joi – Server-side validation

---

## 📁 Project Structure

WanderLust/
│

├── models/ # Mongoose schemas

├── routes/ # Express routes

├── controllers/ # Business logic

├── views/ # EJS templates

├── public/ # CSS, JS, images

├── middleware/ # Custom middleware

├── utils/ # Utility functions

├── app.js # Main application file

└── package.json


---

## ⚙️ Installation & Setup

Follow these steps to run the project locally 👇

### 1️⃣ Clone the repository

git clone https://github.com/ranishilpi/WanderLust-Airbnb-like-Listing-Web-App.git
cd WanderLust-Airbnb-like-Listing-Web-App

2️⃣ Install dependencies
npm install

3️⃣ Set up Environment Variables
Create a .env file in the root directory and add:

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_KEY=your_api_key

CLOUDINARY_SECRET=your_api_secret

DB_URL=mongodb://127.0.0.1:27017/wanderlust

SESSION_SECRET=your_secret_key

4️⃣ Start MongoDB

Make sure MongoDB is running locally:

5️⃣ Run the application
npm start
or (if using nodemon):
nodemon app.js

6️⃣ Open in Browser
http://localhost:3000


