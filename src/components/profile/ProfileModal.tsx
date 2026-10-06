"use client";

import React, { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Check, LogOut, LogIn } from "lucide-react";
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
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-md shadow-indigo-500/20"
            />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-indigo-300 mb-1.5">
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
                      ? "border-indigo-500 scale-110 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-[#080d1a] rounded-xl border border-slate-200 dark:border-[#182640] text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 shadow-inner"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-[#080d1a] rounded-xl border border-slate-200 dark:border-[#182640] text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 shadow-inner"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 block mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-[#080d1a] rounded-xl border border-slate-200 dark:border-[#182640] text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 shadow-inner resize-none"
            />
          </div>
        </div>

        {/* Activity Badges */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-[#080d1a] rounded-2xl border border-slate-100 dark:border-[#141f33]">
          <div>
            <div className="text-[11px] text-slate-400">Saved Favorites</div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {favoriteCount} items
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Account Status</div>
            <div className="text-base font-bold text-emerald-400">
              {profile.isLoggedIn ? "Active User" : "Guest Mode"}
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#141e30] flex items-center justify-between">
          <button
            type="button"
            onClick={handleToggleAuth}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
              profile.isLoggedIn
                ? "text-rose-500 hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                : "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
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
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#141d31] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-md shadow-indigo-600/30 active:scale-95"
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
