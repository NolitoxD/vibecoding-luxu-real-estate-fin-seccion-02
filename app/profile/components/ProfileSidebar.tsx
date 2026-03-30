'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileSidebarProps {
  savedLabel: string;
  visitsLabel: string;
  settingsLabel: string;
}

export default function ProfileSidebar({ savedLabel, visitsLabel, settingsLabel }: ProfileSidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/profile/saved", label: savedLabel, icon: "favorite" },
    { href: "/profile/visits", label: visitsLabel, icon: "calendar_today" },
    { href: "/profile/settings", label: settingsLabel, icon: "settings" },
  ];

  return (
    <nav className="flex flex-col gap-2">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              isActive 
                ? "bg-mosque text-white shadow-md shadow-mosque/20" 
                : "text-nordic/70 hover:bg-black/5 hover:text-nordic"
            }`}
          >
            <span className="material-icons font-material-icons">{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
