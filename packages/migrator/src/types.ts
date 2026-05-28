import type {
  Page,
  Post,
  PostCategory,
  PostTag,
  Product,
  ProductCategory,
  ProductTag,
  SeoFields,
  SourceIdentity
} from "@global-trade/core";

export type MigrationEntityKind =
  | "product"
  | "productCategory"
  | "productTag"
  | "post"
  | "postCategory"
  | "postTag"
  | "page"
  | "media"
  | "redirect";

export interface MigrationFile {
  filename: string;
  contentType?: string;
  text: string;
}

export interface MigrationContext {
  sourceSiteUrl: string;
  files: MigrationFile[];
  options?: Record<string, unknown>;
}

export interface MigrationPreview {
  connector: string;
  counts: Record<MigrationEntityKind, number>;
  warnings: MigrationWarning[];
  samples: MigrationEntity[];
  detectedSeoPlugins: string[];
  sourceTotals?: Record<string, number> | undefined;
  requiredActions: string[];
}

export interface MigrationWarning {
  code: string;
  message: string;
  severity: "info" | "warning" | "error";
  sourceId?: string;
}

export type MigrationEntity =
  | { kind: "product"; source: SourceIdentity; data: Omit<Product, "id" | "updatedAt"> }
  | { kind: "productCategory"; source: SourceIdentity; data: Omit<ProductCategory, "id"> }
  | { kind: "productTag"; source: SourceIdentity; data: Omit<ProductTag, "id"> }
  | { kind: "post"; source: SourceIdentity; data: Omit<Post, "id" | "updatedAt"> }
  | { kind: "postCategory"; source: SourceIdentity; data: Omit<PostCategory, "id"> }
  | { kind: "postTag"; source: SourceIdentity; data: Omit<PostTag, "id"> }
  | { kind: "page"; source: SourceIdentity; data: Omit<Page, "id" | "updatedAt"> }
  | { kind: "media"; source: SourceIdentity; data: NormalizedMedia }
  | { kind: "redirect"; source: SourceIdentity; data: RedirectRecord };

export interface NormalizedMedia {
  sourceUrl: string;
  alt?: string | undefined;
  title?: string | undefined;
  caption?: string | undefined;
  mimeType?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
}

export interface RedirectRecord {
  sourcePath: string;
  targetPath: string;
  statusCode: 301 | 302;
}

export interface ImportBatchResult {
  imported: number;
  updated: number;
  skipped: number;
  warnings: MigrationWarning[];
}

export interface MigrationConnector {
  id: string;
  label: string;
  detect(context: MigrationContext): Promise<boolean> | boolean;
  preview(context: MigrationContext): Promise<MigrationPreview>;
  map(context: MigrationContext): Promise<MigrationEntity[]>;
  importBatch?(entities: MigrationEntity[], options: ImportBatchOptions): Promise<ImportBatchResult>;
  rollback?(batchId: string, options: RollbackOptions): Promise<void>;
}

export interface ImportBatchOptions {
  batchId: string;
  dryRun?: boolean;
}

export interface RollbackOptions {
  dryRun?: boolean;
}

export interface SeoAdapter {
  id: string;
  detect(meta: Record<string, unknown>): boolean;
  map(meta: Record<string, unknown>): SeoFields;
}

export interface FieldMapper<TSource, TTarget> {
  map(source: TSource): TTarget;
}
