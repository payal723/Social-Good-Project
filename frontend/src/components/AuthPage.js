import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthPage = ({ setUserId }) => {
    const [isLogin, setIsLogin] = useState(true); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = isLogin 
            ? 'http://localhost:5000/api/auth/login' 
            : 'http://localhost:5000/api/auth/register';

        try {
            const res = await axios.post(url, { username, password });
            if (isLogin) {
                toast.success('Login successful!');
                setUserId(res.data.userId); 
            } else {
                toast.success('Registration successful! Please log in.');
                setIsLogin(true); 
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Something went wrong!';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>{isLogin ? 'EcoHub Login' : 'Create an Account'}</h2>
                <p>{isLogin ? 'Welcome back! Please log in.' : 'Join the community!'}</p>
                
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div className="auth-toggle">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;