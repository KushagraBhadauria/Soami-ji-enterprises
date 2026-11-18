"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { site } from "@/lib/site";
import { Button } from "./ui/Button";

const topics = ["CCTV installation", "CCTV repair / AMC", "Laptop / computer repair", "Buy a laptop / computer", "Second-hand products", "Other"];

export function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", topic: topics[0], msg: "" });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const text = `Hi ${site.name},\nName: ${f.name}\nPhone: ${f.phone}\nRegarding: ${f.topic}\n\n${f.msg}`;
        window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">Your name</label>
          <input id="c-name" required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Full name" />
        </div>
        <div>
          <label className="label" htmlFor="c-phone">Mobile number</label>
          <input id="c-phone" required inputMode="tel" className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="10-digit mobile" />
        </div>
      </div>
      <div>
        <label className="label">I need help with</label>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button type="button" key={t} onClick={() => setF({ ...f, topic: t })} className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${f.topic === t ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 text-slate-600 hover:border-slate-400"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-msg">Message</label>
        <textarea id="c-msg" rows={4} className="input resize-none" value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} placeholder="Tell us briefly what you need…" />
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        <Send className="h-5 w-5" /> Send on WhatsApp
      </Button>
    </form>
  );
}
