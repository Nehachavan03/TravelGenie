import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Clock, MapPin, Map as MapIcon, CalendarDays, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

interface ItineraryItem {
    id: string;
    day_number: number;
    time_slot: string;
    place_name: string;
    place_description: string;
    category_name: string;
}

interface TripDetails {
    id: string;
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
                    city_name: 'Paris',
                    start_date: '2026-06-15',
                    end_date: '2026-06-22',
                    budget: 'Medium',
                    items: [
                        { id: 'i1', day_number: 1, time_slot: '09:00 AM', place_name: 'Eiffel Tower', category_name: 'Historical', place_description: 'Visit the landmark tower early morning.' },
                        { id: 'i2', day_number: 1, time_slot: '01:00 PM', place_name: 'Le Jules Verne', category_name: 'Dining', place_description: 'Lunch at the second floor of Eiffel Tower.' },
                        { id: 'i3', day_number: 1, time_slot: '03:30 PM', place_name: 'Seine River Cruise', category_name: 'Experience', place_description: 'Afternoon boat tour.' },
                        { id: 'i4', day_number: 2, time_slot: '10:00 AM', place_name: 'Louvre Museum', category_name: 'Museum', place_description: 'Explore the world\'s largest art museum.' },
                        { id: 'i5', day_number: 2, time_slot: '04:00 PM', place_name: 'Notre-Dame Cathedral', category_name: 'Historical', place_description: 'Walk around the iconic cathedral.' },
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
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-8">
                    <div className="h-10 bg-gray-200 w-1/3 rounded"></div>
                    <div className="h-40 bg-gray-200 rounded-2xl w-full"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl w-full"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    if (!trip) return <div className="text-center p-12">Trip not found</div>;

    // Group items by day
    const itemsByDay = trip.items.reduce((acc, item) => {
        if (!acc[item.day_number]) acc[item.day_number] = [];
        acc[item.day_number].push(item);
        return acc;
    }, {} as Record<number, ItineraryItem[]>);

    // Sort days
    const sortedDays = Object.keys(itemsByDay).map(Number).sort((a, b) => a - b);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/dashboard" className="flex items-center text-primary-600 hover:text-primary-800 font-medium mb-8 transition-colors">
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10 text-center md:text-left md:flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-4 -translate-y-4 shadow-sm pointer-events-none">
                    <MapIcon size={120} />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Trip to {trip.city_name}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600 font-medium mt-4">
                        <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <CalendarDays size={18} className="text-primary-500" />
                            {new Date(trip.start_date).toLocaleDateString()} &mdash; {new Date(trip.end_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <span className="text-primary-500 font-bold">$</span>
                            {trip.budget} Budget
                        </span>
                    </div>
                </div>
                <div className="mt-6 md:mt-0 relative z-10 flex gap-3 justify-center">
                    <Link to={`/cities/${trip.city_name}`} className="bg-white border-2 border-primary-500 text-primary-600 px-5 py-2.5 rounded-lg font-medium hover:bg-primary-50 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Add Places
                    </Link>
                </div>
            </div>

            <div className="space-y-12">
                {sortedDays.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No activities planned yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            You haven't added any places to your itinerary. Start exploring places in {trip.city_name} to build your timeline!
                        </p>
                    </div>
                ) : (
                    sortedDays.map((day) => (
                        <div key={day} className="relative">
                            <div className="flex items-center mb-6">
                                <div className="bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm z-10">
                                    {day}
                                </div>
                                <h2 className="text-2xl font-bold ml-4 text-gray-900">Day {day}</h2>
                                <div className="flex-1 border-b-2 border-gray-100 ml-6"></div>
                            </div>

                            <div className="ml-5 border-l-2 border-gray-100 pl-8 space-y-6 pb-6 mt-[-1rem] pt-6 pr-2">
                                {itemsByDay[day].sort((a, b) => a.time_slot.localeCompare(b.time_slot)).map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow relative group slide-in-from-bottom-2 animate-in fade-in duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="absolute -left-[45px] top-6 bg-white border-2 border-primary-500 w-5 h-5 rounded-full z-10"></div>

                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-primary-600">
                                                    <Clock size={16} />
                                                    {item.time_slot}
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                    <MapPin size={18} className="text-gray-400" />
                                                    {item.place_name}
                                                </h3>
                                                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {item.category_name}
                                                </span>
                                                <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                                                    {item.place_description}
                                                </p>
                                            </div>
                                            <button className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                                <MoreVertical size={20} />
                                            </button>
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

export default TripTimeline;
