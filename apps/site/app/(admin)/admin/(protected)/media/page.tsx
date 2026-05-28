import { uploadMediaAction } from "@/app/(admin)/admin/actions";
import { listAdminMedia } from "@/lib/admin-data";

export default async function MediaPage() {
  const media = await listAdminMedia();

  return (
    <div>
      <h1>Media</h1>
      <form action={uploadMediaAction} className="payload-form" style={{ marginTop: 20 }}>
        <section className="payload-form-section">
          <h2>Upload local media</h2>
          <div className="payload-field">
            <label htmlFor="file">File</label>
            <input id="file" name="file" type="file" accept="image/*,application/pdf" required />
          </div>
          <div className="payload-field-grid">
            <div className="payload-field">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" />
            </div>
            <div className="payload-field">
              <label htmlFor="alt">Alt</label>
              <input id="alt" name="alt" />
            </div>
          </div>
          <button className="payload-button" type="submit">
            Upload
          </button>
        </section>
      </form>
      <section className="payload-list" style={{ marginTop: 24 }}>
        {media.map((asset) => (
          <article className="payload-card" key={asset.id}>
            <div className="payload-card__body">
              <div className="payload-media-row">
                {asset.mimeType?.startsWith("image/") || asset.publicUrl.match(/\.(png|jpe?g|webp|gif|svg)(\?|$)/i) ? (
                  <img src={asset.publicUrl} alt={asset.alt ?? asset.title ?? ""} />
                ) : (
                  <div className="payload-media-file">{asset.mimeType ?? "file"}</div>
                )}
                <div>
                  <strong>{asset.title || asset.publicUrl}</strong>
                  <p>{asset.kind}</p>
                  <code>{asset.publicUrl}</code>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
