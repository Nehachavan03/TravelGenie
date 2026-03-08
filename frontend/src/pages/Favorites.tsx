import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Heart, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Place {
    id: string;
    name: string;
    category_name: string;
    image_url: string;
    description: string;
    city_id: string;
}

const Favorites: React.FC = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                if (!user?.id) return;
                const response = await api.get(`/favorites/${user.id}`);
                setFavorites(response.data);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                // Fallback for UI demonstration
                setFavorites([
                    {
                        id: 'p1',
                        name: 'Eiffel Tower',
                        category_name: 'Historical',
                        image_url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=1000',
                        description: 'Iconic iron lattice tower on the Champ de Mars.',
                        city_id: 'c1',
                    }
                ]);
                toast.error('Could not load your saved favorites. Showing a mock favorited item.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, [user]);

    const handleRemoveFavorite = async (placeId: string) => {
        try {
            await api.post('/favorites/toggle', { place_id: placeId });
            setFavorites(favorites.filter(f => f.id !== placeId));
            toast.success('Removed from favorites');
        } catch (error) {
            toast.error('Failed to remove favorite directly. Removing from mock view.');
            setFavorites(favorites.filter(f => f.id !== placeId));
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-3 mb-10 border-b border-gray-200 pb-6">
                <Heart className="h-8 w-8 fill-red-500 text-red-500" />
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    My Saved Places
                </h1>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm overflow-hidden h-96">
                            <div className="bg-gray-200 h-64 w-full"></div>
                        </div>
                    ))}
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                    <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        You haven't saved any places. Start exploring to build your dream itinerary!
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                        <Search className="mr-2 h-5 w-5" />
                        Discover Places
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favorites.map((place) => (
                        <div
                            key={place.id}
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-transparent hover:border-red-100 relative"
                        >
                            <button
                                onClick={() => handleRemoveFavorite(place.id)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition-all shadow-sm"
                                title="Remove from favorites"
                            >
                                <Heart size={20} className="fill-current" />
                            </button>

                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={place.image_url}
                                    alt={place.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800 backdrop-blur-md bg-opacity-90 shadow-sm border border-gray-100">
                                        {place.category_name}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        {place.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {place.description}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    {/* Provide link back to city to view places */}
                                    <Link
                                        to={`/cities/${place.city_id}`}
                                        className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
                                    >
                                        <MapPin className="h-4 w-4 mr-1" />
                                        View in City
                                    </Link>
                                    <button className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors py-2 px-4 rounded-lg shadow-sm">
                                        Add to Trip
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
