// src/ImageEditor.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DesignEditor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const image = new URLSearchParams(location.search).get('image');

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Edit Image</h1>
            {image ? (
                <div className="flex flex-col items-center">
                    <img
                        src={`data:image/png;base64,${image}`}
                        alt="Selected"
                        className="w-full h-auto rounded shadow mb-4"
                    />
                    {/* Add editing tools here */}
                </div>
            ) : (
                <p className="text-red-500">No image selected for editing.</p>
            )}
            <button
                onClick={() => navigate('/')}
                className="p-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-200"
            >
                Go Back
            </button>
        </div>
    );
};

export default DesignEditor;
