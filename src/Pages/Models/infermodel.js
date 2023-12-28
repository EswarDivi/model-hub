import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../HomePage/Navbar';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../AuthContext';
import { DiscussionEmbed } from "disqus-react"

const Infermodel = () => {
    const { user } = useAuth();
    const { modeltokenid } = useParams();
    const [modelData, setModelData] = useState(null);
    const [textInput, setTextInput] = useState('Input text here...');
    const [output, setOutput] = useState(null);
    const [error, setError] = useState('');
    const [isRunning, setisRunning] = useState(false);


    const fileInputRef = useRef(null);
    const backendURL = process.env.REACT_APP_MODAL_ENDPOINT;
    useEffect(() => {
        const fetchModelData = async () => {
            try {
                const response = await axios.get(`https://modelhub-backend.vercel.app/getmodeldetails/${modeltokenid}`);
                setModelData(response.data);
            } catch (error) {
                setError('Failed to fetch model data');
                console.error('Failed to fetch model data:', error);
            }
        };

        fetchModelData();
    }, [modeltokenid]);

    const uploadToS3 = async (file) => {
        try {
            const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
            const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
            const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME;
            const region = process.env.REACT_APP_AWS_BUCKET_REGION;
    
            const uniqueId = uuidv4();
            const fileExtension = file.name.split('.').pop();
            const newFileName = `${uniqueId}.${fileExtension}`;

            AWS.config.update({
                accessKeyId,
                secretAccessKey,
                region,
            });

            const params = {
                Bucket: bucketName,
                Key: newFileName,
                Body: file
            };

            const s3 = new AWS.S3();
            const result = await s3.upload(params).promise();

            console.log('File uploaded successfully');
            return result.Location;
        } catch (err) {
            console.error('Error uploading file:', err);
            throw err;
        }
    };

    const handleInference = async () => {
        if (!user) {
            alert('Please login to run inference');
            return;
        }
        setisRunning(true);
        let fileURL;
        if (modelData?.modelmodality === 'image' || modelData?.modelmodality === 'audio') {
            const file = fileInputRef.current.files[0];
            if (!file) {
                console.error('No file selected');
                return;
            }
            try {
                fileURL = await uploadToS3(file);
            } catch (error) {
                console.error('Error uploading file:', error);
                setOutput('Error');
                setisRunning(false);
                return;
            }
        }
        try {
            const response = await axios.get(`${backendURL}/?modelconfig=${modelData?.s3_url}&inputs=${fileURL || textInput}&modality=${modelData?.modelmodality}&task=${modelData?.modeltype}`);
            setOutput(response.data[0]);
        } catch (error) {
            console.error('Error during inference:', error);
            setOutput('Error during inference');
        }
        setisRunning(false);
    };

    const renderInputField = () => {
        switch (modelData?.modelmodality) {
            case 'text':
                return (
                    <textarea
                        className="w-full h-32 p-2 text-black"
                        placeholder="Type your input here..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                    />
                );
            case 'image':
            case 'audio':
                return (
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={modelData.modelmodality === 'image' ? 'image/*' : 'audio/*'}
                        onChange={(e) => fileInputRef.current = e.target}
                    />
                );
            default:
                return <p>Unsupported modality</p>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 text-white">
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="flex flex-col items-center">
                    <div className="bg-gray-700 p-6 rounded-lg shadow-lg m-4 w-full max-w-4xl">
                        <h1 className="text-2xl font-bold mb-4">About Model</h1>
                        <p>
                            <span className="font-bold">Model Name:</span> {modelData?.modelname}
                        </p>
                        <p>
                            <span className="font-bold">Model Type:</span> {modelData?.modeltype}
                        </p>
                        <p>
                            <span className="font-bold">Model Modality:</span> {modelData?.modelmodality}
                        </p>
                        <p>
                            <span className="font-bold">Model Description:</span> {modelData?.modeldescription}
                        </p>
                        <p>
                            <span className="font-bold">Uploaded by:</span> {modelData?.username}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 m-4 w-full max-w-4xl">
                        <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full sm:flex-1 min-w-0">
                            <h2 className="text-xl font-bold mb-4">Input</h2>
                            {renderInputField()}
                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={handleInference}
                                    disabled={isRunning}
                                >
                                    {isRunning ? 'Working...' : 'Run Inference'}
                                </button>
                            </div>
                        </div>

                        {/* Output */}
                        <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full sm:flex-1 min-w-0">
                            <h2 className="text-xl font-bold mb-4">Output</h2>
                            <div className="w-full h-32 bg-white text-black p-2 rounded">
                                <pre className="text-green-500 bg-gray-800 p-2 rounded overflow-x-scroll">
                                    {JSON.stringify(output || error || "Output Comes Here", null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-700 p-6 rounded-lg shadow-lg m-4 w-full max-w-4xl">
                        <h1 className="text-2xl font-bold mb-4">Comments</h1>
                        <DiscussionEmbed
                            shortname="hubmodel"

                            config={
                                {
                                    url: `https://modelhub.vercel.app/model/${modeltokenid}`,
                                    identifier: modeltokenid,
                                    title: modelData?.modelname
                                }
                            }
                        />

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Infermodel;
