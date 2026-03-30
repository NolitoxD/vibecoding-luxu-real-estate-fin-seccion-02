import { createClient } from "@/lib/supabase/server";
import { getTranslation } from "@/i18n/server";
import ProfileForm from "./components/ProfileForm";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Try to fetch from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { t } = await getTranslation();
  
  // 2. Fallback to user_metadata if profile table record is missing
  const initialData = {
    fullName: profile?.full_name || user.user_metadata?.full_name || '',
    phone: profile?.phone || user.user_metadata?.phone || '',
    email: user.email || ''
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-nordic mb-6">{t('profile.settings') || 'Profile Settings'}</h2>

      <div className="max-w-2xl">
        <ProfileForm initialData={initialData} />
      </div>
    </div>
  );
}
