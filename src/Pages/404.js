import React from 'react';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-700">404</h1>
                <p className="text-2xl text-gray-100">Oops! This page is lost in space.</p>
                <p className="mt-4 text-gray-200">The page you are looking for might have been abducted by aliens.</p>
            </div>
        </div>
    );
}

export default NotFound;