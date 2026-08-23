import { siteConfig } from "@/lib/site";

export default function ContactPage() {
  const wa = `https://wa.me/${siteConfig.whatsapp}`;
  return (
    <div className="container-lp max-w-3xl py-12 sm:py-16">
      <h1 className="section-heading">Contact</h1>
      <p className="mt-4 text-brand-navy/70">
        Concierge support for orders, authenticity questions, and delivery updates.
      </p>
      <ul className="mt-8 space-y-3 text-sm text-brand-navy/80">
        <li>
          Email:{" "}
          <a className="text-brand-gold underline" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </li>
        <li>
          Phone:{" "}
          <a className="text-brand-gold underline" href="tel:+233540357260">
            {siteConfig.phone}
          </a>
        </li>
        <li>
          WhatsApp:{" "}
          <a className="text-brand-gold underline" href={wa} target="_blank" rel="noopener noreferrer">
            Chat with us
          </a>
        </li>
        <li>Location: {siteConfig.location}</li>
      </ul>
    </div>
  );
}
