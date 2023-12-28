import React, { useState } from 'react';
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../AuthContext';

const Login = () => {
  const { login } = useAuth();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [remeberme, setRemeberme] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("https://modelhub-backend.vercel.app/login", {
        email, password
      });
      if (response.data.status === "success") {
        setMessage('Login successful!');
        login(response.data.user, remeberme);
        setUser(response.data.user);
        navigate('/');
      } else {
        setMessage('Please check your email and password. If you are not registered, please signup first.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error(error);
    }
  }


  const handleInputChange = (e) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex items-center justify-center">
      <div className="login-container bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Model hub</h1>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberme"
              name="rememberme"
              checked={remeberme}
              onChange={() => setRemeberme(!remeberme)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="rememberme"
              className="ml-2 block text-sm text-white"
            >
              Remember me
            </label>
          </div>
          <button
            type="submit"
            onClick={submit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Login
          </button>
        </form>
        <div id="message" className="mt-4" style={{ color: message.includes('successful') ? 'green' : 'red' }}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default Login;
