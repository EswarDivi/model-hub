import React, { useState } from 'react';
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const [email, setEmail] = useState('');
  const [uname, setUname] = useState(''); // Added state for user name
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(''); // Added state for role
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const hasUpperCase = (str) => /[A-Z]/.test(str);
  const hasLowerCase = (str) => /[a-z]/.test(str);
  const hasNumber = (str) => /\d/.test(str);

  async function submit(e) {
    e.preventDefault();

    if (!email || !password || password !== confirmPassword || !role) {
      setMessage('Please fill in all fields and ensure passwords match.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    const isPasswordValid = password.length >= 8 && hasUpperCase(password) && hasLowerCase(password) && hasNumber(password);

    if (!isPasswordValid) {
      setMessage('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }

      try {
        const response = await axios.post("https://modelhub-backend.vercel.app/signup", {
          uname,email, password, role
        });

        if (response.data === "unameexist") {
          setMessage('Username already exists. Please choose a different username.');
        }  
        else if (response.data === "exist") {
          setMessage('Email already exists. Please login or use a different email.');
        }    
        else if (response.data === "notexist") {
          setMessage('Signup successful!');
          navigate('/login');
        }

      }catch (error) {
        setMessage('Something went wrong. Please try again.');
        console.log(error);
      }
    };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else if (name === 'role') {
      setRole(value);
    }
    else if (name === 'uname') {
      setUname(value);
    }
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex items-center justify-center">
      <div className="login-container bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Model hub - Signup</h1>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label htmlFor="uname" className="sr-only">
              User Name
            </label>
            <input
              type="text"
              id="uname"
              name="uname"
              value={uname}
              onChange={handleInputChange}
              placeholder="User Name"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="role" className="sr-only">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="developer">Developer</option>
              <option value="researcher">Researcher</option>
            </select>
          </div>
          <button
            type="submit"
            onClick={submit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Signup
          </button>
        </form>
        <div id="message" className="mt-4" style={{ color: message.includes('successful') ? 'green' : 'red' }}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default Signup;
