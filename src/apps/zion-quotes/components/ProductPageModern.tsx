import React from "react";
import { type Product, computeTotal, currency } from "../data/quotation";
import { AutoFit } from "./AutoFit";
import { useFocusProps } from "./preview-focus";
import { LogoMark, NAVY, ORANGE } from "./brand";
import { getProductSpec, type ProductSpec, type ProductCard } from "./product-specs";

export function ProductPageModern({ product }: { product: Product }) {
  const spec = getProductSpec(product.key, product.title, product.badge, product.subTitle);
  const total = computeTotal(product.pricing);
  const k = product.key;

  const titleFx = useFocusProps(`${k}:title`, "");
  const introFx = useFocusProps(`${k}:intro`, "");
  const subFx = useFocusProps(`${k}:sub`, "");
  const priceFx = useFocusProps(`${k}:pricing`, "");
  const bulletFx = useFocusProps(`${k}:bullets`, "");

  return (
    <section
      id={`page-${k}`}
      data-page={k}
      className="a4-page shadow-page bg-white relative overflow-hidden"
    >
      {/* 1. Top Right Swoop Wave Accent */}
      <div className="absolute right-0 top-0 pointer-events-none" style={{ width: "55mm", height: "28mm" }}>
        <svg viewBox="0 0 220 112" fill="none" className="w-full h-full">
          <path
            d="M90 0C130 0 165 25 190 60C205 82 215 98 220 112V0H90Z"
            fill="#0E2A5D"
          />
          <path
            d="M80 0C120 0 155 25 180 60C195 82 205 98 210 112"
            stroke={ORANGE}
            strokeWidth="4"
            fill="none"
          />
        </svg>
        {/* White Dot Grid inside the swoop */}
        <div className="absolute right-[5mm] top-[4mm] grid grid-cols-4 gap-[1.8mm] opacity-40">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="w-[1mm] h-[1mm] rounded-full bg-white block" />
          ))}
        </div>
      </div>

      {/* Main Flow Content Container */}
      <div className="absolute left-[16mm] right-[16mm] top-[10mm] bottom-[46mm] flex flex-col justify-start">
        {/* 2. Top Header Bar */}
        <header className="flex items-center justify-between shrink-0" style={{ height: "15mm", marginBottom: "4.5mm" }}>
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

          <div className="text-right z-10">
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

        {/* 3. Title, Intro & Badge (Left) + Smartphone Mockup (Right) */}
        <div className="flex items-start justify-between shrink-0" style={{ marginBottom: "5mm" }}>
          {/* Left text block */}
          <div style={{ width: "116mm" }}>
            {/* Two-Tone Title */}
            <h2 {...titleFx} className="font-display font-black tracking-tight" style={{ fontSize: "8.2mm", lineHeight: 1.12 }}>
              <span style={{ color: NAVY }}>{spec.titlePrefix}</span>
              <span style={{ color: ORANGE }}>{spec.titleSuffix}</span>
            </h2>

            {/* Intro Description */}
            <p
              {...introFx}
              className="leading-[1.55]"
              style={{ fontSize: "3.05mm", color: "#475569", marginTop: "2.5mm" }}
            >
              {product.intro}
            </p>

            {/* Subtitle with Pill Badge */}
            <div {...subFx} className="flex items-center gap-[3mm]" style={{ marginTop: "3.5mm" }}>
              <span
                className="flex items-center justify-center font-bold rounded-full shrink-0"
                style={{
                  border: `0.45mm solid ${NAVY}`,
                  color: NAVY,
                  fontSize: "2.85mm",
                  padding: "0.6mm 3.2mm",
                  background: "#F8FAFC",
                }}
              >
                {spec.badge}
              </span>
              <span style={{ width: "8mm", height: "0.45mm", background: "#CBD5E1", flexShrink: 0 }} />
              <span className="font-display font-extrabold text-[3.7mm] truncate" style={{ color: ORANGE }}>
                {spec.subTitle}
              </span>
            </div>
          </div>

          {/* Right Phone Mockup */}
          <div className="shrink-0 flex items-center justify-center">
            <ProductPhoneMockup spec={spec} />
          </div>
        </div>

        {/* 4. Pricing Tables */}
        <div {...priceFx} className="shrink-0" style={{ marginBottom: "5.5mm" }}>
          {product.tables.map((t, i) => (
            <table
              key={i}
              className="w-full"
              style={{ borderCollapse: "collapse", marginBottom: "2.5mm", fontSize: "3.2mm" }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      background: NAVY,
                      color: "#fff",
                      padding: "2.2mm 2.5mm",
                      fontWeight: 700,
                      width: "50%",
                      textAlign: "center",
                      border: "0.3mm solid #fff",
                    }}
                  >
                    {t.slabLabel}
                  </th>
                  <th
                    style={{
                      background: NAVY,
                      color: "#fff",
                      padding: "2.2mm 2.5mm",
                      fontWeight: 700,
                      width: "50%",
                      textAlign: "center",
                      border: "0.3mm solid #fff",
                    }}
                  >
                    {t.rateLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "2.2mm 2.5mm",
                      textAlign: "center",
                      fontWeight: 600,
                      color: NAVY,
                      border: "0.3mm solid #E2E8F0",
                      background: "#F8FAFC",
                    }}
                  >
                    {t.slabValue}
                  </td>
                  <td
                    style={{
                      padding: "2.2mm 2.5mm",
                      textAlign: "center",
                      fontWeight: 700,
                      color: NAVY,
                      border: "0.3mm solid #E2E8F0",
                      background: "#F8FAFC",
                    }}
                  >
                    {t.rateValue}
                  </td>
                </tr>
              </tbody>
            </table>
          ))}

          {/* Breakdown table */}
          <table className="w-full" style={{ borderCollapse: "collapse", fontSize: "3.1mm" }}>
            <thead>
              <tr>
                <th style={{ background: NAVY, color: "#fff", padding: "2.2mm 2.2mm", fontWeight: 700, border: "0.3mm solid #fff" }}>Setup Charges</th>
                <th style={{ background: NAVY, color: "#fff", padding: "2.2mm 2.2mm", fontWeight: 700, border: "0.3mm solid #fff" }}>Monthly Charges</th>
                <th style={{ background: NAVY, color: "#fff", padding: "2.2mm 2.2mm", fontWeight: 700, border: "0.3mm solid #fff" }}>Price</th>
                <th style={{ background: NAVY, color: "#fff", padding: "2.2mm 2.2mm", fontWeight: 700, border: "0.3mm solid #fff" }}>GST (%)</th>
                <th style={{ background: NAVY, color: "#fff", padding: "2.2mm 2.2mm", fontWeight: 700, border: "0.3mm solid #fff" }}>Final Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "2.2mm 2.2mm", textAlign: "center", fontWeight: 600, color: NAVY, border: "0.3mm solid #E2E8F0", background: "#F8FAFC" }}>
                  ₹ {currency(product.pricing.setup)}
                </td>
                <td style={{ padding: "2.2mm 2.2mm", textAlign: "center", fontWeight: 600, color: NAVY, border: "0.3mm solid #E2E8F0", background: "#F8FAFC" }}>
                  ₹ {currency(product.pricing.monthly)}
                </td>
                <td style={{ padding: "2.2mm 2.2mm", textAlign: "center", fontWeight: 600, color: NAVY, border: "0.3mm solid #E2E8F0", background: "#F8FAFC" }}>
                  ₹ {currency(product.pricing.price)}
                </td>
                <td style={{ padding: "2.2mm 2.2mm", textAlign: "center", fontWeight: 600, color: NAVY, border: "0.3mm solid #E2E8F0", background: "#F8FAFC" }}>
                  {product.pricing.gst}%
                </td>
                <td style={{ padding: "2.2mm 2.2mm", textAlign: "center", fontWeight: 800, color: ORANGE, border: "0.3mm solid #E2E8F0", background: "#F8FAFC" }}>
                  ₹{" "}
                  {product.pricing.total && Number(product.pricing.total) > 0
                    ? currency(product.pricing.total)
                    : currency(String(total))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. Split Feature Section (Left: Checklist | Right: 4 Feature Cards) */}
        <div className="flex items-start justify-between flex-1 min-h-0">
          {/* Left Column: Checklist */}
          <div style={{ width: "105mm" }}>
            <ul {...bulletFx}>
              {product.bullets.slice(0, 11).map((b, i) => (
                <li key={i} className="flex items-start gap-[2.8mm]" style={{ marginBottom: "3.6mm" }}>
                  <span
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{ width: "4.8mm", height: "4.8mm", background: ORANGE, marginTop: "0.5mm" }}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="font-medium leading-[1.42]" style={{ fontSize: "3.1mm", color: "#334155" }}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: 4 Feature Cards */}
          <div style={{ width: "66mm" }}>
            <div className="flex flex-col gap-[3.6mm]">
              {spec.cards.map((card, idx) => (
                <FeatureCard key={idx} card={card} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Callout Banner (Above Footer) */}
      <div
        className="absolute left-[16mm] right-[16mm] flex items-stretch overflow-hidden shadow-md"
        style={{
          bottom: "22mm",
          height: "22.5mm",
          borderRadius: "3.5mm",
          border: "0.35mm solid #E2E8F0",
        }}
      >
        {/* Left Navy Container */}
        <div
          className="flex items-center gap-[4mm]"
          style={{ width: "52%", background: NAVY, padding: "3mm 5mm" }}
        >
          <span
            className="flex items-center justify-center rounded-full shrink-0 shadow-sm"
            style={{ width: "12mm", height: "12mm", background: ORANGE }}
          >
            <BannerLeftIcon icon={spec.banner.leftIcon} />
          </span>
          <div className="leading-tight">
            <div className="font-bold text-[3.4mm] text-white">
              {spec.banner.leftTitle}
            </div>
            <div className="font-extrabold text-[3.8mm]" style={{ color: ORANGE, marginTop: "0.5mm" }}>
              {spec.banner.leftHighlight}
            </div>
            <div style={{ width: "22mm", height: "0.8mm", background: ORANGE, marginTop: "1.5mm", borderRadius: "1mm" }} />
          </div>
        </div>

        {/* Right Light Container */}
        <div
          className="flex items-center justify-between flex-1"
          style={{ background: "#FFFFFF", padding: "3mm 5mm" }}
        >
          {/* Subtle Graphic */}
          <BannerRightGraphic graphic={spec.banner.rightGraphic} />

          {/* Slogan */}
          <div className="text-right leading-tight ml-auto">
            <div style={{ fontSize: "3mm", color: "#64748B", fontWeight: 500 }}>
              {spec.banner.rightPre}
            </div>
            <div className="font-extrabold text-[3.6mm]" style={{ color: NAVY, marginTop: "0.5mm" }}>
              <span style={{ color: ORANGE }}>{spec.banner.rightHighlight}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Bottom Wave Footer */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-auto" style={{ height: "18mm" }}>
        <svg
          viewBox="0 0 794 65"
          fill="none"
          className="w-full absolute inset-x-0 bottom-0 block pointer-events-none"
          style={{ height: "16mm" }}
        >
          <path d="M0 24C160 8 320 42 480 24s220-18 314-6v47H0V24Z" fill={ORANGE} />
          <path d="M0 32C160 16 320 46 480 32s220-16 314-4v37H0V32Z" fill={NAVY} />
        </svg>

        {/* White Dot Grid on the bottom right */}
        <div className="absolute right-[8mm] bottom-[3.5mm] grid grid-cols-6 gap-[2.4mm] opacity-35 z-10 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="w-[1.1mm] h-[1.1mm] rounded-full bg-white block" />
          ))}
        </div>

        {/* Centered Contacts on the Navy Wave */}
        <div
          className="absolute inset-x-[16mm] bottom-[3mm] flex items-center justify-center gap-[6mm] z-10"
          style={{ fontSize: "3.1mm", fontWeight: 600, color: "#FFFFFF" }}
        >
          <a href="https://zionmarketing.in" className="flex items-center gap-[2mm] text-white no-underline">
            <span
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: "5mm", height: "5mm", background: "#FFFFFF" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </span>
            <span>zionmarketing.in</span>
          </a>
          <span style={{ opacity: 0.45 }}>|</span>
          <a href="mailto:info@zionmarketing.in" className="flex items-center gap-[2mm] text-white no-underline">
            <span
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: "5mm", height: "5mm", background: "#FFFFFF" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2.5">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <span>info@zionmarketing.in</span>
          </a>
          <span style={{ opacity: 0.45 }}>|</span>
          <a href="tel:+919819291927" className="flex items-center gap-[2mm] text-white no-underline">
            <span
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: "5mm", height: "5mm", background: "#FFFFFF" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <span>+91 98192 91927</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Subcomponents --------------------------------- */

