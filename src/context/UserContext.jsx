import React, { createContext, useContext } from 'react';
import ProfileIcon from '/profile.svg';

// Provide defaults for user, profile picture, and appointments store
const defaultValue = {
  user: { profilePic: ProfileIcon },
  setUser: () => {},
  appointments: [],
  setAppointments: () => {},
  // Global loading flags
  isPageLoading: false,
  setIsPageLoading: () => {},
  isDataLoading: false,
  setIsDataLoading: () => {},
};

// Simple context to share the logged-in user and appointments across pages
export const UserContext = createContext(defaultValue);

// Hook that ensures sensible defaults are always available to consumers
export const useUser = () => {
  const ctx = useContext(UserContext) || defaultValue;

  // Ensure a profile picture is always present
  const user = ctx.user;
  const ensuredUser = user && Object.keys(user).length > 0
    ? (user.profilePic ? user : { ...user, profilePic: ProfileIcon })
    : { profilePic: ProfileIcon };

  // Ensure appointments array exists even if provider omitted it
  const ensuredAppointments = Array.isArray(ctx.appointments)
    ? ctx.appointments
    : [];

  return {
    ...ctx,
    user: ensuredUser,
    appointments: ensuredAppointments,
    isPageLoading: typeof ctx.isPageLoading === 'boolean' ? ctx.isPageLoading : false,
    isDataLoading: typeof ctx.isDataLoading === 'boolean' ? ctx.isDataLoading : false,
  };
};

export default UserContext;
