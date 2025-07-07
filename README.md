<h1 align="center">Social Network Application</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#technologies-used">Technologies Used</a> •
  <a href="#installation">Installation</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#api-endpoints">API Endpoints</a> •
  <a href="#real-time-features">Real-Time Features</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a> •
  <a href="#acknowledgments">Acknowledgments</a> •
  <a href="#contact">Contact</a>
</p>

---

<h2 align="center">Features</h2>

<ul>
  <li>✨ <strong>User Authentication</strong>: Secure login and signup with JWT (JSON Web Tokens) and password hashing.</li>
  <li>📝 <strong>Profile Management</strong>: Users can update their profile information, including name, email, and profile picture.</li>
  <li>🤝 <strong>Friend Requests</strong>: Send, accept, or reject friend requests with real-time notifications.</li>
  <li>🔍 <strong>Friend Recommendations</strong>: Get personalized friend recommendations based on mutual connections.</li>
  <li>🔔 <strong>Real-Time Notifications</strong>: Receive instant notifications for friend requests and acceptances using <strong>Socket.IO</strong>.</li>
  <li>🔒 <strong>Change Password</strong>: Users can securely change their password with validation.</li>
  <li>🗑️ <strong>Delete Account</strong>: Users can delete their account, which removes all associated data from the system.</li>
</ul>

---

<h2 align="center">Technologies Used</h2>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

---

<h2 align="center">Installation</h2>

<p>To get started with the Social Network Application, follow these steps:</p>

<h3>Prerequisites</h3>

<ul>
  <li><strong>Node.js</strong> (v14 or higher)</li>
  <li><strong>MongoDB</strong> (running locally or a cloud instance)</li>
  <li><strong>Git</strong> (optional)</li>
</ul>

<h3>Steps</h3>

<ol>
  <li><strong>Clone the Repository</strong></li>
  <pre><code>git clone https://github.com/your-username/social-network-app.git
cd social-network-app</code></pre>

  <li><strong>Install Dependencies</strong></li>
  <pre><code>cd client
npm install
cd ../server
npm install</code></pre>

  <li><strong>Set Up Environment Variables</strong></li>
  <p>Create a <code>.env</code> file in the <code>server</code> directory and add the following variables:</p>
  <pre><code>MONGO_URI=mongodb://localhost:27017/social-network
JWT_SECRET=your_jwt_secret_key
PORT=5000</code></pre>
  <p>Replace <code>your_jwt_secret_key</code> with a secure secret key for JWT token generation.</p>

  <li><strong>Start the Backend Server</strong></li>
  <pre><code>npm start</code></pre>
  <p>The server will start on <code>http://localhost:5000</code>.</p>

  <li><strong>Start the Frontend Application</strong></li>
  <pre><code>npm start</code></pre>
  <p>The frontend will start on <code>http://localhost:3000</code>.</p>

  <li><strong>Access the Application</strong></li>
  <p>Open your browser and navigate to <code>http://localhost:3000</code> to access the application.</p>
</ol>

---

<h2 align="center">Project Structure</h2>

<h3>Backend (<code>server</code>)</h3>

<ul>
  <li><strong><code>index.js</code></strong>: The main entry point for the backend server.</li>
  <li><strong><code>models/</code></strong>: Contains Mongoose models for <code>User</code> and <code>FriendRequest</code>.</li>
  <li><strong><code>routes/</code></strong>: Contains API routes for user authentication, friend requests, profile management, etc.</li>
  <li><strong><code>uploads/</code></strong>: Directory for storing uploaded profile pictures.</li>
</ul>

<h3>Frontend (<code>client</code>)</h3>

<ul>
  <li><strong><code>src/Components/</code></strong>: Contains React components for different parts of the application (e.g., <code>Login</code>, <code>Signup</code>, <code>Dashboard</code>, etc.).</li>
  <li><strong><code>src/context/</code></strong>: Contains the <code>SocketContext</code> for managing real-time communication.</li>
  <li><strong><code>src/App.js</code></strong>: The main entry point for the React application.</li>
  <li><strong><code>src/index.js</code></strong>: Renders the React application.</li>
</ul>

---

<h2 align="center">API Endpoints</h2>

<h3>Authentication</h3>

<ul>
  <li><strong>POST <code>/signup</code></strong>: Register a new user.</li>
  <li><strong>POST <code>/login</code></strong>: Log in an existing user and return a JWT token.</li>
</ul>

<h3>User Management</h3>

<ul>
  <li><strong>GET <code>/user/:userId</code></strong>: Fetch user details by ID.</li>
  <li><strong>PUT <code>/edit-profile/:userId</code></strong>: Update user profile information.</li>
  <li><strong>POST <code>/change-password/:userId</code></strong>: Change user password.</li>
  <li><strong>DELETE <code>/delete-profile/:userId</code></strong>: Delete user profile.</li>
</ul>

<h3>Friend Requests</h3>

<ul>
  <li><strong>POST <code>/send-friend-request</code></strong>: Send a friend request to another user.</li>
  <li><strong>POST <code>/respond-friend-request</code></strong>: Accept or reject a friend request.</li>
  <li><strong>GET <code>/pending-friend-requests/:userId</code></strong>: Fetch pending friend requests for a user.</li>
  <li><strong>GET <code>/friend-recommendations/:userId</code></strong>: Get friend recommendations for a user.</li>
</ul>

<h3>Friends</h3>

<ul>
  <li><strong>GET <code>/friend-list/:userId</code></strong>: Fetch the friend list of a user.</li>
  <li><strong>POST <code>/unfriend</code></strong>: Remove a friend from the user's friend list.</li>
</ul>

<h3>Search</h3>

<ul>
  <li><strong>GET <code>/search-users</code></strong>: Search for users by username.</li>
</ul>

---

<h2 align="center">Real-Time Features</h2>

<p><strong>Socket.IO</strong> is used to provide real-time notifications for:</p>

<ul>
  <li>New friend requests.</li>
  <li>Friend request acceptances.</li>
</ul>

---

<h2 align="center">Contributing</h2>

<p>Contributions are welcome! If you'd like to contribute to this project, please follow these steps:</p>

<ol>
  <li>Fork the repository.</li>
  <li>Create a new branch for your feature or bugfix.</li>
  <li>Commit your changes and push them to your fork.</li>
  <li>Submit a pull request with a detailed description of your changes.</li>
</ol>

---

<h2 align="center">License</h2>

<p>This project is licensed under the MIT License. See the <a href="LICENSE">LICENSE</a> file for more details.</p>

---

<h2 align="center">Acknowledgments</h2>

<ul>
  <li><strong>React</strong> for the frontend framework.</li>
  <li><strong>Express</strong> for the backend server.</li>
  <li><strong>MongoDB</strong> for the database.</li>
  <li><strong>Socket.IO</strong> for real-time communication.</li>
  <li><strong>Tailwind CSS</strong> for styling.</li>
</ul>

---

<h2 align="center">Contact</h2>

<p>If you have any questions or feedback, feel free to reach out:</p>

<ul>
  <li><strong>Email</strong>:faraj.ansari16@gmail.com</li>
  <li><strong>GitHub</strong>: <a href="https://github.com/itsfraz">itsfraz</a></li>
</ul>

---

<p align="center">Thank you for checking out the <strong>Social Network Application</strong>! We hope you enjoy using it as much as we enjoyed building it. Happy networking! 🚀</p>
