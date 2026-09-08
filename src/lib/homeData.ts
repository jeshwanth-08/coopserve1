export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  rating: number;
  reviewsCount: number;
  bookingsCount: number;
  price: number;
  originalPrice: number;
  duration: string;
  image: string;
  badge?: string;
  description: string;
  includes: string[];
  excludes?: string[];
  isAvailable?: boolean;
}

export type CategoryItem = CategoryDetail;

export interface CategoryDetail {
  id: string;
  title: string;
  slug: string;
  aliases: string[];
  tagline: string;
  heroHeadline: string;
  iconName: string;
  image: string;
  coverBanner: string;
  popularServices: string[];
  startingPrice: number;
  badge?: string;
  description: string;
  whatsIncluded: string[];
  whatsNotIncluded: string[];
  processSteps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export interface ProProfile {
  id: string;
  name: string;
  role: string;
  city: string;
  rating: number;
  reviewsCount: number;
  jobsCompleted: number;
  experienceYears: number;
  avatar: string;
  verified: boolean;
  specialty: string;
  quote: string;
}

export interface ServicePackage {
  id: string;
  title: string;
  tag: string;
  originalPrice: number;
  offerPrice: number;
  savings: number;
  duration: string;
  rating: number;
  image: string;
  highlights: string[];
}

export interface ReviewItem {
  id: string;
  name: string;
  city: string;
  locality: string;
  service: string;
  categorySlug?: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
  verified: boolean;
  beforeAfterImage?: string;
}

export const INDIAN_CITIES = [
  { name: "Bengaluru", localities: ["Indiranagar", "Koramangala", "HSR Layout", "Whitefield", "JP Nagar", "Hebbal"] },
  { name: "Mumbai", localities: ["Bandra West", "Andheri East", "Powai", "Juhu", "Worli", "Thane West"] },
  { name: "Delhi NCR", localities: ["DLF Phase 5, Gurugram", "South Extension", "Noida Sector 62", "Dwarka", "Vasant Kunj"] },
  { name: "Hyderabad", localities: ["Madhapur", "Gachibowli", "Jubilee Hills", "Banjara Hills", "Kondapur"] },
  { name: "Pune", localities: ["Kothrud", "Koregaon Park", "Viman Nagar", "Baner", "Wakad"] },
  { name: "Chennai", localities: ["Adyar", "Anna Nagar", "T. Nagar", "Velachery", "OMR"] },
];

export const CATEGORIES: CategoryDetail[] = [
  {
    id: "cat-1",
    title: "Cleaning",
    slug: "cleaning",
    aliases: ["home-cleaning", "deep-cleaning", "house-cleaning"],
    tagline: "Spotless bathrooms, kitchens & full homes",
    heroHeadline: "Professional Home & Kitchen Deep Cleaning Services",
    iconName: "Sparkles",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    coverBanner: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85",
    popularServices: ["Full Home Deep Clean", "Bathroom Scrub & Shine", "Kitchen Degreasing", "Sofa Shampooing"],
    startingPrice: 399,
    badge: "Trending",
    description: "Eco-friendly, chemical-safe deep cleaning for bathrooms, modular kitchens, sofas, and full furnished or unfurnished apartments using industrial single-disc floor scrubbers and HEPA extraction vacuums.",
    whatsIncluded: [
      "Industrial high-pressure steam and vacuum extraction",
      "Hard water scale & tile grout dirt removal with non-acidic agents",
      "Cabinet interior vacuuming and exterior degreasing",
      "Door frames, switchboards, and window track scrubbing",
      "Hospital-grade antiviral sanitization mist"
    ],
    whatsNotIncluded: [
      "Removal of permanent paint or cement splatter from construction",
      "Cleaning of high exterior building glass walls beyond safety reach",
      "Washing of clothes or kitchen utensils (unless booked as add-on)"
    ],
    processSteps: [
      { title: "Inspection & Dust Vacuuming", desc: "Technicians assess all tile surfaces and HEPA vacuum dry dust from ceilings to floors." },
      { title: "Chemical Degreasing & Scrubbing", desc: "Non-corrosive foaming solutions loosen embedded stains, oil residues, and lime scale." },
      { title: "High-Pressure Rinse & Buff", desc: "Single disc rotary machines buff floor tiles and industrial wet-vacs dry all areas." },
      { title: "Sanitization & Final Walkthrough", desc: "Surface sanitization with customer quality sign-off." }
    ],
    faqs: [
      { q: "How long does a 2 BHK or 3 BHK deep clean take?", a: "A standard 2 BHK deep clean takes approximately 3.5 to 5 hours with a 2–3 person specialist crew." },
      { q: "Do I need to provide buckets, mops, or cleaning chemicals?", a: "No. Our crew brings heavy-duty machines, certified Taski chemicals, microfiber towels, and extension ladders." },
      { q: "Is the cleaning safe for pets and young toddlers?", a: "Yes, 100%. We exclusively use biodegradable, non-toxic cleaning agents without harsh hydrochloric acid." }
    ]
  },
  {
    id: "cat-2",
    title: "AC & Appliances",
    slug: "ac-appliances",
    aliases: ["ac-repair", "ac-service", "appliances", "refrigerator-repair", "washing-machine-repair"],
    tagline: "Jet service, gas refill & machine repairs",
    heroHeadline: "High-Pressure Power Jet AC Service & Appliance Repairs",
    iconName: "Flame",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    coverBanner: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=85",
    popularServices: ["Power Jet AC Clean", "Gas Leak & Refill", "Washing Machine Check", "Refrigerator Cooling Fix"],
    startingPrice: 449,
    badge: "Most Booked",
    description: "Certified HVAC and appliance technicians for split/window AC power jet washing, inverter PCB repairs, refrigerant gas charging, washing machine drum vibration fixes, and refrigerator cooling restores.",
    whatsIncluded: [
      "High-pressure foam jet wash with waterproof AC jacket",
      "Indoor cooling coil, blower wheel, and air filter deep clean",
      "Outdoor condenser unit coil pressure wash",
      "Drain pipe flush to prevent indoor water dripping",
      "Digital multimeter voltage and amp load check",
      "30-day comprehensive rework warranty"
    ],
    whatsNotIncluded: [
      "Refrigerant gas top-up or full refill (billed separately at standard transparent MRP card)",
      "Spare parts like capacitors, PCB boards, or copper pipes",
      "Scaffolding for outdoor units installed at dangerous heights above 3rd floor"
    ],
    processSteps: [
      { title: "Pre-service Temperature & Gas Audit", desc: "Technician measures inlet/outlet airflow temp and compressor amp draw." },
      { title: "Jacket Wrapping & Foam Jet Wash", desc: "A heavy-duty waterproof bag is clipped around the indoor unit to shield walls during jet wash." },
      { title: "Outdoor Condenser Descaling", desc: "High pressure jet dislodges dirt from aluminum condenser fins to maximize heat release." },
      { title: "Cooling Performance Test", desc: "15-minute load test verifying ice-cold output before departure." }
    ],
    faqs: [
      { q: "How often should I get my split AC jet serviced in India?", a: "We recommend power jet servicing twice a year (before summer begins and post-monsoon) to prevent coil corrosion and heavy electricity bills." },
      { q: "Will the water jet dirty my bedroom walls or wallpaper?", a: "No. Our technicians clip a full 360-degree funnel jacket that channels all wash water into a sealed drainage bucket." }
    ]
  },
  {
    id: "cat-3",
    title: "Plumbing",
    slug: "plumbing",
    aliases: ["plumber", "pipe-leak", "tap-repair"],
    tagline: "Rapid leak fixes, taps & drainage solutions",
    heroHeadline: "Master Plumbing, Leak Diagnosis & Sanitary Installations",
    iconName: "Droplet",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
    coverBanner: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=85",
    popularServices: ["Tap & Mixer Repair", "Drain Blockage Clearing", "Water Tank Cleaning", "Geyser Pipeline Fitting"],
    startingPrice: 199,
    badge: "45-Min Dispatch",
    description: "Expert plumbers for concealed wall leaks, tap cartridge replacements, toilet flush tank overhaul, motorized drain snaking, water tank sanitization, and hot-water geyser pipeline fittings.",
    whatsIncluded: [
      "Diagnosis of water pressure and leakage origin",
      "Standard Teflon tape and rubber washer replacements",
      "Proper tightening with precision torque pipe wrenches",
      "Post-repair pressure testing and clean dry wipe"
    ],
    whatsNotIncluded: [
      "Cost of new brass taps, diverter cartridges, or PVC pipes",
      "Masonry or tile replacement if structural walls need cutting"
    ],
    processSteps: [
      { title: "Isolation & Diagnosis", desc: "Technician turns off the angle stopcock and inspects thread integrity." },
      { title: "Repair or Part Replacement", desc: "Old worn components are replaced with genuine ISO-rated fittings." },
      { title: "Pressure Check & Seal", desc: "Main valve reopened to test under high head pressure." }
    ],
    faqs: [
      { q: "Do your plumbers carry basic spare parts like washers and angle valves?", a: "Yes, all our plumbers carry a stock of standard CPVC connectors, washers, Teflon tape, and angle valves." }
    ]
  },
  {
    id: "cat-4",
    title: "Electrical",
    slug: "electrical",
    aliases: ["electrician", "electrical-work", "wiring"],
    tagline: "Certified electricians for switches, fans & wiring",
    heroHeadline: "Licensed Electricians for Safe Home Wiring & Installations",
    iconName: "Zap",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
    coverBanner: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=85",
    popularServices: ["Ceiling Fan Installation", "MCB Tripping Fix", "Switchboard Replacement", "Chandelier Hanging"],
    startingPrice: 149,
    badge: "Certified",
    description: "Government-licensed electricians for MCB tripping faults, ceiling fan and chandelier installations, concealed wiring fixes, inverter battery connections, and smart home switchboard setups.",
    whatsIncluded: [
      "Digital multimeter earth and phase voltage checks",
      "Insulated safety tools and heavy-duty wire strippers",
      "Proper color-coded wire labeling and connector crimping",
      "Free electrical safety audit card of your main distribution board"
    ],
    whatsNotIncluded: [
      "Cost of electrical hardware (switches, MCBs, wires, chandeliers)",
      "Laying fresh underground conduit pipelines through thick concrete"
    ],
    processSteps: [
      { title: "Mains Power De-energization", desc: "Safety lockout of relevant breaker before opening switchboards." },
      { title: "Fault Tracing & Wiring", desc: "Using digital continuity testers to identify short circuits." },
      { title: "Terminal Tightening & Load Test", desc: "Verifying thermal stability under full household appliance load." }
    ],
    faqs: [
      { q: "Is emergency electrical assistance available late at night?", a: "Yes, our urgent dispatch team handles sparking switchboards and power blackout emergencies 24/7." }
    ]
  },
  {
    id: "cat-5",
    title: "Beauty & Grooming",
    slug: "beauty-grooming",
    aliases: ["beauty", "salon", "grooming", "spa", "haircut"],
    tagline: "Salon, facial, haircut & spa in your living room",
    heroHeadline: "Premium Salon, Spa & Grooming in the Comfort of Home",
    iconName: "Scissors",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
    coverBanner: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85",
    popularServices: ["Pedicure & Manicure", "Hydra Glow Facial", "Men's Beard & Haircut", "Relaxing Swedish Spa"],
    startingPrice: 299,
    badge: "Top Rated",
    description: "Ultra-hygienic at-home salon and spa services for women and men with 100% single-use sealed kits, disposable towels, and certified estheticians.",
    whatsIncluded: [
      "Single-use sealed cosmetic kits opened directly in front of you",
      "Disposable hygiene sheets, gowns, and sanitized tools",
      "Relaxing aroma steam and soothing massage techniques",
      "Post-service floor and station cleanup"
    ],
    whatsNotIncluded: [
      "Permanent hair chemical rebonding or bleaching treatments requiring salon hoods"
    ],
    processSteps: [
      { title: "Hygienic Station Setup", desc: "Esthetician lays disposable protective sheets and sanitizes all tools." },
      { title: "Consultation & Treatment", desc: "Tailored treatment using single-use mono-dose packs." },
      { title: "Clean Up & Glow", desc: "Zero cleanup burden for you — we pack up all residues." }
    ],
    faqs: [
      { q: "Are the products authentic and safe for sensitive skin?", a: "Yes, we exclusively use premium branded products (O3+, Cheryl's, L'Oréal, Sara) in factory-sealed single-use pouches." }
    ]
  },
  {
    id: "cat-6",
    title: "Painting",
    slug: "painting",
    aliases: ["house-painting", "wall-painting", "waterproofing"],
    tagline: "Wall texture, waterproof coats & full home color",
    heroHeadline: "Dust-Free Home Painting, Waterproofing & Texture Art",
    iconName: "Paintbrush",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
    coverBanner: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=85",
    popularServices: ["Accent Wall Texture", "1 BHK Express Paint", "Waterproofing Treatment", "Door & Railing Enamel"],
    startingPrice: 1499,
    description: "Laser-accurate wall moisture measurement, dust-free mechanized sanding, Asian Paints/Dulux premium emulsions, and complete floor masking furniture protection.",
    whatsIncluded: [
      "Digital moisture meter assessment of wall dampness",
      "Complete plastic masking of floors, fans, and furniture",
      "Mechanized dust-free vacuum sanding and putty filling",
      "2-3 coats of premium low-VOC emulsion paint",
      "Post-painting deep cleanup and furniture repositioning"
    ],
    whatsNotIncluded: [
      "Structural plastering of hollow masonry (can be added as civil repair)"
    ],
    processSteps: [
      { title: "Moisture Check & Shade Consultation", desc: "Expert tests dampness levels and helps pick perfect light-reflective tones." },
      { title: "Masking & Surface Prep", desc: "All furniture covered with heavy plastic drops and wall cracks filled." },
      { title: "Mechanized Sanding & Application", desc: "Smooth roller finish with minimum overspray and zero brush marks." }
    ],
    faqs: [
      { q: "How long does it take to paint a 3 BHK apartment?", a: "With our mechanized 4-person crew, a standard 3 BHK is completed in 3 to 4 days with zero dust in the air." }
    ]
  },
  {
    id: "cat-7",
    title: "Pest Control",
    slug: "pest-control",
    aliases: ["pest", "termite", "cockroach-control", "bed-bugs"],
    tagline: "Safe herbal gel treatment & termite protection",
    heroHeadline: "Odorless Herbal Gel Pest & Termite Control",
    iconName: "ShieldAlert",
    image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=600&q=80",
    coverBanner: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1200&q=85",
    popularServices: ["Cockroach Herbal Gel", "Termite Barrier", "Bed Bug Eradication", "Mosquito Shield Fog"],
    startingPrice: 699,
    description: "100% odorless, pet-safe and infant-safe Bayer herbal gel applications. No need to empty your kitchen cabinets or leave the house.",
    whatsIncluded: [
      "Bayer Maxforce odorless herbal gel spot application in hinge gaps",
      "Drainage pipe anti-pest powder barrier",
      "Residual spray along floor skirting and balcony drains",
      "90-Day free warranty with free revisit if pests persist"
    ],
    whatsNotIncluded: [
      "Fumigation requiring overnight evacuation (unless industrial heavy infestation)"
    ],
    processSteps: [
      { title: "Inspection of Nesting Hotspots", desc: "Technician checks cabinet corners, fridge motors, and pipe entries." },
      { title: "Gel Dotting & Drain Treatment", desc: "Microdots placed strategically out of reach of children and pets." },
      { title: "Perimeter Barrier Spray", desc: "Odorless anti-reinfestation spray along doors and balconies." }
    ],
    faqs: [
      { q: "Do I need to take out all pots and spices from my kitchen cabinets?", a: "No! Unlike old chemical sprays, our herbal gel is odorless and applied in tiny dots behind hinge brackets without emptying cabinets." }
    ]
  },
  {
    id: "cat-8",
    title: "Home Repairs",
    slug: "home-repairs",
    aliases: ["carpentry", "locksmith", "handyman", "carpenter", "door-repair"],
    tagline: "Carpentry, lock rekeying, drilling & tiling",
    heroHeadline: "Expert Carpentry, Locksmith & Handyman Repairs",
    iconName: "Wrench",
    image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80",
    coverBanner: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=85",
    popularServices: ["Door Lock Installation", "Drilling & Wall Hanging", "Cabinet Hinge Repair", "Curtain Rod Fix"],
    startingPrice: 149,
    description: "Precision drilling for paintings and mirrors, hydraulic cabinet hinge replacements, smart deadbolt installation, and wood furniture restoration.",
    whatsIncluded: [
      "Laser level measurement and heavy duty wall anchors",
      "Precision mortise chiseling and drill dust collector use",
      "Clean post-service sweeping and alignment check"
    ],
    whatsNotIncluded: [
      "Cost of hardware fixtures, deadbolts, or curtain rods"
    ],
    processSteps: [
      { title: "Laser Level Marking", desc: "Precise horizontal alignment preventing crooked frame hanging." },
      { title: "Dust-Free Drilling & Anchor Insert", desc: "Vacuum assisted drilling prevents wall dust from falling on floors." },
      { title: "Load Test & Cleanup", desc: "Testing weight capacity and wiping surface clean." }
    ],
    faqs: [
      { q: "Can the technician help hang heavy 25kg mirrors safely?", a: "Yes, our carpenters use heavy-duty steel sleeve anchors tested for up to 60kg load." }
    ]
  },
  {
    id: "cat-9",
    title: "Furniture Assembly",
    slug: "furniture-assembly",
    aliases: ["furniture", "ikea-assembly", "bed-assembly"],
    tagline: "IKEA, modular beds, wardrobes & study desks",
    heroHeadline: "Precision Assembly for IKEA, Urban Ladder & Modular Furniture",
    iconName: "Armchair",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    coverBanner: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85",
    popularServices: ["King Bed Setup", "3-Door Wardrobe Assembly", "Ergonomic Desk Setup", "Wall Mounted TV Unit"],
    startingPrice: 499,
    description: "Experienced modular furniture carpenters for flatpack IKEA, Wakefit, Nilkamal, and customized sliding wardrobes.",
    whatsIncluded: [
      "Unboxing and hardware inventory sorting",
      "Hydraulic gas-lift adjustment and alignment",
      "Floor protection mats during installation",
      "Packing box breakdown and neat bundling"
    ],
    whatsNotIncluded: [
      "Custom woodworking modification to alter factory dimensions"
    ],
    processSteps: [
      { title: "Inventory & Base Construction", desc: "Sorting screws and assembling primary structural frame." },
      { title: "Panel Alignment & Hinge Tuning", desc: "Fine-tuning soft close hinges and drawer runners." }
    ],
    faqs: [
      { q: "Do you provide screws and dowels if some are missing in the box?", a: "Yes, our technicians carry extra metric screws, wood dowels, and cam-lock fasteners." }
    ]
  },
  {
    id: "cat-10",
    title: "Moving & Shifting",
    slug: "moving-shifting",
    aliases: ["moving", "packers-and-movers", "relocation", "tempo-booking"],
    tagline: "Safe doorstep packing, mini tempo & movers",
    heroHeadline: "Hassle-Free City Relocation, Packing & Mini Movers",
    iconName: "Truck",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    coverBanner: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    popularServices: ["Local House Relocation", "Tata Ace Mini Truck", "Single Sofa/Bed Move", "Cardboard Box Packing"],
    startingPrice: 899,
    description: "3-layer bubble wrap packing, closed-body sanitized mini trucks (Tata Ace/Bolero), dedicated helper crew, and safe transit insurance.",
    whatsIncluded: [
      "3-layer corrugated & bubble wrap for fragile glassware and TVs",
      "Dedicated loading and unloading helper staff",
      "Closed weatherproof vehicle with GPS tracking",
      "Basic dismantling and reassembly of cots and tables"
    ],
    whatsNotIncluded: [
      "Interstate customs toll permits (quoted transparently based on route)"
    ],
    processSteps: [
      { title: "Systematic Layered Packing", desc: "Color-coded labeling of kitchen, bedroom, and fragile items." },
      { title: "Safe Loading & Transit", desc: "Strap secured loading in clean enclosed vehicle." },
      { title: "Unloading & Furniture Placement", desc: "Placing heavy furniture in assigned rooms." }
    ],
    faqs: [
      { q: "Is transit damage protection included?", a: "Yes, all moving bookings include standard ₹10,000 protection cover with optional zero-depreciation top-ups." }
    ]
  },
  {
    id: "cat-11",
    title: "Car/Bike Care",
    slug: "car-bike-care",
    aliases: ["car-wash", "bike-service", "car-cleaning", "bike-repair"],
    tagline: "Eco waterless doorstep wash & bike tuning",
    heroHeadline: "Doorstep Foam Wash, Interior Detailing & Bike Tuning",
    iconName: "Car",
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80",
    coverBanner: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=85",
    popularServices: ["Doorstep SUV Deep Foam Wash", "Ceramic Gloss Wax", "Bike 24-Point General Tuneup", "Interior Vacuum & Ozone"],
    startingPrice: 349,
    description: "High-foaming doorstep car wash at your apartment parking slot with zero mess, dashboard UV dress, high-suction floor vacuuming, and 24-point two-wheeler maintenance.",
    whatsIncluded: [
      "pH neutral foam wash using portable high-pressure sprayer",
      "Deep cabin vacuuming including boot and under-seat gaps",
      "Dashboard and door trim UV protective dressing",
      "Crystal clear streak-free glass polishing"
    ],
    whatsNotIncluded: [
      "Engine overhaul or body repainting"
    ],
    processSteps: [
      { title: "Pre-rinse & Snow Foam", desc: "Lifting abrasive road dust without scratching clear coat." },
      { title: "Microfiber Scrub & Dry", desc: "Plush 600 GSM microfiber towels for swirl-free drying." },
      { title: "Cabin Vacuum & Ozone Fresh", desc: "Eliminating trapped odors and dust mites from AC vents." }
    ],
    faqs: [
      { q: "Does your team need water or electricity connections in my basement parking?", a: "Our mobile van is self-powered with onboard water tanks and silent battery generators." }
    ]
  },
  {
    id: "cat-12",
    title: "Home Improvement",
    slug: "home-improvement",
    aliases: ["renovation", "interior", "modular-kitchen", "false-ceiling"],
    tagline: "False ceiling, modular storage & green balconies",
    heroHeadline: "Modular Kitchens, False Ceilings & Home Upgrades",
    iconName: "Home",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
    coverBanner: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
    popularServices: ["Balcony Turf & Planters", "Kitchen Modular Pull-outs", "Gypsum False Ceiling", "Smart Home Sensor Setup"],
    startingPrice: 2499,
    badge: "Design Assist",
    description: "End-to-end design assistance for false ceiling cove lights, modular kitchen tandem drawers, balcony garden artificial turf, and smart home automation.",
    whatsIncluded: [
      "Free in-person design consultation & 3D layout measurement",
      "Termite-proof marine plywood and Hafele/Hettich hardware",
      "Fixed milestone payments with dedicated project supervisor",
      "5-Year material warranty"
    ],
    whatsNotIncluded: [
      "Civil structural alteration of load-bearing pillar columns"
    ],
    processSteps: [
      { title: "Measurement & 3D Visualization", desc: "Precise room scan and tailored design render." },
      { title: "Factory Fabrication", desc: "Precision CNC edge-banded modular components." },
      { title: "Clean On-Site Installation", desc: "Professional fitting with dust barriers in 48 hours." }
    ],
    faqs: [
      { q: "Is there any warranty on modular kitchen fittings?", a: "Yes, all our tandem drawers and soft-close hinges carry a 5-year manufacturer replacement warranty." }
    ]
  }
];

export const POPULAR_SERVICES: ServiceItem[] = [
  {
    id: "serv-1",
    name: "Master Power Jet AC Service (Split/Window)",
    category: "AC & Appliances",
    categorySlug: "ac-appliances",
    rating: 4.88,
    reviewsCount: 14200,
    bookingsCount: 38500,
    price: 499,
    originalPrice: 799,
    duration: "45–60 mins",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    badge: "2x Cooling Guaranteed",
    description: "Deep jet pump coil wash, filter clean, drain tray descaling & 10-point cooling check.",
    includes: ["High pressure water jet wash", "Anti-bacterial coil sanitization", "Gas pressure measurement", "30-day rework warranty"],
    excludes: ["Gas leak repair or charging (billed separately if low)"],
    isAvailable: true
  },
  {
    id: "serv-2",
    name: "Intense Bathroom Deep Cleaning & De-scaling",
    category: "Cleaning",
    categorySlug: "cleaning",
    rating: 4.92,
    reviewsCount: 21900,
    bookingsCount: 54000,
    price: 449,
    originalPrice: 699,
    duration: "60 mins",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    badge: "Zero Acid Safe",
    description: "Hard water stain removal from tiles & taps, WC scrub, exhaust clean and floor buffing.",
    includes: ["Hard water scale removal", "Mirror & glass shine", "Tile grout deep scrub", "Disinfection spray"],
    isAvailable: true
  },
  {
    id: "serv-3",
    name: "Complete Home Electrical Health & Wiring Audit",
    category: "Electrical",
    categorySlug: "electrical",
    rating: 4.85,
    reviewsCount: 8400,
    bookingsCount: 19800,
    price: 249,
    originalPrice: 399,
    duration: "30 mins",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
    badge: "Express 45-Min",
    description: "Earthing voltage check, load calculation, MCB inspection and loose socket remediation.",
    includes: ["Digital multimeter testing", "MCB safety verification", "Earthing fault diagnosis", "Detailed digital health card"],
    isAvailable: true
  },
  {
    id: "serv-4",
    name: "Herbal Gel Cockroach & Pest Shield (Kitchen + Home)",
    category: "Pest Control",
    categorySlug: "pest-control",
    rating: 4.89,
    reviewsCount: 11300,
    bookingsCount: 29000,
    price: 749,
    originalPrice: 1199,
    duration: "40 mins",
    image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=600&q=80",
    badge: "Child & Pet Safe",
    description: "100% odorless Bayer herbal gel spots in cabinet corners, drain trap treatment & spray barrier.",
    includes: ["No need to empty kitchen cabinets", "100% safe odorless herbal gel", "Drain pipe powder treatment", "90-day service warranty"],
    isAvailable: true
  },
  {
    id: "serv-5",
    name: "Hydra Glow Facial & Diamond Pedicure Combo",
    category: "Beauty & Grooming",
    categorySlug: "beauty-grooming",
    rating: 4.95,
    reviewsCount: 16800,
    bookingsCount: 42000,
    price: 899,
    originalPrice: 1499,
    duration: "75 mins",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
    badge: "100% Single-Use Kits",
    description: "Deep ultrasonic skin hydration, blackhead purge, relaxing rose petal foot soak & scrub.",
    includes: ["Monodose sealed product kits", "Ultra-hygienic disposable towels", "Aroma steam treatment", "Relaxing shoulder massage"],
    isAvailable: true
  },
  {
    id: "serv-6",
    name: "Tap Leakage, Spout & Flush Tank Overhaul",
    category: "Plumbing",
    categorySlug: "plumbing",
    rating: 4.86,
    reviewsCount: 9700,
    bookingsCount: 24500,
    price: 199,
    originalPrice: 349,
    duration: "30 mins",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
    badge: "Genuine Spares",
    description: "Instant drip diagnosis, washer/cartridge replacement and Teflon sealing with water pressure check.",
    includes: ["Ceramic cartridge inspection", "No extra visiting charges", "Clean post-work cleanup", "Standardized rate card"],
    isAvailable: true
  },
  {
    id: "serv-7",
    name: "Doorstep Eco Foam Car Wash + Interior Sanitization",
    category: "Car/Bike Care",
    categorySlug: "car-bike-care",
    rating: 4.87,
    reviewsCount: 6500,
    bookingsCount: 16200,
    price: 499,
    originalPrice: 799,
    duration: "50 mins",
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80",
    badge: "At Your Parking Slot",
    description: "High foaming snow wash, tyre dress glaze, high suction interior vacuum & AC vent disinfection.",
    includes: ["pH neutral foam wash", "All 4 mats power vacuumed", "Dashboard UV polish", "Windshield crystal coat"],
    isAvailable: true
  },
  {
    id: "serv-8",
    name: "Modular Bed & Wardrobe Precision Assembly",
    category: "Furniture Assembly",
    categorySlug: "furniture-assembly",
    rating: 4.91,
    reviewsCount: 4300,
    bookingsCount: 11000,
    price: 599,
    originalPrice: 999,
    duration: "90 mins",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    badge: "Laser Leveling",
    description: "Expert assembly for IKEA, Wakefit, Urban Ladder beds, hydraulic lifts and wardrobes.",
    includes: ["Laser level alignment", "Heavy duty anchors included", "Hydraulic gas lift testing", "Scratch-free floor mats used"],
    isAvailable: true
  },
  {
    id: "serv-9",
    name: "Full Home Deep Cleaning (Furnished 2/3 BHK)",
    category: "Cleaning",
    categorySlug: "cleaning",
    rating: 4.94,
    reviewsCount: 18400,
    bookingsCount: 46000,
    price: 1899,
    originalPrice: 2899,
    duration: "4–5 Hours",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    badge: "3-Person Crew",
    description: "Complete room scrubbing, kitchen grease removal, bathroom descaling, fan/balcony dusting.",
    includes: ["Floor single disc buffing", "Window track cleaning", "Kitchen exhaust scrub", "Antiviral mist spray"],
    isAvailable: true
  },
  {
    id: "serv-10",
    name: "Ceiling Fan Installation & Regulator Tuning",
    category: "Electrical",
    categorySlug: "electrical",
    rating: 4.88,
    reviewsCount: 7200,
    bookingsCount: 17400,
    price: 149,
    originalPrice: 249,
    duration: "25 mins",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
    badge: "Fast 30-Min",
    description: "Safe downrod mounting, blade pitch balancing, capacitor check, and step-less regulator wiring.",
    includes: ["Downrod locking pin check", "Capacitor speed audit", "No wobble guarantee"],
    isAvailable: true
  },
  {
    id: "serv-11",
    name: "Washing Machine Drum & Drainage Vibration Repair",
    category: "AC & Appliances",
    categorySlug: "ac-appliances",
    rating: 4.83,
    reviewsCount: 5100,
    bookingsCount: 12800,
    price: 349,
    originalPrice: 599,
    duration: "45 mins",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    badge: "All Brands (LG, Samsung, IFB)",
    description: "Front load/top load spin cycle noise diagnosis, shock absorber check, inlet filter descaling.",
    includes: ["Suspension spring test", "Motor carbon brush audit", "Drainage pump clearing"],
    isAvailable: true
  },
  {
    id: "serv-12",
    name: "Door Lock & Digital Deadbolt Installation",
    category: "Home Repairs",
    categorySlug: "home-repairs",
    rating: 4.93,
    reviewsCount: 3800,
    bookingsCount: 9400,
    price: 299,
    originalPrice: 499,
    duration: "40 mins",
    image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80",
    badge: "Security Plus",
    description: "Precision wood mortising, smart keypad lock fitting, striker plate alignment.",
    includes: ["Clean chisel carving", "5 duplicate key verification", "Fingerprint setup assist"],
    isAvailable: true
  }
];

export const TOP_PROFESSIONALS: ProProfile[] = [
  {
    id: "pro-1",
    name: "Rajesh Kumar",
    role: "Master Electrician & Smart Home Specialist",
    city: "Bengaluru",
    rating: 4.94,
    reviewsCount: 520,
    jobsCompleted: 1480,
    experienceYears: 9,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    verified: true,
    specialty: "High-voltage distribution boards & smart switches",
    quote: "Precision, safety protocols and leaving the premises spotless are my non-negotiables."
  },
  {
    id: "pro-2",
    name: "Sunita Sharma",
    role: "Senior Esthetician & Bridal Grooming Lead",
    city: "Mumbai",
    rating: 4.98,
    reviewsCount: 840,
    jobsCompleted: 2150,
    experienceYears: 11,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    verified: true,
    specialty: "Hydra facials & organic fruit peel therapies",
    quote: "Salon grade hygiene in the comfort of your home is what our clients love the most."
  },
  {
    id: "pro-3",
    name: "David Chen",
    role: "Senior Hydro-Engineer & Master Plumber",
    city: "Delhi NCR",
    rating: 4.91,
    reviewsCount: 460,
    jobsCompleted: 1290,
    experienceYears: 8,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    verified: true,
    specialty: "Concealed pipeline leaks & pressure boosters",
    quote: "Diagnosing the root cause without needlessly breaking tiles saves customers immense stress."
  },
  {
    id: "pro-4",
    name: "Farhan Siddiqui",
    role: "AC & Refrigeration Thermal Systems Lead",
    city: "Hyderabad",
    rating: 4.93,
    reviewsCount: 680,
    jobsCompleted: 1920,
    experienceYears: 10,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    verified: true,
    specialty: "Inverter AC PCB diagnosis & high-pressure jet wash",
    quote: "A clean coil restores up to 30% lost efficiency and drops your power bill noticeably."
  },
];

export const LIMITED_OFFERS = [
  {
    code: "COOPFIRST",
    title: "Flat ₹150 OFF",
    subtitle: "On your very first booking across any category",
    minBooking: "₹399",
    expiry: "Valid today",
    bgGradient: "from-indigo-600 via-indigo-700 to-indigo-900",
    badge: "Welcome Deal",
    tagColor: "bg-indigo-100 text-indigo-700"
  },
  {
    code: "COOLSUMMER",
    title: "20% Discount",
    subtitle: "Power Jet AC service & refrigerator maintenance",
    minBooking: "₹499",
    expiry: "3 days left",
    bgGradient: "from-amber-500 via-amber-600 to-amber-800",
    badge: "Seasonal Pack",
    tagColor: "bg-amber-100 text-amber-800"
  },
  {
    code: "DEEP250",
    title: "Flat ₹250 OFF",
    subtitle: "Full home deep cleaning & sofa shampooing combos",
    minBooking: "₹999",
    expiry: "Limited slots",
    bgGradient: "from-emerald-600 via-teal-700 to-emerald-900",
    badge: "Weekend Special",
    tagColor: "bg-emerald-100 text-emerald-800"
  }
];

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: "pkg-1",
    title: "Complete Move-In Sanitization & Safety Pack",
    tag: "Best Value for New Tenants",
    originalPrice: 3499,
    offerPrice: 2299,
    savings: 1200,
    duration: "3.5 Hours",
    rating: 4.93,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Full 2/3 BHK floor buffing & kitchen degreasing",
      "2 Bathrooms deep chemical descaling & disinfection",
      "Herbal gel cockroach & ant barrier throughout house",
      "Complimentary switchboard & wiring safety inspection"
    ]
  },
  {
    id: "pkg-2",
    title: "Summer AC Double Shield: 2x Jet Clean + Gas Health",
    tag: "Beat The Heat",
    originalPrice: 1799,
    offerPrice: 999,
    savings: 800,
    duration: "90 Mins",
    rating: 4.91,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "2 AC indoor & outdoor high-pressure foam jet wash",
      "Condenser coil anti-rust protective barrier coat",
      "Free refrigerant gas pressure check & drain flush",
      "30-day performance warranty with guaranteed cooling"
    ]
  },
  {
    id: "pkg-3",
    title: "Head-to-Toe Radiant Spa & Salon Bliss Pack",
    tag: "Most Loved by Women",
    originalPrice: 2499,
    offerPrice: 1499,
    savings: 1000,
    duration: "2 Hours",
    rating: 4.96,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Hydra Glow Skin brightening facial with ultrasonic tool",
      "Crystal rose pedicure & deluxe honey manicure",
      "Relaxing aromatherapy back & head stress relief massage",
      "100% sealed single-use kit & disposable hygiene gown"
    ]
  }
];

