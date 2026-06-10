import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Catalog = () => {
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await API.get('/assets');
      setAssets(response.data);
    } catch (error) {
      console.error("Failed to fetch assets", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const handleRequest = async (assetId) => {
    try {
      // Auto-set booking for 1 item for the next 7 days
      const startDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      await API.post('/bookings', {
        asset_id: assetId,
        quantity: 1,
        start_date: startDate,
        due_date: dueDate
      });
      
      alert('Success! Request sent to the Admin for approval.');
    } catch (error) {
      alert(error.response?.data?.message || 'Error requesting asset');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-800 text-white shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">Equipment Catalog</h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition-colors">
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Available for Borrowing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map(asset => (
            <div key={asset.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">{asset.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${asset.available_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {asset.available_quantity} Available
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-6 h-10 overflow-hidden">
                {asset.description}
              </p>
              
              <button 
                onClick={() => handleRequest(asset.id)}
                disabled={asset.available_quantity < 1}
                className={`w-full py-2 rounded-md font-medium transition-colors ${
                  asset.available_quantity > 0 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {asset.available_quantity > 0 ? 'Request Asset' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
