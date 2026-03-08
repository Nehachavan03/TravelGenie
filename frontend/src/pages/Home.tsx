import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { MapPin, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

interface Country {
    code: string;
    name: string;
    image_url: string;
    description: string;
}

const Home: React.FC = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await api.get('/countries');
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
                // Fallback for UI demonstration if backend is down
                toast.error('Could not load destinations. Showing featured destinations instead.');
                setCountries([
                    {
                        code: 'FR',
                        name: 'France',
                        image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000',
                        description: 'Experience the magic of Paris, pristine beaches of Nice, and world-class cuisine.',
                    },
                    {
                        code: 'JP',
                        name: 'Japan',
                        image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000',
                        description: 'Where ancient traditions seamlessly blend with futuristic technology.',
                    },
                    {
                        code: 'IT',
                        name: 'Italy',
                        image_url: 'https://images.unsplash.com/photo-1516483638261-f40889f08a44?auto=format&fit=crop&q=80&w=1000',
                        description: 'Discover historical ruins, magnificent art, and spectacular landscapes.',
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountries();
    }, []);

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-primary-700 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=2000"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                        Design Your Dream <span className="text-primary-200">Journey</span>
                    </h1>
                    <p className="mt-4 text-xl md:text-2xl text-primary-50 max-w-3xl">
                        Discover breathtaking destinations, organize your itinerary, and make unforgettable memories with our smart travel planner.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="flex items-center gap-3 mb-10">
                    <Globe className="h-8 w-8 text-primary-600" />
                    <h2 className="text-3xl font-bold text-gray-900">Explore Destinations</h2>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm overflow-hidden h-96">
                                <div className="bg-gray-200 h-56 w-full"></div>
                                <div className="p-6">
                                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {countries.map((country) => (
                            <Link
                                key={country.code}
                                to={`/countries/${country.code}`}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={country.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000'}
                                        alt={country.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary-400" />
                                        {country.name}
                                    </h3>
                                </div>
                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <p className="text-gray-600 text-base line-clamp-3">
                                        {country.description || `Explore the beautiful cities and attractions that ${country.name} has to offer.`}
                                    </p>
                                    <div className="mt-6">
                                        <span className="text-primary-600 font-medium group-hover:text-primary-700 flex items-center gap-1 transition-colors">
                                            View Cities
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