function FeatureCard({ card }: { card: ProductCard }) {
  const bg = card.color === "orange" ? ORANGE : NAVY;
  return (
    <div
      className="flex items-center gap-[3.5mm]"
      style={{
        background: "#F8FAFC",
        border: "0.3mm solid #E2E8F0",
        borderRadius: "3.5mm",
        padding: "3.4mm 3.8mm",
      }}
    >
      <span
        className="flex items-center justify-center rounded-xl shrink-0 shadow-sm"
        style={{ width: "11mm", height: "11mm", background: bg }}
      >
        <CardIcon icon={card.icon} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-extrabold text-[3.35mm] leading-tight" style={{ color: NAVY }}>
          {card.title}
        </div>
        <div className="text-[2.75mm] leading-snug mt-[0.6mm]" style={{ color: "#64748B" }}>
          {card.desc}
        </div>
      </div>
    </div>
  );
}

function CardIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "lightning":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#fff" />
        </svg>
      );
    case "shield":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "chart":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="12" width="4" height="8" rx="1" fill="#fff" />
          <rect x="10" y="8" width="4" height="12" rx="1" fill="#fff" />
          <rect x="17" y="4" width="4" height="16" rx="1" fill="#fff" />
        </svg>
      );
    case "gear":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "gallery":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" fill="#fff" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case "pointer":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 3 10.07 19.97 12.58 12.58 19.97 10.07 3 3" fill="#fff" />
        </svg>
      );
    case "users":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" fill="#fff" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "mic":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill="#fff" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" strokeWidth="2.5" />
        </svg>
      );
    case "clock":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    default:
      return null;
  }
}

