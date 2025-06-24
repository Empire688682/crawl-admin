"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios"
import { useGlobalContext } from '../Context';
import Image from "next/image"

const AuthForms = () => {
  const { publicApiUrl, checkIsAuthenticated } = useGlobalContext();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    rememberMe: false,
    agreeToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Helper function to validate form data
  const validateForm = () => {
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return false;
    }
    if (!formData.password.trim()) {
      toast.error('Password is required');
      return false;
    }
    if (!isLogin) {
      if (!formData.email.trim()) {
        toast.error('Email is required');
        return false;
      }
      if (!formData.first_name.trim()) {
        toast.error('First name is required');
        return false;
      }
      if (!formData.last_name.trim()) {
        toast.error('Last name is required');
        return false;
      }
      if (formData.password !== formData.confirm_password) {
        toast.error('Passwords do not match');
        return false;
      }
      if (!formData.agreeToTerms) {
        toast.error('Please agree to the terms and conditions');
        return false;
      }
    }
    return true;
  };

  // Helper function to store user data
  const storeUserData = (result) => {
    console.log("Result1:",  `${isLogin? result.user.username : result.username}`);
    try {
      const now = new Date().getTime();
      const threeDays = 1000 * 60 * 60 * 24 * 3;
      const expiredAt = now + threeDays;

      const userData = {
        token: `${isLogin? result.token :  result.ID}`,
        id: `${isLogin? result.user.ID :  result.ID}`,
        username: `${isLogin? result.user.username : result.username}`,
        subscription_status: `${ isLogin? result.user.subscription_status : result.subscription_status}`,
        email: `${isLogin? result.user.email : result.email}`,
        first_name: `${isLogin? result.user.first_name : result.first_name}`,
        last_name: `${isLogin?  result.user.last_name :  result.last_name}`,
        expiredAt: expiredAt
      };

      localStorage.setItem("CrawlAdmin", JSON.stringify(userData));
      toast.success(isLogin ? 'Login successful!' : 'Registration successful!');

      // Small delay to show success message before reload
      setTimeout(() => {
        checkIsAuthenticated()
      }, 1000);
    } catch (error) {
      console.error('Error storing user data:', error);
      toast.error('Error saving user data');
    }
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      let endpoint, requestData;

      if (isLogin) {
        endpoint = `${publicApiUrl}login`;
        requestData = {
          username: formData.username,
          password: formData.password
        };
      } else {
        endpoint = `${publicApiUrl}users`;
        requestData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          agreeToTerms: formData.agreeToTerms
        };
      }

      const response = await axios.post(endpoint, requestData);
      

      // Check if response is ok first
      if (![200, 201].includes(response.status)) {
        toast.error('Invalid request data');
        return;
      }

      const result = isLogin ? response.data : response.data.Data

      // Check if the response contains the expected data
      if (isLogin) {
        if (result.token && result.user) {
          storeUserData(result);
        } else {
          toast.error(response.error || response.message || 'Authentication failed');
        }
      } else {
        if (result?.ID && result?.username) {
          storeUserData(result);
        } else {
          toast.error(response.error || response.message || 'Authentication failed');
        }
      }

    } catch (error) {
      console.error(`${isLogin ? 'Login' : 'Signup'} error:`, error);

      // More specific error handling
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        toast.error('Network error - please check your connection');
      } else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
        toast.error('Invalid response from server');
      } else {
        toast.error(error.response.data.error || error.response.data.Message);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    // Reset form when switching
    setFormData({
      first_name: "",
      last_name: "",
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      rememberMe: false,
      agreeToTerms: false
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="w-full max-w-md">
        <div className="bg-black rounded-lg p-8">
          <div className="flex justify-center mb-8">
            <Image src="/crawl-logo-.png" alt="Logo" width={100} height={100} />
          </div>
          <h1 className="text-white text-2xl font-semibold text-center mb-8">
            {isLogin ? 'Login to your Account' : 'Sign UP'}
          </h1>

          <div className="space-y-6">
            {/* First Name Field */}
            {
              !isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none"
                    required
                  />
                </div>
              )
            }

            {/* Last Name Field */}
            {
              !isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none"
                    required
                  />
                </div>
              )
            }

            {/* Username Field */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none"
                required
              />
            </div>

            {/* Email Field (only for signup) */}
            {!isLogin && (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none"
                  required
                />
              </div>
            )}

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white pl-12 pr-12 py-3 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password Field (only for signup) */}
            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  placeholder="Confirm Password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white pl-12 pr-12 py-3 rounded-lg border border-gray-700 focus:border-gray-600 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            {/* Remember Me (only for login) */}
            {isLogin && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                  Remember me
                </label>
              </div>
            )}

            {/* Terms Agreement (only for signup) */}
            {!isLogin && (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-6 h-6 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 mt-1"
                  required
                />
                <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-300">
                  By registering, you are agreeing to our{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300">Terms of use</a> and{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={loading}
              type="button"
              onClick={handleSubmit}
              className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : isLogin ? 'Login' : 'Register'}
            </button>

            {/* Forgot Password (only for login) */}
            {isLogin && (
              <div className="text-center">
                <a href="#" className="text-sm text-gray-400 hover:text-gray-300">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">
                  {isLogin ? 'or continue with' : ''}
                </span>
              </div>
            </div>

            {/* Social Login (only for login) */}
            {/*isLogin && (
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <span className="text-white font-bold">G</span>
                </button>
              </div>
            )*/}
          </div>

          {/* Toggle Form */}
          <div className="mt-8 text-center">
            <span className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              onClick={toggleForm}
              className="text-white font-semibold hover:text-gray-300 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;