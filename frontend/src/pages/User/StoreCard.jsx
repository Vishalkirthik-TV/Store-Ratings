import React from 'react';

function StoreCard({ store, myRating, onRatingChange }) {
    const renderStars = (rating) => {
        return '⭐'.repeat(Math.round(rating));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-purple-600 font-semibold mb-4">{store.name}</h3>
            <p className="mb-4"><strong>Address:</strong> {store.address}</p>
            <div className="flex items-center gap-2 my-4">
                <strong>Overall Rating:</strong>
                <span className="text-xl">
                    {store.rating > 0 ? renderStars(store.rating) : 'No ratings yet'}
                </span>
                {store.rating > 0 && (
                    <span className="text-gray-600">
                        ({parseFloat(store.rating).toFixed(1)})
                    </span>
                )}
            </div>
            {myRating && (
                <p className="text-purple-600 font-bold">
                    Your Rating: {myRating} ⭐
                </p>
            )}
            <div className="flex items-center gap-4 mt-4">
                <select
                    defaultValue={myRating || ''}
                    onChange={(e) => onRatingChange(store.id, parseInt(e.target.value))}
                    className="py-2 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                >
                    <option value="">Select Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </select>
                <span className="text-sm text-gray-600">
                    {myRating ? 'Update your rating' : 'Rate this store'}
                </span>
            </div>
        </div>
    );
}

export default StoreCard;
