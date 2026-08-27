# 📚 Bookly

> **A full-stack bookstore and book discovery platform built with React, Express, and Supabase.**

Bookly is a modern full-stack web application that allows users to **discover, search, save, and purchase books** through a simple and user-friendly interface.

The application combines book discovery features with essential e-commerce functionality, including **authentication, favorites, shopping cart management, and order placement**. It also provides an **admin panel** for managing books and confirming deliveries.

This project was developed as a **team project**, providing practical experience in full-stack development, API integration, database management, authentication, Git, and collaborative software development.

---

## ✨ Features

### 👤 User Features

* 🔐 **Authentication**

  * User registration
  * User login and logout
  * Secure authentication with Supabase

* 🔎 **Book Search & Discovery**

  * Search for books
  * Search by different criteria
  * Browse books by categories
  * Explore curated book sections

* 📖 **Book Information**

  * Book title
  * Author
  * Description
  * Cover image
  * Price

* ❤️ **Favorites**

  * Add books to favorites
  * Remove books from favorites
  * Easily access saved books

* 🛒 **Shopping Cart**

  * Add books to the cart
  * Increase or decrease quantities
  * Remove books from the cart
  * Review selected books before ordering

* 📦 **Orders**

  * Place book orders
  * Provide a delivery address
  * Manage ordered books

---

### 🛠️ Admin Features

* 📚 Manage the book collection
* 📦 View user orders
* 👤 View users and their orders
* 🚚 Confirm book deliveries

---

## 🏗️ Application Architecture

Bookly follows a **client-server architecture**:

```text
┌─────────────────────┐
│   React + Vite      │
│      Frontend       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Express + Node.js │
│       Backend       │
└───────┬───────┬─────┘
        │       │
        ▼       ▼
┌───────────┐ ┌─────────────────┐
│ Supabase  │ │ Google Books API│
│ Auth/DB   │ │  Book Data      │
└───────────┘ └─────────────────┘
```

### How it works

1. The **React frontend** provides the user interface and handles user interactions.
2. The **Express backend** handles server-side logic and requests.
3. **Supabase** manages authentication and application data.
4. The **Google Books API** provides book information for discovery and search.
5. Users can save books, manage their cart, and place orders.
6. Administrators can manage books and confirm deliveries.

---

## 🛠️ Tech Stack

| Technology              | Purpose                             |
| ----------------------- | ----------------------------------- |
| ⚛️ **React**            | Frontend user interface             |
| ⚡ **Vite**              | Frontend development and build tool |
| 🟨 **JavaScript**       | Application logic                   |
| 🎨 **HTML / CSS**       | Structure and styling               |
| 🟢 **Node.js**          | Backend runtime                     |
| 🚂 **Express.js**       | Backend/API server                  |
| 🟩 **Supabase**         | Authentication and database         |
| 📚 **Google Books API** | Book data and search                |
| 🐙 **Git / GitHub**     | Version control and collaboration   |

---

## 📂 Project Structure

```text
Bookly/
│
├── 📁 backend/
│   ├── server.js
│   └── ...                 # Express backend files
│
├── 📁 public/
│   └── ...                 # Public assets
│
├── 📁 src/
│   ├── 📁 components/      # Reusable React components
│   ├── 📁 pages/           # Application pages
│   ├── 📁 css/             # Stylesheets
│   └── ...                 # React application files
│
├── 📄 index.html
├── 📄 package.json
├── 📄 vite.config.js
└── 📄 README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/HaninMaarouf/Bookly.git
cd Bookly
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create the required `.env` files for the frontend and backend.

The environment variables should contain your **Supabase configuration** and any required API configuration.


### 5. Start the backend

From the `backend` directory:

```bash
node server.js
```

### 6. Start the frontend

Open another terminal and run:

```bash
npm run dev
```

Then open the local URL provided by Vite in your browser.

---

## 🔐 Authentication & Database

Bookly uses **Supabase** for authentication and database functionality.

Supabase is responsible for:

* 👤 User authentication
* 📚 Storing application data
* ❤️ Managing favorites
* 🛒 Managing cart-related data
* 📦 Managing orders
* 🔒 Database access control

---

## 📚 Book API

Bookly integrates the **Google Books API** to retrieve book information.

The API allows the application to obtain information such as:

* Book titles
* Authors
* Descriptions
* Cover images
* Categories
* Other book metadata

This data is then displayed through Bookly's search and discovery experience.

---

## 👥 Team Project

Bookly was developed collaboratively as a team project.

Through this project, we gained practical experience with:

* Full-stack web development
* React component architecture
* REST API communication
* Backend development with Express
* Supabase authentication and databases
* API integration
* Git and GitHub workflows
* Branch-based collaboration
* Debugging and integration
* Building a complete web application from frontend to backend

---

## 🎯 Project Goals

The main goals of Bookly were to:

* Build a complete full-stack web application
* Practice integrating frontend and backend technologies
* Work with external APIs
* Implement user authentication
* Work with a real database
* Implement basic e-commerce functionality
* Practice collaborative development using Git and GitHub
* Create a simple and accessible book-shopping experience

---

## 🔮 Future Improvements

Possible future improvements include:

* 💳 Online payment integration
* ⭐ Book ratings and reviews
* 🔔 Order status notifications
* 📊 More advanced admin analytics
* 🧠 Improved AI-powered recommendations
* 📱 Enhanced mobile responsiveness
* 🔍 More advanced filtering and sorting
* 📚 Personalized book recommendations

---

## 📌 Project Status

**Bookly is a completed full-stack team project developed for learning and practical application of modern web development technologies.**

---

## 👩‍💻 Repository

**GitHub:** [HaninMaarouf/Bookly](https://github.com/HaninMaarouf/Bookly)



