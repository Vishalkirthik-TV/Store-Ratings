import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { ErrorMessage, SuccessMessage } from '../components/Messages';
import { FormInput, FormTextarea } from '../components/FormComponents';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (formData.name.length < 20 || formData.name.length > 60) {
            setError('Name must be between 20 and 60 characters');
            return false;
        }

        if (formData.address.length > 400) {
            setError('Address must not exceed 400 characters');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Invalid email format');
            return false;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('Password must be 8-16 characters with at least one uppercase letter and one special character');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        try {
            await authService.signup(formData);
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-500 to-purple-700">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-center mb-8 text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
                    Sign Up
                </h2>
                <ErrorMessage message={error} />
                <SuccessMessage message={success} />
                <form onSubmit={handleSubmit}>
                    <FormInput
                        label="Name (20-60 characters)"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        helpText="8-16 characters, one uppercase, one special character"
                    />
                    <FormTextarea
                        label="Address (max 400 characters)"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-medium transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="text-center mt-6 text-gray-600">
                    Already have an account? <Link to="/login" className="text-purple-500 font-medium hover:text-purple-700">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
