import { detectConnector, type MigrationEntity } from "@global-trade/migrator";
import { createCookieSupabaseClient } from "@/lib/auth";
import { importMigrationEntities } from "@/lib/migration-import";
import { isSupabaseConfigured } from "@/lib/supabase";
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

  const entities = await connector.map(context);
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      message: "Import staging completed. Supabase is not configured, so no data was persisted.",
      entities: entities.length,
      counts: countEntities(entities)
    });
  }

  const supabase = await createCookieSupabaseClient();
  try {
    const result = await importMigrationEntities(supabase, entities);

    return NextResponse.json({
      message: "Import completed.",
      entities: entities.length,
      imported: result.imported,
      updated: result.updated,
      skipped: result.skipped,
      counts: result.counts
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Import failed." }, { status: 500 });
  }
}

function countEntities(entities: MigrationEntity[]) {
  return entities.reduce<Record<string, number>>((acc, entity) => {
    acc[entity.kind] = (acc[entity.kind] ?? 0) + 1;
    return acc;
  }, {});
}
