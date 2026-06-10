import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");

  // FIXED: Changed category_name to category to match standard database schemas
  const [newAsset, setNewAsset] = useState({
    name: "",
    description: "",
    total_quantity: 1,
    category: "DSLR Cameras",
    health_status: "good",
  });

  const [editingAssetId, setEditingAssetId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    category: "",
    total_quantity: 1,
    available_quantity: 1,
    health_status: "good",
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
      setNewAsset({
        name: "",
        description: "",
        total_quantity: 1,
        category: "DSLR Cameras",
        health_status: "good",
      });
      fetchDashboardData();
    } catch (error) {
      console.error("Error adding asset", error);
    }
  };

  const startEdit = (asset) => {
    setEditingAssetId(asset.id);
    setEditFormData({
      name: asset.name,
      description: asset.description || "",
      category: asset.category || asset.category_name || "", // Support both just in case
      total_quantity: asset.total_quantity,
      available_quantity: asset.available_quantity,
      health_status: asset.health_status,
    });
  };

  const cancelEdit = () => {
    setEditingAssetId(null);
  };

  const handleEditSubmit = async (id) => {
    try {
      await API.put(`/assets/${id}`, editFormData);
      setEditingAssetId(null);
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Error updating asset");
    }
  };

  const handleDeleteAsset = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this asset completely from inventory?",
      )
    ) {
      try {
        await API.delete(`/assets/${id}`);
        fetchDashboardData();
      } catch (error) {
        alert(error.response?.data?.message || "Error deleting asset");
      }
    }
  };

  const handleUpdateBooking = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Error updating booking");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredBookings = bookings.filter((b) =>
    b.user_name.toLowerCase().includes(studentSearch.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-800 text-white shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">
          Admin Control Panel
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* FIXED: Removed Emojis, Updated Colors to Blue, Green, Red */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Unique Items
            </p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {assets.length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Active Bookings Issued
            </p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {bookings.filter((b) => b.status === "issued").length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Pending Requests
            </p>
            <h3 className="text-3xl font-bold text-red-600 mt-2">
              {bookings.filter((b) => b.status === "pending").length}
            </h3>
          </div>
        </div>

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
                  className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="e.g. Sony ZV-E10"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Category
                </label>
                <input
                  list="category-options"
                  required
                  value={newAsset.category}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, category: e.target.value })
                  }
                  className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                  placeholder="Select or type custom category..."
                />
                <datalist id="category-options">
                  <option value="DSLR Cameras" />
                  <option value="Studio Lighting Equipment" />
                  <option value="Audio Systems" />
                  <option value="Costumes & Stage Props" />
                  <option value="Recording Equipment" />
                </datalist>
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
                  className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Equipment details..."
                  rows="2"
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
                    setNewAsset({
                      ...newAsset,
                      total_quantity: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium text-sm transition-colors"
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
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-3 font-semibold text-gray-600">
                      Equipment Details
                    </th>
                    <th className="p-3 font-semibold text-gray-600 text-center">
                      Total
                    </th>
                    <th className="p-3 font-semibold text-gray-600 text-center">
                      Available
                    </th>
                    <th className="p-3 font-semibold text-gray-600">
                      Condition
                    </th>
                    <th className="p-3 font-semibold text-gray-600 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {editingAssetId === asset.id ? (
                        <>
                          <td className="p-3 space-y-2">
                            <input
                              type="text"
                              className="border p-1 w-full rounded text-sm font-medium"
                              value={editFormData.name}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  name: e.target.value,
                                })
                              }
                            />
                            {/* FIXED: Added Category to inline edit so you can fix old items */}
                            <input
                              type="text"
                              className="border p-1 w-full rounded text-xs text-gray-500"
                              value={editFormData.category}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  category: e.target.value,
                                })
                              }
                              placeholder="Category"
                            />
                            <input
                              type="text"
                              className="border p-1 w-full rounded text-xs text-gray-500"
                              value={editFormData.description}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Description"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="0"
                              className="border p-1 w-16 text-center rounded"
                              value={editFormData.total_quantity}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  total_quantity: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="0"
                              className="border p-1 w-16 text-center rounded"
                              value={editFormData.available_quantity}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  available_quantity:
                                    parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </td>
                          <td className="p-3">
                            <select
                              className="border p-1 rounded bg-white text-xs"
                              value={editFormData.health_status}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  health_status: e.target.value,
                                })
                              }
                            >
                              <option value="good">Good</option>
                              <option value="maintenance">Maintenance</option>
                              <option value="damaged">Damaged</option>
                            </select>
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => handleEditSubmit(asset.id)}
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-400 text-white px-2 py-1 rounded text-xs hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3">
                            <div className="font-medium text-gray-800">
                              {asset.name}
                            </div>
                            {/* FIXED: Display category properly */}
                            <div className="text-xs text-gray-400 font-semibold tracking-wide uppercase mt-0.5">
                              {asset.category ||
                                asset.category_name ||
                                "UNCATEGORIZED"}
                            </div>
                          </td>
                          <td className="p-3 text-center text-gray-600">
                            {asset.total_quantity}
                          </td>
                          <td className="p-3 text-center text-gray-600 font-bold">
                            {asset.available_quantity}
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                asset.health_status === "good"
                                  ? "bg-green-100 text-green-800"
                                  : asset.health_status === "maintenance"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {asset.health_status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-3 whitespace-nowrap">
                            <button
                              onClick={() => startEdit(asset)}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAsset(asset.id)}
                              className="text-red-600 hover:text-red-800 font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Student Booking History
            </h2>
            <input
              type="text"
              placeholder="Filter by student name..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 shadow-sm bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3 font-semibold text-gray-600">Student</th>
                  <th className="p-3 font-semibold text-gray-600">Asset</th>
                  <th className="p-3 font-semibold text-gray-600 text-center">
                    Qty
                  </th>
                  <th className="p-3 font-semibold text-gray-600">Dates</th>
                  <th className="p-3 font-semibold text-gray-600">Status</th>
                  <th className="p-3 font-semibold text-gray-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      No requests found matching search queries.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
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
                      <td className="p-3 text-center text-gray-800 font-bold">
                        {booking.quantity}
                      </td>
                      <td className="p-3 text-gray-500 text-xs">
                        {new Date(booking.start_date).toLocaleDateString()} -{" "}
                        {new Date(booking.due_date).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "issued"
                                ? "bg-blue-100 text-blue-800"
                                : booking.status === "returned"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2 whitespace-nowrap">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateBooking(booking.id, "issued")
                              }
                              className="bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded text-xs transition-colors font-medium"
                            >
                              Issue
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateBooking(booking.id, "rejected")
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded text-xs transition-colors font-medium"
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
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1 rounded text-xs transition-colors font-medium"
                          >
                            Return
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
