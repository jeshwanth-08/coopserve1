import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning previous database records...");
  await prisma.notification.deleteMany();
  await prisma.requestComment.deleteMany();
  await prisma.communitySupport.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.statusHistory.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding admin account...");
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const commonPasswordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Eleanor Vance (Coop Coordinator)",
      email: "admin@coop.org",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      phone: "+1 555-0100",
      address: "Suite 400, Central Cooperative HQ",
      locality: "Greenwood Heights",
    },
  });

  console.log("Seeding 10 service providers...");
  const providerData = [
    {
      name: "Marcus Thorne",
      email: "provider1@coop.org",
      phone: "+1 555-0201",
      locality: "Greenwood Heights",
      skills: ["Master Electrician", "Rewiring", "Circuit Breakers", "Solar Panel Hookups"],
      categories: ["Electrician", "Appliance Repair"],
      certifications: ["State Master Electrician License #EL-4910", "OSHA 30 Safety Certified"],
      serviceArea: "Greenwood Heights & Riverside",
      isVerified: true,
      isActive: true,
      avgRating: 4.9,
      totalReviews: 18,
    },
    {
      name: "David Chen",
      email: "provider2@coop.org",
      phone: "+1 555-0202",
      locality: "Riverside Society",
      skills: ["Master Plumbing", "Drain Snaking", "Water Heaters", "Pipe Leak Detection"],
      categories: ["Plumber"],
      certifications: ["Licensed Journeyman Plumber #PL-8832"],
      serviceArea: "Riverside Society",
      isVerified: true,
      isActive: true,
      avgRating: 4.8,
      totalReviews: 14,
    },
    {
      name: "Sonia Patel",
      email: "provider3@coop.org",
      phone: "+1 555-0203",
      locality: "Oakwood Valley",
      skills: ["HVAC Installation", "AC Repair", "Ductwork", "Heat Pumps"],
      categories: ["HVAC & AC Technician", "Appliance Repair"],
      certifications: ["EPA Universal 608 Certification", "NATE Core & AC Specialist"],
      serviceArea: "Oakwood Valley & Sunrise Enclave",
      isVerified: true,
      isActive: true,
      avgRating: 4.7,
      totalReviews: 11,
    },
    {
      name: "Roberto Gomez",
      email: "provider4@coop.org",
      phone: "+1 555-0204",
      locality: "Greenwood Heights",
      skills: ["Custom Cabinetry", "Door Hinges & Framing", "Furniture Assembly", "Drywall"],
      categories: ["Carpenter", "Locksmith"],
      certifications: ["Guild of Master Craftsmen Cert #CR-1204"],
      serviceArea: "Greenwood Heights",
      isVerified: true,
      isActive: true,
      avgRating: 4.9,
      totalReviews: 15,
    },
    {
      name: "Amina Al-Mansoor",
      email: "provider5@coop.org",
      phone: "+1 555-0205",
      locality: "Riverside Society",
      skills: ["Interior/Exterior Painting", "Waterproofing", "Plaster Finishing", "Color Matching"],
      categories: ["Painter"],
      certifications: ["PCA Professional Painting Contractor Cert"],
      serviceArea: "Riverside Society & Oakwood Valley",
      isVerified: true,
      isActive: true,
      avgRating: 4.6,
      totalReviews: 9,
    },
    {
      name: "Liam O'Connor",
      email: "provider6@coop.org",
      phone: "+1 555-0206",
      locality: "Sunrise Enclave",
      skills: ["Deep Cleaning", "Sanitization", "Post-Construction Clean", "Eco-friendly Clean"],
      categories: ["Cleaner"],
      certifications: ["IICRC House Cleaning Technician Cert"],
      serviceArea: "Sunrise Enclave & Palm Grove",
      isVerified: true,
      isActive: true,
      avgRating: 4.85,
      totalReviews: 22,
    },
    {
      name: "Hannah Kim",
      email: "provider7@coop.org",
      phone: "+1 555-0207",
      locality: "Palm Grove Colony",
      skills: ["Landscape Architecture", "Tree Trimming", "Irrigation Systems", "Soil Conditioning"],
      categories: ["Gardener"],
      certifications: ["Certified Professional Horticulturist (CPH)"],
      serviceArea: "Palm Grove Colony & Greenwood",
      isVerified: true,
      isActive: true,
      avgRating: 4.75,
      totalReviews: 12,
    },
    {
      name: "Jamal Washington",
      email: "provider8@coop.org",
      phone: "+1 555-0208",
      locality: "Greenwood Heights",
      skills: ["Lock Rekeying", "Deadbolt Installation", "Emergency Lockout", "Smart Locks"],
      categories: ["Locksmith"],
      certifications: ["ALOA Certified Master Locksmith (CML)"],
      serviceArea: "All Cooperative Localities",
      isVerified: true,
      isActive: true,
      avgRating: 4.95,
      totalReviews: 27,
    },
    {
      name: "Victor Morozov",
      email: "provider9@coop.org",
      phone: "+1 555-0209",
      locality: "Oakwood Valley",
      skills: ["Bricklaying", "Foundation Repair", "Retaining Walls", "Chimney Repair"],
      categories: ["Masonry & Concrete"],
      certifications: ["Application Submitted - Pending Verification"],
      serviceArea: "Oakwood Valley",
      isVerified: false, // Unverified demo provider
      isActive: true,
      avgRating: 0.0,
      totalReviews: 0,
    },
    {
      name: "Maya Lin",
      email: "provider10@coop.org",
      phone: "+1 555-0210",
      locality: "Sunrise Enclave",
      skills: ["Washing Machines", "Refrigeration", "Microwaves", "Induction Hobs"],
      categories: ["Appliance Repair", "Electrician"],
      certifications: ["Awaiting Background Check Documentation"],
      serviceArea: "Sunrise Enclave",
      isVerified: false, // Unverified demo provider
      isActive: false,   // Inactive demo provider
      avgRating: 0.0,
      totalReviews: 0,
    },
  ];

  const createdProviders = [];
  for (const p of providerData) {
    const user = await prisma.user.create({
      data: {
        name: p.name,
        email: p.email,
        passwordHash: commonPasswordHash,
        role: "PROVIDER",
        phone: p.phone,
        locality: p.locality,
        address: `Shop ${Math.floor(Math.random() * 80) + 1}, Artisan Arcade`,
      },
    });

    const profile = await prisma.providerProfile.create({
      data: {
        userId: user.id,
        skills: JSON.stringify(p.skills),
        serviceCategories: JSON.stringify(p.categories),
        certifications: JSON.stringify(p.certifications),
        serviceArea: p.serviceArea,
        isVerified: p.isVerified,
        isActive: p.isActive,
        avgRating: p.avgRating,
        totalReviews: p.totalReviews,
      },
    });

    createdProviders.push({ ...user, profile });
  }

  console.log("Seeding 15 members...");
  const memberNames = [
    { name: "Alice Henderson", locality: "Greenwood Heights", address: "Apt 4B, Pinecrest Towers" },
    { name: "Benjamin Brooks", locality: "Greenwood Heights", address: "Unit 12, Maple Crest Villas" },
    { name: "Clara Oswald", locality: "Greenwood Heights", address: "78 Willow Way" },
    { name: "Daniel Craig", locality: "Greenwood Heights", address: "Townhouse 3, Cedar Lane" },
    { name: "Elena Rostova", locality: "Riverside Society", address: "Block C-201, Riverbend Condos" },
    { name: "Farhan Siddiqui", locality: "Riverside Society", address: "Villa 15, Promenade Boulevard" },
    { name: "Grace Hopper", locality: "Riverside Society", address: "54 Riverside Drive" },
    { name: "Henry Cavill", locality: "Riverside Society", address: "Penthouse 8, Waterside Haven" },
    { name: "Iris Murdoch", locality: "Oakwood Valley", address: "Bungalow 9, Oakwood Heights" },
    { name: "Jack Dawson", locality: "Oakwood Valley", address: "14 Forest Glade Avenue" },
    { name: "Kavita Nair", locality: "Oakwood Valley", address: "Flat 302, Green Meadows" },
    { name: "Leo Tolstoy", locality: "Sunrise Enclave", address: "House 22, Sunrise View" },
    { name: "Mei Ling", locality: "Sunrise Enclave", address: "Building 4, Golden Rays Society" },
    { name: "Noah Campbell", locality: "Palm Grove Colony", address: "Villa 7, Palm Frond Lane" },
    { name: "Olivia Wilde", locality: "Palm Grove Colony", address: "Apt 101, Oasis Court" },
  ];

  const createdMembers = [];
  for (let i = 0; i < memberNames.length; i++) {
    const m = memberNames[i];
    const user = await prisma.user.create({
      data: {
        name: m.name,
        email: `member${i + 1}@coop.org`,
        passwordHash: commonPasswordHash,
        role: "MEMBER",
        phone: `+1 555-03${(i + 10).toString()}`,
        address: m.address,
        locality: m.locality,
      },
    });
    createdMembers.push(user);
  }

  console.log("Seeding 32 service requests across statuses, including 6 emergency and 10 community requests...");

  const requestsData = [
    // 1. Emergency Pending (Personal)
    {
      memberIdx: 0,
      category: "Electrician",
      description: "Main circuit breaker constantly sparking and emitting a burning plastic smell. Power cut in half of the apartment.",
      visibility: "PERSONAL",
      locality: "Greenwood Heights",
      address: "Apt 4B, Pinecrest Towers",
      isEmergency: true,
      status: "PENDING",
      assignedProviderIdx: null,
      notes: "Member reported sparks behind distribution board.",
    },
    // 2. Emergency Pending (Community)
    {
      memberIdx: 4,
      category: "Plumber",
      description: "Main underground water pipe burst near Block C entrance. Clean water is flooding the basement parking ramp rapidly!",
      visibility: "COMMUNITY",
      locality: "Riverside Society",
      address: "Block C Underground Parking Ramp",
      isEmergency: true,
      status: "PENDING",
      assignedProviderIdx: null,
      notes: "Society security isolated the primary valve partially.",
    },
    // 3. Emergency Assigned (Personal)
    {
      memberIdx: 1,
      category: "Plumber",
      description: "Sewage backflow in ground floor master bathroom. Water level rising fast.",
      visibility: "PERSONAL",
      locality: "Greenwood Heights",
      address: "Unit 12, Maple Crest Villas",
      isEmergency: true,
      status: "ASSIGNED",
      assignedProviderIdx: 1, // David Chen
      notes: "Dispatched David Chen on high priority.",
    },
    // 4. Emergency Accepted (Personal)
    {
      memberIdx: 8,
      category: "HVAC & AC Technician",
      description: "Heating furnace broke down during sudden freeze warning. Elderly resident in home.",
      visibility: "PERSONAL",
      locality: "Oakwood Valley",
      address: "Bungalow 9, Oakwood Heights",
      isEmergency: true,
      status: "ACCEPTED",
      assignedProviderIdx: 2, // Sonia Patel
      notes: "Provider accepted immediately, preparing emergency thermal parts.",
    },
    // 5. Emergency On The Way (Personal)
    {
      memberIdx: 7,
      category: "Locksmith",
      description: "Toddler accidentally locked inside front bedroom with spring latch jammed. Needs immediate entry.",
      visibility: "PERSONAL",
      locality: "Riverside Society",
      address: "Penthouse 8, Waterside Haven",
      isEmergency: true,
      status: "ON_THE_WAY",
      assignedProviderIdx: 7, // Jamal Washington
      notes: "Locksmith en route with priority bypass kit.",
    },
    // 6. Emergency In Progress (Community)
    {
      memberIdx: 2,
      category: "Electrician",
      description: "Society elevator power transformer tripped with loud bang, elevator stuck between floors 2 and 3.",
      visibility: "COMMUNITY",
      locality: "Greenwood Heights",
      address: "Central Lift Shaft, Tower 1",
      isEmergency: true,
      status: "IN_PROGRESS",
      assignedProviderIdx: 0, // Marcus Thorne
      notes: "Fire dept freed passengers; Marcus is inspecting transformer coils.",
    },
    // 7. Community Pending
    {
      memberIdx: 3,
      category: "Gardener",
      description: "Overgrown tree branches near society entrance are brushing against low-hanging telecom cables and blocking street lamps.",
      visibility: "COMMUNITY",
      locality: "Greenwood Heights",
      address: "Greenwood Heights Main Gate",
      isEmergency: false,
      status: "PENDING",
      assignedProviderIdx: null,
      notes: "Co-signers requested cooperative landscaping crew.",
    },
    // 8. Community Pending
    {
      memberIdx: 5,
      category: "Cleaner",
      description: "Post-monsoon algae buildup and slippery moss along the riverfront jogging track and children's play area.",
      visibility: "COMMUNITY",
      locality: "Riverside Society",
      address: "Riverfront Jogging Track North Sector",
      isEmergency: false,
      status: "PENDING",
      assignedProviderIdx: null,
      notes: "Multiple morning walkers reported slips.",
    },
    // 9. Community Assigned
    {
      memberIdx: 9,
      category: "Masonry & Concrete",
      description: "Cracked pavement and broken concrete curb stones outside community center creating a tripping hazard.",
      visibility: "COMMUNITY",
      locality: "Oakwood Valley",
      address: "Community Clubhouse Plaza",
      isEmergency: false,
      status: "ASSIGNED",
      assignedProviderIdx: 3, // Roberto Gomez (carpenter/handyman)
      notes: "Assigned for initial inspection.",
    },
    // 10. Community Accepted
    {
      memberIdx: 11,
      category: "Painter",
      description: "Society perimeter wall vandalized with spray graffiti. Requesting pressure wash and neutral repaint.",
      visibility: "COMMUNITY",
      locality: "Sunrise Enclave",
      address: "Outer Perimeter Wall, East Wing",
      isEmergency: false,
      status: "ACCEPTED",
      assignedProviderIdx: 4, // Amina Al-Mansoor
      notes: "Accepted; color swatch submitted to society committee.",
    },
    // 11. Community In Progress
    {
      memberIdx: 13,
      category: "Gardener",
      description: "Society central lawn aerating, lawn mowing, and new flowering shrub plantation before annual cooperative meet.",
      visibility: "COMMUNITY",
      locality: "Palm Grove Colony",
      address: "Central Community Park",
      isEmergency: false,
      status: "IN_PROGRESS",
      assignedProviderIdx: 6, // Hannah Kim
      notes: "Hannah Kim and two assistants are working on bed prep.",
    },
    // 12. Community Resolved
    {
      memberIdx: 6,
      category: "Plumber",
      description: "Common rooftop water tank float valve replaced to prevent overflow into storm drains.",
      visibility: "COMMUNITY",
      locality: "Riverside Society",
      address: "Terrace Water Storage Deck",
      isEmergency: false,
      status: "RESOLVED",
      assignedProviderIdx: 1, // David Chen
      notes: "Replaced heavy-duty brass float valve and tested shutoff pressure.",
    },
    // 13. Community Resolved
    {
      memberIdx: 10,
      category: "Electrician",
      description: "Solar street lights along Oakwood promenade repaired and lithium batteries replaced.",
      visibility: "COMMUNITY",
      locality: "Oakwood Valley",
      address: "Promenade Path Poles 1-8",
      isEmergency: false,
      status: "RESOLVED",
      assignedProviderIdx: 0, // Marcus Thorne
      notes: "Replaced faulty BMS modules on 4 poles.",
    },
    // 14. Community Cancelled
    {
      memberIdx: 12,
      category: "Cleaner",
      description: "Deep clean requested for clubhouse terrace party area.",
      visibility: "COMMUNITY",
      locality: "Sunrise Enclave",
      address: "Clubhouse Rooftop Terrace",
      isEmergency: false,
      status: "CANCELLED",
      assignedProviderIdx: null,
      notes: "Member cancelled: Society committee hired dedicated party caterers who included cleanup.",
    },
    // 15. Personal Pending
    {
      memberIdx: 0,
      category: "Carpenter",
      description: "Need custom floating bookshelf installed in study room and reinforcement for dining room credenza.",
      visibility: "PERSONAL",
      locality: "Greenwood Heights",
      address: "Apt 4B, Pinecrest Towers",
      isEmergency: false,
      status: "PENDING",
      assignedProviderIdx: null,
      notes: "Awaiting coordinator assignment.",
    },
    // 16. Personal Pending
    {
      memberIdx: 14,
      category: "Appliance Repair",
      description: "Front load washing machine making severe banging sound during high spin cycle. Suspected drum bearing wear.",
      visibility: "PERSONAL",
      locality: "Palm Grove Colony",
      address: "Apt 101, Oasis Court",
      isEmergency: false,
      status: "PENDING",
      assignedProviderIdx: null,
      notes: "Requested weekend morning slot.",
    },
    // 17. Personal Assigned
    {
      memberIdx: 3,
      category: "Painter",
      description: "Accent wall in living room needs textured royal blue finish and ceiling touch up.",
      visibility: "PERSONAL",
      locality: "Greenwood Heights",
      address: "Townhouse 3, Cedar Lane",
      isEmergency: false,
      status: "ASSIGNED",
      assignedProviderIdx: 4, // Amina
      notes: "Assigned by Eleanor Vance.",
    },
    // 18. Personal Accepted
    {
      memberIdx: 4,
      category: "Cleaner",
      description: "Full apartment move-in deep cleaning including kitchen chimneys and window tracks.",
      visibility: "PERSONAL",
      locality: "Riverside Society",
      address: "Block C-201, Riverbend Condos",
      isEmergency: false,
      status: "ACCEPTED",
      assignedProviderIdx: 5, // Liam O'Connor
      notes: "Provider confirmed scheduled arrival for Thursday 9 AM.",
    },
    // 19. Personal On The Way
    {
      memberIdx: 1,
      category: "Locksmith",
      description: "Install digital keypad smart lock on front entry door.",
      visibility: "PERSONAL",
      locality: "Greenwood Heights",
      address: "Unit 12, Maple Crest Villas",
      isEmergency: false,
      status: "ON_THE_WAY",
      assignedProviderIdx: 7, // Jamal Washington
      notes: "Provider en route with drill template and mortise set.",
    },
    // 20. Personal In Progress
    {
      memberIdx: 8,
      category: "Electrician",
      description: "Install 3 ceiling fans with remote modules and replace 8 recessed halogen bulbs with warm LEDs.",
      visibility: "PERSONAL",
      locality: "Oakwood Valley",
      address: "Bungalow 9, Oakwood Heights",
      isEmergency: false,
      status: "IN_PROGRESS",
      assignedProviderIdx: 0, // Marcus Thorne
      notes: "Marcus is mounting downrods and wiring remotes.",
    },
    // 21. Personal In Progress
    {
      memberIdx: 5,
      category: "Plumber",
      description: "Kitchen sink double drain pipe replacement and install undersink RO filtration unit.",
      visibility: "PERSONAL",
      locality: "Riverside Society",
      address: "Villa 15, Promenade Boulevard",
      isEmergency: false,
      status: "IN_PROGRESS",
      assignedProviderIdx: 1, // David Chen
      notes: "David Chen is assembling P-trap and testing RO tap.",
    },
    // 22. Personal Resolved (With Rating)
    {
      memberIdx: 2,
      category: "Electrician",
      description: "Kitchen induction cooker tripped MCB immediately when turned on. Replace wiring and 25A breaker.",
      visibility: "PERSONAL",
      locality: "Greenwood Heights",
      address: "78 Willow Way",
      isEmergency: false,
      status: "RESOLVED",
      assignedProviderIdx: 0, // Marcus
      notes: "Diagnosed shorted wire in conduit, pulled fresh 4mm heat-resistant cable and tested under full load.",
      rating: { stars: 5, comment: "Marcus was punctual, exceptionally neat, and solved the electrical trip safely. Highly recommended!" },
    },
    // 23. Personal Resolved (With Rating)
    {
      memberIdx: 6,
      category: "Plumber",
      description: "Bathroom shower mixer valve was leaking behind tiles into adjoining wall.",
      visibility: "PERSONAL",
      locality: "Riverside Society",
      address: "54 Riverside Drive",
      isEmergency: false,
      status: "RESOLVED",
      assignedProviderIdx: 1, // David Chen
      notes: "Replaced cartridge and Teflon seal without breaking external tile work.",
      rating: { stars: 5, comment: "Saved us hundreds by fixing the valve cartridge without tearing up tiles. Brilliant plumber!" },
    },
    // 24. Personal Resolved (With Rating)
    {
      memberIdx: 7,
      category: "HVAC & AC Technician",
      description: "Split AC not cooling adequately during summer humidity. Filter cleaning and gas top-up.",
      visibility: "PERSONAL",
      locality: "Riverside Society",
      address: "Penthouse 8, Waterside Haven",
      isEmergency: false,
      status: "RESOLVED",
      assignedProviderIdx: 2, // Sonia Patel
      notes: "Cleaned condenser fins, flushed drain line, and adjusted refrigerant pressure.",
      rating: { stars: 4, comment: "AC is cooling great again. Slightly delayed by 15 mins due to traffic but communicated ahead." },
    },
    // 25. Personal Resolved (With Rating)
    {
      memberIdx: 9,
      category: "Carpenter",
      description: "Teakwood dining table leg wobbly and 4 chairs need joint re-gluing and doweling.",
      visibility: "PERSONAL",
      locality: "Oakwood Valley",
      address: "14 Forest Glade Avenue",
      isEmergency: false,
      status: "RESOLVED",
      assignedProviderIdx: 3, // Roberto Gomez
      notes: "Reinforced corners with hardwood blocks and polyurethane glue.",
      rating: { stars: 5, comment: "Roberto is a true craftsman. Our vintage dining set feels brand new and rock solid." },
    },
    // 26. Personal Resolved (With Rating)
    {
      memberIdx: 11,
      category: "Cleaner",
      description: "Post-renovation dust cleaning for 3 BHK flat.",
      visibility: "PERSONAL",
      locality: "Sunrise Enclave",
      address: "House 22, Sunrise View",
      isEmergency: false,
      status: "RESOLVED",
      assignedProviderIdx: 5, // Liam O'Connor
      notes: "HEPA vacuumed walls, polished floor tiles, cleaned glass panels.",
      rating: { stars: 5, comment: "Spotless work! Left no residue on baseboards or window tracks. Friendly team." },
    },
    // 27. Personal Resolved (With Rating)
    {
      memberIdx: 13,
      category: "Gardener",
      description: "Drip irrigation pipe replacement and winter vegetable bed planting.",
      visibility: "PERSONAL",
      locality: "Palm Grove Colony",
      address: "Villa 7, Palm Frond Lane",
      isEmergency: false,
      status: "RESOLVED",
      assignedProviderIdx: 6, // Hannah Kim
      notes: "Installed timer valve and drip emitters for 12 raised beds.",
      rating: { stars: 5, comment: "Hannah gave wonderful planting advice and the automated drip system works like a charm." },
    },
    // 28. Personal Resolved (With Rating)
    {
      memberIdx: 0,
      category: "Locksmith",
      description: "Security upgrade: Re-key all exterior deadbolts after moving into new home.",
      visibility: "PERSONAL",
      locality: "Greenwood Heights",
      address: "Apt 4B, Pinecrest Towers",
      isEmergency: false,
      status: "RESOLVED",
      assignedProviderIdx: 7, // Jamal Washington
      notes: "Rekeyed 4 cylinders to master keyway and provided 5 duplicate keys.",
      rating: { stars: 5, comment: "Fast, discrete, and professional service. Very polite." },
    },
    // 29. Personal Cancelled
    {
      memberIdx: 10,
      category: "Painter",
      description: "Balcony metal railing touch-up and anti-rust primer.",
      visibility: "PERSONAL",
      locality: "Oakwood Valley",
      address: "Flat 302, Green Meadows",
      isEmergency: false,
      status: "CANCELLED",
      assignedProviderIdx: null,
      notes: "Member decided to do it themselves over the weekend.",
    },
    // 30. Declined Demo (Assigned then declined -> back to PENDING)
    {
      memberIdx: 12,
      category: "Plumber",
      description: "Under-sink RO waste line connection and faucet aerator descaling.",
      visibility: "PERSONAL",
      locality: "Sunrise Enclave",
      address: "Building 4, Golden Rays Society",
      isEmergency: false,
      status: "DECLINED",
      assignedProviderIdx: null,
      notes: "Provider declined due to out-of-area conflict. Status reset to PENDING for reassignment.",
    },
    // 31. Community Pending (Emergency)
    {
      memberIdx: 14,
      category: "Electrician",
      description: "Perimeter electric fence security controller alarm triggering continuously due to heavy wind storm damage.",
      visibility: "COMMUNITY",
      locality: "Palm Grove Colony",
      address: "Outer Security Gate 2",
      isEmergency: true,
      status: "PENDING",
      assignedProviderIdx: null,
      notes: "Gate guard alerted cooperative desk.",
    },
    // 32. Community In Progress
    {
      memberIdx: 1,
      category: "Painter",
      description: "Community library interior walls repaint and moisture sealant application.",
      visibility: "COMMUNITY",
      locality: "Greenwood Heights",
      address: "Community Library, Block A Basement",
      isEmergency: false,
      status: "IN_PROGRESS",
      assignedProviderIdx: 4, // Amina
      notes: "Amina has completed priming and 1st coat.",
    },
  ];

  for (const req of requestsData) {
    const member = createdMembers[req.memberIdx];
    const assignedProvider =
      req.assignedProviderIdx !== null ? createdProviders[req.assignedProviderIdx] : null;

    const createdReq = await prisma.serviceRequest.create({
      data: {
        memberId: member.id,
        category: req.category,
        description: req.description,
        visibility: req.visibility,
        locality: req.locality,
        address: req.address,
        isEmergency: req.isEmergency,
        status: req.status,
        assignedProviderId: assignedProvider ? assignedProvider.id : null,
        completionNotes: req.status === "RESOLVED" ? req.notes : null,
        resolvedAt: req.status === "RESOLVED" ? new Date(Date.now() - 1000 * 60 * 60 * 24) : null,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * (Math.floor(Math.random() * 72) + 6)),
      },
    });

    // Create Initial Status History
    await prisma.statusHistory.create({
      data: {
        requestId: createdReq.id,
        status: "PENDING",
        changedById: member.id,
        note: "Request logged by member",
        changedAt: new Date(createdReq.createdAt.getTime() + 1000 * 60),
      },
    });

    // Add intermediate history steps
    if (assignedProvider && ["ASSIGNED", "ACCEPTED", "ON_THE_WAY", "IN_PROGRESS", "RESOLVED"].includes(req.status)) {
      await prisma.statusHistory.create({
        data: {
          requestId: createdReq.id,
          status: "ASSIGNED",
          changedById: admin.id,
          note: `Assigned to ${assignedProvider.name}`,
          changedAt: new Date(createdReq.createdAt.getTime() + 1000 * 60 * 15),
        },
      });
    }

    if (assignedProvider && ["ACCEPTED", "ON_THE_WAY", "IN_PROGRESS", "RESOLVED"].includes(req.status)) {
      await prisma.statusHistory.create({
        data: {
          requestId: createdReq.id,
          status: "ACCEPTED",
          changedById: assignedProvider.id,
          note: "Provider accepted the assignment",
          changedAt: new Date(createdReq.createdAt.getTime() + 1000 * 60 * 30),
        },
      });
    }

    if (assignedProvider && ["ON_THE_WAY", "IN_PROGRESS", "RESOLVED"].includes(req.status)) {
      await prisma.statusHistory.create({
        data: {
          requestId: createdReq.id,
          status: "ON_THE_WAY",
          changedById: assignedProvider.id,
          note: "En route to service location",
          changedAt: new Date(createdReq.createdAt.getTime() + 1000 * 60 * 45),
        },
      });
    }

    if (assignedProvider && ["IN_PROGRESS", "RESOLVED"].includes(req.status)) {
      await prisma.statusHistory.create({
        data: {
          requestId: createdReq.id,
          status: "IN_PROGRESS",
          changedById: assignedProvider.id,
          note: "Work started on site",
          changedAt: new Date(createdReq.createdAt.getTime() + 1000 * 60 * 60),
        },
      });
    }

    if (assignedProvider && req.status === "RESOLVED") {
      await prisma.statusHistory.create({
        data: {
          requestId: createdReq.id,
          status: "RESOLVED",
          changedById: assignedProvider.id,
          note: req.notes,
          changedAt: new Date(createdReq.createdAt.getTime() + 1000 * 60 * 120),
        },
      });

      if (req.rating) {
        await prisma.rating.create({
          data: {
            requestId: createdReq.id,
            memberId: member.id,
            providerId: assignedProvider.id,
            stars: req.rating.stars,
            comment: req.rating.comment,
          },
        });
      }
    }

    // Co-signs and comments for community requests
    if (req.visibility === "COMMUNITY") {
      // Add 2-4 co-signs from neighbors in the same or nearby locality
      const eligibleSupporters = createdMembers.filter((m) => m.id !== member.id && m.locality === req.locality);
      const supportersToTake = eligibleSupporters.slice(0, 3);
      for (const sup of supportersToTake) {
        await prisma.communitySupport.create({
          data: {
            requestId: createdReq.id,
            userId: sup.id,
          },
        });
      }

      // Add a helpful community comment
      if (supportersToTake.length > 0) {
        await prisma.requestComment.create({
          data: {
            requestId: createdReq.id,
            userId: supportersToTake[0].id,
            comment: "I noticed this as well on my way in this morning. Glad it was logged with the coop!",
          },
        });
      }
    }
  }

  // Seed sample notifications for admin and providers
  await prisma.notification.create({
    data: {
      userId: admin.id,
      type: "COMMUNITY_ALERT",
      message: "New emergency request logged: Main underground water pipe burst at Riverside Society!",
      link: "/admin/requests",
    },
  });

  await prisma.notification.create({
    data: {
      userId: createdProviders[0].id,
      type: "ASSIGNED",
      message: "You have been assigned to Emergency Request: Elevator power transformer tripped.",
      link: `/provider/requests`,
    },
  });

  console.log("Seeding completed successfully!");
  console.log("Summary:");
  console.log("- 1 Admin: admin@coop.org (password: admin123)");
  console.log("- 10 Providers: provider1@coop.org .. provider10@coop.org (password: password123)");
  console.log("- 15 Members: member1@coop.org .. member15@coop.org (password: password123)");
  console.log(`- ${requestsData.length} Service Requests across all statuses`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
