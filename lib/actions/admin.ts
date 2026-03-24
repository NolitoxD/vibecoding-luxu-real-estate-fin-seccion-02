'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { UserRole } from '@/types/user';
import { Property } from '@/types/property';
export async function updateUserRole(userId: string, newRole: UserRole) {
  const supabase = await createClient();
  
  // Verify the current user is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!roleData || roleData.role !== 'admin') {
    throw new Error('Forbidden: You do not have permission to perform this action');
  }

  // Update the target user's role
  const { error } = await supabase
    .from('user_roles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message || 'Failed to update role');
  }

  // Revalidate the users page so the list refreshes
  revalidatePath('/admin/users');
}

export async function deleteProperty(propertyId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single();
  if (!roleData || roleData.role !== 'admin') throw new Error('Forbidden: You do not have permission to perform this action');

  const { error } = await supabase.from('properties').delete().eq('id', propertyId);
  if (error) throw new Error(error.message || 'Failed to delete property');

  revalidatePath('/admin');
}

export async function updateProperty(propertyId: string, data: Partial<Property>) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single();
  if (!roleData || roleData.role !== 'admin') throw new Error('Forbidden: You do not have permission to perform this action');

  const { error } = await supabase.from('properties').update(data).eq('id', propertyId);
  if (error) throw new Error(error.message || 'Failed to update property');

  revalidatePath('/admin');
}

export async function adminCreateUser(data: { email: string; password?: string; role: UserRole }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single();
  if (!roleData || roleData.role !== 'admin') throw new Error('Forbidden');

  // We use the anon key with persistSession: false so the admin does not get logged out
  // when creating a new user through this temporary client instance.
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const tempAuthClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: newAuthUser, error: authError } = await tempAuthClient.auth.signUp({
    email: data.email,
    password: data.password || 'TemporaryPassword123!',
  });

  if (authError || !newAuthUser.user) {
    throw new Error(authError?.message || 'Error creating user in Auth');
  }

  // Allow trigger (if any) to populate the basic user_roles record first
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Now, stringently upsert the desired role into user_roles
  // using the admin's authenticated server client (which has JWT for RLS bypass if policy applies).
  const { error: roleError } = await supabase
    .from('user_roles')
    .upsert({
      id: newAuthUser.user.id,
      email: data.email,
      role: data.role
    }, { onConflict: 'id' });

  if (roleError) {
    console.warn('Failed to assign explicit user role (RLS may apply), wait for trigger fallback:', roleError);
  } else if (data.role !== 'user') {
    // Make doubly sure it updates if the trigger inserted before upsert could
    await supabase.from('user_roles').update({ role: data.role }).eq('id', newAuthUser.user.id);
  }

  revalidatePath('/admin/users');
  return { success: true };
}
