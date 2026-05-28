"use server";

import { createCookieSupabaseClient, requireAdminSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function uploadFileAction(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  await requireAdminSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "File is required." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createCookieSupabaseClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const storagePath = `admin/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(storagePath, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) return { error: uploadError.message };

  const { data } = supabase.storage.from("media").getPublicUrl(storagePath);
  const publicUrl = data.publicUrl;

  await supabase.from("media_assets").insert({
    kind: "local",
    storage_path: storagePath,
    public_url: publicUrl,
    source: { type: "admin-upload" },
    alt: null,
    title: null,
    mime_type: file.type || null,
  });

  return { url: publicUrl };
}
