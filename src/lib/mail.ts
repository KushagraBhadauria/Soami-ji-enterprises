import "server-only";
import nodemailer from "nodemailer";
import { site } from "./site";
import { inr, fmtDateTime } from "./format";
import type { Quotation } from "./types";

/**
 * Sends the "new quotation" alert to the shop owner over SMTP.
 *
 * Env:
 *   SMTP_USER, SMTP_PASS   – the sending mailbox (e.g. a Gmail + 16-char App Password)
 *   OWNER_EMAIL            – optional; where alerts are delivered (defaults to SMTP_USER)
 *   SMTP_HOST, SMTP_PORT   – optional; default smtp.gmail.com : 465 (SSL)
 * (GMAIL_USER / GMAIL_APP_PASSWORD are also accepted for backwards compatibility.)
 */
export async function notifyOwner(q: Quotation, pdf: Buffer, siteUrl: string) {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
  const to = process.env.OWNER_EMAIL || user;
  if (!user || !pass || !to) {
    console.warn("[mail] SMTP_USER / SMTP_PASS not set — skipping owner email.");
    return { sent: false };
  }
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });

  const rows = q.items
    .map(
      (i, n) => `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee;color:#64748b">${n + 1}</td>
        <td style="padding:8px;border-bottom:1px solid #eee"><b>${esc(i.name)}</b><br><span style="color:#64748b;font-size:12px">${esc(i.description)}</span></td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${inr(i.amount)}</td></tr>`
    )
    .join("");
  const wa = `https://wa.me/${q.customer_phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;color:#0b1220">
    <div style="background:#0b1220;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
      <div style="font-size:12px;letter-spacing:2px;color:#ffb547;text-transform:uppercase">New enquiry</div>
      <div style="font-size:20px;font-weight:bold;margin-top:4px">${esc(q.customer_name)} has requested a quotation</div>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:0;padding:24px;border-radius:0 0 12px 12px">
      <p style="margin:0 0 16px">${esc(q.customer_name)} has shown interest in your products and generated quotation <b>${q.quote_no}</b> on ${fmtDateTime(q.created_at)}. The PDF is attached.</p>
      <table style="width:100%;font-size:14px;margin-bottom:16px">
        <tr><td style="color:#64748b;width:110px">Name</td><td><b>${esc(q.customer_name)}</b></td></tr>
        <tr><td style="color:#64748b">Phone</td><td><a href="tel:${q.customer_phone}">${q.customer_phone}</a> · <a href="${wa}">WhatsApp</a></td></tr>
        ${q.customer_email ? `<tr><td style="color:#64748b">Email</td><td>${esc(q.customer_email)}</td></tr>` : ""}
        ${q.customer_address ? `<tr><td style="color:#64748b">Address</td><td>${esc(q.customer_address)}</td></tr>` : ""}
        ${q.note ? `<tr><td style="color:#64748b">Note</td><td>${esc(q.note)}</td></tr>` : ""}
      </table>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr style="background:#f1f5f9"><th style="padding:8px;text-align:left">#</th><th style="padding:8px;text-align:left">Item</th><th style="padding:8px">Qty</th><th style="padding:8px;text-align:right">Amount</th></tr>
        ${rows}
        <tr><td colspan="3" style="padding:10px 8px;text-align:right;font-weight:bold">Grand Total</td><td style="padding:10px 8px;text-align:right;font-weight:bold;color:#1a63e6">${inr(q.grand_total)}</td></tr>
      </table>
      <p style="margin-top:20px"><a href="${siteUrl}/admin/leads" style="background:#1a63e6;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Open customer list</a></p>
    </div>
  </div>`;

  await transport.sendMail({
    from: `"${site.brand} Website" <${user}>`,
    to,
    replyTo: q.customer_email || undefined,
    subject: `New quotation ${q.quote_no} — ${q.customer_name} (${q.customer_phone}) — ${inr(q.grand_total)}`,
    html,
    attachments: [{ filename: `Quotation-${q.quote_no.replace(/\//g, "-")}.pdf`, content: pdf }],
  });
  return { sent: true };
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
