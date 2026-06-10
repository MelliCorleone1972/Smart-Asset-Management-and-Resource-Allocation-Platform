import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newAsset, setNewAsset] = useState({
    name: "",
    description: "",
    total_quantity: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [assetsRes, bookingsRes] = await Promise.all([
        API.get("/assets"),
        API.get("/bookings"),
      ]);
      setAssets(assetsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    }
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await API.post("/assets", newAsset);
      setNewAsset({ name: "", description: "", total_quantity: 1 });
      fetchDashboardData();
    } catch (error) {
      console.error("Error adding asset", error);
    }
  };

  // NEW: Function to handle approving or returning assets
  const handleUpdateBooking = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      fetchDashboardData(); // Automatically refresh the tables to show new inventory numbers
    } catch (error) {
      alert(error.response?.data?.message || "Error updating booking");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-800 text-white shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">
          Admin Control Panel
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition-colors"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Top Section: Add Asset & Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Register New Equipment
            </h2>
            <form onSubmit={handleAddAsset} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  value={newAsset.name}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, name: e.target.value })
                  }
                  className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Sony A7III DSLR"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={newAsset.description}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, description: e.target.value })
                  }
                  className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Includes 50mm lens..."
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Total Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newAsset.total_quantity}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, total_quantity: e.target.value })
                  }
                  className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors"
              >
                Add to Inventory
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Current Inventory
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Name
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Total
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Available
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {asset.name}
                      </td>
                      <td className="p-3 text-gray-600">
                        {asset.total_quantity}
                      </td>
                      <td className="p-3 text-gray-600 font-bold">
                        {asset.available_quantity}
                      </td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {asset.health_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* NEW Bottom Section: Booking Requests */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Student Booking Requests
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 text-sm font-semibold text-gray-600">
                    Student
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600">
                    Asset
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600">
                    Dates
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="p-3 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No pending requests.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {booking.user_name}
                      </td>
                      <td className="p-3 text-gray-600">
                        {booking.asset_name}
                      </td>
                      <td className="p-3 text-gray-600 text-sm">
                        {new Date(booking.start_date).toLocaleDateString()} -{" "}
                        {new Date(booking.due_date).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "issued"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3 space-x-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateBooking(booking.id, "issued")
                              }
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                            >
                              Issue Asset
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateBooking(booking.id, "rejected")
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status === "issued" && (
                          <button
                            onClick={() =>
                              handleUpdateBooking(booking.id, "returned")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                          >
                            Mark Returned
                          </button>
                        )}
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

export default Dashboard;
