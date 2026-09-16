import { ProductPageModern } from "./ProductPageModern";
import {
  BrandHeader,
  Glyph,
  LogoMark,
  NAVY,
  ORANGE,
  PageFooter,
} from "./brand";
import { computeTotal, currency, type Product, type Quotation } from "../data/quotation";
import { AutoFit } from "./AutoFit";
import { useFocusProps } from "./preview-focus";

export function QuotationDocument({ data }: { data: Quotation }) {
  const active = data.products.filter((p) => p.enabled);
  return (
    <>
      <CoverPage data={data} />
      {active.map((p) => (
        <ProductPageModern key={p.key} product={p} />
      ))}
      <ContactPage data={data} />
    </>
  );
}

/* --------------------------------- Cover --------------------------------- */

function CoverPage({ data }: { data: Quotation }) {
  const proposalFx = useFocusProps("client:proposal");
  const dateFx = useFocusProps("client:date");

  return (
    <section id="page-cover" data-page="cover" className="a4-page shadow-page bg-white relative overflow-hidden">
      {/* Top Header Bar */}
      <div className="absolute left-[16mm] top-[14mm]">
        <LogoMark width={50} />
      </div>

      <div className="absolute right-[16mm] top-[14mm] text-right">
        <div className="font-extrabold text-[3.8mm] leading-[1.25]" style={{ color: NAVY }}>
          Connect.
        </div>
        <div className="font-extrabold text-[3.8mm] leading-[1.25]" style={{ color: NAVY }}>
          Communicate.
        </div>
        <div className="font-extrabold text-[4.2mm] leading-[1.25]" style={{ color: ORANGE }}>
          Grow.
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="absolute left-[16mm] top-[48mm]" style={{ width: "114mm" }}>
        <h1 className="font-display font-black leading-[0.9] tracking-tight" style={{ fontSize: "23mm" }}>
          <span style={{ color: NAVY }}>Quo</span>
          <span style={{ color: ORANGE }}>tation</span>
        </h1>
        <div className="flex items-center gap-[2.5mm] mt-[4mm]">
          <span style={{ width: "16mm", height: "1.3mm", background: ORANGE, borderRadius: "1mm" }} />
          <span className="font-bold tracking-[0.14em] text-[2.7mm]" style={{ color: NAVY }}>
            TAILORED SOLUTIONS FOR YOUR BUSINESS
          </span>
        </div>
        <p className="mt-[4mm] leading-[1.65] text-[3.25mm]" style={{ color: "#475569" }}>
          We are pleased to present this quotation for our enterprise communication &amp; branding solutions,
          designed to help your business connect, engage and grow faster.
        </p>
      </div>

      {/* 3D Quotation Document Graphic on the Right */}
      <div className="absolute right-[16mm] top-[40mm]" style={{ width: "54mm", height: "58mm" }}>
        <svg viewBox="0 0 180 190" fill="none" className="w-full h-full drop-shadow-md">
          {/* Subtle Orange bursts */}
          <path d="M125 15l4 -8" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
          <path d="M142 22l8 -4" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
          <path d="M152 38l8 5" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />

          {/* Document Sheet */}
          <rect x="25" y="24" width="125" height="152" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2.5" />

          {/* Quotation Header on Card */}
          <text x="87" y="52" textAnchor="middle" fill="#94A3B8" fontSize="10.5" fontWeight="800" letterSpacing="1.8">
            QUOTATION
          </text>

          {/* Document placeholder lines */}
          <rect x="42" y="66" width="68" height="4" rx="2" fill="#CBD5E1" />
          <rect x="42" y="78" width="52" height="4" rx="2" fill="#E2E8F0" />
          <rect x="42" y="90" width="62" height="4" rx="2" fill="#E2E8F0" />
          <rect x="42" y="106" width="42" height="4" rx="2" fill="#E2E8F0" />

          {/* Orange Checkmark Badge */}
          <circle cx="134" cy="132" r="22" fill={ORANGE} />
          <path d="M125 132l6 6 12-13" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      {/* 4 Feature Circles */}
      <div className="absolute left-[16mm] right-[16mm] top-[108mm] grid grid-cols-4 gap-[4mm]">
        {/* 1. Reliable Communication */}
        <div className="flex flex-col items-center text-center">
          <span
            className="flex items-center justify-center rounded-full"
            style={{ width: "15mm", height: "15mm", background: ORANGE }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              <circle cx="8" cy="12" r="1.2" fill="#fff" />
              <circle cx="12" cy="12" r="1.2" fill="#fff" />
              <circle cx="16" cy="12" r="1.2" fill="#fff" />
            </svg>
          </span>
          <span className="font-bold text-[2.7mm] mt-[2.5mm] leading-tight" style={{ color: NAVY }}>
            Reliable<br />Communication
          </span>
        </div>

        {/* 2. Measurable Results */}
        <div className="flex flex-col items-center text-center">
          <span
            className="flex items-center justify-center rounded-full"
            style={{ width: "15mm", height: "15mm", background: NAVY }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
          </span>
          <span className="font-bold text-[2.7mm] mt-[2.5mm] leading-tight" style={{ color: NAVY }}>
            Measurable<br />Results
          </span>
        </div>

        {/* 3. Dedicated Support */}
        <div className="flex flex-col items-center text-center">
          <span
            className="flex items-center justify-center rounded-full"
            style={{ width: "15mm", height: "15mm", background: ORANGE }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
          </span>
          <span className="font-bold text-[2.7mm] mt-[2.5mm] leading-tight" style={{ color: NAVY }}>
            Dedicated<br />Support
          </span>
        </div>

        {/* 4. Trusted Partnership */}
        <div className="flex flex-col items-center text-center">
          <span
            className="flex items-center justify-center rounded-full"
            style={{ width: "15mm", height: "15mm", background: NAVY }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <span className="font-bold text-[2.7mm] mt-[2.5mm] leading-tight" style={{ color: NAVY }}>
            Trusted<br />Partnership
          </span>
        </div>
      </div>

      {/* "Prepared For" Card */}
      <div
        className="absolute left-[16mm] right-[16mm] flex items-center justify-between"
        style={{
          top: "138mm",
          border: "0.35mm solid #E2E8F0",
          borderRadius: "4mm",
          padding: "4.5mm 7mm",
          background: "#FFFFFF",
          boxShadow: "0 2px 10px rgba(16, 47, 104, 0.04)",
        }}
      >
        <div {...useFocusProps("client:name", "flex items-center gap-[4mm] flex-1 min-w-0")}>
          <span
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: "13mm", height: "13mm", background: ORANGE }}
          >
            <Glyph name="user" size={7} />
          </span>
          <div className="min-w-0 flex-1">
            <div style={{ fontSize: "2.8mm", color: "#64748B", fontWeight: 500 }}>Prepared For</div>
            <AutoFit size={5.4} maxLines={1} className="font-display font-extrabold" style={{ color: ORANGE }}>
              {data.client.clientName || "Valued Client"}
            </AutoFit>
          </div>
        </div>

        <span style={{ width: "0.3mm", height: "12mm", background: "#E2E8F0", margin: "0 6mm" }} />

        <div {...useFocusProps("client:company", "flex items-center gap-[4mm] flex-1 min-w-0")}>
          <span
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: "13mm", height: "13mm", background: NAVY }}
          >
            <Glyph name="user" size={7} />
          </span>
          <div className="min-w-0 flex-1">
            <div style={{ fontSize: "2.8mm", color: "#64748B", fontWeight: 500 }}>Our Valued Partner</div>
            <AutoFit size={5.4} maxLines={1} className="font-display font-extrabold" style={{ color: NAVY }}>
              {data.client.companyName || "Enterprise Partner"}
            </AutoFit>
          </div>
        </div>
      </div>

      {/* Metadata Pill Strip */}
      <div
        className="absolute left-[16mm] right-[16mm] flex items-center justify-between"
        style={{
          top: "168mm",
          background: "#F1F5F9",
          borderRadius: "999px",
          padding: "3.2mm 8mm",
          fontSize: "3.3mm",
        }}
      >
        <span {...proposalFx}>
          <span style={{ color: "#64748B" }}>Quotation No.: </span>
          <strong style={{ color: NAVY }}>{data.client.proposalNumber || "ZM/2026/001"}</strong>
        </span>
        <span style={{ width: "0.3mm", height: "4.5mm", background: "#CBD5E1" }} />
        <span {...dateFx}>
          <span style={{ color: "#64748B" }}>Date: </span>
          <strong style={{ color: NAVY }}>{data.client.date || "11/09/2026"}</strong>
        </span>
      </div>

      {/* Bottom Wave Section with Plane & Skyline */}
      <div className="absolute inset-x-0 bottom-0" style={{ height: "98mm" }}>
        <svg viewBox="0 0 794 370" fill="none" className="w-full h-full block">
          <defs>
            <linearGradient id="zionWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#071B3A" />
              <stop offset="60%" stopColor="#102F68" />
              <stop offset="100%" stopColor="#1D4F91" />
            </linearGradient>
            <linearGradient id="zionSkylineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#EEF4FF" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Skyline Silhouettes on Right */}
          <rect x="520" y="180" width="22" height="120" rx="3" fill="url(#zionSkylineGrad)" />
          <rect x="548" y="140" width="30" height="160" rx="3" fill="url(#zionSkylineGrad)" />
          <rect x="584" y="190" width="26" height="110" rx="3" fill="url(#zionSkylineGrad)" />
          <rect x="616" y="160" width="28" height="140" rx="3" fill="url(#zionSkylineGrad)" />
          <rect x="650" y="200" width="24" height="100" rx="3" fill="url(#zionSkylineGrad)" />
          <rect x="680" y="170" width="32" height="130" rx="3" fill="url(#zionSkylineGrad)" />
          <rect x="718" y="185" width="28" height="115" rx="3" fill="url(#zionSkylineGrad)" />

          {/* Main Deep Navy Wave sweeping from left */}
          <path
            d="M0 80C140 80 240 120 380 210C450 255 520 280 620 270C700 262 750 280 794 300V370H0V80Z"
            fill="url(#zionWaveGrad)"
          />

          {/* Flying Paper Airplane Trail */}
          <path
            d="M260 270C340 260 410 220 460 170"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            fill="none"
          />

          {/* Floating Orange & Blue Particles */}
          <circle cx="370" cy="245" r="7" fill={ORANGE} />
          <circle cx="415" cy="220" r="5" fill="#1D4F91" />
          <circle cx="430" cy="240" r="8" fill={ORANGE} />
          <circle cx="300" cy="275" r="9" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />

          {/* Paper Airplane */}
          <g transform="translate(460, 120) rotate(15)">
            <path d="M0 40L65 0L42 55L24 44L0 40Z" fill="#FFFFFF" />
            <path d="M65 0L24 44L42 55L65 0Z" fill="#F1F5F9" />
            <path d="M24 44L28 62L36 49L24 44Z" fill={ORANGE} />
          </g>

          {/* Bottom Orange and Navy Base Edge */}
          <path d="M0 354C160 330 320 370 480 348s220-22 314-8v30H0v-16Z" fill={ORANGE} />
          <path d="M0 362C160 340 320 375 480 356s220-20 314-6v20H0v-14Z" fill={NAVY} />
        </svg>

        {/* Text inside the Navy Wave (left side) */}
        <div className="absolute left-[16mm] top-[26mm] text-white">
          <div className="flex gap-[3mm] mb-[4mm] opacity-35">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="w-[1.8mm] h-[1.8mm] rounded-full bg-white block" />
            ))}
          </div>
          <div className="text-[3.6mm] font-medium leading-tight opacity-90">Let's Build</div>
          <div className="text-[5.4mm] font-black leading-tight mt-[1mm]">Stronger Connections</div>
          <div className="text-[5.4mm] font-black leading-tight mt-[0.5mm]" style={{ color: ORANGE }}>
            Together.
          </div>
          <div style={{ width: "26mm", height: "1.2mm", background: ORANGE, marginTop: "3mm" }} />
        </div>

        {/* Right Quote Callout */}
        <div
          className="absolute right-[16mm] top-[14mm] flex items-stretch gap-[3mm]"
          style={{ background: "rgba(255, 255, 255, 0.85)", padding: "2.5mm 4.5mm", borderRadius: "2mm", backdropFilter: "blur(4px)" }}
        >
          <span style={{ width: "1.2mm", background: ORANGE, borderRadius: "1mm" }} />
          <div className="leading-tight">
            <div style={{ fontSize: "2.8mm", color: "#64748B" }}>From</div>
            <div className="font-bold text-[3.4mm]" style={{ color: NAVY }}>Communication</div>
            <div className="text-[3.2mm]" style={{ color: NAVY }}>
              to <strong className="font-extrabold" style={{ color: ORANGE }}>Possibilities.</strong>
            </div>
          </div>
        </div>

        {/* Floating White Footer Pill */}
        <div
          className="absolute inset-x-[16mm] bottom-[8mm] flex items-center justify-center gap-[6mm] shadow-lg"
          style={{
            height: "12mm",
            background: "#FFFFFF",
            borderRadius: "999px",
            border: "0.35mm solid #E2E8F0",
            fontSize: "3.2mm",
            fontWeight: 600,
            color: NAVY,
          }}
        >
          <a href="https://zionmarketing.in" className="flex items-center gap-[2mm] text-navy no-underline">
            <span className="flex items-center justify-center rounded-full" style={{ width: "5.5mm", height: "5.5mm", background: "#EEF4FF" }}>
              <Glyph name="globe" color={NAVY} size={3.2} />
            </span>
            <span>zionmarketing.in</span>
          </a>
          <span style={{ opacity: 0.3 }}>|</span>
          <a href="mailto:info@zionmarketing.in" className="flex items-center gap-[2mm] text-navy no-underline">
            <span className="flex items-center justify-center rounded-full" style={{ width: "5.5mm", height: "5.5mm", background: "#EEF4FF" }}>
              <Glyph name="mail" color={NAVY} size={3.2} />
            </span>
            <span>info@zionmarketing.in</span>
          </a>
          <span style={{ opacity: 0.3 }}>|</span>
          <a href="tel:+919819291927" className="flex items-center gap-[2mm] text-navy no-underline">
            <span className="flex items-center justify-center rounded-full" style={{ width: "5.5mm", height: "5.5mm", background: "#EEF4FF" }}>
              <Glyph name="phone" color={NAVY} size={3.2} />
            </span>
            <span>+91 98192 91927</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Product page ------------------------------ */

