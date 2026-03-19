import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Edit3, MapPin, Map as MapIcon, CalendarDays, MoreVertical, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

interface ItineraryItem {
    id: string;
    day_number: number;
    time_slot: string; // Back-end still returns this as the field name for notes
    place_name: string;
    place_description: string;
    category_name: string;
}

interface TripDetails {
    id: string;
    city_id: string;
    city_name: string;
    start_date: string;
    end_date: string;
    budget: string;
    items: ItineraryItem[];
}

const TripTimeline: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [trip, setTrip] = useState<TripDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const response = await api.get(`/itinerary/details/${id}`);
                setTrip(response.data);
            } catch (error) {
                console.error('Error fetching itinerary details:', error);
                toast.error('Could not load itinerary. Showing mock data.');

                // Mock data for UI 
                setTrip({
                    id: id || 't1',
                    city_id: '1',
                    city_name: 'Paris',
                    start_date: '2026-06-15',
                    end_date: '2026-06-22',
                    budget: 'Medium',
                    items: [
                        { id: 'i1', day_number: 1, time_slot: 'Early morning visit', place_name: 'Eiffel Tower', category_name: 'Historical', place_description: 'Visit the landmark tower early morning.' },
                        { id: 'i2', day_number: 1, time_slot: 'Lunch with a view', place_name: 'Le Jules Verne', category_name: 'Dining', place_description: 'Lunch at the second floor of Eiffel Tower.' },
                        { id: 'i3', day_number: 1, time_slot: 'Relaxing afternoon', place_name: 'Seine River Cruise', category_name: 'Experience', place_description: 'Afternoon boat tour.' },
                        { id: 'i4', day_number: 2, time_slot: 'Art exploration', place_name: 'Louvre Museum', category_name: 'Museum', place_description: 'Explore the world\'s largest art museum.' },
                        { id: 'i5', day_number: 2, time_slot: 'Historic walk', place_name: 'Notre-Dame Cathedral', category_name: 'Historical', place_description: 'Walk around the iconic cathedral.' },
                    ]
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchTripDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-8">
                    <div className="h-10 bg-gray-200 w-1/3 rounded"></div>
                    <div className="h-64 bg-gray-200 rounded-3xl w-full"></div>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl w-full"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    if (!trip) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <Compass size={64} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Trip not found</h2>
            <p className="text-gray-500 mt-2 mb-6">The itinerary you're looking for doesn't exist or has been removed.</p>
            <Link to="/dashboard" className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all">
                Go to Dashboard
            </Link>
        </div>
    );

    const handleDeletePlace = async (detailId: string) => {
        if (!window.confirm('Are you sure you want to remove this place from your itinerary?')) return;

        try {
            await api.delete(`/itinerary/remove-place/${detailId}`);
            toast.success('Place removed');

            // Remove from local state
            setTrip(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.filter(item => item.id !== detailId)
                };
            });
        } catch (error) {
            console.error('Error removing place:', error);
            toast.error('Failed to remove place');
        }
    };

    // Group items by day
    const itemsByDay = trip.items.reduce((acc, item) => {
        if (!acc[item.day_number]) acc[item.day_number] = [];
        acc[item.day_number].push(item);
        return acc;
    }, {} as Record<number, ItineraryItem[]>);

    // Sort days
    const sortedDays = Object.keys(itemsByDay).map(Number).sort((a, b) => a - b);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-800 font-bold mb-8 transition-colors group">
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            {/* Enhanced Trip Header */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 mb-12 overflow-hidden flex flex-col lg:flex-row">
                <div className="lg:w-2/5 h-64 lg:h-auto relative">
                    <img
                        src={`https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000`}
                        alt={trip.city_name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r"></div>
                    <div className="absolute bottom-6 left-8 text-white lg:hidden">
                        <h1 className="text-3xl font-black">Trip to {trip.city_name}</h1>
                    </div>
                </div>

                <div className="p-8 lg:p-10 flex-1 flex flex-col justify-between relative bg-white">
                    <div className="absolute top-0 right-0 p-10 opacity-5 transform translate-x-4 -translate-y-4 pointer-events-none hidden lg:block">
                        <MapIcon size={160} />
                    </div>

                    <div className="relative z-10">
                        <div className="hidden lg:block mb-4">
                            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                                Planned Itinerary
                            </span>
                            <h1 className="text-4xl font-black text-gray-900 mt-2">
                                Trip to {trip.city_name}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-gray-600 font-bold">
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                                <CalendarDays size={20} className="text-primary-500" />
                                <span>{new Date(trip.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(trip.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                                <span className="text-primary-600 text-lg">₹</span>
                                <span>{trip.budget} Budget</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4 items-center">
                        <Link
                            to={`/cities/${trip.city_id}`}
                            className="flex-1 lg:flex-none text-center bg-primary-600 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-primary-200 hover:bg-primary-700 hover:-translate-y-0.5 transition-all"
                        >
                            + Add More Places
                        </Link>
                        <button
                            onClick={() => window.print()}
                            className="flex-1 lg:flex-none text-center bg-white border-2 border-gray-200 text-gray-700 px-8 py-3.5 rounded-2xl font-black hover:bg-gray-50 transition-all"
                        >
                            Print Trip
                        </button>
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="space-y-16">
                {sortedDays.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[2rem] shadow-sm border-2 border-dashed border-gray-200">
                        <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MapPin size={32} className="text-primary-500" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Your timeline is empty</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
                            Start exploring {trip.city_name} and add some amazing places to your daily schedule!
                        </p>
                        <Link to={`/cities/${trip.city_id}`} className="inline-flex items-center bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all">
                            Browse Places
                        </Link>
                    </div>
                ) : (
                    sortedDays.map((day) => (
                        <div key={day} className="relative">
                            {/* Day Header */}
                            <div className="flex items-center mb-10 sticky top-4 z-20">
                                <div className="bg-primary-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl shadow-primary-200 border-4 border-white">
                                    {day}
                                </div>
                                <div className="ml-6 flex flex-col">
                                    <h2 className="text-3xl font-black text-gray-900 leading-none">Day {day}</h2>
                                    <span className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">Adventure Schedule</span>
                                </div>
                                <div className="flex-1 border-b-2 border-gray-100 ml-8"></div>
                            </div>

                            {/* Timeline Line */}
                            <div className="ml-7 border-l-4 border-dashed border-primary-100 pl-12 space-y-8 pb-4 relative">
                                {itemsByDay[day].map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="relative group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 p-6 lg:p-8 transition-all duration-300 transform hover:-translate-y-1 animate-in fade-in slide-in-from-left-4"
                                        style={{ animationDelay: `${index * 150}ms` }}
                                    >
                                        {/* Timeline Dot */}
                                        <div className="absolute -left-[54px] top-1/2 -translate-y-1/2 bg-white border-4 border-primary-500 w-6 h-6 rounded-full z-10 shadow-sm transition-transform group-hover:scale-125"></div>

                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-xl text-xs font-black">
                                                        {item.category_name}
                                                    </span>
                                                </div>

                                                <h3 className="text-2xl font-black text-gray-900 mb-1 flex items-center gap-2">
                                                    {item.place_name}
                                                </h3>

                                                {item.time_slot && (
                                                    <div className="flex items-start gap-1.5 text-primary-600 mb-4 font-bold text-sm">
                                                        <Edit3 size={14} className="mt-0.5 flex-shrink-0" />
                                                        <p className="italic leading-tight">Note: {item.time_slot}</p>
                                                    </div>
                                                )}

                                                <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">
                                                    {item.place_description}
                                                </p>
                                            </div>

                                            <div className="flex items-center md:items-start">
                                                <button onClick={() => handleDeletePlace(item.id)} className="bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 p-3 rounded-2xl transition-all duration-200">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Missing import fix
const Trash2 = ({ size }: { size: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9v-4m4 4v-4" />
    </svg>
);

export default TripTimeline;
