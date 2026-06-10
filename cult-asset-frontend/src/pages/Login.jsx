import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", { email, password });
      const { token } = response.data;

      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);

      if (decoded.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/catalog");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        {/* Header Branding */}
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Cultural Council
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            IIT Roorkee Asset Management
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        {/* Form Elements */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                placeholder="admin@iitr.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </form>

        {/* Registration Navigation Link */}
        <div className="text-center mt-4 border-t border-gray-100 pt-4">
          <Link
            to="/register"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            New Student? Create an account here →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
