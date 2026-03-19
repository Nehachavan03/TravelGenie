import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Clock, Calendar } from 'lucide-react';
import api from '../services/api';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    plan?: Array<{
        day: number;
        title: string;
        description: string;
        places: Array<{ time: string; name: string }>;
    }>;
}

const ChatOverlay: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'm1',
            role: 'assistant',
            content: "Hi! I'm VoyageAI, your personal travel assistant. Please ask questions like how to use the app or plan a 1 day trip!"
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const quickQuestions = [
        "How to login?",
        "How to use the app?",
        "How to use the features?",
        "Plan a 1 day trip"
    ];

    const handleQuickQuestion = (q: string) => {
        setInput(q);
        // We can optionally submit immediately
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await api.post('/chatbot', { message: userMsg.content });

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data.message || 'Here is a suggested plan based on your request!',
                plan: response.data.plan // If backend returns structured plan
            };

            setMessages(prev => [...prev, assistantMsg]);
        } catch (error) {
            console.error('Chat error:', error);

            // Fallback Mock AI Response for demonstration
            setTimeout(() => {
                const mockResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "Based on your interests, I've created a 2-day itinerary for you!",
                    plan: [
                        {
                            day: 1,
                            title: "Classic City Highlights",
                            description: "Explore the most iconic landmarks and get a feel for the city's rich history.",
                            places: [
                                { time: '09:00 AM', name: 'Historic City Center' },
                                { time: '01:00 PM', name: 'Local Gastronomy Market' },
                                { time: '04:00 PM', name: 'Sunset Viewpoint' }
                            ]
                        },
                        {
                            day: 2,
                            title: "Art & Culture",
                            description: "Immerse yourself in world-class museums and local neighborhoods.",
                            places: [
                                { time: '10:00 AM', name: 'National Arts Museum' },
                                { time: '02:30 PM', name: 'Bohemian Quarter Walk' }
                            ]
                        }
                    ]
                };
                setMessages(prev => [...prev, mockResponse]);
                setIsTyping(false);
            }, 1500);

        } finally {
            setIsTyping(false);
        }
    };

    // Actually, I'll just rely on the setTimeout setting isTyping(false) in the catch block.

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-2xl hover:bg-primary-700 transition-all transform hover:scale-110 z-50 flex items-center justify-center animate-bounce group"
                    aria-label="Open AI Assistant"
                >
                    <Sparkles className="absolute top-1 right-1 h-3 w-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <MessageSquare size={26} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-primary-600 text-white px-5 py-4 flex justify-between items-center shadow-md z-10">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-wide">AI Travel Guide</h3>
                                <p className="text-xs text-primary-100 opacity-90">Always online to help you plan</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-primary-100 hover:text-white p-1 rounded-md hover:bg-primary-500/50 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0
                  ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-primary-100 text-primary-700'}`}
                                >
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>

                                <div className={`flex flex-col max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm
                      ${msg.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}
                                    >
                                        {msg.content}
                                    </div>

                                    {/* AI Plan Rendering (Vertical Timeline) */}
                                    {msg.plan && msg.plan.length > 0 && (
                                        <div className="mt-3 w-[280px] bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden text-left">
                                            <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                                                <Calendar size={14} className="text-primary-500" /> Suggested Itinerary
                                            </div>
                                            <div className="p-4 space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar">
                                                {msg.plan.map((dayPlan, idx) => (
                                                    <div key={idx} className="relative">
                                                        <h4 className="font-bold text-sm text-primary-700 mb-1">Day {dayPlan.day}: {dayPlan.title}</h4>
                                                        <p className="text-xs text-gray-500 mb-2 italic line-clamp-2">{dayPlan.description}</p>

                                                        <div className="ml-2 border-l-2 border-primary-100 pl-3 space-y-2 mt-2">
                                                            {dayPlan.places.map((place, i) => (
                                                                <div key={i} className="relative">
                                                                    <div className="absolute -left-[17px] top-1.5 bg-white border-2 border-primary-400 w-2.5 h-2.5 rounded-full"></div>
                                                                    <div className="flex items-start gap-1.5">
                                                                        <Clock size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                                        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{place.time}</span>
                                                                    </div>
                                                                    <div className="text-sm font-medium text-gray-800 ml-[18px]">
                                                                        {place.name}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3 flex-row">
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shadow-sm">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {!isTyping && messages.length < 3 && (
                        <div className="px-5 py-2 flex flex-wrap gap-2 bg-slate-50">
                            {quickQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleQuickQuestion(q)}
                                    className="text-[10px] font-bold bg-white border border-primary-200 text-primary-700 px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors shadow-sm"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full padding px-2 py-1.5 focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400 transition-all"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask for an itinerary (e.g., 3 days in Paris)"
                                className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 text-gray-700 placeholder-gray-400"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 flex-shrink-0"
                            >
                                <Send size={16} className="ml-0.5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatOverlay;
