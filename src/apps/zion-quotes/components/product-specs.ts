export interface ProductCard {
  title: string;
  desc: string;
  icon: "lightning" | "shield" | "chart" | "gear" | "gallery" | "pointer" | "users" | "mic" | "clock";
  color: "orange" | "navy";
}

export interface ProductSpec {
  titlePrefix: string;
  titleSuffix: string;
  badge: string;
  subTitle: string;
  phoneMockup: {
    type: "sms" | "rcs" | "whatsapp" | "obd";
    title: string;
    subtitle: string;
    highlight?: string;
  };
  cards: ProductCard[];
  banner: {
    leftIcon: "plane" | "chat" | "phone";
    leftTitle: string;
    leftHighlight: string;
    rightGraphic: "growth" | "waveform" | "plane";
    rightPre: string;
    rightHighlight: string;
  };
}

export const PRODUCT_SPECS: Record<string, ProductSpec> = {
  bulkSms: {
    titlePrefix: "SMS Services & ",
    titleSuffix: "Pricing",
    badge: "SMS",
    subTitle: "Promotional & Transactional SMS",
    phoneMockup: {
      type: "sms",
      title: "Reach Your Customers Instantly!",
      subtitle: "Reliable. Fast. Scalable.",
    },
    cards: [
      {
        title: "Instant Delivery",
        desc: "High Throughput Multi-Telco Routing",
        icon: "lightning",
        color: "orange",
      },
      {
        title: "Secure & Reliable",
        desc: "Enterprise-Grade Infrastructure",
        icon: "shield",
        color: "navy",
      },
      {
        title: "Real-Time Reports",
        desc: "Track Performance with Ease",
        icon: "chart",
        color: "orange",
      },
      {
        title: "Easy Integration",
        desc: "API, Dashboard & Developer Support",
        icon: "gear",
        color: "navy",
      },
    ],
    banner: {
      leftIcon: "plane",
      leftTitle: "Reach More.",
      leftHighlight: "Deliver Faster.",
      rightGraphic: "growth",
      rightPre: "From Messages",
      rightHighlight: "to Opportunities.",
    },
  },

  rcs: {
    titlePrefix: "RCS Business ",
    titleSuffix: "Messaging",
    badge: "RCS",
    subTitle: "Next-Gen Rich Communication",
    phoneMockup: {
      type: "rcs",
      title: "Verified Brand.",
      subtitle: "Richer Conversations.",
      highlight: "Real Results.",
    },
    cards: [
      {
        title: "Rich Media",
        desc: "Images, Carousels, Videos",
        icon: "gallery",
        color: "orange",
      },
      {
        title: "Action Buttons",
        desc: "Drive Higher Engagement",
        icon: "pointer",
        color: "navy",
      },
      {
        title: "Verified Brand",
        desc: "Build Trust & Credibility",
        icon: "shield",
        color: "orange",
      },
      {
        title: "Better Results",
        desc: "Connect, Engage, Grow",
        icon: "users",
        color: "navy",
      },
    ],
    banner: {
      leftIcon: "plane",
      leftTitle: "Let's Build Stronger Connections",
      leftHighlight: "Together.",
      rightGraphic: "growth",
      rightPre: "From Communication",
      rightHighlight: "to Possibilities.",
    },
  },

  whatsapp: {
    titlePrefix: "WhatsApp ",
    titleSuffix: "Business API",
    badge: "WA",
    subTitle: "Official Meta Cloud API",
    phoneMockup: {
      type: "whatsapp",
      title: "Smarter Conversations",
      subtitle: "Stronger Business.",
    },
    cards: [
      {
        title: "Engage Your Customers",
        desc: "Automate. Personalize. Scale.",
        icon: "users",
        color: "orange",
      },
      {
        title: "Boost Business Growth",
        desc: "Higher Reach. Better Conversions.",
        icon: "chart",
        color: "navy",
      },
      {
        title: "Build Trust with Verified Business",
        desc: "Official. Secure. Reliable.",
        icon: "shield",
        color: "orange",
      },
      {
        title: "Omnichannel Connect",
        desc: "CRM & AI Agent Integrations",
        icon: "gear",
        color: "navy",
      },
    ],
    banner: {
      leftIcon: "chat",
      leftTitle: "Turn Conversations",
      leftHighlight: "Into Opportunities.",
      rightGraphic: "plane",
      rightPre: "Let's Scale Your Business",
      rightHighlight: "Together.",
    },
  },

  obd: {
    titlePrefix: "OBD ",
    titleSuffix: "Voice Call Services",
    badge: "OBD",
    subTitle: "Automated Voice Broadcasting",
    phoneMockup: {
      type: "obd",
      title: "Reach More Customers",
      subtitle: "With Voice.",
    },
    cards: [
      {
        title: "Studio Voice Recording",
        desc: "Professional. Real. Impactful.",
        icon: "mic",
        color: "orange",
      },
      {
        title: "Wider Reach",
        desc: "Non-DND & DND Delivery",
        icon: "users",
        color: "navy",
      },
      {
        title: "Actionable Insights",
        desc: "Call Duration & Listen Rates",
        icon: "chart",
        color: "orange",
      },
      {
        title: "24x7 Support",
        desc: "Always Here for You",
        icon: "clock",
        color: "navy",
      },
    ],
    banner: {
      leftIcon: "phone",
      leftTitle: "Your Message.",
      leftHighlight: "Their Attention.",
      rightGraphic: "waveform",
      rightPre: "Turn Calls Into",
      rightHighlight: "Opportunities.",
    },
  },
};

export function getProductSpec(key: string, title: string, badge: string, subTitle: string): ProductSpec {
  if (PRODUCT_SPECS[key]) {
    return PRODUCT_SPECS[key];
  }

  // Fallback for other services (meta, ivr, smpp, etc.)
  const words = title.split(" ");
  const half = Math.max(1, Math.floor(words.length / 2));
  const prefix = words.slice(0, half).join(" ") + " ";
  const suffix = words.slice(half).join(" ");

  return {
    titlePrefix: prefix,
    titleSuffix: suffix,
    badge,
    subTitle,
    phoneMockup: {
      type: "sms",
      title: "Enterprise Solutions",
      subtitle: "Built to Scale.",
    },
    cards: [
      {
        title: "High Performance",
        desc: "Multi-Carrier Redundancy & Uptime",
        icon: "lightning",
        color: "orange",
      },
      {
        title: "Enterprise Security",
        desc: "Encrypted & Compliant Infrastructure",
        icon: "shield",
        color: "navy",
      },
      {
        title: "Granular Analytics",
        desc: "Real-time Metrics & Insights",
        icon: "chart",
        color: "orange",
      },
      {
        title: "Developer First",
        desc: "Comprehensive REST APIs & Webhooks",
        icon: "gear",
        color: "navy",
      },
    ],
    banner: {
      leftIcon: "plane",
      leftTitle: "Scale Faster.",
      leftHighlight: "Grow Stronger.",
      rightGraphic: "growth",
      rightPre: "From Vision",
      rightHighlight: "to Reality.",
    },
  };
}
