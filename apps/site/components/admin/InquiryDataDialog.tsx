"use client";

import type { Inquiry } from "@global-trade/core";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type InquiryDataDialogProps = {
  inquiry: Inquiry;
  formData: Record<string, unknown>;
};

export function InquiryDataDialog({ inquiry, formData }: InquiryDataDialogProps) {
  const entries = Object.entries(formData).filter(([, value]) => value !== undefined && value !== null && value !== "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="payload-action-button" type="button">
          View
        </button>
      </DialogTrigger>
      <DialogContent className="inquiry-dialog-content">
        <DialogHeader>
          <DialogTitle>{inquiry.subject || formatFormType(inquiry.formType)}</DialogTitle>
        </DialogHeader>
        <div className="inquiry-dialog-meta">
          <span>{new Date(inquiry.createdAt).toLocaleString()}</span>
          <span>{formatFormType(inquiry.formType)}</span>
        </div>
        <div className="inquiry-dialog-data">
          {entries.length > 0 ? (
            entries.map(([key, value]) => (
              <div key={key}>
                <span>{inquiry.fieldLabels?.[key] ?? humanizeKey(key)}</span>
                <strong>{formatValue(value)}</strong>
              </div>
            ))
          ) : (
            <p className="payload-muted">No form data.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function humanizeKey(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(formatValue).join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value, null, 2);
  return String(value);
}

function formatFormType(value: string) {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
