import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MapPin, ArrowLeft, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface City {
    id: string;
    name: string;
    image_url: string;
    description: string;
    country_code: string;
}

const Cities: React.FC = () => {
    const { country_code } = useParams<{ country_code: string }>();
    const [cities, setCities] = useState<City[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await api.get(`/cities/${country_code}`);
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
                toast.error('Could not load cities. Showing popular cities instead.');
                // Fallback mock data
                setCities([
                    {
                        id: '1',
                        name: country_code === 'FR' ? 'Paris' : country_code === 'JP' ? 'Tokyo' : 'Rome',
                        image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1000',
                        description: 'The capital city known for its stunning architecture and vibrant culture.',
                        country_code: country_code || 'UN',
                    },
                    {
                        id: '2',
                        name: country_code === 'FR' ? 'Nice' : country_code === 'JP' ? 'Kyoto' : 'Venice',
                        image_url: 'https://images.unsplash.com/photo-1516483638261-f40889f08a44?auto=format&fit=crop&q=80&w=1000',
                        description: 'A beautiful coastal or historical destination perfect for relaxation.',
                        country_code: country_code || 'UN',
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        if (country_code) {
            fetchCities();
        }
    }, [country_code]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-primary-600 hover:text-primary-800 font-medium mb-8 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to Destinations
            </button>

            <div className="flex items-center gap-3 mb-10">
                <Building2 className="h-8 w-8 text-primary-600" />
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Select Your City
                </h1>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
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
            ) : cities.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No cities found</h3>
                    <p className="mt-2 text-gray-500">We couldn't find any cities for this country.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cities.map((city) => (
                        <Link
                            key={city.id}
                            to={`/cities/${city.id}`}
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={city.image_url || `https://tse1.mm.bing.net/th?q=${encodeURIComponent(city.name)}+city+landmark&w=800&h=600&c=7&rs=1&p=0`}
                                    alt={city.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary-400" />
                                    {city.name}
                                </h3>
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <p className="text-gray-600 text-base line-clamp-3">
                                    {city.description || `Experience the best attractions and places in ${city.name}.`}
                                </p>
                                <div className="mt-6">
                                    <span className="text-primary-600 font-medium group-hover:text-primary-700 flex items-center gap-1 transition-colors">
                                        Explore Places
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
        </div>
    );
};

export default Cities;
