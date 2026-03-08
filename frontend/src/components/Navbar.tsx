import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Map, Heart } from 'lucide-react';

const Navbar: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-primary-600 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Map className="h-8 w-8 text-white" />
                            <span className="font-bold text-xl tracking-tight hidden sm:block">TravelPlanner</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/favorites" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-500 transition-colors flex items-center gap-1">
                                    <Heart size={18} />
                                    <span className="hidden sm:inline">Favorites</span>
                                </Link>
                                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-500 transition-colors">
                                    My Trips
                                </Link>
                                <div className="hidden md:block px-3 py-2 text-primary-100 text-sm">
                                    Hi, {user?.name || 'Traveler'}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="ml-2 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary-700 hover:bg-primary-800 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-500 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-md text-sm font-medium bg-white text-primary-600 hover:bg-gray-100 transition-colors"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
