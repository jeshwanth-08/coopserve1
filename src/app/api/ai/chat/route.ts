import { NextResponse } from "next/server";
import { ALL_20_SERVICES } from "@/data/allServicesData";
import { TOP_PROFESSIONALS } from "@/lib/homeData";

interface ChatPayload {
  message: string;
  history?: Array<{ sender: "bot" | "user"; text: string }>;
  apiKey?: string;
}

export async function POST(req: Request) {
  try {
    const body: ChatPayload = await req.json();
    const { message, apiKey: userProvidedApiKey } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const geminiKey =
      userProvidedApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const openAiKey =
      process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    // 1. Try Live Gemini if API Key is available
    if (geminiKey) {
      try {
        const geminiResult = await callGemini(message, geminiKey);
        if (geminiResult) {
          return NextResponse.json(geminiResult);
        }
      } catch (err) {
        console.warn("Gemini API call error, falling back to smart diagnostic engine:", err);
      }
    }

    // 2. Try OpenAI if API Key is available
    if (openAiKey) {
      try {
        const openAiResult = await callOpenAI(message, openAiKey);
        if (openAiResult) {
          return NextResponse.json(openAiResult);
        }
      } catch (err) {
        console.warn("OpenAI API call error, falling back to smart diagnostic engine:", err);
      }
    }

    // 3. Fallback to Built-in High-Accuracy Smart Diagnostic Engine
    const smartDiagnostic = runSmartDiagnosticEngine(message);
    return NextResponse.json(smartDiagnostic);
  } catch (error: any) {
    console.error("AI Chat route error:", error);
    return NextResponse.json(
      {
        text: "I am ready to help! Please tell me which home issue you need solved (e.g., washing machine, plumbing, electrical, or AC).",
        action: {
          label: "View All 20 Services",
          url: "/services",
        },
      },
      { status: 200 }
    );
  }
}

