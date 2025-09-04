'use client';

import { useAuth } from '@/contexts/appContext';
import { useState } from 'react';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        // Client-side validation
        if (!formData.name.trim() || formData.name.trim().length < 2) {
          setError('Name must be at least 2 characters long');
          return;
        }

        if (!formData.email.trim()) {
          setError('Email is required');
          return;
        }

        if (!validateEmail(formData.email)) {
          setError('Please enter a valid email address');
          return;
        }
        
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Account created successfully');
          setSuccess('Account created successfully! Logging you in...');
          
          // Automatically log in the user after successful registration
          try {
            const loginResponse = await login(formData.email, formData.password);
            
            if (loginResponse.success) {
              setSuccess('Welcome! Redirecting to home page...');
              // Small delay to show the success message before redirect
              setTimeout(() => {
                window.location.href = '/blogs';
              }, 1500);
            } else {
              // If auto-login fails, show manual login option
              setSuccess('Account created successfully! Please sign in manually.');
              setIsSignUp(false);
              setFormData({
                name: '',
                email: formData.email,
                password: '',
                confirmPassword: '',
              });
            }
          } catch (loginError) {
            console.error('Auto-login failed:', loginError);
            setSuccess('Account created successfully! Please sign in manually.');
            setIsSignUp(false);
            setFormData({
              name: '',
              email: formData.email,
              password: '',
              confirmPassword: '',
            });
          }
        } else {
          setError(data.error || 'Failed to create account');
        }
      } else {
        // Login validation
        if (!formData.email.trim()) {
          setError('Email is required');
          return;
        }

        if (!validateEmail(formData.email)) {
          setError('Please enter a valid email address');
          return;
        }

        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          return;
        }

        const response = await login(formData.email, formData.password);

        if (response.success) {
          console.log('Login successful');
          setSuccess('Login successful! Redirecting...');
          // Small delay to show the success message before redirect
          setTimeout(() => {
            window.location.href = '/blogs';
          }, 1000);
        } else {
          setError(response.error || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSignUp
                ? 'Create a new account to get started'
                : 'Sign in to your account to continue'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 placeholder-gray-400 ${
                  formData.email && !validateEmail(formData.email)
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : formData.email && validateEmail(formData.email)
                    ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="Enter your email"
              />
              {formData.email && !validateEmail(formData.email) && (
                <p className="mt-1 text-xs text-red-500">
                  Please enter a valid email address
                </p>
              )}
              {formData.email && validateEmail(formData.email) && (
                <p className="mt-1 text-xs text-green-600">
                  ✓ Valid email address
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                placeholder="Enter your password"
              />
              {isSignUp && (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            {isSignUp && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading
                ? isSignUp
                  ? 'Creating Account...'
                  : 'Signing in...'
                : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                  setError('');
                  setSuccess('');
                }}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium cursor-pointer"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
