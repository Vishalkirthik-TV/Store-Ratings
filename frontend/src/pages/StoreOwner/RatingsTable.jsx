import React from 'react';

function RatingsTable({ ratings }) {
    const renderStars = (rating) => {
        return '⭐'.repeat(rating);
    };

    return (
        <div className="bg-white rounded-lg p-8 shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Customer Ratings</h3>
            {ratings.length > 0 ? (
                <div className="overflow-x-auto mt-6">
                    <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
                            <tr>
                                <th className="p-4 text-left font-semibold">Customer Name</th>
                                <th className="p-4 text-left font-semibold">Customer Email</th>
                                <th className="p-4 text-left font-semibold">Rating</th>
                                <th className="p-4 text-left font-semibold">Submitted On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings.map(rating => (
                                <tr key={rating.id} className="border-b border-gray-200 transition-colors hover:bg-gray-50">
                                    <td className="p-4 text-gray-800">{rating.user_name}</td>
                                    <td className="p-4 text-gray-800">{rating.user_email}</td>
                                    <td className="p-4 text-gray-800">{renderStars(rating.rating)} ({rating.rating}/5)</td>
                                    <td className="p-4 text-gray-800">{new Date(rating.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-600 mt-5">
                    No ratings submitted yet
                </p>
            )}
        </div>
    );
}

export default RatingsTable;
