export type ProductKey =
  | "bulkSms"
  | "rcs"
  | "whatsapp"
  | "meta"
  | "obd"
  | "ivr"
  | "smpp"
  | "api"
  | "realEstate";

export interface RateRow {
  slabLabel: string;
  slabValue: string;
  rateLabel: string;
  rateValue: string;
}

export interface Pricing {
  setup: string;
  monthly: string;
  price: string;
  gst: string;
  total: string;
}

export interface Product {
  key: ProductKey;
  enabled: boolean;
  /** Banner heading, e.g. "SMS Services & Pricing" */
  title: string;
  /** Small label inside the round icon */
  badge: string;
  /** Sub heading above the rate table */
  subTitle: string;
  intro: string;
  tables: RateRow[];
  bullets: string[];
  pricing: Pricing;
}

export interface ClientInfo {
  clientName: string;
  companyName: string;
  proposalNumber: string;
  date: string;
}

export interface AccountManager {
  name: string;
  designation: string;
  mobile: string;
  email: string;
  officeAddress?: string;
}

export interface Quotation {
  client: ClientInfo;
  products: Product[];
  manager: AccountManager;
}

const emptyPricing = (setup = "0", monthly = "0"): Pricing => ({
  setup,
  monthly,
  price: "0",
  gst: "18",
  total: "0",
});

export const PRODUCT_LABELS: Record<ProductKey, string> = {
  bulkSms: "Bulk SMS",
  rcs: "RCS Business Messaging",
  whatsapp: "WhatsApp Business API",
  meta: "Meta Messaging",
  obd: "OBD Voice Calls",
  ivr: "Smart IVR Solutions",
  smpp: "SMPP Connectivity",
  api: "Enterprise APIs & CRM",
  realEstate: "Real Estate Project Branding",
};

