"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function InquiryForm({ productId, sourceUrl }: { productId?: string; sourceUrl?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        messenger: form.get("messenger"),
        company: form.get("company"),
        message: form.get("message"),
        productId,
        sourceUrl
      })
    });
    setStatus(response.ok ? "sent" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" required />
      </div>
      <div className="field">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone / WhatsApp / WeChat</label>
        <input id="phone" name="phone" />
      </div>
      <div className="field">
        <label htmlFor="messenger">Messenger ID</label>
        <input id="messenger" name="messenger" />
      </div>
      <div className="field">
        <label htmlFor="message">Product requirements</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Enter product details such as size, color, materials, quantity, and other requirements."
          required
        />
      </div>
      <button className="button" type="submit" disabled={status === "sending"}>
        <Send size={16} />
        <span style={{ marginLeft: 8 }}>{status === "sending" ? "Sending" : "Send inquiry"}</span>
      </button>
      {status === "sent" && <p>Your inquiry has been received.</p>}
      {status === "error" && <p style={{ color: "var(--danger)" }}>Submission failed. Please try again.</p>}
    </form>
  );
}
