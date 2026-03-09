import React, { useState } from 'react';
import api from '../services/api';
import { Sparkles, Send, Calendar, MapPin, Wallet, Coffee, Plane, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SmartPlanner: React.FC = () => {
    const [city, setCity] = useState('');
    const [days, setDays] = useState('3');
    const [budget, setBudget] = useState('Medium');
    const [interests, setInterests] = useState<string[]>([]);
    const [itinerary, setItinerary] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const interestOptions = ['History', 'Food', 'Nature', 'Shopping', 'Adventure', 'Nightlife', 'Art', 'Family Fun'];

    const toggleInterest = (interest: string) => {
        if (interests.includes(interest)) {
            setInterests(interests.filter(i => i !== interest));
        } else {
            setInterests([...interests, interest]);
        }
    };

    const handlePlanTrip = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city || interests.length === 0) {
            toast.error('Please enter a city and select at least one interest');
            return;
        }

        setIsLoading(true);
        setItinerary(null);

        try {
            const response = await api.post('/ai/plan', {
                city,
                days,
                budget,
                interests
            });
            setItinerary(response.data.itinerary);
            toast.success('AI Itinerary generated!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate itinerary. Using fallback data.');
            setItinerary(`Day 1: Arrival in ${city}. Morning coffee at a local cafe. Visit the historic city center and enjoy a traditional lunch. Evening walk by the river.\n\nDay 2: Full day exploring local museums and art galleries. Optional shopping at the main district.\n\nDay 3: Nature day! Visit the botanical gardens or a nearby park. Farewell dinner at a top-rated restaurant.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 text-primary-600 rounded-2xl mb-4 animate-pulse">
                    <Sparkles size={32} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                    AI Smart <span className="text-primary-600">Planner</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
                    Let our intelligent assistant design the perfect day-by-day schedule for your next adventure.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Input Form */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10 sticky top-8">
                        <form onSubmit={handlePlanTrip} className="space-y-6">
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                                    Where are you going?
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <MapPin size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="e.g. Paris, Tokyo, Mumbai"
                                        className="w-full rounded-2xl border-gray-200 border pl-12 pr-4 py-4 text-gray-900 font-bold focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                                        Duration
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <Calendar size={18} />
                                        </div>
                                        <select
                                            value={days}
                                            onChange={(e) => setDays(e.target.value)}
                                            className="w-full rounded-2xl border-gray-200 border pl-12 pr-4 py-4 text-gray-900 font-bold focus:ring-2 focus:ring-primary-500 bg-gray-50"
                                        >
                                            {[1, 2, 3, 4, 5, 7, 10].map(d => (
                                                <option key={d} value={d}>{d} {d === 1 ? 'Day' : 'Days'}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                                        Budget
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <Wallet size={18} />
                                        </div>
                                        <select
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                            className="w-full rounded-2xl border-gray-200 border pl-12 pr-4 py-4 text-gray-900 font-bold focus:ring-2 focus:ring-primary-500 bg-gray-50"
                                        >
                                            <option value="Low">Economic</option>
                                            <option value="Medium">Standard</option>
                                            <option value="High">Luxury</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-wider">
                                    What do you love?
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {interestOptions.map(interest => (
                                        <button
                                            key={interest}
                                            type="button"
                                            onClick={() => toggleInterest(interest)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                                interests.includes(interest)
                                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 px-6 border border-transparent shadow-xl shadow-primary-200 text-lg font-black rounded-2xl text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Generating Magic...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Plan My Trip
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Output Area */}
                <div className="lg:col-span-7">
                    {!itinerary && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-200">
                            <Plane size={64} className="text-gray-300 mb-6" />
                            <h3 className="text-2xl font-black text-gray-400">Ready to Generate</h3>
                            <p className="text-gray-400 font-medium mt-2">Fill in your preferences and watch the AI work its magic.</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center space-y-6 p-12 bg-white rounded-[2.5rem] shadow-xl border border-gray-100">
                            <div className="relative">
                                <div className="w-24 h-24 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-primary-600">
                                    <Sparkles size={32} />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-black text-gray-900">Consulting Local Experts...</h3>
                                <p className="text-gray-500 font-medium mt-2">Searching for the best hidden gems and top-rated spots.</p>
                            </div>
                        </div>
                    )}

                    {itinerary && (
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="bg-primary-600 p-8 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black">Your Personalized Plan</h3>
                                    <p className="text-primary-100 font-bold">{city} &bull; {days} Days</p>
                                </div>
                                <button 
                                    onClick={() => window.print()}
                                    className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <div className="p-8 md:p-10">
                                <div className="prose prose-primary max-w-none">
                                    {itinerary.split('\n').map((line, i) => (
                                        <p key={i} className={`mb-4 text-gray-700 leading-relaxed font-medium ${line.startsWith('Day') ? 'text-xl font-black text-gray-900 mt-8 first:mt-0' : ''}`}>
                                            {line}
                                        </p>
                                    ))}
                                </div>
                                
                                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-3 text-gray-500 font-bold">
                                        <Coffee size={20} />
                                        <span>Enjoy your trip!</span>
                                    </div>
                                    <button 
                                        onClick={() => setItinerary(null)}
                                        className="text-primary-600 font-black hover:text-primary-700"
                                    >
                                        Start Over
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartPlanner;
