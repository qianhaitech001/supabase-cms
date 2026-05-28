import { z } from "zod";
import { NextResponse } from "next/server";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const inquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  messenger: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(1),
  productId: z.string().optional(),
  sourceUrl: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = inquirySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid inquiry payload.", issues: parsed.error.flatten() }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mode: "mock" });
  }

  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.from("inquiries").insert({
    status: "new",
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    messenger: parsed.data.messenger,
    company: parsed.data.company,
    message: parsed.data.message,
    product_id: parsed.data.productId,
    source_url: parsed.data.sourceUrl,
    metadata: {
      messenger: parsed.data.messenger
    }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
