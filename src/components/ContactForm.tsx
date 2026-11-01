"use client";

import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { Send, CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import { personal } from "@/data/portfolio";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    // Validate configuration
    const isConfigured =
      Boolean(serviceId && templateId && publicKey) &&
      serviceId !== "YOUR_SERVICE_ID" &&
      templateId !== "YOUR_TEMPLATE_ID" &&
      publicKey !== "YOUR_PUBLIC_KEY";

    try {
      if (isConfigured && serviceId && templateId && publicKey) {
        // Send via official EmailJS service
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_name: personal.name,
            to_email: personal.email,
          },
          publicKey
        );
        setIsDemoMode(false);
      } else {
        // Graceful fallback / preview simulation when keys are not yet bound in env
        await new Promise((resolve) => setTimeout(resolve, 850));
        setIsDemoMode(true);
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      console.error("EmailJS submission error:", err);
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to dispatch message. Please retry or email directly."
      );
    }
  };

  const handleMailtoFallback = () => {
    const body = `Hi Harsh,\n\n${formData.message}\n\nFrom: ${formData.name} (${formData.email})`;
    window.location.href = `mailto:${personal.email}?subject=${encodeURIComponent(
      formData.subject || "Portfolio enquiry"
    )}&body=${encodeURIComponent(body)}`;
  };

  const resetForm = () => {
    setStatus("idle");
    setErrorMessage("");
    setIsDemoMode(false);
  };

  return (
    <div className="contact-form-container">
      {status === "success" ? (
        <div className="form-success-state" role="status" aria-live="polite">
          <div className="success-icon-wrap">
            <CheckCircle2 size={36} className="text-accent" />
          </div>
          <h3>Message Transmitted</h3>
          <p>
            Thank you for reaching out! Your message has been received. Harsh will get back to you as soon as possible.
          </p>
          {isDemoMode && (
            <div className="demo-notice">
              <span>SYS_INFO: Ready for EmailJS production keys in <code>.env.local</code>. Simulated send succeeded.</span>
            </div>
          )}
          <button type="button" className="button secondary" onClick={resetForm}>
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          {status === "error" && (
            <div className="form-error-banner" role="alert">
              <AlertCircle size={18} />
              <div className="error-copy">
                <span>{errorMessage}</span>
                <button type="button" className="fallback-mailto-link" onClick={handleMailtoFallback}>
                  <Mail size={13} /> Open in Email App Instead
                </button>
              </div>
            </div>
          )}

          <div className="form-group-row">
            <label>
              <span>NAME //</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                disabled={status === "submitting"}
              />
            </label>

            <label>
              <span>EMAIL //</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={status === "submitting"}
              />
            </label>
          </div>

          <label>
            <span>SUBJECT //</span>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What would you like to build or discuss?"
              required
              disabled={status === "submitting"}
            />
          </label>

          <label>
            <span>MESSAGE //</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me a little about your project, idea or enquiry..."
              required
              rows={4}
              disabled={status === "submitting"}
            />
          </label>

          <div className="form-actions-row">
            <button
              className="button primary submit-button"
              type="submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={16} className="button-spinner" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <span>Send message</span>
                  <Send size={15} />
                </>
              )}
            </button>
            <span className="form-telemetry">
              EMAILJS_V3 · DIRECT_DISPATCH
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
