"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ChatNowDialog() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="button button-outline" type="button">
          Chat Now
        </button>
      </DialogTrigger>
      <DialogContent className="chat-now-dialog">
        <DialogTitle>Please enter your mailbox</DialogTitle>
        <form
          className="chat-now-form"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <label htmlFor="chat-email">Email:</label>
          <input
            id="chat-email"
            name="email"
            onChange={(event) => {
              setEmail(event.target.value);
              setSubmitted(false);
            }}
            placeholder="Enter your email"
            required
            type="email"
            value={email}
          />
          <button type="submit">Confirm</button>
        </form>
        {submitted ? <p className="chat-now-message">Thanks. We will contact you shortly.</p> : null}
      </DialogContent>
    </Dialog>
  );
}
