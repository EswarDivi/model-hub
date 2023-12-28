import React, { useState, useRef } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import { useAuth } from '../AuthContext'; // Import useAuth
import { v4 as uuidv4 } from 'uuid'
import sample from './sample.json';



const ModelUploadForm = ({ onUploadSuccess }) => {
    const [modelData, setModelData] = useState({
        modelName: '',
        modelDescription: '',
        modelModality: '',
        modelType: ''
    });

    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);


    const handleInputChange = (e) => {
        setModelData({ ...modelData, [e.target.name]: e.target.value });
    };

    const handleFileChange = () => {
        console.log('File selected:', fileInputRef.current.files[0].name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await uploadToS3();

    };


    const uploadToS3 = async () => {
        console.log('Upload function triggered');
        setIsUploading(true);
        const accessKeyId = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
        const bucketName = process.env.REACT_APP_AWS_BUCKET_NAME;
        const region = process.env.REACT_APP_AWS_BUCKET_REGION;

        const uniqueId = uuidv4();

        AWS.config.update({
            accessKeyId,
            secretAccessKey,
            region,
        });

        const file = fileInputRef.current.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }

        const fileExtension = file.name.split('.').pop();

        const newFileName = `${uniqueId}.${fileExtension}`;

        const params = {
            Bucket: bucketName,
            Key: newFileName,
            Body: file
        };

        const s3 = new AWS.S3();
        s3.upload(params, async (err, data) => {
            if (err) {
                console.error('Error uploading file:', err);
            } else {
                console.log('File uploaded successfully');
                await saveModelInformation(data.Location, uniqueId);
            }
        });
    };


    const { user } = useAuth();
    const saveModelInformation = async (s3Url, modeltokenid) => {
        try {
            const username = user.username;
            const response = await axios.post('https://modelhub-backend.vercel.app/uploadmodel', {
                ...modelData,
                s3Url,
                username,
                modeltokenid
            });
            console.log('Model information saved');
            onUploadSuccess();
            setIsUploading(false);
            setModelData({
                modelName: '',
                modelDescription: '',
                modelModality: '',
                modelType: ''
            });
            fileInputRef.current.value = '';
        } catch (error) {
            console.error('Error saving model information:', error);
        }
    };


    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
            <div className="upload-container bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">Upload Model</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Model Name */}
                    <input
                        type="text"
                        name="modelName"
                        value={modelData.modelName}
                        onChange={handleInputChange}
                        placeholder="Model Name"
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Model Description */}
                    <textarea
                        name="modelDescription"
                        value={modelData.modelDescription}
                        onChange={handleInputChange}
                        placeholder="Model Description"
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    ></textarea>

                    {/* Model Modality */}
                    <select
                        name="modelModality"
                        value={modelData.modelModality}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>Select Modality</option>
                        <option value="audio">Audio</option>
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                    </select>

                    {/* Model Type */}
                    <select
                        name="modelType"
                        value={modelData.modelType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>Select Type</option>
                        <option value="classification">Classification</option>
                        <option value="generation">Generation</option>
                    </select>

                    <label htmlFor="file-upload" className="mb-2 text-lg font-bold text-gray-100">Sample File</label>
                    <pre className="text-green-500 bg-gray-800 p-2 rounded overflow-x-scroll">
                        {JSON.stringify(sample, null, 2)}
                    </pre>
                    {/* File Upload */}
                    <input
                        type="file"
                        accept='application/json'
                        required
                        ref={fileInputRef} // Use the ref here
                        onChange={handleFileChange} // Optional if you're using another method to handle file changes
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-white file:bg-blue-500 file:rounded-md file:border-none file:px-4 file:py-2"
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full px-4 py-2 rounded-md ${isUploading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModelUploadForm;
