"use server";

import { createCookieSupabaseClient } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createCookieSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createCookieSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
