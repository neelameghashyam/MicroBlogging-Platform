import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../css/register.css'; // Import the CSS file

export default function Register() {
    const { handleRegister } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            email: email,
            password: password 
        };
        // runClientSideValidations()
        // after client side validations pass
        handleRegister(formData);
    };

    return (
        <div className="register-container"> {/* Add CSS class */}
            <h2>Register Page</h2>
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
                <input type="submit" value="Register" /> {/* Add value for better button text */}
            </form>
        </div>
    );
}