export const defaultQuotation = (): Quotation => ({
  client: {
    clientName: "Valued Client",
    companyName: "Enterprise Partner",
    proposalNumber: "ZM/2026/001",
    date: "",
  },
  manager: {
    name: "Syed Muzammil",
    designation: "Business Consultant",
    mobile: "+91 98192 91927",
    email: "info@zionmarketing.in",
    officeAddress:
      "Office No. 805, 8th Floor, 63 Goldmedal Avenue, S. V. Road, Piramal Nagar, Goregaon West, Mumbai – 400104",
  },
  products: [
    {
      key: "bulkSms",
      enabled: true,
      title: "SMS Services & Pricing",
      badge: "SMS",
      subTitle: "Promotional & Transactional SMS",
      intro:
        "Zion Marketing offers competitive SMS services designed to meet high-volume enterprise communication needs. Our multi-telco routing ensures instant OTP delivery, high concurrency, and real-time delivery reports.",
      tables: [
        {
          slabLabel: "Credit Slab",
          slabValue: "Per SMS",
          rateLabel: "SMS Rate",
          rateValue: "0.0875",
        },
      ],
      bullets: [
        "You will be charged only for delivered SMS.",
        "Undelivered credits will be refunded within 24 hours.",
        "Delivery: Non-DND & Partial DND Numbers.",
        "Delivery Ratio: 100% with high throughput routing.",
        "SMS Sending Time: 24 Hrs.",
        "DLT & Header Templates Support.",
        "Content approval TAT: 15 Minutes.",
        "Easy to use web dashboard and developer portal.",
        "REST API available with Postman collection and JSON format for easy integration.",
        "Comprehensive API documentation and sample requests are available.",
        "Dedicated technical assistance during the integration process.",
      ],
      pricing: emptyPricing(),
    },
    {
      key: "rcs",
      enabled: true,
      title: "RCS Business Messaging",
      badge: "RCS",
      subTitle: "Next-Gen Rich Communication",
      intro:
        "Zion Marketing delivers verified RCS Business Messaging with rich media, carousels and action buttons — giving your brand a trusted identity inside the native smartphone messaging inbox.",
      tables: [
        {
          slabLabel: "Credit Slab (Utility)",
          slabValue: "Per RCS",
          rateLabel: "RCS Rate",
          rateValue: "0.10 Paisa",
        },
      ],
      bullets: [
        "Agent Promotional — Time: 10 AM to 7 PM (7 days a week).",
        "Message Limit: Four (4) messages per brand per user per month.",
        "Onboarding: GST Certificate, Company PAN / CIN.",
        "Logo Image (224×224 px, under 30KB — JPEG, JPG, PNG).",
        "Banner Image (1440×448 px, under 300KB — JPEG, JPG, PNG).",
        "Rich communication experience with higher user engagement.",
        "Verified business identity with official brand badge.",
        "Secure & reliable messaging with smart SMS fallback.",
      ],
      pricing: emptyPricing(),
    },
    {
      key: "whatsapp",
      enabled: true,
      title: "WhatsApp Business API",
      badge: "WA",
      subTitle: "Official Meta Cloud API",
      intro:
        "Zion Marketing provides official WhatsApp Business API solutions to help businesses engage, communicate and convert. Empower your brand with 24/7 AI chatbots, multi-agent team inboxes, and automated notifications.",
      tables: [
        {
          slabLabel: "Credit Slab (Marketing)",
          slabValue: "Per WhatsApp",
          rateLabel: "WhatsApp Rate",
          rateValue: "0.80",
        },
        {
          slabLabel: "Credit Slab (Utility)",
          slabValue: "Per WhatsApp",
          rateLabel: "WhatsApp Rate",
          rateValue: "0.10",
        },
      ],
      bullets: [
        "Official Meta Cloud API Partner Integration.",
        "Free WhatsApp API Approval & Onboarding Setup.",
        "Chat Automation & 24/7 AI Chatbot Journeys.",
        "Multi-Agent Team Inbox with role-based access.",
        "Bulk WhatsApp campaign notifications & granular analytics.",
        "Green Tick Official Verification assistance.",
        "Zero Rental Charges, Zero Annual Maintenance (AMC).",
        "Zero Hidden Charges with transparent billing.",
        "Seamless CRM Connectors (Zoho, Salesforce, LeadSquared).",
      ],
      pricing: emptyPricing(),
    },
    {
      key: "meta",
      enabled: true,
      title: "Meta Messaging & Ads Sync",
      badge: "META",
      subTitle: "Facebook & Instagram Messaging",
      intro:
        "Zion Marketing helps you run high-converting customer engagement campaigns across Meta platforms — syncing Click-to-WhatsApp ads, Instagram DMs, and Facebook Messenger automation directly with your sales funnel.",
      tables: [
        {
          slabLabel: "Instagram DM Automation",
          slabValue: "Monthly Plan",
          rateLabel: "Plan Rate",
          rateValue: "2,500",
        },
        {
          slabLabel: "Click-to-WhatsApp Ad Sync",
          slabValue: "One-Time Setup",
          rateLabel: "Setup Rate",
          rateValue: "3,500",
        },
      ],
      bullets: [
        "Click-to-WhatsApp and Click-to-Messenger ad conversion setup.",
        "Automated Instagram DM responses and story reply triggers.",
        "Lead qualification chatbots to capture and verify buyer intent.",
        "Dynamic retargeting and CRM lead synchronization in real-time.",
        "Comprehensive campaign ROI tracking and conversation attribution.",
        "Dedicated technical consultation for Meta Business Manager.",
      ],
      pricing: emptyPricing(),
    },
    {
      key: "obd",
      enabled: true,
      title: "OBD Voice Call Services",
      badge: "OBD",
      subTitle: "Automated Voice Broadcasting",
      intro:
        "Zion Marketing helps you reach your customers instantly with outbound voice broadcasting. Professional studio artist voice recording, DND & Non-DND delivery, and round-the-clock campaign support.",
      tables: [
        {
          slabLabel: "Credit Slab",
          slabValue: "Per Voice Call",
          rateLabel: "Voice Rate 30 Sec-Pulse",
          rateValue: "0.095 Paisa/Voice",
        },
      ],
      bullets: [
        "Studio Artist Voice Record (Male & Female in multiple languages).",
        "Delivery across Non-DND & DND Numbers with intelligent retry logic.",
        "Sender ID: Virtual Number / Custom caller CLI.",
        "Voice Sending Time: 24 Hrs with live dashboard monitoring.",
        "Voice approval TAT: 10 minutes.",
        "Voice Resend TAT: 1 Day.",
        "Interactive DTMF (touch-tone capture for polls & responses).",
        "24X7 Dedicated Customer Care & NOC Support.",
        "Granular call duration & listen-rate analytics.",
      ],
      pricing: emptyPricing(),
    },
    {
      key: "ivr",
      enabled: false,
      title: "Smart IVR Solutions",
      badge: "IVR",
      subTitle: "Cloud Multi-Level IVR",
      intro:
        "Automate inbound customer journeys with a cloud IVR built for scale — multi-level menus, skill-based call routing, recording and real-time reporting on a virtual number of your choice.",
      tables: [
        {
          slabLabel: "Credit Slab",
          slabValue: "Per Minute (Pulse 30 Sec)",
          rateLabel: "IVR Rate",
          rateValue: "0.30",
        },
      ],
      bullets: [
        "Multi-level IVR menu with smart call routing logic.",
        "Virtual number & 1800 Toll-Free number provision.",
        "Call recording with downloadable audio & transcripts.",
        "Sticky agent and business working-hour routing.",
        "Missed call alerts sent instantly over SMS & WhatsApp.",
        "Real-time supervisor dashboard and live call monitoring.",
        "Direct CRM screen-pop and webhook synchronization.",
      ],
      pricing: emptyPricing("5000", "2000"),
    },
    {
      key: "smpp",
      enabled: false,
      title: "SMPP Connectivity",
      badge: "SMPP",
      subTitle: "Direct SMPP Carrier Binds",
      intro:
        "High-throughput, carrier-grade SMPP connectivity for enterprises and aggregators sending at volume — direct binds, ultra-low latency, and guaranteed uptime with dedicated technical support.",
      tables: [
        {
          slabLabel: "Credit Slab",
          slabValue: "Per SMS (SMPP)",
          rateLabel: "SMPP Rate",
          rateValue: "0.060",
        },
      ],
      bullets: [
        "SMPP v3.4 direct bind (TX / RX / TRX mode support).",
        "Carrier-grade 5,000+ TPS dedicated throughput.",
        "IP whitelisting, encrypted tunnels & secure credentials.",
        "Real-time millisecond DLR push over SMPP.",
        "99.9% platform uptime commitment with SLA.",
        "Dedicated NOC & technical integration engineering support.",
      ],
      pricing: emptyPricing("10000", "5000"),
    },
    {
      key: "api",
      enabled: false,
      title: "Enterprise APIs & CRM Integration",
      badge: "API",
      subTitle: "Developer-First RESTful Platform",
      intro:
        "Connect all communication channels directly into your CRM, ERP, and backend systems with Zion Marketing's developer-friendly REST APIs and instant webhooks.",
      tables: [
        {
          slabLabel: "CRM Connector Suite",
          slabValue: "Per Integration",
          rateLabel: "Integration Rate",
          rateValue: "5,000",
        },
        {
          slabLabel: "API Webhook Bridge",
          slabValue: "Annual License",
          rateLabel: "License Rate",
          rateValue: "12,000",
        },
      ],
      bullets: [
        "Unified RESTful API for SMS, RCS, WhatsApp, and Voice.",
        "Pre-built connectors for Salesforce, Zoho, HubSpot, and LeadSquared.",
        "Instant event webhooks for message status and user responses.",
        "SDKs available in Python, Node.js, PHP, Java, and cURL.",
        "Comprehensive API documentation with Swagger & Postman collections.",
        "99.9% API uptime commitment with enterprise-grade SLA.",
      ],
      pricing: emptyPricing("5000", "1000"),
    },
    {
      key: "realEstate",
      enabled: false,
      title: "Real Estate Project Branding",
      badge: "RE",
      subTitle: "Comprehensive Launch Marketing",
      intro:
        "End-to-end real estate project branding and launch solutions from Zion Marketing. From project naming and luxury brochure design to sales pavilion branding, site hoardings, and targeted digital acquisition campaigns.",
      tables: [
        {
          slabLabel: "Identity & Collateral Kit",
          slabValue: "Project Package",
          rateLabel: "Package Rate",
          rateValue: "45,000",
        },
        {
          slabLabel: "Site & Hoarding Creatives",
          slabValue: "Per Project",
          rateLabel: "Creative Rate",
          rateValue: "25,000",
        },
      ],
      bullets: [
        "Project naming, positioning strategy, and signature logo design.",
        "Luxury printed & digital project brochures with floor plan styling.",
        "Site hoardings, gantry designs, and entrance experience graphics.",
        "Experience center & sales lounge wall branding and signage.",
        "Omnichannel launch campaigns (WhatsApp broadcasts, SMS, Meta Ads).",
        "High-intent lead generation workflows tied to real estate CRMs.",
      ],
      pricing: emptyPricing("25000", "0"),
    },
  ],
});

export const currency = (v: string) => {
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  if (!isFinite(n)) return v;
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const computeTotal = (p: Pricing) => {
  const num = (v: string) => Number(String(v).replace(/[^0-9.-]/g, "")) || 0;
  const base = num(p.setup) + num(p.monthly) + num(p.price);
  const gst = (base * num(p.gst)) / 100;
  return base + gst;
};

export interface SavedQuotationRecord {
  id: string;
  organization_id: string;
  created_by: string;
  quotation_number: string;
  client_name: string;
  client_company: string;
  quotation_data: Quotation;
  status: string;
  created_at: string;
  updated_at: string;
  creator_email?: string;
  creator_name?: string;
}

