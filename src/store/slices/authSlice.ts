import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "@/types";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/utils";

const PROFILE_STORAGE_KEY = "pulsehub_user_profile";

const defaultProfile: UserProfile = {
  id: "user-101",
  name: "Alex Morgan",
  email: "alex.morgan@frontend.dev",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  bio: "Frontend Architect & Design Technologist passionate about high-performance dashboards, Next.js, and generative UI.",
  joinedDate: "October 2024",
  isLoggedIn: true,
};

const initialState: UserProfile = defaultProfile;

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      const saved = loadFromLocalStorage<UserProfile | null>(PROFILE_STORAGE_KEY, null);
      if (saved) {
        return { ...state, ...saved };
      }
      return state;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      const updated = { ...state, ...action.payload };
      saveToLocalStorage(PROFILE_STORAGE_KEY, updated);
      return updated;
    },
    login: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.isLoggedIn = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      saveToLocalStorage(PROFILE_STORAGE_KEY, state);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      saveToLocalStorage(PROFILE_STORAGE_KEY, state);
    },
  },
});

export const { initializeAuth, updateProfile, login, logout } = authSlice.actions;

export default authSlice.reducer;
