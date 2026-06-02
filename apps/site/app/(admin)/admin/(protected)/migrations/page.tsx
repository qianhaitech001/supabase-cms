"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Database, FileArchive, Link2, Upload } from "lucide-react";

export default function MigrationWizardPage() {
  const [sourceSiteUrl, setSourceSiteUrl] = useState("");
  const [replacementSiteUrl, setReplacementSiteUrl] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [preview, setPreview] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const resultRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (importResult) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [importResult]);

  useEffect(() => {
    if (!importing) return;
    setImportProgress(8);
    const timer = window.setInterval(() => {
      setImportProgress((value) => Math.min(92, value + Math.max(1, Math.round((95 - value) * 0.08))));
    }, 420);
    return () => window.clearInterval(timer);
  }, [importing]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    form.set("sourceSiteUrl", sourceSiteUrl);
    form.set("replacementSiteUrl", replacementSiteUrl);
    const response = await fetch("/api/migrations/preview", {
      method: "POST",
      body: form
    });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(payload.error ?? "Preview failed");
      return;
    }
    setPreview(payload);
    setImportResult(null);
  }

  async function onImport() {
    const formElement = document.querySelector<HTMLFormElement>("#migration-form");
    if (!formElement) return;
    setImporting(true);
    setImportProgress(8);
    setError(null);
    const form = new FormData(formElement);
    form.set("sourceSiteUrl", sourceSiteUrl);
    form.set("replacementSiteUrl", replacementSiteUrl);
    const response = await fetch("/api/migrations/import", {
      method: "POST",
      body: form
    });
    const payload = await response.json();
    setImporting(false);
    setImportProgress(response.ok ? 100 : 0);
    if (!response.ok) {
      setError(payload.error ?? "Import failed");
      return;
    }
    setImportResult(payload);
  }

  return (
    <div className="migration-page">
      <div className="payload-page-header">
        <div>
          <p className="payload-eyebrow">WordPress / WooCommerce</p>
          <h1>Migration Wizard</h1>
          <p>Preview imported entities, inspect warnings, then import products, posts, pages, categories, and remote media references.</p>
        </div>
      </div>

      {error && (
        <div className="payload-alert payload-alert--danger">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="migration-workbench">
        <form id="migration-form" className="migration-card migration-form-card" onSubmit={onSubmit}>
          <div className="migration-card__header">
            <span className="migration-step">1</span>
            <div>
              <h2>Source and files</h2>
              <p>Both URL fields are optional. Leave them empty to import using the default inshowhome.com source.</p>
            </div>
          </div>

          <div className="migration-url-grid">
            <div className="migration-field">
              <label htmlFor="sourceSiteUrl">
                <Link2 size={15} />
                Old URL to find
              </label>
              <input
                id="sourceSiteUrl"
                name="sourceSiteUrl"
                placeholder="https://inshowhome.com"
                value={sourceSiteUrl}
                onChange={(event) => setSourceSiteUrl(event.target.value)}
              />
              <small>Used as source URL and replacement target when paired with the new URL.</small>
            </div>
            <div className="migration-field">
              <label htmlFor="replacementSiteUrl">
                <Link2 size={15} />
                New replacement URL
              </label>
              <input
                id="replacementSiteUrl"
                name="replacementSiteUrl"
                placeholder="https://your-new-domain.com"
                value={replacementSiteUrl}
                onChange={(event) => setReplacementSiteUrl(event.target.value)}
              />
              <small>Optional. Rewrites matching old URLs inside uploaded XML/CSV before preview and import.</small>
            </div>
          </div>

          <label className="migration-dropzone" htmlFor="files">
            <FileArchive size={24} />
            <strong>WordPress XML / WooCommerce CSV</strong>
            <span>{fileNames.length ? `${fileNames.length} file(s) selected` : "Choose XML or CSV files for preview"}</span>
            <input
              id="files"
              name="files"
              type="file"
              multiple
              accept=".xml,.csv,text/xml,text/csv"
              required
              onChange={(event) => setFileNames(Array.from(event.currentTarget.files ?? []).map((file) => file.name))}
            />
          </label>

          {fileNames.length > 0 && (
            <div className="migration-file-list">
              {fileNames.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          )}

          <button className="payload-button migration-primary-action" type="submit" disabled={loading}>
            <Upload size={16} />
            <span>{loading ? "Previewing" : "Preview migration"}</span>
          </button>
        </form>

        <aside className="migration-card migration-status-card">
          <div className="migration-card__header">
            <span className="migration-step">2</span>
            <div>
              <h2>Import flow</h2>
              <p>Preview first, then import. Remote media URLs are kept as old-site references unless you replace URLs above.</p>
            </div>
          </div>
          <div className="migration-flow-list">
            <div className={preview ? "is-done" : undefined}>
              <CheckCircle2 size={17} />
              <span>Parse uploaded files</span>
            </div>
            <div className={preview ? "is-done" : undefined}>
              <Database size={17} />
              <span>Validate entity counts</span>
            </div>
            <div className={importResult ? "is-done" : importing ? "is-active" : undefined}>
              <Upload size={17} />
              <span>Import into Supabase</span>
            </div>
          </div>
          {(importing || importProgress > 0) && (
            <div className="migration-progress" aria-label="Import progress" aria-valuemax={100} aria-valuemin={0} aria-valuenow={importProgress} role="progressbar">
              <div className="migration-progress__bar" style={{ width: `${importProgress}%` }} />
              <span>{importing ? `Importing ${importProgress}%` : "Import completed"}</span>
            </div>
          )}
        </aside>
      </div>

      {preview && (
        <section className="migration-card migration-preview-card">
          <div className="migration-preview-header">
            <div>
              <p className="payload-eyebrow">Preview</p>
              <h2>{preview.connector ?? "Migration"} summary</h2>
            </div>
            <button className="payload-button" type="button" disabled={importing} onClick={onImport}>
              {importing ? "Importing" : "Import now"}
            </button>
          </div>

          <div className="migration-count-grid">
            {Object.entries(preview.counts ?? {}).map(([key, value]) => (
              <div className="migration-count-card" key={key}>
                <span>{formatLabel(key)}</span>
                <strong>{String(value)}</strong>
              </div>
            ))}
          </div>

          {preview.warnings?.length ? (
            <div className="migration-warning-list">
              {preview.warnings.slice(0, 6).map((warning: any, index: number) => (
                <div className="payload-alert payload-alert--warning" key={`${warning.code}-${index}`}>
                  <AlertTriangle size={16} />
                  <span>{warning.message}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="payload-alert payload-alert--success">
              <CheckCircle2 size={17} />
              <span>No blocking warnings detected in preview.</span>
            </div>
          )}

          <details className="migration-json-details">
            <summary>View raw preview JSON</summary>
            <pre>{JSON.stringify(preview, null, 2)}</pre>
          </details>
        </section>
      )}
      {importResult && (
        <section className="migration-card migration-result-card" ref={resultRef}>
          <div className="payload-alert payload-alert--success">
            <CheckCircle2 size={18} />
            <span>
              {importResult.message ?? "Import completed."} Imported {importResult.imported ?? 0}, updated{" "}
              {importResult.updated ?? 0}, skipped {importResult.skipped ?? 0}.
            </span>
          </div>
          <div className="migration-result-grid">
            <div><span>Imported</span><strong>{importResult.imported ?? 0}</strong></div>
            <div><span>Updated</span><strong>{importResult.updated ?? 0}</strong></div>
            <div><span>Skipped</span><strong>{importResult.skipped ?? 0}</strong></div>
          </div>
          <details className="migration-json-details">
            <summary>View raw import JSON</summary>
            <pre>{JSON.stringify(importResult, null, 2)}</pre>
          </details>
        </section>
      )}
    </div>
  );
}

function formatLabel(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}
