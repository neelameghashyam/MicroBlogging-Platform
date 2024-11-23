import { Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import ProfileCreation from './pages/ProfileCreation';
import PostCreation from './pages/PostCreation';
import Dashboard from './pages/Dashboard';
import ListUsers from './pages/ListUsers';
import Forbidden from './pages/Forbidden';
import AuthorizRoute from './components/AuthorizeRoute';
import '../App.css'; // Import the CSS file
import AllProfiles from './pages/AllProfiles';
import AllPosts from './pages/AllPosts';
import MyFeed from './pages/MyFeed';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

function App() {
    const { state, handleLogout } = useContext(AuthContext);

    return (
        <div className="app-container">
            <h2>User Mini Blog App</h2>
            <div className="nav-container">
                <ul>
                    {state.isLoggedIn ? (
                        <>
                            <li><Link to="/profile">Profile</Link></li>
                            <li><Link to="/post-creation">Post Creation</Link></li>
                            {(state.user.role === 'admin' || state.user.role === 'moderator') && 
                                <li><Link to="/listUsers">List Users</Link></li>}
                            <li><Link to="/allProfiles">All Profiles</Link></li>
                            <li><Link to="/allPosts">All Posts</Link></li>
                            <li><Link to="/my-feed">My Feed</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/resetPassword">Reset Password</Link></li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </>
                    )}
                </ul>
            </div>

            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile-creation" element={
                    <PrivateRoute>
                        <ProfileCreation />
                    </PrivateRoute>
                } />
                <Route path="/post-creation" element={
                    <PrivateRoute>
                        <PostCreation />
                    </PrivateRoute>
                } />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/profile" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                } />
                <Route path="/resetPassword" element={
                    <PrivateRoute>
                        <ResetPassword />
                    </PrivateRoute>
                } />
                <Route path='/listUsers' element={
                    <PrivateRoute>
                        <AuthorizRoute permittedRoles={['admin', 'moderator']}>
                            <ListUsers />
                        </AuthorizRoute>
                    </PrivateRoute>
                } />
                <Route path='/allProfiles' element={
                    <PrivateRoute>
                        <AllProfiles />
                    </PrivateRoute>
                } />
                <Route path='/allPosts' element={
                    <PrivateRoute>
                        <AllPosts />
                    </PrivateRoute>
                } />
                <Route path='/my-feed' element={
                    <PrivateRoute>
                        <MyFeed />
                    </PrivateRoute>
                } />
                <Route path='/forbidden' element={<Forbidden />} />
            </Routes>

            <ToastContainer />
        </div>
    );
}

export default App;
