import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => storageService.getUserProfile());

  useEffect(() => {
    storageService.saveUserProfile(user);
  }, [user]);

  const switchRole = (newRole) => {
    setUser(prev => ({
      ...prev,
      role: newRole
    }));
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  return (
    <UserContext.Provider value={{ user, role: user.role, switchRole, updateProfile, isAdmin: user.role === 'admin' }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
