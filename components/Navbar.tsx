import Link from "next/link";
import Image from "next/image";
import { getTranslation } from "@/i18n/server";
import { createClient } from "@/lib/supabase/server";
import LanguageSelector from "./LanguageSelector";
import { signOut } from "@/app/actions/auth";

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
            <Link href="#" className={getLinkClass("saved")}>
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
              <div className="flex items-center gap-3 pl-2 border-l border-nordic/10 ml-2">
                <button aria-label="Profile" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all relative">
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  ) : (
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <form action={signOut}>
                  <button type="submit" className="text-sm font-medium text-nordic/70 hover:text-red-500 transition-colors hidden sm:block">
                    {t("navbar.signOut")}
                  </button>
                  {/* Mobile icon equivalent or generic signout icon if extremely constrained */}
                  <button type="submit" aria-label="Sign Out" className="sm:hidden text-nordic/70 hover:text-red-500 pt-1">
                    <span className="material-icons text-[20px]">logout</span>
                  </button>
                </form>
              </div>
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
          <Link href="#" className={getMobileLinkClass("saved")}>
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
