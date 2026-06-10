import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Catalog = () => {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Upgraded to handle start_date, due_date, AND quantity
  const [bookingData, setBookingData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await API.get("/assets");
      setAssets(response.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403)
        navigate("/login");
    }
  };

  const handleInputChange = (assetId, field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [assetId]: {
        ...prev[assetId],
        [field]: value,
      },
    }));
  };

  const handleRequest = async (assetId, maxAvailable) => {
    const data = bookingData[assetId] || {};
    const reqQuantity = parseInt(data.quantity) || 1;

    if (!data.start_date || !data.due_date) {
      alert("Please select both a start date and a return date.");
      return;
    }
    if (new Date(data.start_date) > new Date(data.due_date)) {
      alert("The return date cannot be earlier than your start date.");
      return;
    }
    if (reqQuantity > maxAvailable || reqQuantity < 1) {
      alert(
        `Invalid quantity. You can only request between 1 and ${maxAvailable} items.`,
      );
      return;
    }

    try {
      await API.post("/bookings", {
        asset_id: assetId,
        quantity: reqQuantity,
        start_date: data.start_date,
        due_date: data.due_date,
      });

      alert("Success! Booking request submitted to the Admin.");
      fetchAssets(); // Refresh available counts

      setBookingData((prev) => {
        const updated = { ...prev };
        delete updated[assetId];
        return updated;
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error requesting asset");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-800 text-white shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">Equipment Catalog</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/history")}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md font-medium transition-colors"
          >
            My Requests
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Available for Borrowing
          </h2>
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-10">
              No equipment found.
            </p>
          ) : (
            filteredAssets.map((asset) => {
              const currentData = bookingData[asset.id] || {
                start_date: "",
                due_date: "",
                quantity: 1,
              };
              return (
                <div
                  key={asset.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {asset.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${asset.available_quantity > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {asset.available_quantity} Available
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {asset.description}
                    </p>

                    <div className="bg-gray-50 p-3 rounded-lg space-y-3 mb-4 border border-gray-100">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={currentData.start_date}
                            onChange={(e) =>
                              handleInputChange(
                                asset.id,
                                "start_date",
                                e.target.value,
                              )
                            }
                            className="w-full mt-1 p-1 text-sm bg-white border rounded outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase">
                            Return
                          </label>
                          <input
                            type="date"
                            value={currentData.due_date}
                            onChange={(e) =>
                              handleInputChange(
                                asset.id,
                                "due_date",
                                e.target.value,
                              )
                            }
                            className="w-full mt-1 p-1 text-sm bg-white border rounded outline-none"
                          />
                        </div>
                      </div>
                      {/* NEW: Quantity Input */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase">
                          Quantity Needed
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={asset.available_quantity}
                          value={currentData.quantity}
                          onChange={(e) =>
                            handleInputChange(
                              asset.id,
                              "quantity",
                              e.target.value,
                            )
                          }
                          className="w-full mt-1 p-1 text-sm bg-white border rounded outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleRequest(asset.id, asset.available_quantity)
                    }
                    disabled={asset.available_quantity < 1}
                    className={`w-full py-2 rounded-md font-medium transition-colors ${
                      asset.available_quantity > 0
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {asset.available_quantity > 0
                      ? "Request Asset"
                      : "Out of Stock"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
