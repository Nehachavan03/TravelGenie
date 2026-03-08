import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Star } from 'lucide-react';

interface Review {
    id: string;
    user_name: string;
    place_id: string;
    rating: number;
    comment: string;
    created_at: string;
}

interface ReviewSectionProps {
    placeId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ placeId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/reviews/${placeId}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                // Mock fallback data for UI representation
                setReviews([
                    {
                        id: 'r1',
                        user_name: 'Alice Johnson',
                        place_id: placeId,
                        rating: 5,
                        comment: 'Absolutely breathtaking! The views were incredible and the experience was once in a lifetime. Highly recommend going early to beat the crowds.',
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 'r2',
                        user_name: 'Mark Davis',
                        place_id: placeId,
                        rating: 4,
                        comment: 'Great spot but a bit crowded. Make sure you book tickets in advance.',
                        created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [placeId]);

    return (
        <div className="bg-gray-50 rounded-2xl p-6 mt-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="fill-yellow-400 text-yellow-400 h-6 w-6" />
                Traveler Reviews
            </h3>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse flex gap-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <p className="text-gray-500 italic">No reviews yet for this place. Be the first to leave one!</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                                        {review.user_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{review.user_name}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i < review.rating ? 'fill-current' : 'text-gray-300'}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                "{review.comment}"
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