function ProductPage({ product }: { product: Product }) {
  const total = computeTotal(product.pricing);
  const k = product.key;
  const titleFx = useFocusProps(`${k}:title`, "absolute inset-x-[16mm]");
  const introFx = useFocusProps(`${k}:intro`, "absolute text-center leading-[1.6]");
  const subFx = useFocusProps(`${k}:sub`, "absolute inset-x-[16mm] flex items-center justify-center gap-[3.5mm]");
  const priceFx = useFocusProps(`${k}:pricing`, "");
  const bulletFx = useFocusProps(`${k}:bullets`, "");

  return (
    <section id={`page-${k}`} data-page={k} className="a4-page shadow-page bg-white relative overflow-hidden">
      {/* Consistent Header matching Cover Page */}
      <BrandHeader compact />

      {/* Modern Section Title */}
      <div {...titleFx} style={{ top: "30mm" }} className="text-center">
        <div className="flex items-center justify-center gap-[3mm]">
          <span style={{ width: "12mm", height: "1.2mm", background: ORANGE, borderRadius: "1mm" }} />
          <AutoFit
            size={7}
            maxLines={1}
            align="center"
            className="font-display font-black tracking-tight"
            style={{ color: NAVY }}
          >
            {product.title}
          </AutoFit>
          <span style={{ width: "12mm", height: "1.2mm", background: ORANGE, borderRadius: "1mm" }} />
        </div>
      </div>

      {/* Intro Description */}
      <p
        {...introFx}
        style={{ left: "18mm", right: "18mm", top: "43mm", fontSize: "3.2mm", color: "#475569" }}
      >
        <strong style={{ color: NAVY }}>Zion Marketing</strong>{" "}
        {product.intro.replace(/^(Immense Smart Solution|Zion Marketing)\s*/, "")}
      </p>

      {/* Badge & Subtitle */}
      <div {...subFx} style={{ top: "58mm" }}>
        <span
          className="flex items-center justify-center font-bold px-[3.5mm] py-[1mm] rounded-full"
          style={{
            border: `0.4mm solid ${NAVY}`,
            color: NAVY,
            fontSize: "2.8mm",
            background: "#F8FAFC",
          }}
        >
          {product.badge}
        </span>
        <span style={{ width: "8mm", height: "0.4mm", background: "#CBD5E1" }} />
        <AutoFit
          size={5}
          maxLines={1}
          className="font-display font-extrabold"
          style={{ color: ORANGE }}
        >
          {product.subTitle}
        </AutoFit>
      </div>

      {/* Tables & Bullets */}
      <div
        className="absolute flex flex-col"
        style={{ left: "16mm", right: "16mm", top: "70mm", bottom: "24mm", overflow: "hidden" }}
      >
        <div {...priceFx} style={{ flexShrink: 0 }}>
          {product.tables.map((t, i) => (
            <table
              key={i}
              className="w-full"
              style={{ borderCollapse: "collapse", marginBottom: "3.5mm", fontSize: "3.5mm" }}
            >
              <thead>
                <tr>
                  <Th>{t.slabLabel}</Th>
                  <Th>{t.rateLabel}</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>{t.slabValue}</Td>
                  <Td>{t.rateValue}</Td>
                </tr>
              </tbody>
            </table>
          ))}

          <table className="w-full" style={{ borderCollapse: "collapse", fontSize: "3.25mm" }}>
            <thead>
              <tr>
                <Th small>Setup Charges</Th>
                <Th small>Monthly Charges</Th>
                <Th small>Price</Th>
                <Th small>GST (%)</Th>
                <Th small>Final Total</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td small>₹ {currency(product.pricing.setup)}</Td>
                <Td small>₹ {currency(product.pricing.monthly)}</Td>
                <Td small>₹ {currency(product.pricing.price)}</Td>
                <Td small>{product.pricing.gst}%</Td>
                <Td small highlight>
                  ₹{" "}
                  {product.pricing.total && Number(product.pricing.total) > 0
                    ? currency(product.pricing.total)
                    : currency(String(total))}
                </Td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul
          {...bulletFx}
          style={{
            marginTop: "6mm",
            overflow: "hidden",
            fontSize: "3.3mm",
            color: "#33405a",
            flex: 1,
            minHeight: 0,
          }}
        >
          {product.bullets.slice(0, 13).map((b, i) => (
            <li key={i} className="flex gap-[3.5mm]" style={{ marginBottom: "2.8mm" }}>
              <span
                style={{
                  width: "2mm",
                  height: "2mm",
                  borderRadius: "0.5mm",
                  background: ORANGE,
                  marginTop: "1.8mm",
                  flexShrink: 0,
                }}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Consistent Footer matching Cover Page */}
      <PageFooter />
    </section>
  );
}

function Th({ children, small }: { children: React.ReactNode; small?: boolean }) {
  return (
    <th
      style={{
        background: NAVY,
        color: "#fff",
        padding: small ? "2.4mm" : "3.2mm",
        fontWeight: 600,
        overflowWrap: "anywhere",
        border: "0.3mm solid #fff",
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  small,
  highlight,
}: {
  children: React.ReactNode;
  small?: boolean;
  highlight?: boolean;
}) {
  return (
    <td
      style={{
        padding: small ? "2.4mm" : "3.2mm",
        textAlign: "center",
        fontWeight: 600,
        color: highlight ? ORANGE : NAVY,
        overflowWrap: "anywhere",
        border: "0.3mm solid #d7dce7",
      }}
    >
      {children}
    </td>
  );
}

/* ------------------------------ Contact page ------------------------------ */

function ContactPage({ data }: { data: Quotation }) {
  const bank: Array<[string, string, "user" | "bank" | "pin" | "card" | "doc"]> = [
    ["A/c Holder's Name", "ZION ENTERPRISES", "user"],
    ["Bank Name", "HDFC Bank", "bank"],
    ["A/c No.", "50200078197710", "card"],
    ["Branch & IFS Code", "HDFC0000543", "doc"],
  ];
  const mgrFx = useFocusProps("manager:card", "");

  return (
    <section id="page-contact" data-page="contact" className="a4-page shadow-page bg-white relative overflow-hidden">
      {/* Content Container spanning between top margin and footer */}
      <div className="absolute left-[16mm] right-[16mm] top-[10mm] bottom-[26mm] flex flex-col justify-between">
        {/* 1. Header Bar */}
        <header className="flex items-center justify-between shrink-0" style={{ height: "14mm" }}>
          <div className="flex items-center">
            <img
              src="/zion-logo.png"
              alt="Zion Marketing logo"
              style={{
                height: "13.5mm",
                width: "auto",
                maxWidth: "44mm",
                objectFit: "contain",
                display: "block",
                mixBlendMode: "multiply",
              }}
            />
          </div>
          <div className="text-right">
            <div className="font-extrabold text-[3.2mm] leading-[1.2]" style={{ color: NAVY }}>
              Connect.
            </div>
            <div className="font-extrabold text-[3.2mm] leading-[1.2]" style={{ color: NAVY }}>
              Communicate.
            </div>
            <div className="font-extrabold text-[3.6mm] leading-[1.2]" style={{ color: ORANGE }}>
              Grow.
            </div>
          </div>
        </header>

        {/* 2. Section Title */}
        <div className="text-center shrink-0">
          <div className="flex items-center justify-center gap-[3mm]">
            <span style={{ width: "12mm", height: "1.2mm", background: ORANGE, borderRadius: "1mm" }} />
            <h2 className="font-display font-black tracking-tight" style={{ fontSize: "8mm", color: NAVY }}>
              Contact <span style={{ color: ORANGE }}>Us</span>
            </h2>
            <span style={{ width: "12mm", height: "1.2mm", background: ORANGE, borderRadius: "1mm" }} />
          </div>
        </div>

        {/* 3. Key Account Manager Card */}
        <div
          {...mgrFx}
          className="flex items-center justify-between shrink-0"
          style={{
            border: "0.35mm solid #E2E8F0",
            borderRadius: "4mm",
            padding: "3.5mm 6mm",
            background: "#FFFFFF",
            boxShadow: "0 2px 10px rgba(16, 47, 104, 0.04)",
          }}
        >
          <div className="flex items-center gap-[4mm] flex-1 min-w-0">
            <span
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: "12.5mm", height: "12.5mm", background: ORANGE }}
            >
              <Glyph name="user" size={6.5} />
            </span>
            <div className="min-w-0 flex-1">
              <div style={{ fontSize: "2.6mm", color: "#64748B", fontWeight: 500 }}>Key Account Manager</div>
              <AutoFit size={5.2} maxLines={1} className="font-display font-extrabold" style={{ color: NAVY }}>
                {data.manager.name || "—"}
              </AutoFit>
              <div style={{ fontSize: "2.9mm", color: "#64748B", marginTop: "0.4mm" }}>
                {data.manager.designation}
              </div>
            </div>
          </div>

          <span style={{ width: "0.3mm", height: "12mm", background: "#E2E8F0", margin: "0 5mm" }} />

          <div className="flex flex-col gap-[2mm] shrink-0">
            <a href={`tel:${data.manager.mobile.replace(/[^\d+]/g, "")}`} className="flex items-center gap-[2.5mm] text-navy no-underline">
              <span
                className="flex items-center justify-center rounded-full shrink-0"
                style={{ width: "5.5mm", height: "5.5mm", background: "#EEF4FF" }}
              >
                <Glyph name="phone" color={NAVY} size={3} />
              </span>
              <span className="font-bold text-[3.3mm]" style={{ color: NAVY }}>
                {data.manager.mobile}
              </span>
            </a>
            <a href={`mailto:${data.manager.email}`} className="flex items-center gap-[2.5mm] text-navy no-underline">
              <span
                className="flex items-center justify-center rounded-full shrink-0"
                style={{ width: "5.5mm", height: "5.5mm", background: "#EEF4FF" }}
              >
                <Glyph name="mail" color={NAVY} size={3} />
              </span>
              <span className="font-bold text-[3.3mm]" style={{ color: NAVY }}>
                {data.manager.email}
              </span>
            </a>
          </div>
        </div>

        {/* 4. Bank Account Details */}
        <div className="shrink-0">
          <div className="flex items-center gap-[3mm] mb-[2mm]">
            <span
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: "8.5mm", height: "8.5mm", background: NAVY }}
            >
              <Glyph name="bank" size={4.5} />
            </span>
            <h3 className="font-display font-extrabold" style={{ color: NAVY, fontSize: "5mm" }}>
              Bank Account <span style={{ color: ORANGE }}>Details:</span>
            </h3>
            <span style={{ flex: 1, height: "0.4mm", background: "#E2E8F0" }} />
          </div>

          <div
            style={{
              border: "0.35mm solid #E2E8F0",
              borderRadius: "3.5mm",
              padding: "2.5mm 6mm",
              background: "#F8FAFC",
            }}
          >
            {bank.map(([k, v, icon], i) => (
              <div
                key={k}
                className="flex items-center gap-[4mm]"
                style={{
                  padding: "1.8mm 0",
                  borderBottom: i < bank.length - 1 ? "0.25mm solid #E2E8F0" : "none",
                  fontSize: "3.3mm",
                }}
              >
                <span
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: "6mm", height: "6mm", background: NAVY }}
                >
                  <Glyph name={icon} size={3.2} />
                </span>
                <span className="font-semibold" style={{ color: NAVY, width: "46mm" }}>
                  {k}
                </span>
                <span style={{ color: NAVY }}>:</span>
                <span className="font-bold" style={{ color: k === "Bank Name" || k === "A/c Holder's Name" ? NAVY : ORANGE }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Terms & Conditions */}
        <div className="shrink-0">
          <div className="flex items-center gap-[3mm] mb-[2mm]">
            <span
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: "8.5mm", height: "8.5mm", background: NAVY }}
            >
              <Glyph name="doc" size={4.5} />
            </span>
            <h3 className="font-display font-extrabold" style={{ color: NAVY, fontSize: "5mm" }}>
              Terms &amp; <span style={{ color: ORANGE }}>Conditions: -</span>
            </h3>
            <span style={{ flex: 1, height: "0.4mm", background: "#E2E8F0" }} />
          </div>

          <ul style={{ paddingLeft: "3mm", fontSize: "3.05mm", color: "#475569" }}>
            {[
              "All taxes as applicable by government regulations.",
              "Rates are valid for 30 days from proposal date.",
              "Payment Terms: Standard advance / agreed credit cycle.",
              "All payments in favor of ZION ENTERPRISES.",
            ].map((t) => (
              <li key={t} className="flex items-center gap-[3mm]" style={{ marginBottom: "1.6mm" }}>
                <span
                  style={{
                    width: "1.8mm",
                    height: "1.8mm",
                    borderRadius: "0.5mm",
                    background: ORANGE,
                    flexShrink: 0,
                  }}
                />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 6. Office Address */}
        <div className="shrink-0">
          <div className="flex items-center gap-[3mm] mb-[2mm]">
            <span
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: "8.5mm", height: "8.5mm", background: NAVY }}
            >
              <Glyph name="pin" size={4.5} />
            </span>
            <h3 className="font-display font-extrabold" style={{ color: NAVY, fontSize: "5mm" }}>
              Office <span style={{ color: ORANGE }}>Address:</span>
            </h3>
            <span style={{ flex: 1, height: "0.4mm", background: "#E2E8F0" }} />
          </div>

          <div
            className="flex items-center gap-[4mm]"
            style={{
              border: "0.35mm solid #E2E8F0",
              borderRadius: "3.5mm",
              padding: "3mm 5mm",
              background: "#F8FAFC",
            }}
          >
            <span
              className="flex items-center justify-center rounded-full shrink-0 shadow-sm"
              style={{ width: "9mm", height: "9mm", background: ORANGE }}
            >
              <Glyph name="pin" color="#fff" size={4.8} />
            </span>
            <div className="text-[3.1mm] leading-[1.35] text-slate-700">
              <strong className="block font-bold text-[3.3mm]" style={{ color: NAVY }}>
                Zion Marketing / Zion Enterprises
              </strong>
              {data.manager.officeAddress ||
                "Office No. 805, 8th Floor, 63 Goldmedal Avenue, S. V. Road, Piramal Nagar, Goregaon West, Mumbai – 400104"}
            </div>
          </div>
        </div>

        {/* 7. Thank You Section */}
        <div className="text-center shrink-0">
          <div className="flex items-center justify-center gap-[3mm]">
            <span style={{ width: "10mm", height: "1mm", background: ORANGE, borderRadius: "1mm" }} />
            <span className="font-display font-black" style={{ color: NAVY, fontSize: "8.5mm" }}>
              Thank <span style={{ color: ORANGE }}>You</span>
            </span>
            <span style={{ width: "10mm", height: "1mm", background: ORANGE, borderRadius: "1mm" }} />
          </div>
          <div style={{ fontSize: "3.1mm", color: "#475569", marginTop: "1.8mm" }}>
            24/7 Support Center: Call us on <strong style={{ color: NAVY }}>+91 98192 91927</strong> &nbsp;|&nbsp; Mail us on{" "}
            <strong style={{ color: NAVY }}>info@zionmarketing.in</strong>
          </div>
          <div className="font-medium italic" style={{ color: "#64748B", fontSize: "2.65mm", marginTop: "1.2mm" }}>
            &ldquo;Any Changes in rules and Regulations by Company, TRAI or Operator will be Applicable with effect from the date communicated&rdquo;
          </div>
        </div>
      </div>

      {/* Consistent Footer matching Cover Page */}
      <PageFooter />
    </section>
  );
}
