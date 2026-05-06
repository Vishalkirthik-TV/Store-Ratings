import React from 'react';

function StoreInfoCard({ storeData }) {
    const renderStars = (rating) => {
        return '⭐'.repeat(rating);
    };

    return (
        <div className="bg-white rounded-lg p-8 shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">My Store Information</h3>
            <div className="mt-5">
                <p className="mb-4"><strong>Store Name:</strong> {storeData.name}</p>
                <p className="mb-4"><strong>Email:</strong> {storeData.email}</p>
                <p className="mb-4"><strong>Address:</strong> {storeData.address}</p>
                <div className="flex items-center gap-2 my-4">
                    <strong>Average Rating:</strong>
                    <span className="text-xl">
                        {storeData.rating > 0 ? renderStars(Math.round(storeData.rating)) : 'No ratings yet'}
                    </span>
                    {storeData.rating > 0 && (
                        <span className="text-gray-600">
                            ({parseFloat(storeData.rating).toFixed(2)})
                        </span>
                    )}
                </div>
                <p><strong>Total Ratings:</strong> {storeData.rating_count}</p>
            </div>
        </div>
    );
}

export default StoreInfoCard;
