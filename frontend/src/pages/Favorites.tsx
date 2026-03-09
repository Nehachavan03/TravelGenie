import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Heart, MapPin, Search, Sparkles, Loader2, X } from 'lucide-react';
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
    const [recommendations, setRecommendations] = useState<string | null>(null);
    const [isRecLoading, setIsRecLoading] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                if (!user?.id) return;
                const response = await api.get(`/favorites/${user.id}`);
                // Map place_id from backend to id for frontend
                const mappedData = response.data.map((p: any) => ({
                    ...p,
                    id: p.place_id || p.id
                }));
                setFavorites(mappedData);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                toast.error('Could not load your saved favorites.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, [user]);

    const handleGetRecommendations = async () => {
        if (favorites.length === 0) {
            toast.error('Add some favorites first to get recommendations!');
            return;
        }

        setIsRecLoading(true);
        try {
            const favNames = favorites.map(f => f.name);
            const response = await api.post('/ai/recommend', { favorites: favNames });
            setRecommendations(response.data.recommendations);
        } catch (error) {
            console.error(error);
            toast.error('Failed to get smart recommendations.');
        } finally {
            setIsRecLoading(false);
        }
    };

    const handleRemoveFavorite = async (placeId: string) => {
        try {
            if (!user?.id) return;
            await api.post('/favorites/toggle', { 
                user_id: user.id, 
                place_id: placeId 
            });
            setFavorites(favorites.filter(f => f.id !== placeId));
            toast.success('Removed from favorites');
        } catch (error) {
            console.error('Error removing favorite:', error);
            toast.error('Failed to remove favorite.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-200 pb-6">
                <div className="flex items-center gap-3">
                    <Heart className="h-8 w-8 fill-red-500 text-red-500" />
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        My Saved Places
                    </h1>
                </div>
                
                {favorites.length > 0 && (
                    <button
                        onClick={handleGetRecommendations}
                        disabled={isRecLoading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-black rounded-2xl shadow-xl shadow-primary-100 text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                        {isRecLoading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-5 w-5" />
                        )}
                        Smart Recommendations
                    </button>
                )}
            </div>

            {/* AI Recommendations Panel */}
            {recommendations && (
                <div className="mb-12 bg-white rounded-[2.5rem] shadow-2xl border-4 border-primary-100 p-8 md:p-10 relative animate-in zoom-in-95 duration-300">
                    <button 
                        onClick={() => setRecommendations(null)}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary-100 rounded-xl text-primary-600">
                            <Sparkles size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Recommended for You</h2>
                    </div>
                    <div className="prose prose-primary max-w-none">
                        <p className="text-gray-700 text-lg leading-relaxed font-medium">
                            {recommendations}
                        </p>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-white rounded-3xl shadow-sm overflow-hidden h-96">
                            <div className="bg-gray-200 h-64 w-full"></div>
                        </div>
                    ))}
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-gray-300">
                    <Heart className="mx-auto h-20 w-20 text-gray-200 mb-6" />
                    <h3 className="text-2xl font-black text-gray-900 mb-2">No favorites yet</h3>
                    <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">
                        You haven't saved any places. Start exploring to build your dream list!
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-black rounded-2xl shadow-xl shadow-primary-200 text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:-translate-y-1"
                    >
                        <Search className="mr-2 h-6 w-6" />
                        Discover Places
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favorites.map((place) => (
                        <div
                            key={place.id}
                            className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full border border-gray-100 relative"
                        >
                            <button
                                onClick={() => handleRemoveFavorite(place.id)}
                                className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition-all shadow-sm"
                                title="Remove from favorites"
                            >
                                <Heart size={20} className="fill-current" />
                            </button>

                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={place.image_url || `https://tse1.mm.bing.net/th?q=${encodeURIComponent(place.name)}+landmark+photo&w=800&h=600&c=7&rs=1&p=0`}
                                    alt={place.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-primary-100 text-primary-800 backdrop-blur-md bg-opacity-90 shadow-sm border border-white/50 uppercase tracking-widest">
                                        {place.category_name}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                                        {place.name}
                                    </h3>
                                    <p className="text-gray-500 font-medium text-sm leading-relaxed line-clamp-3">
                                        {place.description}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <Link
                                        to={`/cities/${place.city_id}`}
                                        className="flex items-center text-sm font-black text-primary-600 hover:text-primary-800 transition-colors"
                                    >
                                        <MapPin className="h-4 w-4 mr-1.5" />
                                        View in City
                                    </Link>
                                    <button className="text-xs font-black uppercase tracking-widest text-white bg-gray-900 hover:bg-black transition-all py-3 px-6 rounded-xl shadow-lg">
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
