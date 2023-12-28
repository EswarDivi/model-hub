import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from '../AuthContext';
import ModelUploadForm from "./uploadModel";
import Navbar from "../HomePage/Navbar";

const Viewmodels = () => {
    const { user } = useAuth();
    const [models, setModels] = useState([]);

    const getUserModels = async () => {
        try {
            const username = user.username;
            const response = await axios.get(`https://modelhub-backend.vercel.app/getmodels/${username}`);
            setModels(response.data);
        } catch (error) {
            console.error('Error getting user models:', error);
        }
    };

    const refreshModels = () => {
        getUserModels();
    };

    useEffect(() => {
        getUserModels();
    }, []);

    if (!user) {
        return (
            <div className="Viewmodels">
                <Navbar />
                <div className="flex flex-col md:flex-row bg-gray-900 text-white p-8">
                    <div className="flex-grow">
                        <div className="text-center p-6">
                            <p className="text-3xl font-bold mb-6">Login to Use this Page</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="Viewmodels">
            <Navbar />
            <div className="flex flex-col md:flex-row bg-gray-900 text-white p-8">
                <div className="flex-grow">
                    <div className="p-4">
                        <div className="flex flex-col gap-4">
                            {models && models.length > 0 ? (
                                models.map((model, index) => (

                                    <div key={index} className="bg-gray-700 rounded-lg shadow-md overflow-hidden p-6 mb-4">
                                        <a href={`model/${model.modeltokenid}`}>
                                            <h2 className="text-lg font-semibold mb-2">{model.modelname}</h2>
                                        </a>
                                        <p className="text-gray-100 text-sm mb-4">{model.modeldescription}</p>
                                        <p className="text-gray-100 text-xs mb-1">Model Type: <span className="text-gray-100 font-medium">{model.modeltype}</span></p>
                                        <p className="text-gray-100 text-xs mb-1">Model Token ID: <span className="text-gray-100 font-medium">{model.modeltokenid}</span></p>
                                        <p className="text-gray-100 text-xs">Model Modality: <span className="text-gray-100 font-medium">{model.modelmodality}</span></p>
                                        <a href={model.s3_url} className="text-blue-500 hover:text-blue-400 text-xs">Download Model</a>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-6">
                                    {
                                        user.role !== 'researcher' ? (
                                            <p className="text-3xl font-bold mb-6">No models found, please upload.</p>
                                        ) : (
                                            <p className="text-3xl font-bold mb-6">No models found, please contact admin.</p>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {user.role !== 'researcher' && (
                    <div className="mt-4 md:mt-0 md:w-1/2">
                        <ModelUploadForm onUploadSuccess={refreshModels} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Viewmodels;
