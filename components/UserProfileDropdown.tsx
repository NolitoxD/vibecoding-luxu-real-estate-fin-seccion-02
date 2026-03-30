'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from '@/app/actions/auth';

interface UserProfileDropdownProps {
  avatarUrl?: string;
  fullName?: string;
  email?: string;
  savedLabel: string;
  visitsLabel: string;
  settingsLabel: string;
  signOutLabel: string;
}

export default function UserProfileDropdown({
  avatarUrl,
  fullName,
  email,
  savedLabel,
  visitsLabel,
  settingsLabel,
  signOutLabel,
}: UserProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { href: '/profile/saved', label: savedLabel, icon: 'favorite' },
    { href: '/profile/visits', label: visitsLabel, icon: 'calendar_today' },
    { href: '/profile/settings', label: settingsLabel, icon: 'settings' },
  ];

  return (
    <div className="relative pl-2 border-l border-nordic/10 ml-2" ref={dropdownRef}>
      {/* Avatar trigger */}
      <button
        id="user-profile-button"
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all relative focus:outline-none focus:ring-mosque"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt="Profile" fill className="object-cover" sizes="36px" />
        ) : (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl shadow-2xl border border-nordic/10 bg-white overflow-hidden z-50 animate-fade-in"
        >
          {/* User info header */}
          <div className="px-5 py-4 bg-nordic/5 border-b border-nordic/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-mosque/20 flex items-center justify-center text-mosque font-semibold text-lg shrink-0 overflow-hidden relative">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Profile" fill className="object-cover" sizes="40px" />
                ) : (
                  <span>{fullName?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="min-w-0">
                {fullName && <p className="text-sm font-semibold text-nordic truncate">{fullName}</p>}
                {email && <p className="text-xs text-nordic/50 truncate">{email}</p>}
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-sm text-nordic/80 hover:bg-mosque/5 hover:text-mosque transition-colors group"
              >
                <span className="material-icons font-material-icons text-base text-mosque/60 group-hover:text-mosque transition-colors">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <div className="py-2 border-t border-nordic/10">
            <form action={signOut}>
              <button
                type="submit"
                role="menuitem"
                className="flex items-center gap-3 px-5 py-3 text-sm text-red-500/80 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
              >
                <span className="material-icons font-material-icons text-base">logout</span>
                {signOutLabel}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
