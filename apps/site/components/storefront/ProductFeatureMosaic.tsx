import Link from "next/link";

export function ProductFeatureMosaic({
  largeImage,
  smallImage
}: {
  largeImage: string;
  smallImage: string;
}) {
  return (
    <section className="featured-products">
      <div className="featured-col-lg">
        <img src={largeImage} alt="Time to flourish" />
        <div className="featured-col-lg_info">
          <h3>Time to flourish</h3>
          <p>Spring your space to life with small shifts &amp; big</p>
          <Link className="detail-btn" href="/products">
            Details
          </Link>
        </div>
      </div>
      <div className="featured-col-sm">
        <img src={smallImage} alt="Time to flourish" />
      </div>
    </section>
  );
}
