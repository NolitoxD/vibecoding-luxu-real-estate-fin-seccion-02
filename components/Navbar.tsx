import Link from "next/link";
import { getTranslation } from "@/i18n/server";
import { createClient } from "@/lib/supabase/server";
import LanguageSelector from "./LanguageSelector";
import UserProfileDropdown from "./UserProfileDropdown";

interface NavbarProps {
  currentType?: string;
}

export default async function Navbar({ currentType }: NavbarProps) {
  const { t } = await getTranslation();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("id", user.id)
      .single();
      
    if (roleData?.role === "admin") {
      isAdmin = true;
    }
  }

  const getLinkClass = (type?: string) => {
    const isActive = type ? currentType === type : !currentType;
    return isActive
      ? "text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1"
      : "text-nordic/70 hover:text-nordic font-medium text-sm hover:border-b-2 hover:border-nordic/20 px-1 py-1 transition-all";
  };

  const getMobileLinkClass = (type?: string) => {
    const isActive = type ? currentType === type : !currentType;
    return isActive
      ? "block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10"
      : "block px-3 py-2 rounded-md text-base font-medium text-nordic hover:bg-black/5";
  };

  return (
    <nav className="sticky top-0 z-50 bg-clear-day/95 backdrop-blur-md border-b border-nordic/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-nordic flex items-center justify-center">
              <span className="material-icons text-white text-lg font-material-icons">
                apartment
              </span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic">
              LuxeEstate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={getLinkClass(undefined)}>
              {t("navbar.all")}
            </Link>
            <Link href="/?type=sale" className={getLinkClass("sale")}>
              {t("navbar.buy")}
            </Link>
            <Link href="/?type=rent" className={getLinkClass("rent")}>
              {t("navbar.rent")}
            </Link>
            <Link href="#" className={getLinkClass("sell")}>
              {t("navbar.sell")}
            </Link>
            <Link href="/profile/saved" className={getLinkClass("saved")}>
              {t("navbar.saved")}
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-mosque font-bold text-sm bg-mosque/10 hover:bg-mosque hover:text-white px-3 py-1.5 rounded-md transition-all">
                Admin
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            <LanguageSelector />
            <button aria-label="Search" className="text-nordic hover:text-mosque transition-colors">
              <span className="material-icons font-material-icons">search</span>
            </button>
            <button aria-label="Notifications" className="text-nordic hover:text-mosque transition-colors relative">
              <span className="material-icons font-material-icons">
                notifications_none
              </span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-clear-day"></span>
            </button>

            {/* Profile */}
            {user ? (
              <UserProfileDropdown
                avatarUrl={user.user_metadata?.avatar_url}
                fullName={user.user_metadata?.full_name}
                email={user.email}
                savedLabel={t("profile.saved") || "Saved Properties"}
                visitsLabel={t("profile.visits") || "Scheduled Visits"}
                settingsLabel={t("profile.settings") || "Settings"}
                signOutLabel={t("navbar.signOut") || "Sign Out"}
              />
            ) : (
              <Link aria-label="Login" href="/login" className="flex items-center gap-2 pl-4 border-l border-nordic/10 ml-2">
                <span className="text-nordic bg-mosque/10 hover:bg-mosque hover:text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300">
                  {t("navbar.signIn")}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-nordic/5 bg-clear-day overflow-hidden h-0 transition-all duration-300">
        <div className="px-4 py-2 space-y-1">
          <Link href="/" className={getMobileLinkClass(undefined)}>
            {t("navbar.all")}
          </Link>
          <Link href="/?type=sale" className={getMobileLinkClass("sale")}>
            {t("navbar.buy")}
          </Link>
          <Link href="/?type=rent" className={getMobileLinkClass("rent")}>
            {t("navbar.rent")}
          </Link>
          <Link href="#" className={getMobileLinkClass("sell")}>
            {t("navbar.sell")}
          </Link>
          <Link href="/profile/saved" className={getMobileLinkClass("saved")}>
            {t("navbar.saved")}
          </Link>
          {isAdmin && (
            <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-bold text-mosque bg-mosque/10">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
