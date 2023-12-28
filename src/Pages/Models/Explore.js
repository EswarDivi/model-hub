import Navbar from '../HomePage/Navbar';
import React, { useState, useEffect } from 'react';


const Explore = () => {
  const [models, setModels] = useState([]); // Initialize with modelsData directly

  const getModels = async () => {
    try {
      console.log('Getting models...');
      const response = await fetch('https://modelhub-backend.vercel.app/getallmodels');
      const models = await response.json();
      setModels(models);
    } catch (error) {
      console.error('Error getting models:', error);
    }
  };

  useEffect(() => {
    getModels();
  }, []);

  const [modelmodality, setmodelmodality] = useState('');
  const [typeFilter, setTypeFilter] = useState('');


  const bgColors = [
    'bg-blue-600',
    'bg-red-600',
    'bg-green-600',
    'bg-yellow-600',
    'bg-indigo-600',
    'bg-purple-600',
    'bg-pink-600',
    'bg-teal-600',
    'bg-orange-600',
    'bg-lime-600'
  ];

  const filteredModels = models.filter(model => {
    return (modelmodality ? model.modelmodality === modelmodality : true) &&
      (typeFilter ? model.modeltype === typeFilter : true);
  });

  const uniquemodelmodality = [...new Set(models.map(model => model.modelmodality))];
  const uniqueTypes = [...new Set(models.map(model => model.modeltype))];

  return (
    <div>
      <Navbar />
      <div className="flex">
        <aside className="w-50 bg-gray-800 min-h-screen p-4 text-white">
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Filter by Framework</h3>
            {uniquemodelmodality.map((framework, index) => (
              <div key={index}>
                <label className="inline-flex items-center mt-3">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600"
                    checked={framework === modelmodality}
                    onChange={() => setmodelmodality(framework === modelmodality ? '' : framework)}
                  />
                  <span className="ml-2 text-white">{framework}</span>
                </label>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Filter by Type</h3>
            {uniqueTypes.map((type, index) => (
              <div key={index}>
                <label className="inline-flex items-center mt-3">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600"
                    checked={type === typeFilter}
                    onChange={() => setTypeFilter(type === typeFilter ? '' : type)}
                  />
                  <span className="ml-2 text-white">{type}</span>
                </label>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-grow">
          <div className="container bg-gray-900 text-white mx-auto p-4">
            <div className="flex flex-col gap-4">
              {filteredModels.map((model, index) => (
                <div key={index} className={`${bgColors[index % bgColors.length]} rounded-lg shadow-md overflow-hidden`}>
                  <div className="p-6">
                    <a href={`model/${model.modeltokenid}`} className="hover:text-blue-400">
                      <h2 className="text-lg font-semibold mb-2 text-blue-300 hover:underline">{model.modelname}</h2>
                    </a>
                    <p className="text-gray-100 text-sm mb-4">{model.modeldescription}</p>
                    <p className="text-gray-100 text-xs mb-1">Model Type: <span className="text-gray-100 font-medium">{model.modeltype}</span></p>
                    <p className="text-gray-100 text-xs">Model Framework: <span className="text-gray-100 font-medium">{model.modelmodality}</span></p>
                    <a href={`user/${model.username}`} className="hover:text-blue-400">
                      <p className="text-gray-100 text-xs">Uploaded by: <span className="font-medium text-blue-300 hover:underline">{model.username}</span></p>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Explore;