function ProductPhoneMockup({ spec }: { spec: ProductSpec }) {
  const { type } = spec.phoneMockup;

  return (
    <div className="relative" style={{ width: "42mm", height: "54mm" }}>
      {/* Curved ripple arcs behind phone */}
      <svg viewBox="0 0 200 220" fill="none" className="absolute -left-[14mm] -top-[8mm] w-[60mm] h-[66mm] pointer-events-none opacity-80">
        <circle cx="140" cy="110" r="60" stroke="#CBD5E1" strokeWidth="1.2" strokeDasharray="4 4" />
        <circle cx="140" cy="110" r="85" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx="65" cy="115" r="4" fill={ORANGE} />
        <line x1="45" y1="65" x2="35" y2="55" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="55" y1="85" x2="40" y2="85" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      {/* Tilted phone body */}
      <div
        className="relative w-full h-full shadow-xl"
        style={{
          transform: "rotate(-4deg)",
          transformOrigin: "center center",
          background: "#0F172A",
          borderRadius: "6mm",
          padding: "1.2mm",
          border: "0.4mm solid #CBD5E1",
        }}
      >
        {/* Inner screen */}
        <div
          className="w-full h-full relative overflow-hidden flex flex-col items-center justify-between"
          style={{
            background: "#FFFFFF",
            borderRadius: "5mm",
            padding: "2mm 2.5mm",
          }}
        >
          {/* Top Notch / Dynamic Island */}
          <div
            className="rounded-full shrink-0"
            style={{ width: "12mm", height: "2.4mm", background: "#0F172A" }}
          />

          {/* Screen Content based on type */}
          {type === "sms" && (
            <div className="flex flex-col items-center text-center my-auto">
              <span
                className="flex items-center justify-center rounded-full shadow-sm"
                style={{ width: "8.5mm", height: "8.5mm", background: NAVY, marginBottom: "1.5mm" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <circle cx="9" cy="10" r="1.2" fill={NAVY} />
                  <circle cx="12" cy="10" r="1.2" fill={NAVY} />
                  <circle cx="15" cy="10" r="1.2" fill={NAVY} />
                </svg>
              </span>
              <div className="font-extrabold text-[2.2mm] leading-[1.25]" style={{ color: NAVY }}>
                Reach<br />Your Customers<br />Instantly!
              </div>
              <div className="font-bold text-[1.9mm] leading-[1.2] mt-[1.2mm]" style={{ color: ORANGE }}>
                Reliable.<br />Fast. Scalable.
              </div>
            </div>
          )}

          {type === "rcs" && (
            <div className="flex flex-col items-center text-center my-auto">
              <span
                className="flex items-center justify-center rounded-full shadow-sm"
                style={{ width: "8.5mm", height: "8.5mm", background: NAVY, marginBottom: "1.5mm" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  <circle cx="8.5" cy="12" r="1.2" fill={NAVY} />
                  <circle cx="12" cy="12" r="1.2" fill={NAVY} />
                  <circle cx="15.5" cy="12" r="1.2" fill={NAVY} />
                </svg>
              </span>
              <div className="font-bold text-[2.1mm] leading-[1.25]" style={{ color: NAVY }}>
                Verified Brand.
              </div>
              <div className="font-semibold text-[1.9mm] leading-[1.2] mt-[0.5mm]" style={{ color: NAVY }}>
                Richer Conversations.
              </div>
              <div className="font-extrabold text-[2mm] leading-[1.2] mt-[0.5mm]" style={{ color: ORANGE }}>
                Real Results.
              </div>
            </div>
          )}

          {type === "whatsapp" && (
            <div className="flex flex-col items-center text-center my-auto">
              <div className="relative mb-[1.5mm]">
                <span
                  className="flex items-center justify-center rounded-full shadow-sm"
                  style={{ width: "9.5mm", height: "9.5mm", background: "#25D366" }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                  </svg>
                </span>
                {/* Verified badge */}
                <span
                  className="absolute -bottom-[0.5mm] -right-[0.5mm] rounded-full flex items-center justify-center"
                  style={{ width: "3.8mm", height: "3.8mm", background: "#3B82F6" }}
                >
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </div>
              <div className="font-extrabold text-[2.1mm] leading-[1.25]" style={{ color: NAVY }}>
                Smarter Conversations
              </div>
              <div className="font-extrabold text-[2.2mm] leading-[1.2] mt-[0.5mm]" style={{ color: ORANGE }}>
                Stronger Business.
              </div>
            </div>
          )}

          {type === "obd" && (
            <div className="flex flex-col items-center text-center my-auto w-full">
              <span
                className="flex items-center justify-center rounded-full shadow-sm"
                style={{ width: "8.5mm", height: "8.5mm", background: ORANGE, marginBottom: "1.2mm" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <div className="font-bold text-[2.05mm] leading-[1.2]" style={{ color: NAVY }}>
                Reach More Customers<br />With Voice.
              </div>
              {/* Waveform graphic */}
              <div className="flex items-center gap-[0.5mm] my-[1.2mm]">
                {[4, 8, 12, 6, 14, 9, 5, 11, 7, 3].map((h, i) => (
                  <span key={i} style={{ width: "0.6mm", height: `${h * 0.35}mm`, background: i % 2 === 0 ? NAVY : ORANGE, borderRadius: "0.3mm" }} />
                ))}
              </div>
              {/* Call buttons */}
              <div className="flex items-center justify-center gap-[3mm]">
                <span className="flex items-center justify-center rounded-full" style={{ width: "4.2mm", height: "4.2mm", background: "#EF4444" }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="#fff"><path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="4" /></svg>
                </span>
                <span className="flex items-center justify-center rounded-full" style={{ width: "4.2mm", height: "4.2mm", background: "#22C55E" }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="#fff"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating paper plane badge on top-right for SMS */}
      {type === "sms" && (
        <span
          className="absolute -right-[4mm] top-[14mm] flex items-center justify-center rounded-lg shadow-md"
          style={{ width: "8.5mm", height: "8.5mm", background: ORANGE, transform: "rotate(15deg)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" stroke="#fff" strokeWidth="2" />
          </svg>
        </span>
      )}
    </div>
  );
}

function BannerLeftIcon({ icon }: { icon: "plane" | "chat" | "phone" }) {
  if (icon === "plane") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" stroke="#fff" strokeWidth="2" />
      </svg>
    );
  }
  if (icon === "chat") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <circle cx="9" cy="10" r="1.2" fill={NAVY} />
        <circle cx="12" cy="10" r="1.2" fill={NAVY} />
        <circle cx="15" cy="10" r="1.2" fill={NAVY} />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function BannerRightGraphic({ graphic }: { graphic: "growth" | "waveform" | "plane" }) {
  if (graphic === "growth") {
    return (
      <div className="flex items-end gap-[1.2mm] opacity-75">
        {[
          { h: "5mm", color: "#CBD5E1" },
          { h: "7mm", color: "#93C5FD" },
          { h: "10mm", color: "#60A5FA" },
          { h: "13mm", color: "#2563EB" },
          { h: "16mm", color: ORANGE },
        ].map((bar, i) => (
          <span
            key={i}
            style={{ width: "3.2mm", height: bar.h, background: bar.color, borderRadius: "0.8mm" }}
          />
        ))}
      </div>
    );
  }
  if (graphic === "waveform") {
    return (
      <div className="flex items-center gap-[0.8mm] opacity-75">
        {[5, 10, 16, 8, 22, 14, 28, 18, 11, 24, 15, 7, 19, 12, 6].map((h, i) => (
          <span
            key={i}
            style={{
              width: "1.2mm",
              height: `${h * 0.45}mm`,
              background: i % 2 === 0 ? "#60A5FA" : ORANGE,
              borderRadius: "0.5mm",
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-[2mm] opacity-75">
      <svg width="40" height="24" viewBox="0 0 120 70" fill="none">
        <path d="M10 55C40 50 80 40 110 15" stroke="#93C5FD" strokeWidth="3" strokeDasharray="5 5" />
        <g transform="translate(85, 5) rotate(10)">
          <path d="M0 25L40 0L26 35L15 28L0 25Z" fill="#93C5FD" />
          <path d="M15 28L18 39L23 31L15 28Z" fill={ORANGE} />
        </g>
      </svg>
    </div>
  );
}
