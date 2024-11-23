import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../css/login.css'; // Import the CSS file

export default function Login() {
    const { handleLogin } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            email: email,
            password: password 
        };
        handleLogin(formData);
    };

    return (
        <div className="login-container"> {/* Add CSS class */}
            <h2>Login Page</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder='Enter email' 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                /> 
                <input 
                    type="password" 
                    placeholder='Enter password' 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                /> 
                <input type="submit" value="Login" /> {/* Add value for better button text */}
            </form>
        </div>
    );
}
