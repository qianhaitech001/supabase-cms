import { detectConnector } from "@global-trade/migrator";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const sourceSiteUrl = String(form.get("sourceSiteUrl") ?? "");
  const files = form.getAll("files").filter((file): file is File => file instanceof File);

  if (!sourceSiteUrl || files.length === 0) {
    return NextResponse.json({ error: "sourceSiteUrl and files are required." }, { status: 400 });
  }

  const context = {
    sourceSiteUrl,
    files: await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        contentType: file.type,
        text: await file.text()
      }))
    )
  };

  const connector = await detectConnector(context);
  if (!connector) {
    return NextResponse.json({ error: "No compatible migration connector detected." }, { status: 400 });
  }

  const preview = await connector.preview(context);
  return NextResponse.json(preview);
}
