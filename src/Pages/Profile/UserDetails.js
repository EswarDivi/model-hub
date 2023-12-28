import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../HomePage/Navbar';

const UserDetails = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [models, setModels] = useState([]);
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`https://modelhub-backend.vercel.app/getuserdetails/${username}`);
                setUser(response.data);

            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [username]);

    useEffect(() => {

        const fetchUserModels = async () => {
            try {
                const response = await axios.get(`https://modelhub-backend.vercel.app/getmodels/${username}`);
                setModels(response.data);
            } catch (error) {
                console.error('Error fetching models:', error);
            }
        };

        fetchUserModels();
    }, [username]);

    return (

        <div>

            <Navbar />
            <div className="container mx-auto p-4 flex flex-wrap md:flex-nowrap">
                {/* Profile Section */}
                <div className="w-full md:w-1/4 p-4 flex flex-col items-center">
                    {user && (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full text-center p-4">
                            <img
                                src={user?.profilepic}
                                alt="Profile"
                                className="w-32 h-32 rounded-full mx-auto"
                            />
                            <h1 className="text-xl font-semibold mt-4">{user.username}</h1>
                            <p className="text-gray-600">{user.email}</p>
                        </div>
                    )}
                </div>

                {/* Models Section */}
                <div className="w-full md:w-3/4 p-4">
                    {models && models.length > 0 ? (
                        models.map((model, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 rounded-lg shadow-md overflow-hidden mb-4"
                            >
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold mb-2 text-white">
                                        {model.modelname}
                                    </h2>
                                    <p className="text-gray-300 text-sm mb-4">
                                        {model.modeldescription}
                                    </p>
                                    <p className="text-gray-300 text-xs">
                                        Model Type:{" "}
                                        <span className="text-gray-200 font-medium">
                                            {model.modeltype}
                                        </span>
                                    </p>
                                    <p className="text-gray-300 text-xs">
                                        Model Token ID:{" "}
                                        <span className="text-gray-200 font-medium">
                                            {model.modeltokenid}
                                        </span>
                                    </p>
                                    <p className="text-gray-300 text-xs mb-2">
                                        Model Modality:{" "}
                                        <span className="text-gray-200 font-medium">
                                            {model.modelmodality}
                                        </span>
                                    </p>
                                    <a
                                        href={model.s3_url}
                                        className="text-blue-500 hover:text-blue-400 text-xs"
                                    >
                                        Download Model
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-6">
                            <p className="text-3xl font-bold mb-6 text-white">
                                No models found
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default UserDetails;
