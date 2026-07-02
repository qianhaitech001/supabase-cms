import Link from "next/link";
import { inshowAssets } from "@/lib/inshow-assets";
import { getStaticContent, type StaticLocale } from "@/lib/static-content";

export function Footer({ locale }: { locale: StaticLocale }) {
  const content = getStaticContent(locale);
  const text = content.text.footer;
  const year = new Date().getFullYear();
  return (
    <footer id="colophon" className="site-footer">
      <div className="before-container" />
      <div className="footer-container">
        <div className="footer-columns">
          <div className="footer-column">
            <div className="footer-widget footer-info-widget">
              <div className="site-branding">
                <img className="custom-logo" src={inshowAssets.footerLogo} alt="INSHOW HOME" />
                <div className="site-title-block">
                  <h1 className="site-title">INSHOW HOME</h1>
                  <p className="site-description">Full range customization.</p>
                </div>
              </div>
              <h2>{text.address}</h2>
              <p>Ningbo Zhejiang</p>
              <h2>{text.officeHours}</h2>
              <p>Monday - Sunday 10.00 - 18.00.</p>
            </div>
          </div>
          <div className="footer-column">
            <div className="footer-widget footer-contact-widget">
              <h1 className="footer-widget-title">{text.getInTouch}</h1>
              <div className="footer-contact-widget_block">
                <h2>{content.text.staticContact.phone}</h2>
                <p>{content.contact.phone}</p>
              </div>
              <div className="footer-contact-widget_block">
                <h2>{content.text.contact.email}</h2>
                <p>{content.contact.email}</p>
              </div>
            </div>
          </div>
          <div className="footer-column">
            <div className="footer-widget">
              <h1 className="footer-widget-title">{text.usefulLinks}</h1>
              <ul className="friend-links">
                {text.links.map((label, index) => (
                  <li key={label}>
                    <Link href={["/about-us", "/products", "/about-us", "/about-us", "/about-us", "/contact"][index] ?? "/about-us"}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <p>{text.copyright(year)}</p>
        </div>
      </div>
    </footer>
  );
}
