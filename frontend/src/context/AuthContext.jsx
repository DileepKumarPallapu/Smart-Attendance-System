import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('token', res.data.token);
        setLoading(false);
        return { success: true, role: res.data.user.role };
      }
    } catch (err) {
      setLoading(false);
      // Fallback for mock demo login if server is offline or fails
      let mockRole = 'student';
      if (email.includes('admin')) mockRole = 'admin';
      else if (email.includes('sharma') || email.includes('faculty')) mockRole = 'faculty';

      const mockUser = {
        id: 'u-demo-' + mockRole,
        name: mockRole === 'admin' ? 'System Admin' : mockRole === 'faculty' ? 'Dr. Ramesh Sharma' : 'Shaik Baji Babu',
        email,
        role: mockRole,
        department: 'Computer Science & Engineering (AIML)',
        course: 'B.Tech CSE(AIML)',
        classSection: 'Semester 6 - CSE(AIML)',
        rollNumber: 'VTU29959 - 24UECS0901 - CSE(AIML)',
        registrationNumber: 'VTU29959 - 24UECS0901 - CSE(AIML)',
        employeeId: 'VT-EMP-1029',
        avatar: mockRole === 'student' ? 'shaik_baji_babu.jpg' : 'veltech_logo.png',
      };

      const mockToken = 'mock_jwt_token_' + Date.now();
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      return { success: true, role: mockRole };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
