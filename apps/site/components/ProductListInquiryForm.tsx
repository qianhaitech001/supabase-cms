"use client";

import { useState } from "react";
import { StaticContactPanel } from "@/components/storefront/StaticContactPanel";
import type { StaticLocale } from "@/lib/static-content";

export function ProductListInquiryForm({
  isStaticMode = false,
  locale = "en"
}: {
  isStaticMode?: boolean;
  locale?: StaticLocale;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (isStaticMode) {
    return <StaticContactPanel compact locale={locale} />;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const productName = String(form.get("productName") ?? "");
    const inquiryType = String(form.get("inquiryType") ?? "");
    const question = String(form.get("question") ?? "");

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formName: "Product Inquiry",
        formData: {
          inquiryType,
          productName,
          question,
          name: form.get("name"),
          email: form.get("email"),
          payment: form.get("payment"),
          sourceUrl: "/products"
        },
        formType: "product_inquiry",
        subject: productName ? `Product inquiry: ${productName}` : "Product inquiry",
        name: form.get("name"),
        email: form.get("email"),
        message: question,
        sourceUrl: "/products",
        fields: {
          inquiryType,
          productName,
          payment: form.get("payment")
        },
        fieldLabels: {
          inquiryType: "Inquiry Type",
          productName: "Product Name",
          question: "Question",
          name: "Name",
          email: "Email address",
          payment: "Payment"
        }
      })
    });

    setStatus(response.ok ? "sent" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form className="product-list-inquiry-form" onSubmit={onSubmit}>
      <div className="product-list-field product-list-field--full">
        <label htmlFor="inquiryType">Inquiry Type <span>*</span></label>
        <select id="inquiryType" name="inquiryType" defaultValue="product consultation">
          <option>product consultation</option>
          <option>project quotation</option>
          <option>customization</option>
        </select>
      </div>
      <div className="product-list-field product-list-field--full">
        <label htmlFor="productName">Product Name</label>
        <input id="productName" name="productName" placeholder="Product Name" />
      </div>
      <div className="product-list-field product-list-field--full">
        <label htmlFor="question">Question <span>*</span></label>
        <textarea id="question" name="question" placeholder="Question" required rows={6} />
      </div>
      <div className="product-list-field">
        <label htmlFor="name">Name <span>*</span></label>
        <input id="name" name="name" required />
      </div>
      <div className="product-list-field">
        <label htmlFor="email">Email address <span>*</span></label>
        <input id="email" name="email" placeholder="Email address" required type="email" />
      </div>
      <div className="product-list-field product-list-field--full">
        <label htmlFor="payment">Payment</label>
        <input id="payment" name="payment" />
      </div>
      <button className="product-list-send" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending" : "Send Now"}
      </button>
      {status === "sent" ? <p className="product-list-form-status">Your inquiry has been received.</p> : null}
      {status === "error" ? <p className="product-list-form-status is-error">Submission failed. Please try again.</p> : null}
    </form>
  );
}
