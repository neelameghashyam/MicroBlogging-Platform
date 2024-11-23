import { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import axios from '../config/axios';
import ProfileReducer from "../components/ProfileReducer";

const initialState = {
    user: null,
    isLoggedIn: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return { ...state, isLoggedIn: true, user: action.payload };
        case 'LOGOUT_USER':
            return { ...state, isLoggedIn: false, user: null };
        default:
            return state;
    }
};

function AuthProvider(props) {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [profileState, dispatchProfile] = useReducer(ProfileReducer, []);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userResponse = await axios.get('/api/user/account', {
                        headers: { 'Authorization': token },
                    });
                    dispatch({ type: 'LOGIN_USER', payload: userResponse.data });
                } catch (err) {
                    console.error('Error fetching user data:', err);
                    // Optionally handle the error here, such as logging out the user or redirecting
                }
            }
        })();
    }, []);

    const handleRegister = async (formData) => {
        try {
            await axios.post('/api/user/register', formData);
            toast('Successfully Registered', { autoClose: 500 });
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            toast.error('Registration failed');
        }
    };

    const handleLogin = async (formData) => {
        try {
            const response = await axios.post('/api/user/login', formData);
            localStorage.setItem('token', response.data.token);
            toast('Successfully logged in', { autoClose: 500 });

            const userResponse = await axios.get('/api/user/account', {
                headers: { 'Authorization': localStorage.getItem('token') },
            });
            dispatch({ type: 'LOGIN_USER', payload: userResponse.data });

            try {
                const profileResponse = await axios.get(`/api/profile/get/${userResponse.data._id}`, {
                    headers: { 'Authorization': localStorage.getItem('token') },
                });
                if (profileResponse.data) {
                    navigate('/profile');
                } else {
                    navigate('/profile-creation');
                }
            } catch (err) {
                navigate('/profile-creation');
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error('Login failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT_USER' });
        toast('Successfully logged out');
        navigate('/login');
    };

    const handleResetPassword = async (formData) => {
        try {
            await axios.put('/api/user/reset', formData, {
                headers: { 'Authorization': localStorage.getItem('token') },
            });
            toast('Successfully reset password', { autoClose: 500 });
            navigate('/login');
        } catch (err) {
            console.error('Password reset error:', err);
            toast.error('Password reset failed');
        }
    };

    const handleProfileCreation = async (formData) => {
        try {
            await axios.post('/api/profile/create', formData, {
                headers: { 'Authorization': localStorage.getItem('token') },
            });
            toast('Successfully Profile Created', { autoClose: 500 });
            navigate('/profile');
        } catch (err) {
            console.error('Profile creation error:', err);
            toast.error('Profile creation failed');
        }
    };

    const handlePostCreation = async (formData) => {
        try {
            await axios.post('/api/post/create', formData, {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast('Post Created Successfully', { autoClose: 500 });
            navigate('/dashboard');
        } catch (err) {
            console.error('Post creation error:', err);
            toast.error('Post creation failed');
        }
    };

    return (
        <AuthContext.Provider
            value={{ state, handleRegister, handleLogin, handleLogout, handleResetPassword, handleProfileCreation, profileState, dispatchProfile, handlePostCreation }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
