"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Create context
const AuthContext = createContext<{
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => { },
  logout: () => { },
  register: async () => { },
});

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`${API_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);

      // Use JSON format for login, consistent with registration
      const loginData = {
        username,
        password
      };

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);

      // Fetch user data
      const userResponse = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      setUser(userData);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Register function
  const register = async (userData: any) => {
    try {
      setLoading(true);

      const registerData = {
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name,
        password: userData.password
      };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registerData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      loading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
