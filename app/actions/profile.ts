'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(propertyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User must be logged in to save properties');
  }

  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_properties')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .single();

  if (existing) {
    // Remove it
    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .eq('id', existing.id);
    
    if (error) {
      console.error('Error removing favorite:', error);
      throw new Error('Could not remove favorite');
    }
  } else {
    // Add it
    const { error } = await supabase
      .from('saved_properties')
      .insert({
        user_id: user.id,
        property_id: propertyId
      });
      
    if (error) {
      console.error('Error adding favorite:', error);
      throw new Error('Could not add favorite');
    }
  }

  revalidatePath('/');
  revalidatePath('/profile/saved');
  revalidatePath(`/properties/[slug]`);
}

export async function scheduleVisit(propertyId: string, date: string, time: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User must be logged in to schedule a visit');
  }

  const { error } = await supabase
    .from('scheduled_visits')
    .insert({
      user_id: user.id,
      property_id: propertyId,
      visit_date: date,
      visit_time: time,
      status: 'pending'
    });

  if (error) {
    console.error('Error scheduling visit:', error);
    throw new Error('Could not schedule visit');
  }

  revalidatePath('/profile/visits');
}

export async function updateProfileSettings(state: { success: boolean; message: string } | null, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'User not found' };
  }

  const fullName = formData.get('full_name') as string;
  const phone = formData.get('phone') as string;

  try {
    // We temporarily remove the public.profiles database upsert here 
    // because it appears the table hasn't been created on the user's Supabase instance yet,
    // which causes the entire profile update to fail.

    // 1. Update auth.user_metadata for session consistency
    const currentMeta = user.user_metadata || {};
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        ...currentMeta,
        full_name: fullName,
        phone: phone,
      }
    });

    if (authError) {
        console.error('Supabase Auth Update Error:', authError);
        throw new Error('Supabase Auth Update Error: ' + authError.message);
    }

    // 3. Revalidate paths
    revalidatePath('/profile/settings');
    revalidatePath('/', 'layout'); // Update Navbar

    return { success: true, message: 'Profile updated successfully' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Could not update profile';
    console.error('Error updating profile:', error);
    return { success: false, message: errorMessage };
  }
}
