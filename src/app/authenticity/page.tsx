function PolicyLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-lp max-w-3xl py-12 sm:py-16">
      <h1 className="section-heading">{title}</h1>
      <div className="prose-lp mt-8 space-y-4 text-sm leading-relaxed text-brand-navy/80">
        {children}
      </div>
    </div>
  );
}

export default function AuthenticityPage() {
  return (
    <PolicyLayout title="Authenticity Guarantee">
      <p className="badge-authentic">100% Authentic</p>
      <p>
        Lit Perfumes is an authorized reseller of genuine designer and niche fragrances. Every
        bottle we list is sourced through trusted channels and inspected before it leaves our
        warehouse.
      </p>
      <p>
        We do not sell replicas, inspired oils, or grey-market products of uncertain origin. If you
        ever have a concern about a bottle you received from us, contact our concierge with your
        order number and photos — we will make it right for damaged or incorrect items.
      </p>
    </PolicyLayout>
  );
}
