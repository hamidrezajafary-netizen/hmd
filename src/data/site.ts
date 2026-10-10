export const site = {
  name: 'Horizon Properties',
  tagline: 'Exceptional homes & investments',
  description:
    'A private-client real estate house advising on luxury residences, investment portfolios and premium developments across the United States.',
  phone: '(555) 246-7890',
  phoneHref: 'tel:+15552467890',
  email: 'advisors@horizonproperties.com',
  office: '1180 Lakeshore Boulevard, Suite 420, Austin, TX 78701',
  hours: 'Monday – Saturday, 9:00 – 18:00 CST',
  founded: 2001,
} as const;

export type NavItem = { label: string; to: string };

export const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Properties', to: '/properties' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Team', to: '/team' },
  { label: 'Contact', to: '/contact' },
];

export type Service = {
  id: string;
  index: string;
  title: string;
  summary: string;
  detail: string;
  points: string[];
  image: string;
};

export const services: Service[] = [
  {
    id: 'luxury-home-sales',
    index: '01',
    title: 'Luxury Home Sales',
    summary: 'Discreet representation for buyers and sellers of exceptional residences.',
    detail:
      'From first viewing to closing, a single senior advisor leads the process with a private, unhurried approach.',
    points: ['Private client representation', 'Off-market introductions', 'Discreet marketing'],
    image: '1616486338812-3dadae4b4ace',
  },
  {
    id: 'property-investment',
    index: '02',
    title: 'Property Investment',
    summary: 'Portfolio strategy built on data, yield and long-term appreciation.',
    detail:
      'We model cash flow, market depth and exit scenarios before recommending a single acquisition.',
    points: ['Yield and risk modelling', 'Acquisition diligence', 'Portfolio reviews'],
    image: '1670589953882-b94c9cb380f5',
  },
  {
    id: 'property-marketing',
    index: '03',
    title: 'Property Marketing',
    summary: 'Editorial campaigns that present architecture at its best.',
    detail:
      'Architectural photography, film and international placement, curated around the character of each home.',
    points: ['Architectural photography', 'International placement', 'Private launch events'],
    image: '1600607687939-ce8a6c25118c',
  },
  {
    id: 'real-estate-advisory',
    index: '04',
    title: 'Real Estate Advisory',
    summary: 'Strategic counsel for families, funds and private offices.',
    detail:
      'Structuring, timing and negotiation advice for clients holding or building significant property positions.',
    points: ['Acquisition strategy', 'Negotiation support', 'Estate planning liaison'],
    image: '1777919541982-dcb34c146a2d',
  },
  {
    id: 'property-valuation',
    index: '05',
    title: 'Property Valuation',
    summary: 'Accurate, evidence-led appraisals for distinctive homes.',
    detail:
      'Comparable analysis, condition assessment and market depth reporting delivered within five working days.',
    points: ['Comparable analysis', 'Condition assessment', 'Written appraisal report'],
    image: '1600210492486-724fe5c67fb0',
  },
  {
    id: 'relocation-services',
    index: '06',
    title: 'Relocation Services',
    summary: 'A complete welcome for clients moving into a new city.',
    detail:
      'Schools, healthcare, staffing and interiors — arranged quietly around your arrival date.',
    points: ['Neighbourhood orientation', 'Household setup', 'Introductions and vetting'],
    image: '1706808849780-7a04fbac83ef',
  },
];

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  focus: string;
  bio: string;
  photo: string;
  email: string;
  phone: string;
};

export const team: TeamMember[] = [
  {
    id: 'daniel-morgan',
    name: 'Daniel Morgan',
    role: 'Managing Director',
    focus: 'Advisory · Portfolio strategy',
    bio: 'Twenty years advising private clients on residential acquisitions across the United States and Europe.',
    photo: '1560250097-0b93528c311a',
    email: 'daniel.morgan@horizonproperties.com',
    phone: '(555) 246-7890',
  },
  {
    id: 'olivia-carter',
    name: 'Olivia Carter',
    role: 'Luxury Property Advisor',
    focus: 'Coastal & architectural homes',
    bio: 'Represents architecturally significant homes on the Californian and Floridian coastlines.',
    photo: '1573496359142-b8d87734a5a2',
    email: 'olivia.carter@horizonproperties.com',
    phone: '(555) 246-7891',
  },
  {
    id: 'james-wilson',
    name: 'James Wilson',
    role: 'Investment Consultant',
    focus: 'Yield & development',
    bio: 'Builds income-focused portfolios and advises on boutique residential developments.',
    photo: '1507003211169-0a1dd7228f2d',
    email: 'james.wilson@horizonproperties.com',
    phone: '(555) 246-7892',
  },
  {
    id: 'sophia-bennett',
    name: 'Sophia Bennett',
    role: 'Senior Property Specialist',
    focus: 'Lake & mountain estates',
    bio: 'Specialises in lakefront estates and second homes for families relocating within the US.',
    photo: '1494790108377-be9c29b29330',
    email: 'sophia.bennett@horizonproperties.com',
    phone: '(555) 246-7893',
  },
];

export const whyHorizon = {
  stats: [
    { value: '1,240', label: 'Residences placed' },
    { value: '$4.6B', label: 'Property transacted' },
    { value: '38', label: 'Markets covered' },
    { value: '98%', label: 'Client satisfaction' },
  ],
  pillars: [
    {
      title: 'Off-market access',
      body: 'A private network of owners, developers and family offices gives clients access to homes that are never advertised.',
    },
    {
      title: 'Advisory-led service',
      body: 'Every client works with one senior advisor from first conversation to keys, supported by our research desk.',
    },
    {
      title: 'Evidence before opinion',
      body: 'Valuations, yield models and market depth are prepared in writing before any offer is recommended.',
    },
  ],
};

export const values = [
  {
    title: 'Integrity',
    body: 'We would rather lose a listing than misprice a home. Every recommendation is documented and defensible.',
  },
  {
    title: 'Transparency',
    body: 'Clients see the comparable evidence, the fees and the risks — presented plainly, in writing.',
  },
  {
    title: 'Client satisfaction',
    body: 'We measure success by repeat business: two thirds of our clients return or refer a friend.',
  },
];
