import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const History = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyHistory();
  }, []);

  const fetchMyHistory = async () => {
    try {
      const response = await API.get('/bookings/my-history');
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching borrowing history", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-800 text-white shadow-lg p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/catalog')} className="text-sm bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded transition-colors">
            ← Back to Catalog
          </button>
          <h1 className="text-xl font-bold tracking-wider">My Borrowing Dashboard</h1>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Your Allocation Log</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-sm font-semibold text-gray-600">Equipment</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Qty</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Reservation Dates</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      You haven't requested or borrowed any assets yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map(booking => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{booking.asset_name}</td>
                      <td className="p-3 text-gray-600">{booking.quantity}</td>
                      <td className="p-3 text-gray-600 text-sm">
                        {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.due_date).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'issued' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'returned' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
