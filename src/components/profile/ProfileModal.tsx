"use client";

import React, { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { User, Mail, Sparkles, Check, LogOut, LogIn, Camera } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfile, login, logout } from "@/store/slices/authSlice";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.auth);
  const favoriteCount = useAppSelector((state) => state.favorites.items.length);

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [bio, setBio] = useState(profile.bio);
  const [saved, setSaved] = useState(false);

  // Avatar presets
  const avatarPresets = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateProfile({
        name,
        email,
        avatar,
        bio,
      })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleToggleAuth = () => {
    if (profile.isLoggedIn) {
      dispatch(logout());
    } else {
      dispatch(login({ name: name || "Alex Morgan", email: email || "alex@dev.io" }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile & Settings" maxWidth="lg">
      <form onSubmit={handleSave} className="space-y-5">
        {/* Avatar selection */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={avatar || profile.avatar}
              alt={profile.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30"
            />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Choose an Avatar Preset
            </div>
            <div className="flex items-center gap-2">
              {avatarPresets.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(img)}
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                    avatar === img
                      ? "border-blue-600 scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input fields */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Activity Badges */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-[11px] text-slate-400">Saved Favorites</div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {favoriteCount} items
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Account Status</div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {profile.isLoggedIn ? "Active User" : "Guest Mode"}
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleToggleAuth}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
              profile.isLoggedIn
                ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
            }`}
          >
            {profile.isLoggedIn ? (
              <>
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
            >
              {saved && <Check className="w-3.5 h-3.5" />}
              <span>{saved ? "Saved!" : "Save Profile"}</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
