import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/i18n/server";
import ProfileSidebar from "./components/ProfileSidebar";
import Navbar from "@/components/Navbar";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { t } = await getTranslation();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-clear-day/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb back to home */}
          <div className="flex items-center gap-2 text-sm text-nordic/60 mb-6">
            <Link href="/" className="hover:text-mosque transition-colors flex items-center gap-1">
              <span className="material-icons text-sm font-material-icons">home</span>
              Home
            </Link>
            <span className="material-icons text-xs font-material-icons">chevron_right</span>
            <span className="text-nordic font-medium">{t('profile.title') || 'My Profile'}</span>
          </div>

          <h1 className="text-3xl font-light text-nordic mb-8">{t('profile.title') || 'My Profile'}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-nordic/10 pt-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <ProfileSidebar 
                savedLabel={t('profile.saved') || 'Saved Properties'}
                visitsLabel={t('profile.visits') || 'Scheduled Visits'}
                settingsLabel={t('profile.settings') || 'Settings'}
              />
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-nordic/5 p-6 min-h-[500px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