export const CUSTOMER_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Ananya Deshmukh",
    city: "Bengaluru",
    locality: "Indiranagar",
    service: "AC Jet Service & Filter Wash",
    categorySlug: "ac-appliances",
    rating: 5,
    date: "2 days ago",
    comment: "The jet clean was unbelievable. The amount of dust that came out of the blower wheel was shocking. Cooling improved within 10 minutes of turning it on. Rajesh was extremely polite and cleaned up the floor after finishing!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    verified: true,
    beforeAfterImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "rev-2",
    name: "Rohan Varma",
    city: "Mumbai",
    locality: "Bandra West",
    service: "Bathroom Deep Cleaning",
    categorySlug: "cleaning",
    rating: 5,
    date: "4 days ago",
    comment: "I had tough hard-water stains on the glass shower partition for over 2 years. Urban Company couldn't get it fully off last year, but CoopServe's specialist made it crystal transparent again. Genuinely impressed!",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    verified: true
  },
  {
    id: "rev-3",
    name: "Pooja Hegde",
    city: "Hyderabad",
    locality: "Gachibowli",
    service: "Salon at Home Hydra Facial",
    categorySlug: "beauty-grooming",
    rating: 5,
    date: "1 week ago",
    comment: "The beautician arrived in full uniform with single-use sealed kits. Felt 10x more hygienic than local parlours. My skin has an unreal natural glow for my sister's engagement.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    verified: true
  },
  {
    id: "rev-4",
    name: "Vikram Sengupta",
    city: "Delhi NCR",
    locality: "Gurugram Phase 5",
    service: "Emergency Circuit Breaker Repair",
    categorySlug: "electrical",
    rating: 5,
    date: "1 week ago",
    comment: "Our entire kitchen power tripped at 9:30 PM. Booked under urgent service and the electrician arrived in 28 minutes flat with proper testing tools. Saved our refrigerator groceries from spoiling.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    verified: true
  }
];

