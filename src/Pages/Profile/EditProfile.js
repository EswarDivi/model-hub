import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Navbar from '../HomePage/Navbar';

const EditProfile = () => {
    const { user, setUser } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://modelhub-backend.vercel.app/EditProfile", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usertokenid: user.usertokenid,
                    newPassword: newPassword,
                    newRole: newRole,
                }),
            });

            const data = await response.json();
            console.log(data);

            if (data.status === 'success') {
                setUser(data.user); // Update user in context
                navigate('/ViewProfile'); // Redirect to the profile page
                alert('Profile updated successfully');
            } else {
                console.error('Profile update failed:', data.message);
                alert('Profile update failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    };

    return (
        <div className="EditProfile bg-gray-900 min-h-screen">
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold text-white text-center  mb-16">Edit Profile</h1>
                <form onSubmit={handleUpdate} className="max-w-md mx-auto bg-gray-800 p-4 rounded shadow-lg">
                    <div className="mb-4">
                        <label className="block font-semibold text-white mb-2">Username:</label>
                        <input
                            type="text"
                            value={user?.username}
                            disabled
                            className="w-full border p-2 bg-gray-800 text-gray-300 rounded opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-semibold text-white mb-2">Email:</label>
                        <input
                            type="text"
                            value={user?.email}
                            disabled
                            className="w-full border p-2 bg-gray-800 text-gray-300 rounded opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-semibold text-white mb-2">New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full border p-2 bg-gray-900 text-white rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-semibold text-white mb-2">Role:</label>
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            required
                            className="w-full border p-2 bg-gray-900 text-white rounded"
                        >
                            <option value="">Select Role</option>
                            <option value="Researcher">Researcher</option>
                            <option value="Developer">Developer</option>
                        </select>
                        <div className="mt-10 text-center">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline">
                                Update Profile
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditProfile;
