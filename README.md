# 📝 Micro Blogging Platform (MERN Stack)

A **Micro Blogging Platform** built using the **MERN (MongoDB, Express, React, Node.js)** stack. This platform allows users to create and share short posts (microblogs) and engage with others' content. Users can manage profiles, follow other users, like posts, and leave comments. Admins and moderators have additional privileges with **Role-Based Access Control (RBAC)** to manage posts and users.

## 🌟 Features and Functionalities

### 👥 User Registration and Authentication
- **User Registration**: Users can sign up using their email and password. Secure password storage and data protection implemented.
- **Login/Logout**: Users can log in to their accounts using registered email and password. Seamless session management for user experience.
- **User Roles**: By default, all users are assigned the **User** role. Admins can promote users to **Moderator** or **Admin** roles.

### 🔐 Role-Based Access Control (RBAC)
- **Admin Role**: 
  - Full access to all features.
  - Can manage users (promote/demote roles, delete accounts).
  - Can edit or delete any posts or comments.
- **Moderator Role**:
  - Can edit or delete posts and comments.
- **User Role**:
  - Can create, edit, and delete their own posts.
  - Can like and comment on posts, and follow other users.

### 🧑‍💼 User Profile Management
- **Profile Management**: Users can create and update their profile information (username, bio, profile picture).
- **View Profiles**: Users can view their own profile and other users' profiles, including posts.

### ✍️ Microblogging Features
- **Create Posts**: Users can create short text-based posts (with character limit), and optionally add multimedia content (images, videos).
- **Edit/Delete Posts**: Users can edit or delete their own posts. Admins and Moderators can edit/delete any posts.
- **View Posts**: A chronological feed displays posts from followed users and trending posts.
- **Like and Comment**: Users can like posts and leave comments, with a counter showing the number of likes and comments.

### 👣 Follow System
- **Following/Followers**: Users can follow other users to view their posts in the feed. Lists of followers and following are available.
  
### 🔍 Search and Discover
- **Search Users**: Users can search for other users by username.

### 🖥️ Additional Features
- **Responsive Design**: Fully responsive across devices (desktop, tablet, mobile).
- **Security**: Includes robust security measures (data encryption, secure authentication, and protection from vulnerabilities like XSS, CSRF).
- **Data Persistence**: MongoDB is used to store user data, posts, and comments, ensuring efficient data management.

## 🚀 Getting Started

### 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/neelameghashyam/MicroBlogging-Platform.git
   ```
2. Navigate to the project directory:
   ```bash
   cd MicroBlogging-Platform
   ```
3. Install dependencies for both the backend and frontend:
   ```bash
   npm install
   cd client
   npm install
   ```

### ▶️ Running the Application

1. Start the backend server:
   ```bash
   npm run server
   ```
2. Start the frontend development server:
   ```bash
   cd client
   npm start
   ```

### 🌐 Deployment

Ensure that your environment variables (such as MongoDB connection strings and authentication secrets) are properly configured in a `.env` file.

The platform can be deployed on any cloud platform, such as **Heroku**, **Netlify**, or **AWS**.

## 📚 Documentation

- **API Documentation**: Detailed information about the available API endpoints and how to use them.
- **User Guide**: Instructions for users on how to register, create posts, follow others, and more.

## 🤝 Contributing

Feel free to submit pull requests or raise issues for improvements.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more information.

## 📧 Contact

For any inquiries or feedback, please reach out to **Neelameghashyam Raya** at [rayaneelameghashyam@gmail.com](mailto:rayaneelameghashyam@gmail.com).