// Built-in Smart Semantic Diagnostic Engine
function runSmartDiagnosticEngine(query: string) {
  const q = query.toLowerCase();

  // Helper to test regex with word boundaries
  const matches = (pattern: RegExp) => pattern.test(q);

  // 1. Washing Machine / Laundry (Priority Check before generic appliance or AC)
  if (
    matches(/\b(washing\s*machine|washer|laundry|dryer|spin\s*cycle|drain\s*pump|drum\s*bearing|agitator|front\s*load|top\s*load)\b/) ||
    (q.includes("washing") && (q.includes("machine") || q.includes("poor") || q.includes("spin") || q.includes("water") || q.includes("drum")))
  ) {
    return {
      text: "Diagnosed issue: Washing Machine Malfunction. Common culprits include a worn drive belt, motor capacitor failure, unlevel drum suspension, or a clogged lint/drain pump filter.",
      diagnosticPoints: [
        "Drum not spinning / vibrating: Often worn drive belt or shock absorber issue.",
        "Water not draining: Usually lint/coins trapped in the lower drain pump filter.",
        "Noisy spin cycle: Worn tub bearing or uncalibrated leveling feet.",
      ],
      recommendedService: {
        id: "svc-6",
        name: "Appliance Repair (Washing Machine)",
        price: 349,
        duration: "45 mins",
        url: "/book/svc-6?prefilled=true&notes=Washing+Machine+inspection",
      },
      recommendedPro: {
        name: "Marcus Thorne",
        role: "Certified Master Appliance & Electrical Specialist",
      },
      action: {
        label: "Book Washing Machine Specialist (₹349)",
        url: "/book/svc-6",
      },
      safetyTip: "Unplug the machine from the main wall socket if there is excess water leakage or burning smell.",
    };
  }

  // 2. Refrigerator / Fridge / Freezer
  if (matches(/\b(refrigerator|fridge|freezer|ice\s*maker|compressor\s*buzz|cooling\s*coil)\b/)) {
    return {
      text: "Diagnosed issue: Refrigerator / Cooling Malfunction. Potential causes include dust on the condenser coils, faulty starter relay, or defrost timer malfunction.",
      diagnosticPoints: [
        "Fridge not cooling: Dirty coils behind the unit or starter relay failure.",
        "Water pooling at bottom: Blocked defrost drain channel.",
        "Excess ice buildup: Worn magnetic door gasket allowing warm air in.",
      ],
      recommendedService: {
        id: "svc-6",
        name: "Appliance Repair (Refrigerator)",
        price: 349,
        duration: "45 mins",
        url: "/book/svc-6?prefilled=true&notes=Refrigerator+cooling+fix",
      },
      recommendedPro: {
        name: "Marcus Thorne",
        role: "Certified Master Appliance Specialist",
      },
      action: {
        label: "Book Refrigerator Specialist (₹349)",
        url: "/book/svc-6",
      },
    };
  }

  // 3. Microwave / RO Water Purifier / Dishwasher / Kitchen Appliances
  if (matches(/\b(microwave|oven|ro\s*purifier|water\s*purifier|ro\s*filter|dishwasher|mixer|grinder|chimney)\b/)) {
    return {
      text: "Diagnosed issue: Kitchen Appliance Maintenance. Our technicians carry diagnostic multimeters, replacement heating elements, and genuine RO membrane filters.",
      recommendedService: {
        id: "svc-6",
        name: "Appliance Repair",
        price: 349,
        duration: "45 mins",
        url: "/book/svc-6",
      },
      action: {
        label: "Book Appliance Specialist (₹349)",
        url: "/book/svc-6",
      },
    };
  }

  // 4. Air Conditioning (AC) - MUST USE WORD BOUNDARIES \bac\b to avoid matching "machine"
  if (
    matches(/\b(ac|air\s*conditioner|split\s*ac|window\s*ac|hvac|power\s*jet|cooling|compressor|freon|gas\s*refill)\b/) &&
    !matches(/\b(washing|washer|laundry)\b/)
  ) {
    return {
      text: "Diagnosed issue: AC Cooling & Airflow Reduction. The most frequent issues are choked indoor cooling fins, choked blower fan, or refrigerant pressure drop.",
      diagnosticPoints: [
        "Blowing room temperature air: Low refrigerant gas or choked filter mesh.",
        "Water dripping inside room: Blocked condensate drain tray.",
        "Foul odor upon startup: Bacterial biofilm on evaporator fins requiring power jet wash.",
      ],
      recommendedService: {
        id: "svc-5",
        name: "AC Technician (Power Jet Service)",
        price: 499,
        duration: "45–60 mins",
        url: "/book/svc-5",
      },
      recommendedPro: {
        name: "Rahul",
        role: "Master AC Technician & HVAC Specialist",
      },
      action: {
        label: "Book Power Jet AC Clean (₹499)",
        url: "/book/svc-5",
      },
    };
  }

  // 5. Plumbing & Water Leakage
  if (matches(/\b(plumb|leak|tap|pipe|sink|drain|faucet|basin|flush|commode|clog|geyser\s*pipe|water\s*tank|seepage)\b/)) {
    const isUrgent = matches(/\b(burst|flood|overflow|heavy\s*leak|emergency)\b/);
    return {
      text: isUrgent
        ? "⚠️ URGENT PLUMBING ALERT: Active water leakage can damage structural walls and electrical conduits. Emergency dispatch is available in your locality."
        : "Diagnosed issue: Plumbing & Fixture Maintenance. Our hydro-engineers arrive with non-corrosive Teflon seals, heavy-duty drain augers, and replacement brass bibcocks.",
      diagnosticPoints: [
        "Dripping faucet: Worn ceramic cartridge or rubber O-ring seal.",
        "Slow sink drain: Hair and grease sediment trap in the P-trap.",
        "Running flush tank: Worn siphon flapper valve.",
      ],
      recommendedService: {
        id: "svc-2",
        name: "Plumber",
        price: 199,
        duration: "30–45 mins",
        url: "/book/svc-2",
      },
      recommendedPro: {
        name: "David Chen",
        role: "Senior Hydro-Engineer & Master Plumber",
      },
      isEmergency: isUrgent,
      safetyTip: isUrgent ? "Locate your home's main brass water stopcock valve (usually near bathroom shaft or utility) and turn clockwise to shut off water." : undefined,
      action: {
        label: "Book Master Plumber (₹199)",
        url: "/book/svc-2",
      },
    };
  }

  // 6. Electrical, Wiring, & Power Issues
  if (matches(/\b(electric|spark|short\s*circuit|mcb|switch|switchboard|wiring|shock|fuse|power\s*cut|socket|fan|light)\b/)) {
    const isUrgent = matches(/\b(spark|smoke|shock|burning|fire)\b/);
    return {
      text: isUrgent
        ? "⚠️ ELECTRICAL HAZARD DETECTED: Sparking or burning smell indicates high-resistance arcing or insulation breakdown."
        : "Diagnosed issue: Electrical Circuit / Switchgear Fault. Our certified electricians inspect with digital insulation multimeters and replace faulty MCBs with Schneider/Havells genuine units.",
      diagnosticPoints: [
        "MCB tripping repeatedly: Overloaded circuit branch or insulation breakdown in appliance.",
        "Flickering lights / loose switch: Arcing screw terminals inside backbox.",
      ],
      recommendedService: {
        id: "svc-1",
        name: "Electrician",
        price: 149,
        duration: "30–45 mins",
        url: "/book/svc-1",
      },
      recommendedPro: {
        name: "Rajesh Kumar",
        role: "Master Electrician & Smart Home Specialist",
      },
      isEmergency: isUrgent,
      safetyTip: isUrgent ? "Flip DOWN the main MCB on your distribution board immediately. Do NOT touch switches with wet hands." : undefined,
      action: {
        label: "Book Certified Electrician (₹149)",
        url: "/book/svc-1",
      },
    };
  }

  // 7. Carpentry & Furniture
  if (matches(/\b(carpent|door|hinge|wardrobe|bed|table|chair|wood|lock|cabinet|drawer|shelf)\b/)) {
    return {
      text: "Diagnosed issue: Woodwork & Hardware Realignment. Door sag, loose hinge screws, or stuck telescopic drawer channels can be rectified quickly with precision chisel and alignment tools.",
      recommendedService: {
        id: "svc-3",
        name: "Carpenter",
        price: 249,
        duration: "45–60 mins",
        url: "/book/svc-3",
      },
      action: {
        label: "Book Skilled Carpenter (₹249)",
        url: "/book/svc-3",
      },
    };
  }

  // 8. Painting & Wall Care
  if (matches(/\b(paint|painter|wall|seepage|damp|putty|primer|whitewash|texture)\b/)) {
    return {
      text: "Diagnosed issue: Wall Care & Surface Treatment. We provide Asian Paints waterproof acrylic putty, moisture detection scan, and roller-finish touchups with dust sheeting.",
      recommendedService: {
        id: "svc-4",
        name: "Painter",
        price: 599,
        duration: "2–3 hrs",
        url: "/book/svc-4",
      },
      action: {
        label: "Book Professional Painter (₹599)",
        url: "/book/svc-4",
      },
    };
  }

  // 9. Deep Home Cleaning & Sofa Sanitization
  if (matches(/\b(clean|deep\s*clean|bathroom\s*scrub|sofa\s*shampoo|floor\s*buff|kitchen\s*degrease|house\s*clean)\b/)) {
    return {
      text: "Diagnosed issue: Deep Cleaning & Sanitization. Single-disc rotary floor buffing, Taski chemical tile descaling, and high-suction HEPA vacuum extraction.",
      recommendedService: {
        id: "svc-7",
        name: "House Cleaning",
        price: 1499,
        duration: "3–4 hrs",
        url: "/book/svc-7",
      },
      action: {
        label: "Book Full Home Deep Clean (₹1499)",
        url: "/book/svc-7",
      },
    };
  }

  // 10. Cooking & Chefs
  if (matches(/\b(cook|chef|food|meal|breakfast|dinner|lunch|recipe)\b/)) {
    return {
      text: "Looking for an experienced home chef? Our verified cooks specialize in regional home-style meals with strict hairnet and countertop hygiene.",
      recommendedService: {
        id: "svc-8",
        name: "Cook",
        price: 349,
        duration: "60–75 mins",
        url: "/book/svc-8",
      },
      action: {
        label: "Book Trained Cook (₹349)",
        url: "/book/svc-8",
      },
    };
  }

  // 11. Gardening & Lawn
  if (matches(/\b(garden|plant|lawn|prun|grass|soil|pot|fertilizer|weed)\b/)) {
    return {
      text: "Diagnosed issue: Lawn & Potted Plant Care. Professional soil aeration, organic vermicompost feeding, hedge trimming, and neem oil pest treatment.",
      recommendedService: {
        id: "svc-9",
        name: "Gardener",
        price: 299,
        duration: "45 mins",
        url: "/book/svc-9",
      },
      action: {
        label: "Book Home Gardener (₹299)",
        url: "/book/svc-9",
      },
    };
  }

  // 12. Tutor & Education
  if (matches(/\b(tutor|tuition|study|math|maths|science|physics|english|exam|homework)\b/)) {
    return {
      text: "Need personalized 1-on-1 home tutoring? Our verified educators cover school curriculum, concept clarity, and weekly parent progress tracking.",
      recommendedService: {
        id: "svc-10",
        name: "Tutor",
        price: 399,
        duration: "60 mins",
        url: "/book/svc-10",
      },
      action: {
        label: "Book 1-on-1 Home Tutor (₹399)",
        url: "/book/svc-10",
      },
    };
  }

  // 13. Computer & Laptop Repair
  if (matches(/\b(computer|laptop|pc|ssd|macbook|windows|slow|blue\s*screen|virus|ram)\b/)) {
    return {
      text: "Diagnosed issue: PC / Laptop Performance & Hardware. Doorstep diagnostic test, thermal paste cooling refresh, SSD speed upgrade, and zero data loss guarantee.",
      recommendedService: {
        id: "svc-11",
        name: "Computer Repair",
        price: 449,
        duration: "45–60 mins",
        url: "/book/svc-11",
      },
      action: {
        label: "Book PC Diagnostic (₹449)",
        url: "/book/svc-11",
      },
    };
  }

  // 14. Mobile Repair
  if (matches(/\b(mobile|phone|iphone|screen\s*crack|battery|charging\s*port|display)\b/)) {
    return {
      text: "Diagnosed issue: Smartphone Screen / Battery Fix. High-grade digitizer testing, water-resistant seal adhesive, and on-the-spot screen replacement.",
      recommendedService: {
        id: "svc-12",
        name: "Mobile Repair",
        price: 399,
        duration: "30–45 mins",
        url: "/book/svc-12",
      },
      action: {
        label: "Book Doorstep Mobile Fix (₹399)",
        url: "/book/svc-12",
      },
    };
  }

  // 15. Salon & Beauty
  if (matches(/\b(beauty|salon|facial|manicure|pedicure|makeup|hair|esthetician|wax|bridal)\b/)) {
    return {
      text: "Pamper yourself with salon-grade hygiene in the comfort of home. 100% single-use monodose sealed beauty kits with certified estheticians.",
      recommendedService: {
        id: "svc-19",
        name: "Beauty Services",
        price: 499,
        duration: "60 mins",
        url: "/book/svc-19",
      },
      recommendedPro: {
        name: "Sunita Sharma",
        role: "Senior Esthetician & Bridal Grooming Lead",
      },
      action: {
        label: "Book Salon Specialist (₹499)",
        url: "/book/svc-19",
      },
    };
  }

  // 16. Packers & Movers
  if (matches(/\b(move|shifting|packers|relocation|tempo|truck|tata\s*ace)\b/)) {
    return {
      text: "Planning a home move? Our team provides 3-layer corrugated bubble wrap for fragile goods, closed weatherproof mini-trucks, and dedicated helpers.",
      recommendedService: {
        id: "svc-16",
        name: "Packers & Movers",
        price: 1499,
        duration: "4–6 hrs",
        url: "/book/svc-16",
      },
      action: {
        label: "Book Relocation & Mini Truck (₹1499)",
        url: "/book/svc-16",
      },
    };
  }

  // 17. Membership & Plus Plans
  if (matches(/\b(member|membership|plus|discount|vip|saving|plan)\b/)) {
    return {
      text: "CoopServe Plus (₹999/yr) gives you 10% flat discount on all services, unlimited ₹0 inspection visit charges, priority 30-min emergency booking dispatch, and dedicated supervisor support.",
      action: {
        label: "Explore CoopServe Plus Plans",
        url: "/membership",
      },
    };
  }

  // 18. Packages
  if (matches(/\b(package|bundle|combo|refresh|summer|monsoon|move-in)\b/)) {
    return {
      text: "Save up to 40% with our curated bundles! From the Move-In Sanitization Pack to Summer Double AC Shield, packages include comprehensive multi-trade checklists.",
      action: {
        label: "Browse Curated Packages",
        url: "/packages",
      },
    };
  }

  // Default intelligent assistant response
  return {
    text: `I'm Home Buddy, your AI home concierge. I can diagnose any issues across our 20 cooperative services—including appliances (washing machines, refrigerators), AC cooling, plumbing, electrical, and cleaning. Could you tell me more about what's occurring?`,
    action: {
      label: "Browse Full Service Catalog",
      url: "/services",
    },
  };
}

