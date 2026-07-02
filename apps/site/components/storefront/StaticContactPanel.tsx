import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStaticContent, type StaticLocale } from "@/lib/static-content";

type StaticContactPanelProps = {
  title?: string;
  description?: string;
  productName?: string;
  compact?: boolean;
  locale?: StaticLocale;
};

export function StaticContactPanel({
  title,
  description,
  productName,
  compact = false,
  locale = "en"
}: StaticContactPanelProps) {
  const content = getStaticContent(locale);
  const labels = content.text.staticContact;
  const contact = content.contact;
  const mailHref = productName
    ? `mailto:${contact.email}?subject=${encodeURIComponent(`Inquiry: ${productName}`)}`
    : `mailto:${contact.email}`;

  return (
    <section className={compact ? "static-contact-panel static-contact-panel--compact" : "static-contact-panel"}>
      <div className="static-contact-panel__copy">
        <p className="static-contact-panel__eyebrow">{labels.eyebrow}</p>
        <h2>{title ?? labels.title}</h2>
        <p>{description ?? labels.description}</p>
      </div>
      <div className="static-contact-panel__actions">
        <Button asChild className="inshow-button">
          <a href={mailHref}>
            <Mail size={16} />
            {labels.emailUs}
          </a>
        </Button>
        <Button asChild className="inshow-button inshow-button--outline">
          <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} rel="noreferrer" target="_blank">
            <MessageCircle size={16} />
            {labels.whatsapp}
          </a>
        </Button>
      </div>
      {!compact && (
        <div className="static-contact-panel__grid">
          <article>
            <Mail size={20} />
            <strong>{content.text.contact.email}</strong>
            <a href={mailHref}>{contact.email}</a>
          </article>
          <article>
            <Phone size={20} />
            <strong>{labels.phone}</strong>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
          </article>
          <article>
            <MapPin size={20} />
            <strong>{labels.address}</strong>
            <span>{contact.address}</span>
          </article>
        </div>
      )}
      {!compact && (
        <figure className="static-contact-panel__map">
          <iframe loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={contact.mapEmbedUrl} title="Office map" />
          <figcaption>
            <ExternalLink size={15} />
            {labels.mapCaption}
          </figcaption>
        </figure>
      )}
    </section>
  );
}
