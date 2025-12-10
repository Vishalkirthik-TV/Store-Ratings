import React from 'react';

function StoresTable({ stores, filters, sortConfig, onFilterChange, onSort }) {
    return (
        <div>
            <div className="flex gap-4 mb-6 flex-wrap">
                <input
                    type="text"
                    name="name"
                    placeholder="Filter by name"
                    value={filters.name}
                    onChange={onFilterChange}
                    className="flex-1 min-w-[150px] p-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Filter by address"
                    value={filters.address}
                    onChange={onFilterChange}
                    className="flex-1 min-w-[150px] p-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                />
            </div>

            <div className="overflow-x-auto mt-6">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
                        <tr>
                            <th
                                onClick={() => onSort('name')}
                                className="p-4 text-left font-semibold cursor-pointer select-none transition-colors hover:bg-white/10"
                            >
                                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => onSort('email')}
                                className="p-4 text-left font-semibold cursor-pointer select-none transition-colors hover:bg-white/10"
                            >
                                Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => onSort('address')}
                                className="p-4 text-left font-semibold cursor-pointer select-none transition-colors hover:bg-white/10"
                            >
                                Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => onSort('rating')}
                                className="p-4 text-left font-semibold cursor-pointer select-none transition-colors hover:bg-white/10"
                            >
                                Rating {sortConfig.key === 'rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map(store => (
                            <tr key={store.id} className="border-b border-gray-200 transition-colors hover:bg-gray-50">
                                <td className="p-4 text-gray-800">{store.name}</td>
                                <td className="p-4 text-gray-800">{store.email}</td>
                                <td className="p-4 text-gray-800">{store.address}</td>
                                <td className="p-4 text-gray-800">{parseFloat(store.rating).toFixed(1)} ⭐</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StoresTable;
