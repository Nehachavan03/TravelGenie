import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plane, Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });

            const { token, user } = response.data;
            if (token && user) {
                login(token, user);
                toast.success('Login successful!');
                navigate('/');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: 'guest@example.com',
                password: 'guestpassword123'
            });

            const { token, user } = response.data;
            if (token && user) {
                login(token, user);
                toast.success('Welcome! Logged in as Guest.');
                navigate('/');
            }
        } catch (error: any) {
            console.error('Guest login error:', error);
            toast.error('Guest login is currently unavailable. Please register.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl transition-all hover:shadow-2xl">
                <div className="flex flex-col items-center justify-center">
                    <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600">
                        <Plane size={32} className="transform -rotate-45" />
                    </div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to access your planned trips
                    </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-lg w-full px-3 py-3 pl-10 border border-gray-300 focus:ring-2 focus:ring-primary-500"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-lg w-full px-3 py-3 pl-10 border border-gray-300 focus:ring-2 focus:ring-primary-500"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 text-white rounded-lg ${
                                isLoading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'
                            }`}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>

                        <button
                            type="button"
                            onClick={handleGuestLogin}
                            disabled={isLoading}
                            className="w-full py-3 px-4 border-2 border-primary-600 text-primary-600 rounded-lg"
                        >
                            Guest Access
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4 text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600">
                        Sign up now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;