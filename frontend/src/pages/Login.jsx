import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { authService } from '../services/authService';
import { ErrorMessage } from '../components/Messages';
import { FormInput } from '../components/FormComponents';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await authService.login(email, password);
            login(data.token, data.user);

            if (data.user.role === 'admin') {
                navigate('/admin');
            } else if (data.user.role === 'store_owner') {
                navigate('/store-owner');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-500 to-purple-700">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-center mb-8 text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
                    Login
                </h2>
                <ErrorMessage message={error} />
                <form onSubmit={handleSubmit}>
                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FormInput
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-medium transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-6 text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-purple-500 font-medium hover:text-purple-700">Sign up</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
