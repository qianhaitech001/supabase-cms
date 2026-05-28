import { InquiryForm } from "@/components/InquiryForm";

export default function ContactPage() {
  return (
    <main className="shell section">
      <h1>Contact</h1>
      <p style={{ color: "var(--muted)", maxWidth: 680 }}>
        Tell us about your project requirements. The inquiry is stored in the admin and can notify the sales team.
      </p>
      <div style={{ maxWidth: 680, marginTop: 24 }}>
        <InquiryForm sourceUrl="/contact" />
      </div>
    </main>
  );
}