export const FAQS = [
  {
    category: "Booking & Availability",
    question: "How quickly can a professional arrive at my home?",
    answer: "We offer both instant 45–60 minute emergency dispatch for urgent electrical, plumbing and lock repairs, as well as scheduled 2-hour slots for planned deep cleaning, salon services, and appliance maintenance."
  },
  {
    category: "Pricing & Payments",
    question: "Are there any hidden doorstep charges or inspection fees?",
    answer: "Never. Every service on CoopServe features transparent fixed upfront pricing. Standard inspection and consultation rates are clearly shown before booking. If replacement parts are needed, technicians present authentic MRP bills."
  },
  {
    category: "Safety & Quality",
    question: "How are CoopServe service professionals verified?",
    answer: "Every professional undergoes a 3-step verification process: Government ID & police background verification, hands-on trade skill assessment at our local training centers, and mandatory safety & protocol onboarding."
  },
  {
    category: "Warranty & Guarantee",
    question: "What happens if I am not satisfied or the issue reoccurs?",
    answer: "All services come with a complimentary 30-Day CoopServe Rework Warranty and ₹10,000 Damage Protection Cover. If a problem persists within 30 days, we dispatch a senior specialist to fix it at zero extra charge."
  },
  {
    category: "Cancellation & Rescheduling",
    question: "Can I reschedule or cancel my booking without penalty?",
    answer: "Yes! You can reschedule or cancel your appointment free of charge up to 2 hours before the scheduled time directly from your bookings dashboard or via mobile WhatsApp alerts."
  }
];

