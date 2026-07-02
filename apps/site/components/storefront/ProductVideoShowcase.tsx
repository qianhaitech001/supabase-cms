type ProductVideoShowcaseProps = {
  videos: string[];
  title?: string;
  description?: string;
};

export function ProductVideoShowcase({
  videos,
  title = "Product Video",
  description = "Static and dynamic product pages can reuse hosted video URLs without copying files into the app."
}: ProductVideoShowcaseProps) {
  if (videos.length === 0) return null;

  return (
    <section className="product-video-showcase">
      <div className="single-product-container">
        <div className="inshow-section-header">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="product-video-showcase__grid">
          {videos.map((url, index) => (
            <video controls key={`${url}-${index}`} muted playsInline preload="metadata" src={url} />
          ))}
        </div>
      </div>
    </section>
  );
}
