import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Protect route: Redirect to home if user is already authenticated
  if (user) {
    redirect("/");
  }

  // Render Client Component (the form itself)
  return <LoginForm />;
}
