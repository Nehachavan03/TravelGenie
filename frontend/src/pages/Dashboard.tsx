import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Briefcase, Calendar, Plus, X, Trash2, MapPin } from 'lucide-react';

interface Trip {
    itinerary_id: string;
    city: string;
    start_date: string;
    end_date: string;
    budget: string;
    image_url?: string;
}

interface CityOption {
    id: string;
    name: string;
}

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [availableCities, setAvailableCities] = useState<CityOption[]>([]);

    // Form State
    const [selectedCityId, setSelectedCityId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budget, setBudget] = useState('Medium');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                if (!user?.id) return;
                const response = await api.get(`/itinerary/${user.id}`);
                setTrips(response.data);
            } catch (error) {
                console.error('Error fetching trips:', error);
                toast.error('Could not load trips. Showing sample trips instead.');
                
                // Fallback mock data for exploration
                setTrips([
                    {
                        itinerary_id: '1',
                        city: 'Paris',
                        start_date: '2025-06-10',
                        end_date: '2025-06-12',
                        budget: 'High',
                        image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000'
                    },
                    {
                        itinerary_id: '2',
                        city: 'Mumbai',
                        start_date: '2025-12-25',
                        end_date: '2025-12-28',
                        budget: 'Medium',
                        image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1000'
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchAllCities = async () => {
            try {
                // Fetch cities for some popular countries to populate the dropdown
                const countries = ['IN', 'US', 'FR', 'JP', 'UK'];
                let allCities: CityOption[] = [];
                for (const code of countries) {
                    const res = await api.get(`/cities/${code}`);
                    allCities = [...allCities, ...res.data];
                }
                // Sort cities alphabetically
                allCities.sort((a, b) => a.name.localeCompare(b.name));
                setAvailableCities(allCities);
                if (allCities.length > 0) setSelectedCityId(allCities[0].id);
            } catch (e) {
                console.error('Error fetching cities:', e);
            }
        };

        fetchTrips();
        fetchAllCities();
    }, [user]);

    const handleCreateTrip = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const cityId = formData.get('city_id') as string;
        const startDateVal = formData.get('start_date') as string;
        const endDateVal = formData.get('end_date') as string;
        const budgetVal = formData.get('budget_level') as string;

        // Use FormData as primary, state as fallback if needed (though FormData is more reliable for direct DOM access)
        const finalCityId = cityId || selectedCityId;
        const finalStartDate = startDateVal || startDate;
        const finalEndDate = endDateVal || endDate;
        const finalBudget = budgetVal || budget;

        if (!finalCityId || !finalStartDate || !finalEndDate || !finalBudget) {
            toast.error('Please fill in all fields');
            return;
        }

        if (new Date(finalStartDate) > new Date(finalEndDate)) {
            toast.error('End date must be after start date');
            return;
        }

        setIsSubmitting(true);
        try {
            let numericBudget = 5000;
            if (finalBudget === 'Low') numericBudget = 1000;
            if (finalBudget === 'High') numericBudget = 10000;

            const payload = {
                user_id: user?.id,
                city_id: finalCityId,
                start_date: finalStartDate,
                end_date: finalEndDate,
                budget: numericBudget
            };

            const response = await api.post('/itinerary/create', payload);
            
            const cityName = availableCities.find(c => c.id.toString() === finalCityId.toString())?.name || 'New Trip';

            const newTrip: Trip = {
                itinerary_id: response.data.itinerary_id,
                city: cityName,
                start_date: finalStartDate,
                end_date: finalEndDate,
                budget: budget, // Using the string label 'Low'/'Medium'/'High'
                image_url: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000`
            };
            
            setTrips([newTrip, ...trips]);
            setIsCreateModalOpen(false);
            resetForm();
            toast.success('Trip created successfully!');
        } catch (error: any) {
            console.error('Error creating trip:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create trip.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTrip = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!window.confirm('Are you sure you want to delete this trip?')) return;

        try {
            await api.delete(`/itinerary/${id}`);
            setTrips(trips.filter(t => t.itinerary_id !== id));
            toast.success('Trip deleted successfully');
        } catch (error) {
            console.error('Error deleting trip:', error);
            toast.error('Failed to delete trip.');
        }
    };

    const resetForm = () => {
        if (availableCities.length > 0) setSelectedCityId(availableCities[0].id);
        setStartDate('');
        setEndDate('');
        setBudget('Medium');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-gray-200 pb-6">
                <div className="flex items-center gap-3">
                    <Briefcase className="h-8 w-8 text-primary-600" />
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        My Trips
                    </h1>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-all hover:scale-105"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Create New Trip
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-white rounded-2xl shadow-sm overflow-hidden h-72">
                            <div className="bg-gray-200 h-40 w-full"></div>
                        </div>
                    ))}
                </div>
            ) : trips.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border-2 border-dashed border-gray-300">
                    <Briefcase className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No trips planned</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        You don't have any upcoming trips. Create one now to start organizing your itinerary!
                    </p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Plan a Trip
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trips.map((trip) => (
                        <Link
                            key={trip.itinerary_id}
                            to={`/trips/${trip.itinerary_id}`}
                            className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col relative"
                        >
                            <button
                                onClick={(e) => handleDeleteTrip(e, trip.itinerary_id)}
                                className="absolute top-4 left-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                title="Delete Trip"
                            >
                                <Trash2 size={18} />
                            </button>

                            <div className="relative h-48 overflow-hidden bg-gray-200">
                                <img
                                    src={trip.image_url || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000`}
                                    alt={trip.city}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-gray-700 shadow-sm border border-gray-100">
                                    ₹ {trip.budget}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                                    {trip.city}
                                </h3>
                                <div className="space-y-2 text-sm font-bold text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-primary-500" />
                                        <span>
                                            {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <span className="text-primary-600 font-black flex items-center gap-1 group-hover:gap-2 transition-all">
                                        View Itinerary &rarr;
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create Trip Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-2xl font-black text-gray-900">Create New Trip</h2>
                            <button
                                onClick={() => { setIsCreateModalOpen(false); resetForm(); }}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 bg-white rounded-full shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTrip} className="p-8 space-y-6">
                            <div>
                                <label htmlFor="cityId" className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                                    Destination City
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <MapPin size={18} />
                                    </div>
                                    <select
                                        id="cityId"
                                        name="city_id"
                                        value={selectedCityId}
                                        onChange={(e) => setSelectedCityId(e.target.value)}
                                        className="w-full rounded-xl border-gray-200 border pl-10 pr-4 py-3 text-gray-900 font-bold focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50"
                                        required
                                    >
                                        <option value="" disabled>Select a city</option>
                                        {availableCities.map(city => (
                                            <option key={city.id} value={city.id}>{city.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="start_date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full rounded-xl border-gray-200 border px-4 py-3 text-gray-900 font-bold focus:ring-2 focus:ring-primary-500 bg-gray-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="end_date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full rounded-xl border-gray-200 border px-4 py-3 text-gray-900 font-bold focus:ring-2 focus:ring-primary-500 bg-gray-50"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="budget" className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                                    Budget Level
                                </label>
                                <select
                                    id="budget"
                                    name="budget_level"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full rounded-xl border-gray-200 border px-4 py-3 text-gray-900 font-bold focus:ring-2 focus:ring-primary-500 bg-gray-50 transition-all"
                                >
                                    <option value="Low">Low (Backpacker)</option>
                                    <option value="Medium">Medium (Standard)</option>
                                    <option value="High">High (Luxury)</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 px-6 border border-transparent shadow-xl shadow-primary-200 text-lg font-black rounded-2xl text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Planning...' : 'Start My Journey'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
