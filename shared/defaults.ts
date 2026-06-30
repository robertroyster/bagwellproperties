import type { SiteContent, Property } from "./types";

// Default site content — mirrors the original hand-built landing page.
// Seeded into D1 on first run and used as a client-side fallback so the page
// always renders correctly even before the API responds.
export const DEFAULT_CONTENT: SiteContent = {
  site: {
    brandName: "Bagwell Properties",
    est: "EST. 1992 · RALEIGH, NC",
    phone: "(919) 772-1976",
    phoneRaw: "9197721976",
    email: "bcole@bagwellproperties.com",
    address: "333 Sherwee Drive, Raleigh, NC",
  },
  hero: {
    label: "Commercial Real Estate · Wake County, NC",
    line1: "260,000",
    line2: "Square Feet.",
    line3: "One Contact.",
    sub: "Locally owned and operated since 1992. Retail, flex, office, and warehouse space — plus 400+ acres of industrial land along I-40.",
    ctaPrimary: "View Properties",
    ctaSecondary: "Get in Touch",
    image: "/images/bagwell_hero_property.jpg",
    badgeTitle: "Raleigh, NC",
    badgeSub: "Wake County",
    miniStats: [
      { n: "1992", l: "Est." },
      { n: "30+", l: "Yr Tenants" },
      { n: "I-40", l: "Corridor" },
    ],
  },
  stats: [
    { number: "260K+", label: "SF Commercial Space" },
    { number: "400+", label: "Acres Industrial Land" },
    { number: "30+", label: "Years in Operation" },
    { number: "4", label: "Space Types Available" },
  ],
  services: [
    {
      num: "01",
      title: "Commercial Leasing",
      body: "Retail, flex, office, and warehouse space with loading docks across Wake County. Over 260,000 square feet of privately held commercial space — with a single point of contact for every lease.",
      tag: "Retail · Flex · Office · Warehouse",
    },
    {
      num: "02",
      title: "Property Management",
      body: "Hands-on management by the same team since 1995. We know our properties and our tenants personally. Some have been with us for more than thirty years — because we make it easy to stay.",
      tag: "Since 1992 · Wake County",
    },
    {
      num: "03",
      title: "Industrial Land",
      body: "Over 400 acres of industrial-zoned land along I-40 in Wake County, directly across from Amazon. Additional parcels in Wake and Johnston County for developers ready to build.",
      tag: "I-40 Corridor · 400+ Acres",
    },
  ],
  land: {
    label: "Development Opportunity",
    title1: "400+ Acres of",
    title2: "Industrial Land",
    body: "Prime industrial-zoned property in Wake County, North Carolina — right along Interstate 40, directly across from Amazon's fulfillment center. Additional parcels in Wake and Johnston County.",
    image: "/images/bagwell_industrial_land.jpg",
    stats: [
      { stat: "400+", label: "Acres Available" },
      { stat: "I-40", label: "Corridor Access" },
      { stat: "Wake Co.", label: "Primary Location" },
      { stat: "Johnston", label: "Additional Parcels" },
    ],
    cta: "Discuss Land Opportunities",
    locationTitle: "Wake County, NC",
    locationSub: "I-40 Corridor",
  },
  about: {
    label: "About",
    title1: "A Raleigh institution",
    title2: "since 1992.",
    companyName: "Bagwell Properties, Inc.",
    companyAddress: "333 Sherwee Drive, Raleigh, NC",
    paragraphs: [
      "Bagwell Properties, Inc. has been a fixture in the Wake County commercial real estate market for over three decades. Our current management team has been in place since 1995, and our tenant relationships reflect that continuity — some have been with us for more than thirty years.",
      "We're not a national REIT or a faceless platform. We're a locally owned, privately held company that picks up the phone. When you lease from Bagwell, you deal with the same people year after year.",
    ],
    quote: "Some of our tenants have been with us for more than thirty years.",
  },
  contact: {
    label: "Get in Touch",
    heading: "Let's Talk About Your Space.",
    blurb:
      "Whether you're looking for office, flex, retail, or warehouse space — or you're a developer interested in our industrial land — we'd like to hear from you. Call us directly or send a message.",
  },
};

export const DEFAULT_PROPERTIES: Omit<Property, "id">[] = [
  {
    name: "Sherwee Center",
    type: "Office / Flex",
    address: "335 Sherwee Drive, Raleigh NC",
    sf: "±4,400 SF",
    status: "Available",
    image: "/images/bagwell_warehouse_interior.jpg",
    sort: 1,
  },
  {
    name: "5301 Capital Boulevard",
    type: "Retail / Flex Space",
    address: "5301 Capital Blvd, Raleigh, NC",
    sf: "±8,000 SF",
    status: "Available",
    image: "/images/bagwell_hero_property.jpg",
    sort: 2,
  },
];