// Natural language intent mapping rules
export const NATURAL_LANGUAGE_INTENTS = [
  {
    patterns: ["ac", "air conditioner", "cooling", "not cooling", "ac noise", "water leaking ac", "gas leak ac", "ac making weird noises", "cool", "jet wash"],
    suggestions: [
      { name: "Master Power Jet AC Service", reason: "Deep cleaning restored cooling & stops odd smells", serviceId: "serv-1" },
      { name: "AC Gas Leak Diagnosis & Refill", reason: "For poor cooling & compressor hissing sounds", serviceId: "serv-1" },
      { name: "Complete AC Health Check & Inspection", reason: "Diagnose unusual rattle or fan vibration", serviceId: "serv-1" },
    ]
  },
  {
    patterns: ["leak", "tap", "pipe", "drain", "water", "plumber", "flush", "sink", "geyser", "dripping", "bathroom tap"],
    suggestions: [
      { name: "Tap Leakage, Spout & Flush Tank Overhaul", reason: "Instant fix for continuous drip or low water flow", serviceId: "serv-6" },
      { name: "Drain Blockage & Trap Clearance", reason: "Motorized snaking for clogged shower and kitchen pipes", serviceId: "serv-6" },
      { name: "Concealed Wall Pipeline Leak Audit", reason: "Non-destructive acoustic leak detection", serviceId: "serv-6" },
    ]
  },
  {
    patterns: ["spark", "power", "switch", "fan", "mcb", "trip", "tripping", "shock", "wiring", "light", "fuse", "blackout", "electrician"],
    suggestions: [
      { name: "Complete Home Electrical Health & Wiring Audit", reason: "Detect dangerous shorts & earth faults", serviceId: "serv-3" },
      { name: "Ceiling Fan Installation & Regulator Tuning", reason: "Fix fan speed wobble or motor humming", serviceId: "serv-10" },
      { name: "Emergency MCB & Sparking Switchboard Fix", reason: "Rapid 30-min hazard remediation", serviceId: "serv-3" },
    ]
  },
  {
    patterns: ["clean", "bathroom", "kitchen", "dust", "deep cleaning", "sofa", "carpet", "stain", "dirty", "house cleaning"],
    suggestions: [
      { name: "Intense Bathroom Deep Cleaning & De-scaling", reason: "Eradicate stubborn hard water lime stains", serviceId: "serv-2" },
      { name: "Full Home Deep Cleaning (Furnished 2/3 BHK)", reason: "Complete top-to-bottom single disc scrubbing", serviceId: "serv-9" },
      { name: "Sofa Shampooing & Fabric Extraction", reason: "Removes deep dust mites and beverage stains", serviceId: "serv-9" },
    ]
  },
  {
    patterns: ["cockroach", "bugs", "pest", "termite", "ants", "mosquito", "rodent", "insects"],
    suggestions: [
      { name: "Herbal Gel Cockroach & Pest Shield", reason: "100% odorless Bayer gel with 90-day warranty", serviceId: "serv-4" },
      { name: "Comprehensive Termite Protection Barrier", reason: "Drill & fill chemical perimeter defense", serviceId: "serv-4" },
    ]
  },
  {
    patterns: ["haircut", "facial", "pedicure", "manicure", "salon", "grooming", "waxing", "massage", "spa", "beauty"],
    suggestions: [
      { name: "Hydra Glow Facial & Diamond Pedicure Combo", reason: "Single-use sealed salon kits at home", serviceId: "serv-5" },
      { name: "At-Home Men's Beard Styling & Haircut", reason: "Sanitized clipper tools & scalp massage", serviceId: "serv-5" },
    ]
  }
];

export function findCategoryBySlug(slug: string): CategoryDetail | undefined {
  const normalized = slug.toLowerCase().trim();
  return CATEGORIES.find(c => c.slug === normalized || c.aliases.includes(normalized));
}
