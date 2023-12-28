import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import {AiOutlineSmile} from 'react-icons/ai';

const UsersTable = ({ users }) => {
    if (users.length === 0) {
        return <p>No users found.</p>;
    }

    return (
        <table className="min-w-full leading-normal mt-4">
            <thead>
                <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Username
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                    </th>
                    {/* Add other columns as needed */}
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.usertokenid}>
                        <td className="px-5 py-5 border-b border-gray-900 bg-gray-800 text-sm">
                            {user.username}
                        </td>
                        <td className="px-5 py-5 border-b border-gray-900 bg-gray-800 text-sm">
                            {user.email}
                        </td>
                        {/* Add other user details as needed */}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


const ModelsTable = ({ models }) => {
    if (models.length === 0) {
        return <p>No models found.</p>;
    }

    return (
        <table className="min-w-full leading-normal mt-4">
            <thead>
                <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Model Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Modality
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 bg-gray-800 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                    </th>
                </tr>
            </thead>
            <tbody>
                {models.map(model => (
                    <tr key={model.modeltokenid}>
                        <td className="px-5 py-5 border-b border-b border-gray-900 bg-gray-800 text-sm">
                            {model.modelname}
                        </td>
                        <td className="px-5 py-5 border-b border-b border-gray-900 bg-gray-800 text-sm">
                            {model.modeldescription}
                        </td>
                        <td className="px-5 py-5 border-b border-b border-gray-900 bg-gray-800 text-sm">
                            {model.modelmodality}
                        </td>
                        <td className="px-5 py-5 border-b border-b border-gray-900 bg-gray-800 text-sm">
                            {model.modeltype}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        const fetchUsersAndModels = async () => {
            try {
                const [usersResponse, modelsResponse] = await Promise.all([
                    axios.get('https://modelhub-backend.vercel.app/getallusers'),
                    axios.get('https://modelhub-backend.vercel.app/getallmodels'),
                ]);
                setUsers(usersResponse.data);
                setModels(modelsResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchUsersAndModels();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    if (user === null || user.role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <AiOutlineSmile className="mx-auto text-6xl text-yellow-500"/>
                    <p className="text-xl font-semibold mt-4">Seems like you're in a "model" of confusion. Admins only! 😕</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-100">Admin Dashboard</h1>
            <p className="text-gray-400 italic">Welcome, master of the user-verse!</p>
            <section>
                <h2 className="text-2xl bg-gray-900 font-semibold text-white p-2">Users</h2>
                <p className="text-gray-300">Where every user is a star in your galaxy.</p>
                <UsersTable users={users} />
            </section>
            <section className="mt-8">
                <h2 className="text-2xl font-semibold p-2">Models</h2>
                <p className="text-gray-300">The runway of your data realm. Strut your stuff!</p>
                <ModelsTable models={models} />
            </section>
        </div>
    );
    
};

export default AdminPage;
