import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MapPin, ArrowLeft, Navigation2, Heart, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';
import AddToTripModal from '../components/AddToTripModal';

interface Place {
    id: string;
    name: string;
    category_name: string;
    image_url: string;
    description: string;
    rating?: number;
    city_id: string;
}

const Places: React.FC = () => {
    const { id: city_id } = useParams<{ id: string }>();
    const [places, setPlaces] = useState<Place[]>([]);
    const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [expandedReviewPlaceId, setExpandedReviewPlaceId] = useState<string | null>(null);
    const [addingToTripPlace, setAddingToTripPlace] = useState<{ id: string, name: string } | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await api.get(`/places/${city_id}`);
                const data = response.data;
                setPlaces(data);
                setFilteredPlaces(data);

                // Extract unique categories
                const uniqueCategories = ['All', ...new Set(data.map((p: Place) => p.category_name))] as string[];
                setCategories(uniqueCategories);

                // Fetch favorites if user logged in
                if (user?.id) {
                    try {
                        const favRes = await api.get(`/favorites/${user.id}`);
                        const fIds = new Set<string>(favRes.data.map((f: any) => f.place_id.toString()));
                        setFavoriteIds(fIds);
                    } catch (e) {
                        console.error('Error fetching favorites', e);
                    }
                }
            } catch (error) {
                console.error('Error fetching places:', error);
                toast.error('Could not load places. Showing recommended spots.');

                // Mock fallback data
                const mockData: Place[] = [
                    {
                        id: 'p1',
                        name: 'Eiffel Tower',
                        category_name: 'Historical',
                        image_url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=1000',
                        description: 'Iconic iron lattice tower on the Champ de Mars.',
                        city_id: city_id || 'c1',
                    },
                    {
                        id: 'p2',
                        name: 'Louvre Museum',
                        category_name: 'Museum',
                        image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1000',
                        description: 'World\'s largest art museum and historic monument.',
                        city_id: city_id || 'c1',
                    },
                    {
                        id: 'p3',
                        name: 'Seine River Cruise',
                        category_name: 'Experience',
                        image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000',
                        description: 'Scenic boat tours along the beautiful river Seine.',
                        city_id: city_id || 'c1',
                    }
                ];

                setPlaces(mockData);
                setFilteredPlaces(mockData);
                setCategories(['All', 'Historical', 'Museum', 'Experience']);
            } finally {
                setIsLoading(false);
            }
        };

        if (city_id) {
            fetchPlaces();
        }
    }, [city_id]);

    const handleCategoryFilter = (category: string) => {
        setActiveCategory(category);
        if (category === 'All') {
            setFilteredPlaces(places);
        } else {
            setFilteredPlaces(places.filter(p => p.category_name === category));
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent, placeId: string) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please log in to save favorites');
            return;
        }

        try {
            const res = await api.post('/favorites/toggle', { user_id: user.id, place_id: placeId });

            const newFavorites = new Set(favoriteIds);
            if (res.data.isFavorite) {
                newFavorites.add(placeId);
                toast.success('Added to favorites!');
            } else {
                newFavorites.delete(placeId);
                toast.success('Removed from favorites');
            }
            setFavoriteIds(newFavorites);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update favorites. Ensure backend is running.');
            // Optimistic UI update for dev mode
            const newFavorites = new Set(favoriteIds);
            if (newFavorites.has(placeId)) newFavorites.delete(placeId);
            else newFavorites.add(placeId);
            setFavoriteIds(newFavorites);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-primary-600 hover:text-primary-800 font-medium mb-8 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to Cities
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-3">
                    <Navigation2 className="h-8 w-8 text-primary-600" />
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Discover Places
                    </h1>
                </div>

                {/* Category Pill Filters */}
                {!isLoading && categories.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryFilter(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-primary-600 hover:border-primary-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm overflow-hidden h-[400px]">
                            <div className="bg-gray-200 h-64 w-full"></div>
                            <div className="p-6">
                                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredPlaces.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No places found</h3>
                    <p className="mt-2 text-gray-500">We couldn't find any places matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPlaces.map((place) => (
                        <div
                            key={place.id}
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-transparent hover:border-primary-100 relative"
                        >
                            {/* Favorite Button */}
                            <button
                                onClick={(e) => handleToggleFavorite(e, place.id)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm"
                                title="Save to favorites"
                            >
                                <Heart
                                    size={20}
                                    className={`transition-colors ${favoriteIds.has(place.id.toString()) ? 'fill-red-500 text-red-500' : 'fill-transparent text-gray-400 hover:text-red-500'}`}
                                />
                            </button>

                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={place.image_url || `https://tse1.mm.bing.net/th?q=${encodeURIComponent(place.name)}+landmark+photo&w=800&h=600&c=7&rs=1&p=0`}
                                    alt={place.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 backdrop-blur-md bg-opacity-90 shadow-sm">
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
                                    <button
                                        onClick={() => setAddingToTripPlace({ id: place.id, name: place.name })}
                                        className="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors py-2 px-4 rounded-lg hover:bg-primary-50"
                                    >
                                        + Add to Trip
                                    </button>
                                    <button
                                        onClick={() => setExpandedReviewPlaceId(expandedReviewPlaceId === place.id ? null : place.id)}
                                        className={`text-sm font-medium transition-colors py-2 px-3 rounded-lg flex items-center gap-1 ${expandedReviewPlaceId === place.id ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <MessageSquare size={16} />
                                        Reviews
                                    </button>
                                </div>
                            </div>

                            {expandedReviewPlaceId === place.id && (
                                <div className="absolute inset-0 bg-white z-20 overflow-y-auto p-4 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex justify-between items-center mb-2 sticky top-0 bg-white pt-2 pb-4 z-10 border-b border-gray-100">
                                        <h3 className="font-bold text-gray-900">{place.name} Reviews</h3>
                                        <button
                                            onClick={() => setExpandedReviewPlaceId(null)}
                                            className="text-sm text-gray-500 hover:text-gray-700 p-1 bg-gray-100 rounded-full"
                                        >
                                            Close
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <ReviewSection placeId={place.id} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {addingToTripPlace && (
                <AddToTripModal
                    placeId={addingToTripPlace.id}
                    placeName={addingToTripPlace.name}
                    isOpen={!!addingToTripPlace}
                    onClose={() => setAddingToTripPlace(null)}
                />
            )}
        </div>
    );
};

export default Places;
