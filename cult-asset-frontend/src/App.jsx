import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Placeholder components (We will build these next)
const Login = () => <div style={{ padding: '2rem', fontSize: '1.5rem' }}>Login Page</div>;
const Dashboard = () => <div style={{ padding: '2rem', fontSize: '1.5rem' }}>Admin Dashboard</div>;
const Catalog = () => <div style={{ padding: '2rem', fontSize: '1.5rem' }}>Asset Catalog</div>;

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/catalog" element={<Catalog />} />
          
          {/* Default redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
