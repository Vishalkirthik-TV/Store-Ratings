import React from 'react';

function StatisticsCards({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-8 rounded-lg text-center shadow-md">
                <h3 className="text-sm mb-2 opacity-90 font-medium">Total Users</h3>
                <p className="text-4xl font-bold m-0">{stats.totalUsers}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-8 rounded-lg text-center shadow-md">
                <h3 className="text-sm mb-2 opacity-90 font-medium">Total Stores</h3>
                <p className="text-4xl font-bold m-0">{stats.totalStores}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-8 rounded-lg text-center shadow-md">
                <h3 className="text-sm mb-2 opacity-90 font-medium">Total Ratings</h3>
                <p className="text-4xl font-bold m-0">{stats.totalRatings}</p>
            </div>
        </div>
    );
}

export default StatisticsCards;
