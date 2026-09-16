/** Shared brand primitives for Zion Marketing proposal template. */

import { AutoFit } from "./AutoFit";

export const NAVY = "#102F68"; // Zion Primary Blue
export const DEEP_BLUE = "#071B3A"; // Zion Deep Navy
export const SECONDARY_BLUE = "#1D4F91";
export const ORANGE = "#FF6B00"; // Zion Orange Accent
export const LIGHT_ORANGE = "#FF8A24";

// Actual logo aspect ratio (1024 x 576)
const LOGO_ASPECT = 576 / 1024;

export function LogoMark({ size, width = 48 }: { size?: number; width?: number }) {
  const w = size ?? width;
  const h = w * LOGO_ASPECT;
  return (
    <img
      src="/zion-logo.png"
      alt="Zion Marketing logo"
      width={w}
      height={h}
      style={{
        width: `${w}mm`,
        height: `${h}mm`,
        objectFit: "contain",
        display: "block",
        mixBlendMode: "multiply",
      }}
    />
  );
}

export function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="absolute inset-x-[16mm] flex items-center justify-between pointer-events-none"
      style={{ top: compact ? "10mm" : "12mm" }}
    >
      <LogoMark width={compact ? 44 : 50} />
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
    </div>
  );
}

/** Modern PageFooter matching the cover page wave & floating white pill */
export function PageFooter({
  site = "zionmarketing.in",
  email = "info@zionmarketing.in",
  phone = "+91 98192 91927",
}: {
  site?: string;
  email?: string;
  phone?: string;
}) {
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const siteHref = `https://${site.replace(/^https?:\/\//, "")}`;
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-auto" style={{ height: "22mm" }}>
      <svg
        viewBox="0 0 794 75"
        fill="none"
        className="w-full absolute inset-x-0 bottom-0 block pointer-events-none"
        style={{ height: "14mm" }}
      >
        <path d="M0 36C160 16 320 52 480 32s220-20 314-8v51H0V36Z" fill={ORANGE} />
        <path d="M0 45C160 25 320 56 480 40s220-18 314-6v41H0V45Z" fill={NAVY} />
      </svg>
      <div
        className="absolute inset-x-[16mm] bottom-[4.5mm] flex items-center justify-center gap-[6mm] shadow-lg"
        style={{
          height: "10.5mm",
          background: "#FFFFFF",
          borderRadius: "999px",
          border: "0.35mm solid #E2E8F0",
          fontSize: "3mm",
          fontWeight: 600,
          color: NAVY,
          zIndex: 10,
        }}
      >
        <a href={siteHref} className="flex items-center gap-[2mm] text-navy no-underline">
          <span
            className="flex items-center justify-center rounded-full"
            style={{ width: "4.8mm", height: "4.8mm", background: "#EEF4FF" }}
          >
            <Glyph name="globe" color={NAVY} size={3} />
          </span>
          <span>{site}</span>
        </a>
        <span style={{ opacity: 0.3 }}>|</span>
        <a href={`mailto:${email}`} className="flex items-center gap-[2mm] text-navy no-underline">
          <span
            className="flex items-center justify-center rounded-full"
            style={{ width: "4.8mm", height: "4.8mm", background: "#EEF4FF" }}
          >
            <Glyph name="mail" color={NAVY} size={3} />
          </span>
          <span>{email}</span>
        </a>
        <span style={{ opacity: 0.3 }}>|</span>
        <a href={telHref} className="flex items-center gap-[2mm] text-navy no-underline">
          <span
            className="flex items-center justify-center rounded-full"
            style={{ width: "4.8mm", height: "4.8mm", background: "#EEF4FF" }}
          >
            <Glyph name="phone" color={NAVY} size={3} />
          </span>
          <span>{phone}</span>
        </a>
      </div>
    </div>
  );
}

export function Glyph({
  name,
  color = "#fff",
  size = 4,
}: {
  name: "globe" | "mail" | "phone" | "user" | "bank" | "pin" | "card" | "doc" | "check";
  color?: string;
  size?: number;
}) {
  const paths: Record<string, React.ReactNode> = {
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.7 2.5 15 0 18M12 3c-2.5 2.7-2.5 15 0 18" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />,
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c1.5-4 4-5.5 7-5.5S17.5 16 19 20" />
      </>
    ),
    bank: (
      <>
        <path d="M3 10 12 4l9 6" />
        <path d="M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    card: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
      </>
    ),
    doc: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M9 12h6M9 16h6" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
  };
  return (
    <svg
      width={`${size}mm`}
      height={`${size}mm`}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
