import { z } from "zod";
import { NextResponse } from "next/server";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const inquirySchema = z.object({
  formName: z.string().min(1).max(200).optional(),
  formData: z.record(z.unknown()).optional(),
  formType: z.string().regex(/^[a-z][a-z0-9_]{0,63}$/).default("product_inquiry"),
  subject: z.string().max(300).optional(),
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(80).optional(),
  messenger: z.string().max(120).optional(),
  company: z.string().max(200).optional(),
  message: z.string().min(1).max(5000).optional(),
  productId: z.string().uuid().optional(),
  sourceUrl: z.string().max(1000).optional(),
  fields: z.record(z.unknown()).default({}),
  fieldLabels: z.record(z.string()).default({})
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
  const metadata = buildRequestMetadata(request, parsed.data.sourceUrl);
  const formData = normalizePayload({
    ...(parsed.data.formData ?? {}),
    ...(parsed.data.fields ?? {})
  });
  const name = stringField(parsed.data.name ?? formData.name) || "Unknown";
  const email = stringField(parsed.data.email ?? formData.email ?? formData.emailAddress) || "unknown@example.com";
  const message = stringField(parsed.data.message ?? formData.message ?? formData.question ?? formData.requirements) || "No message provided.";
  const formName = parsed.data.formName || parsed.data.subject || humanizeFormType(parsed.data.formType);
  const formType = parsed.data.formName ? slugifyFormName(parsed.data.formName) : parsed.data.formType;
  const payload = normalizePayload({
    ...formData,
    name,
    email,
    phone: parsed.data.phone,
    messenger: parsed.data.messenger,
    company: parsed.data.company,
    message,
    productId: parsed.data.productId,
    sourceUrl: parsed.data.sourceUrl
  });
  const { error } = await supabase.from("inquiries").insert({
    status: "new",
    form_type: formType,
    subject: formName,
    name,
    email,
    phone: parsed.data.phone ?? stringField(formData.phone),
    messenger: parsed.data.messenger ?? stringField(formData.messenger),
    company: parsed.data.company ?? stringField(formData.company),
    message,
    product_id: parsed.data.productId,
    source_url: parsed.data.sourceUrl,
    payload,
    field_labels: parsed.data.fieldLabels,
    metadata
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function stringField(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function slugifyFormName(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
  return /^[a-z]/.test(slug) ? slug : "custom_form";
}

function humanizeFormType(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildRequestMetadata(request: Request, sourceUrl: string | undefined) {
  const url = new URL(request.url);
  return {
    sourceUrl,
    referrer: request.headers.get("referer") ?? undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
    utm: Object.fromEntries([...url.searchParams.entries()].filter(([key]) => key.startsWith("utm_")))
  };
}

function normalizePayload(input: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(input)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, normalizeJsonValue(value)])
  );
}

function normalizeJsonValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalizeJsonValue);
  if (typeof value === "object" && value !== null) return normalizePayload(value as Record<string, unknown>);
  if (["string", "number", "boolean"].includes(typeof value)) return value;
  return String(value);
}
