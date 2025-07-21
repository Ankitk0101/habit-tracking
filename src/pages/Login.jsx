import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';  

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const nav = useNavigate();

  async function handleSubmit() {
    if (!email || !password) return alert("Please fill all fields");

    setLoading(true);
    try {
      await login(email, password);
      nav('/dashboard');

    } catch (e) {
      setError('Login failed. Please try again.');
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl relative">
        <button
          onClick={() => nav('/')}
          className="absolute top-1 right-4 text-gray-500 hover:text-red-500 text-4xl cursor-pointer"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

       
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;