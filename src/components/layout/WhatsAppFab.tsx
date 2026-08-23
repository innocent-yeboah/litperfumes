import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function WhatsAppFab() {
  const href = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    "Hello Lit Perfumes — I'd like help with an order."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-sm bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-4 w-4" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
