# 📝 Micro Blogging Platform

A **Micro Blogging Platform** built with the **MERN (MongoDB, Express, React, Node.js)** stack. Users can create and share short posts, interact with others' content, and manage their profiles. The platform features **Role-Based Access Control (RBAC)**, providing different levels of access for **Admins**, **Moderators**, and **Users**.

## 🌟 Features

### 👥 User Registration & Authentication
- **Sign Up**: Create an account with email and password, with secure password storage.
- **Login & Logout**: Log in to access the platform and manage sessions smoothly.
- **Roles**: Users are assigned roles—**User**, **Moderator**, or **Admin**.

### 🔐 Role-Based Access Control (RBAC)
- **Admin**: 
  - Full control, including user management (promote/demote roles, delete accounts).
  - Can manage all posts and comments.
- **Moderator**: 
  - Can edit or delete any posts or comments.
- **User**: 
  - Can create, edit, delete their own posts.
  - Can like, comment, and follow users.

### 🧑‍💼 User Profile
- **Profile Management**: Create or update profiles with username, bio, and profile picture.
- **View Profiles**: View your own or other users’ profiles and posts.

### ✍️ Posting & Interaction
- **Create Posts**: Post short text-based content with optional media (images/videos).
- **Edit/Delete Posts**: Modify or remove your posts; Admins and Moderators can manage all posts.
- **Engage**: Like and comment on posts, with like/comment counters displayed.

### 👥 Follow System
- **Following**: Follow users to see their posts in your feed.
- **Followers**: View who follows you and whom you follow.

### 🔍 Search
- **Find Users**: Search for users by their username.

### 🖥️ Additional Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop.
- **Security**: Includes data encryption, secure authentication, and protection against vulnerabilities (e.g., XSS, CSRF).
- **Data Management**: MongoDB efficiently handles data storage for users, posts, and comments.

## 🤝 Contributing
Contributions are welcome! Feel free to submit pull requests or raise issues for improvement.

## 📄 License
Licensed under the MIT License. See the `LICENSE` file for details.

## 📧 Contact
For inquiries, reach out to **Neelameghashyam Raya** at [rayaneelameghashyam@gmail.com](mailto:rayaneelameghashyam@gmail.com).
