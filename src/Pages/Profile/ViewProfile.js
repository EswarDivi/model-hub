import React, { useEffect } from 'react';
import Navbar from '../HomePage/Navbar';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

const UserProfileDetails = ({ user }) => {
    const renderDetail = (label, value) => (
        <div className="mb-4">
            <label className="block font-semibold">{label}:</label>
            <input
                type="text"
                value={value}
                disabled
                className="w-full border p-2 bg-gray-800 text-gray-300 rounded opacity-75 cursor-not-allowed"
            />
        </div>
    );

    return user ? (
        <div>
            {renderDetail('Username', user.username)}
            {renderDetail('Email', user.email)}
            {renderDetail('Token ID', user.usertokenid)}
            {renderDetail('Role', user.role)}
        </div>
    ) : (
        <p>User details not available</p>
    );
};
const ViewProfile = () => {
    const { user } = useAuth();
    return (
        <div className="ViewProfile bg-gray-900 min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold text-white text-center  mb-16">User Profile</h1>
                <div className="user-details max-w-md mx-auto bg-gray-900 p-4 rounded shadow-lg">
                    <UserProfileDetails user={user} />
                    <div className="mt-10 text-center">
                        <Link to="/EditProfile">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded">
                                Edit Profile
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;