// Live Google Gemini Integration
async function callGemini(message: string, apiKey: string) {
  const serviceCatalogSummary = ALL_20_SERVICES.map(
    (s) => `${s.id}: ${s.name} (${s.category}) - ₹${s.price} [slug: ${s.slug}]`
  ).join("\n");

  const prosSummary = TOP_PROFESSIONALS.map(
    (p) => `${p.name} (${p.role}) - matches serviceId: ${p.serviceId}`
  ).join("\n");

  const systemInstruction = `You are "Home Buddy", the elite AI home maintenance concierge for CoopServe.
Your goal is to accurately diagnose the user's household issue and recommend the exact service from the CoopServe catalog.
CRITICAL RULES:
1. If the user mentions a washing machine, washer, refrigerator, microwave, or other household appliances, NEVER classify it as AC Technician! Washing machines and refrigerators are "Appliance Repair" (svc-6).
2. Only classify as AC Technician (svc-5) when the issue is specifically about Air Conditioners (split/window AC cooling, coil wash, gas refill).
3. Always provide a clear, helpful, 2-3 sentence diagnosis explaining what might be causing the symptom.
4. Output STRICT JSON only without markdown fences:
{
  "text": "Your helpful diagnostic explanation",
  "diagnosticPoints": ["Point 1", "Point 2"],
  "recommendedService": {
    "id": "exact svc id from catalog",
    "name": "service name",
    "price": 349,
    "duration": "45 mins",
    "url": "/book/svc-id"
  },
  "recommendedPro": {
    "name": "pro name",
    "role": "pro title"
  },
  "action": {
    "label": "Button label e.g. Book Washing Machine Specialist (₹349)",
    "url": "/book/svc-id"
  },
  "safetyTip": "Optional safety tip if hazardous"
}

Available Services:
${serviceCatalogSummary}

Top Specialists:
${prosSummary}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nUser query: "${message}"` }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error ${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  // Clean code fence formatting if present
  const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleanedJson);
}

// Live OpenAI Integration
async function callOpenAI(message: string, apiKey: string) {
  const serviceCatalogSummary = ALL_20_SERVICES.map(
    (s) => `${s.id}: ${s.name} (${s.category}) - ₹${s.price}`
  ).join("\n");

  const systemPrompt = `You are "Home Buddy", the elite AI home concierge for CoopServe.
Washing machines are "Appliance Repair" (svc-6), NOT AC.
Output strict JSON with fields: text, diagnosticPoints (array), recommendedService (id, name, price, duration, url), action (label, url), safetyTip.
Catalog:
${serviceCatalogSummary}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  return content ? JSON.parse(content) : null;
}
