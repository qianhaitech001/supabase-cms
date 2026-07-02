import type { MediaUploadProvider } from "@global-trade/core";
import { createHash, createHmac } from "node:crypto";
import type { createCookieSupabaseClient } from "./auth";

type SupabaseClient = Awaited<ReturnType<typeof createCookieSupabaseClient>>;

export interface AdminMediaUploadInput {
  supabase: SupabaseClient;
  file: File;
  alt?: string | null | undefined;
  title?: string | null | undefined;
}

export interface AdminMediaUploadResult {
  provider: MediaUploadProvider;
  storagePath: string;
  publicUrl: string;
}

export function getMediaUploadProvider(): MediaUploadProvider {
  const envProvider = process.env.MEDIA_UPLOAD_PROVIDER?.trim();
  if (envProvider === "supabase" || envProvider === "upyun" || envProvider === "ali_oss") return envProvider;
  return "supabase";
}

export async function uploadAdminMedia(input: AdminMediaUploadInput): Promise<AdminMediaUploadResult> {
  const provider = getMediaUploadProvider();
  if (provider === "upyun") return uploadToUpyun(input);
  if (provider === "ali_oss") return uploadToAliOss(input);
  return uploadToSupabase(input);
}

async function uploadToSupabase({ supabase, file, alt, title }: AdminMediaUploadInput): Promise<AdminMediaUploadResult> {
  const bucket = process.env.SUPABASE_MEDIA_BUCKET?.trim() || "media";
  const storagePath = buildMediaStoragePath(file.name, "admin");
  const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, await file.arrayBuffer(), {
    contentType: file.type,
    upsert: false
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  const publicUrl = data.publicUrl;
  await insertMediaAsset({
    supabase,
    provider: "supabase",
    storagePath,
    publicUrl,
    file,
    alt,
    title
  });

  return { provider: "supabase", storagePath, publicUrl };
}

async function uploadToUpyun({ supabase, file, alt, title }: AdminMediaUploadInput): Promise<AdminMediaUploadResult> {
  const bucket = readRequiredEnv("UPYUN_BUCKET");
  const operator = readRequiredEnv("UPYUN_OPERATOR");
  const password = readRequiredEnv("UPYUN_PASSWORD");
  const endpoint = normalizeBaseUrl(process.env.UPYUN_API_ENDPOINT?.trim() || "https://v0.api.upyun.com");
  const publicBaseUrl = normalizeBaseUrl(readRequiredEnv("UPYUN_PUBLIC_BASE_URL"));
  const storagePath = buildMediaStoragePath(file.name, process.env.UPYUN_PATH_PREFIX?.trim() || "uploads/admin");
  const requestPath = `/${bucket}/${storagePath.split("/").map(encodeURIComponent).join("/")}`;
  const body = new Uint8Array(await file.arrayBuffer());
  const date = new Date().toUTCString();
  const authorization = createUpyunAuthorizationHeader({
    method: "PUT",
    uri: requestPath,
    date,
    operator,
    password
  });

  const response = await fetch(`${endpoint}${requestPath}`, {
    method: "PUT",
    headers: {
      Authorization: authorization,
      Date: date,
      "Content-Type": file.type || "application/octet-stream"
    },
    body
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`UpYun upload failed (${response.status}): ${message || response.statusText}`);
  }

  const publicUrl = buildUpyunPublicUrl(publicBaseUrl, storagePath);
  await insertMediaAsset({
    supabase,
    provider: "upyun",
    storagePath,
    publicUrl,
    file,
    alt,
    title
  });

  return { provider: "upyun", storagePath, publicUrl };
}

async function uploadToAliOss(_input: AdminMediaUploadInput): Promise<AdminMediaUploadResult> {
  throw new Error(
    "Ali OSS upload is reserved but not enabled yet. Keep MEDIA_UPLOAD_PROVIDER=supabase until the OSS adapter and credentials are configured."
  );
}

async function insertMediaAsset({
  supabase,
  provider,
  storagePath,
  publicUrl,
  file,
  alt,
  title
}: AdminMediaUploadInput & AdminMediaUploadResult) {
  const { error } = await supabase.from("media_assets").insert({
    kind: "local",
    storage_path: storagePath,
    public_url: publicUrl,
    source: { type: "admin-upload", provider },
    alt: alt || null,
    title: title || null,
    mime_type: file.type || null
  });
  if (error) throw new Error(error.message);
}

export function buildMediaStoragePath(fileName: string, prefix: string, timestamp = Date.now()) {
  const normalizedPrefix = prefix
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9/_-]/g, "-");
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return [normalizedPrefix, `${timestamp}-${safeName}`].filter(Boolean).join("/");
}

export function buildUpyunPublicUrl(publicBaseUrl: string, storagePath: string) {
  return `${normalizeBaseUrl(publicBaseUrl)}/${storagePath.replace(/^\/+/, "")}`;
}

export function createUpyunAuthorizationHeader({
  method,
  uri,
  date,
  contentMd5,
  operator,
  password
}: {
  method: string;
  uri: string;
  date?: string | null;
  contentMd5?: string | null;
  operator: string;
  password: string;
}) {
  const passwordMd5 = createHash("md5").update(password).digest("hex");
  const signSource = [method.toUpperCase(), uri, date, contentMd5].filter(Boolean).join("&");
  const signature = createHmac("sha1", passwordMd5).update(signSource).digest("base64");
  return `UPYUN ${operator}:${signature}`;
}

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/g, "");
}
