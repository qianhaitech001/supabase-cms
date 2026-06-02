import { detectConnector } from "@global-trade/migrator";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const sourceSiteUrl = normalizeUrl(String(form.get("sourceSiteUrl") ?? "")) ?? "https://inshowhome.com";
  const replacementSiteUrl = normalizeUrl(String(form.get("replacementSiteUrl") ?? ""));
  const files = form.getAll("files").filter((file): file is File => file instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Files are required." }, { status: 400 });
  }

  const context = {
    sourceSiteUrl,
    files: await Promise.all(
      files.map(async (file) => {
        const text = await file.text();
        return {
          filename: file.name,
          contentType: file.type,
          text: replacementSiteUrl ? replaceSourceUrl(text, sourceSiteUrl, replacementSiteUrl) : text
        };
      })
    )
  };

  const connector = await detectConnector(context);
  if (!connector) {
    return NextResponse.json({ error: "No compatible migration connector detected." }, { status: 400 });
  }

  const preview = await connector.preview(context);
  return NextResponse.json({
    ...preview,
    urlReplacement: replacementSiteUrl
      ? {
          from: sourceSiteUrl,
          to: replacementSiteUrl
        }
      : undefined
  });
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    return new URL(trimmed).origin;
  } catch {
    return undefined;
  }
}

function replaceSourceUrl(text: string, from: string, to: string) {
  return text.split(from).join(to).split(from.replace(/^https:\/\//, "http://")).join(to).split(from.replace(/^http:\/\//, "https://")).join(to);
}
