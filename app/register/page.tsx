import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";

export default async function RegisterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return <RegisterForm />;
}
