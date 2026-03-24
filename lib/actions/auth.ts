"use server";

import { createClient } from "@/lib/supabase/server";

export async function registerUser(email: string, password: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Nota: Si configuraste triggers en Supabase (public.handle_new_user),
  // el usuario se añadirá a public.user_roles automáticamente.
  // Si no, podríamos hacer un insert aquí usando un service_role admin client,
  // pero el signup cliente por defecto no puede escribir en user_roles sin políticas.

  return { success: true };
}

export async function signInUser(email: string, password: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
