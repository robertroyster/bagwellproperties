// Shared types used by both the React client and the Cloudflare Worker.

export interface SiteInfo {
  brandName: string;
  est: string;
  phone: string; // display, e.g. "(919) 772-1976"
  phoneRaw: string; // tel: target, e.g. "9197721976"
  email: string;
  address: string;
}

export interface MiniStat {
  n: string;
  l: string;
}

export interface HeroContent {
  label: string;
  line1: string;
  line2: string; // gold accent line
  line3: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  image: string;
  badgeTitle: string;
  badgeSub: string;
  miniStats: MiniStat[];
}

export interface Stat {
  number: string;
  label: string;
}

export interface Service {
  num: string;
  title: string;
  body: string;
  tag: string;
}

export interface LandStat {
  stat: string;
  label: string;
}

export interface LandContent {
  label: string;
  title1: string;
  title2: string;
  body: string;
  image: string;
  stats: LandStat[];
  cta: string;
  locationTitle: string;
  locationSub: string;
}

export interface AboutContent {
  label: string;
  title1: string;
  title2: string;
  companyName: string;
  companyAddress: string;
  paragraphs: string[];
  quote: string;
}

export interface ContactContent {
  label: string;
  heading: string;
  blurb: string;
}

export interface SiteContent {
  site: SiteInfo;
  hero: HeroContent;
  stats: Stat[];
  services: Service[];
  land: LandContent;
  about: AboutContent;
  contact: ContactContent;
}

export interface Property {
  id: number;
  name: string;
  type: string;
  address: string;
  sf: string;
  status: string;
  image: string;
  sort: number;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  archived: number;
}

export interface MediaItem {
  key: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
}
