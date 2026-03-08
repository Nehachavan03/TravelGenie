import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Briefcase, Calendar, MapPin, Plus, X, Trash2 } from 'lucide-react';

interface Trip {
    itinerary_id: string;
    city: string;
    start_date: string;
    end_date: string;
    budget: string;
    image_url?: string;
}

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form State
    const [cityId, setCityId] = useState('');
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
                // Mock data for UI demonstration
                setTrips([
                    {
                        itinerary_id: 't1',
                        city: 'Paris',
                        start_date: '2026-06-15',
                        end_date: '2026-06-22',
                        budget: 'Medium',
                        image_url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1000'
                    },
                    {
                        itinerary_id: 't2',
                        city: 'Tokyo',
                        start_date: '2026-09-10',
                        end_date: '2026-09-24',
                        budget: 'High',
                        image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000'
                    }
                ]);
                toast.error('Could not load trips. Showing mock trips.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrips();
    }, [user]);

    const handleCreateTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cityId || !startDate || !endDate || !budget) {
            toast.error('Please fill in all fields');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error('End date must be after start date');
            return;
        }

        setIsSubmitting(true);
        try {
            // Map budget string to numeric value for database compatibility
            let numericBudget = 5000; // Default to Medium
            if (budget === 'Low') numericBudget = 1000;
            if (budget === 'High') numericBudget = 10000;

            const payload = {
                user_id: user?.id,
                city_id: cityId,
                start_date: startDate,
                end_date: endDate,
                budget: numericBudget
            };

            const response = await api.post('/itinerary/create', payload);
            
            // Construct a Trip object compatible with the state
            const newTrip: Trip = {
                itinerary_id: response.data.itinerary_id || `t${Date.now()}`,
                city: cityId, // Use the name from the input
                start_date: startDate,
                end_date: endDate,
                budget: budget,
                image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000'
            };
            
            setTrips([...trips, newTrip]);
            setIsCreateModalOpen(false);
            resetForm();
            toast.success('Trip created successfully!');
        } catch (error) {
            console.error('Error creating trip:', error);
            toast.error('Could not create trip (backend might be down). Adding to mock list.');

            // Fallback for UI demonstration
            const newTrip: Trip = {
                itinerary_id: `t${Date.now()}`,
                city: cityId,
                start_date: startDate,
                end_date: endDate,
                budget,
                image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000'
            };
            setTrips([...trips, newTrip]);
            setIsCreateModalOpen(false);
            resetForm();
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
            // Even if backend fails, allow removing from UI for demo/local feel
            setTrips(trips.filter(t => t.itinerary_id !== id));
            toast.success('Trip removed (Local)');
        }
    };

    const resetForm = () => {
        setCityId('');
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
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
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                    <Briefcase className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No trips planned</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        You don't have any upcoming trips. Create one now to start organizing your itinerary!
                    </p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
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
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col relative"
                        >
                            <button
                                onClick={(e) => handleDeleteTrip(e, trip.itinerary_id)}
                                className="absolute top-3 left-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                title="Delete Trip"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="relative h-40 overflow-hidden bg-gray-200">
                                {trip.image_url ? (
                                    <img
                                        src={trip.image_url || `https://tse1.mm.bing.net/th?q=${encodeURIComponent(trip.city)}+city+landmark&w=800&h=600&c=7&rs=1&p=0`}
                                        alt={trip.city}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-500">
                                        <MapPin size={40} />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">
                                    ₹ {trip.budget} Budget
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                                    Trip to {trip.city}
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span>
                                            {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <span className="text-primary-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">Create New Trip</h2>
                            <button
                                onClick={() => { setIsCreateModalOpen(false); resetForm(); }}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTrip} className="p-6 space-y-5">
                            <div>
                                <label htmlFor="cityId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Destination City Name
                                </label>
                                <input
                                    type="text"
                                    id="cityId"
                                    value={cityId}
                                    onChange={(e) => setCityId(e.target.value)}
                                    placeholder="e.g. Paris"
                                    className="w-full rounded-lg border-gray-300 border px-3 py-2 text-gray-900 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 border px-3 py-2 text-gray-900 focus:ring-primary-500 focus:border-primary-500 shadow-sm text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 border px-3 py-2 text-gray-900 focus:ring-primary-500 focus:border-primary-500 shadow-sm text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                                    Budget Level
                                </label>
                                <select
                                    id="budget"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 border px-3 py-2 text-gray-900 focus:ring-primary-500 focus:border-primary-500 shadow-sm bg-white"
                                >
                                    <option value="Low">Low (Backpacker)</option>
                                    <option value="Medium">Medium (Standard)</option>
                                    <option value="High">High (Luxury)</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setIsCreateModalOpen(false); resetForm(); }}
                                    className="flex-1 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Trip'}
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
