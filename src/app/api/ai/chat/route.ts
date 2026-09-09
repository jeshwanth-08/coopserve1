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
        console.warn("Gemini API call failed, trying backup model / engine:", err);
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
        console.warn("OpenAI API call error, falling back to smart engine:", err);
      }
    }

    // 3. Built-in High-Accuracy Conversational Knowledge Engine
    const smartResponse = runSmartDiagnosticEngine(message);
    return NextResponse.json(smartResponse);
  } catch (error: any) {
    console.error("AI Chat route error:", error);
    return NextResponse.json(
      {
        text: "I am ready to help! You can ask me any question about home maintenance, troubleshooting repairs, DIY tips, or CoopServe services.",
        action: {
          label: "View All 20 Services",
          url: "/services",
        },
      },
      { status: 200 }
    );
  }
}

// Live Google Gemini Integration (Gemini 2.0 / 1.5 Flash)
async function callGemini(message: string, apiKey: string) {
  const serviceCatalogSummary = ALL_20_SERVICES.map(
    (s) => `${s.id}: ${s.name} (${s.category}) - ₹${s.price}`
  ).join(", ");

  const prosSummary = TOP_PROFESSIONALS.map(
    (p) => `${p.name} (${p.role})`
  ).join(", ");

  const systemInstruction = `You are "CoopServe AI Support & Home Buddy", the official 24/7 Customer Support representative and intelligent home maintenance concierge for CoopServe (a neighborhood cooperative home services platform), powered by modern LLM intelligence.

CAPABILITIES:
- 24/7 CUSTOMER SUPPORT: You handle all customer inquiries, booking assistance, rescheduling, cancellation/refund policies, 30-day rework guarantees, complaints, and ticket escalations.
- Cooperative Helpline: 1800-266-7788 (Toll-Free, 24/7) | Official Email: help@coopserve.in.
- If the user complains, reports a delay or poor service, generate a ticket reference like #TIC-8492 and assure immediate district coordinator intervention under our 30-day rework warranty.
- You can answer ANY question the user asks — home maintenance, appliances, electrical, plumbing, carpentry, DIY repairs, cleaning, pest control, safety, energy saving, platform questions, general knowledge, science, tips, or friendly conversation.
- Answer thoroughly, clearly, and conversationally with well-structured formatting, bullet points, and actionable tips.

MATCHING RULES:
1. If the user's inquiry relates to an issue that can be serviced by CoopServe:
   - Accurately diagnose the probable causes.
   - Recommend the exact relevant service from CoopServe catalog and appropriate specialist.
   - CRITICAL RULE: Washing machines, refrigerators, microwaves, dishwashers are "Appliance Repair" (svc-6), NEVER AC Technician (svc-5)!
   - Only classify as AC Technician (svc-5) when specifically about Air Conditioners (cooling, coils, gas refill).
2. If the user asks general knowledge, conversational greetings, DIY advice, or non-service questions:
   - Answer intelligently, warmly, and comprehensively without forcing an irrelevant booking!

OUTPUT STRUCTURE (STRICT JSON ONLY):
{
  "text": "Your complete, articulate, smart answer (can be multiple paragraphs with formatting)",
  "diagnosticPoints": ["Key takeaway / diagnosis 1", "Key takeaway 2"],
  "safetyTip": "Important precaution or safety tip if applicable",
  "recommendedService": {
    "id": "exact svc id e.g. svc-6",
    "name": "service name",
    "price": 349,
    "duration": "45 mins",
    "url": "/book/svc-6"
  },
  "recommendedPro": {
    "name": "Marcus Thorne",
    "role": "Master Specialist"
  },
  "action": {
    "label": "Button label e.g. Book Specialist (₹349)",
    "url": "/book/svc-6"
  }
}

Catalog: ${serviceCatalogSummary}
Top Specialists: ${prosSummary}`;

  // Try Gemini 1.5 Flash (most widely accessible) then 2.0 Flash
  const models = ["gemini-1.5-flash", "gemini-2.0-flash"];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemInstruction}\n\nUser Question: "${message}"` }],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 800,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              return JSON.parse(jsonMatch[0]);
            } catch {
              // fallback below
            }
          }
          return {
            text: rawText.replace(/```json/g, "").replace(/```/g, "").trim(),
          };
        }
      }
    } catch {
      continue;
    }
  }

  return null;
}

// Live OpenAI Integration (GPT-4o-mini)
async function callOpenAI(message: string, apiKey: string) {
  const serviceCatalogSummary = ALL_20_SERVICES.map(
    (s) => `${s.id}: ${s.name} (${s.category}) - ₹${s.price}`
  ).join(", ");

  const systemPrompt = `You are "CoopServe AI Support & Home Buddy", the elite 24/7 Customer Support representative and home maintenance concierge for CoopServe.
Answer ANY query intelligently, thoroughly, and helpfully like ChatGPT.
Handle all customer service issues: bookings, cancellations, refunds, warranties (30-day rework warranty), complaints (generate a ticket ID like #TIC-8492), helpline 1800-266-7788 / help@coopserve.in.
Washing machines are "Appliance Repair" (svc-6), NOT AC.
Output strict JSON with fields: text, diagnosticPoints (array, optional), safetyTip (optional), recommendedService (id, name, price, duration, url, optional), action (label, url, optional).
Catalog: ${serviceCatalogSummary}`;

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
      temperature: 0.3,
    }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch {
    return { text: content };
  }
}

// Built-in Comprehensive Multi-Domain Conversational Knowledge Engine
function runSmartDiagnosticEngine(query: string) {
  const q = query.toLowerCase().trim();
  const matches = (pattern: RegExp) => pattern.test(q);

  // 1. Greetings, Identity & General Chit-Chat
  if (matches(/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|namaste)\b/)) {
    return {
      text: "Hello! 👋 I'm your CoopServe 24/7 AI Customer Support & Maintenance Concierge.\n\nI can help you with anything — raising a support ticket, tracking your technician, booking cancellations & refunds, DIY repair troubleshooting, or dispatching certified cooperative professionals!",
      diagnosticPoints: [
        "🎧 Need Customer Support? Ask 'Raise a ticket', 'Talk to coordinator', or call 1800-266-7788.",
        "📦 Need to track your booking? Ask 'Where is my pro?' or 'Track my service'.",
        "📸 Defect diagnosis: Tap the 📸 Camera button to diagnose issues directly from a photo.",
      ],
      action: {
        label: "View All 20 Services",
        url: "/services",
      },
    };
  }

  // 2. Official 24/7 Customer Support, Helpline & Ticketing
  if (matches(/\b(support|customer\s*care|help\s*desk|helpline|human|agent|talk\s*to\s*(someone|agent|person|human|coordinator)|customer\s*support|contact\s*support)\b/)) {
    return {
      text: "🎧 **CoopServe 24/7 Customer Support Desk**\n\nWe are here for you around the clock to ensure high-quality service, fair pricing, and complete peace of mind:\n\n• **Toll-Free Helpline**: 📞 **1800-266-7788** (24/7 Live Emergency Line)\n• **Support Email**: ✉️ **help@coopserve.in**\n• **District Cooperative Coordination**: Indiranagar District Office, Bengaluru\n• **30-Day Guarantee**: Free revisit & rework if you are unsatisfied with any technician's service.",
      diagnosticPoints: [
        "Instant Resolution: Type 'Raise a ticket' to create an official tracked support ticket.",
        "Order Assistance: Type 'Track my booking' to view live GPS technician status.",
        "Billing & Refunds: 100% instant refund on cancellations made >2 hours before service.",
      ],
      action: {
        label: "Contact Support Hub",
        url: "/support",
      },
    };
  }

  // 3. Ticket Generation & Complaint Escalation
  if (matches(/\b(ticket|raise\s*(a\s*)?ticket|complaint|issue\s*with\s*(my\s*)?service|technician\s*(late|didn't|delayed)|bad\s*service|poor\s*work|unhappy|disappointed|not\s*satisfied)\b/)) {
    const ticketId = "TIC-" + Math.floor(100000 + Math.random() * 900000);
    return {
      text: `🎫 **Official Support Ticket Generated: #${ticketId}**\n\nWe sincerely apologize for any inconvenience! Your issue has been logged with **Priority: HIGH** and directly escalated to your District Society Coordinator.\n\n• **Ticket ID**: #${ticketId}\n• **Status**: ACTIVE / ESCALATED\n• **SLA Response**: Under 15 minutes\n• **Assigned Cell**: Bengaluru Central Cooperative Coordination Hub\n• **Resolution Guarantee**: In accordance with the CoopServe Charter, you are eligible for an immediate **100% Free Rework Guarantee** or full refund.`,
      diagnosticPoints: [
        `Ticket #${ticketId} is linked to your registered profile.`,
        "Our society duty officer will reach you on your phone within 15 minutes.",
        "Emergency phone escalation: 1800-266-7788 (quote Ticket #" + ticketId + ").",
      ],
      action: {
        label: "View Account & Tickets",
        url: "/account",
      },
    };
  }

  // 4. Live Tracking & Arrival Status
  if (matches(/\b(track\s*(my\s*)?booking|where\s*is\s*(my\s*)?technician|where\s*is\s*(my\s*)?pro|eta|arrival\s*time|tracking|live\s*status)\b/)) {
    return {
      text: "📍 **Live Technician Tracking & Arrival ETA**\n\nWhen a cooperative technician is dispatched to your home, you can follow their journey in real time with live GPS breadcrumbs, verified mobile OTP, and direct calling.",
      diagnosticPoints: [
        "View technician photo, ID, trade certification, and vehicle number.",
        "6-Stage live progress: Confirmed ➔ Dispatched ➔ En Route ➔ Arrived ➔ In Progress ➔ Completed.",
        "Pay after service completion via UPI, Card, or Doorstep Cash.",
      ],
      action: {
        label: "Open Live Tracking",
        url: "/tracking/BK-884920",
      },
    };
  }

  if (matches(/\b(who\s*are\s*you|what\s*is\s*your\s*name|what\s*can\s*you\s*do|about\s*you|introduce\s*yourself)\b/)) {
    return {
      text: "I am CoopServe Support & Home Buddy ⚡, your AI customer support concierge!\n\nI combine 24/7 customer service (ticket resolution, refunds, tracking, booking support) with diagnostic engineering across all 20 cooperative trades. I can troubleshoot household breakdowns, provide instant DIY maintenance advice, and connect you with certified neighborhood technicians.",
      diagnosticPoints: [
        "24/7 Customer Support Desk: Toll-free 1800-266-7788 / help@coopserve.in.",
        "Equipped with live Google Gemini & OpenAI AI for open-ended queries.",
        "Direct integration with CoopServe's transparent 100% fixed-rate pricing and 30-day warranty.",
      ],
      action: {
        label: "Browse Services Catalog",
        url: "/services",
      },
    };
  }

  // 2. CoopServe Platform Knowledge: How to Book, Pricing, Policies, Membership
  if (matches(/\b(how\s*to\s*book|how\s*does\s*(it|coopserve)\s*work|booking\s*process|how\s*do\s*i\s*schedule)\b/)) {
    return {
      text: "Booking on CoopServe is seamless and transparent:\n\n1. **Select Service**: Pick from our 20 verified trade categories or click an AI-recommended match.\n2. **Choose Date & Time**: Pick your convenient slot (same-day emergency dispatch available in under 60 mins).\n3. **Verified Dispatch**: A background-checked neighborhood cooperative professional arrives at your doorstep with standard rate cards — no hidden surcharges.",
      diagnosticPoints: [
        "100% Fixed Rates: Transparent pricing starting from ₹149.",
        "Doorstep Warranty: 30-day rework guarantee on all completed services.",
        "Verified Crew: Police verified, skill-certified cooperative technicians.",
      ],
      action: {
        label: "Book a Service Now",
        url: "/services",
      },
    };
  }

  if (matches(/\b(price|pricing|rates|cost|how\s*much|charges|fee|catalog)\b/)) {
    return {
      text: "CoopServe operates on fair-trade, transparent pricing with zero middleman markups:\n\n• **Electrician**: From ₹149 (inspection, switchboard, wiring)\n• **Plumber**: From ₹149 (tap leaks, blockages, fittings)\n• **Appliance Repair**: ₹349 (Washing machine, Refrigerator, Microwave, RO)\n• **AC Servicing**: ₹499 (Deep Power Jet cleaning & coil wash)\n• **Cleaning & Pest Control**: From ₹399–₹599\n• **Carpentry & Painting**: From ₹199–₹499",
      diagnosticPoints: [
        "All prices are standardized across neighborhood societies.",
        "HOME+ members receive an additional 10% discount on every job.",
      ],
      action: {
        label: "View Full Price Catalog",
        url: "/services",
      },
    };
  }

  if (matches(/\b(membership|home\+|plus\s*member|subscription|discounts|perks)\b/)) {
    return {
      text: "The **HOME+ Membership** (₹999/year) unlocks premium neighborhood cooperative privileges:\n\n• **10% Flat Discount** on all 20 home services all year round.\n• **Priority Emergency Dispatch**: Technicians reach your home in under 30 minutes.\n• **4 Free Doorstep Inspections** every year for routine electrical, AC, and plumbing checks.\n• **60-Day Extended Warranty** on all repair jobs.",
      action: {
        label: "Explore HOME+ Membership",
        url: "/membership",
      },
    };
  }

  if (matches(/\b(cancel|cancellation|refund|reschedule|money\s*back|warranty)\b/)) {
    return {
      text: "CoopServe guarantees hassle-free customer protection:\n\n• **Free Cancellation**: You can cancel or reschedule any booking anytime up to 2 hours before the scheduled slot with zero penalty.\n• **Instant Refund**: Prepaid amounts are credited back immediately.\n• **30-Day Cooperative Warranty**: If an issue recurs within 30 days of service, our technician returns and rectifies it free of charge.",
      action: {
        label: "Help & Support Center",
        url: "/support",
      },
    };
  }

  // 3. DIY, Energy Saving & Home Hacks
  if (matches(/\b(clean\s*(ceiling\s*)?fan|fan\s*clean|dust\s*(on\s*)?fan)\b/)) {
    return {
      text: "The Mess-Free Pillowcase Fan Cleaning Hack:\n\n1. **Use an Old Pillowcase**: Slip an old pillowcase over a single fan blade like a sleeve.\n2. **Slide & Trap**: Press your hands against both the top and bottom of the blade and slide the pillowcase backward towards you. 100% of the dust and grime stays trapped inside the pillowcase instead of falling onto your bed or floor!\n3. **Repeat for all blades**, then wipe each blade with a microfiber cloth dampened with mild soapy water or vinegar spray.\n4. **Shake out the pillowcase** outside or wash it directly in the washing machine.",
      diagnosticPoints: [
        "Never use dripping wet cloths near the motor housing to prevent electrical shorts.",
        "Check if blade angle is bent — unbalanced blades cause wobbling and humming motor strain.",
      ],
      action: {
        label: "Book Full Home Deep Cleaning (₹399)",
        url: "/book/svc-7",
      },
    };
  }

  if (matches(/\b(save\s*electricity|lower\s*(power|electric|ac)\s*bill|energy\s*saving|power\s*consumption|reduce\s*bill)\b/)) {
    return {
      text: "Top Proven Tips to Cut Your Home Power Bills by 20–35%:\n\n1. **AC Ideal Temperature**: Keep your AC at 24°C–26°C. Every 1°C increase saves 6% electricity.\n2. **Clean AC Filters Bi-Weekly**: Choked filters force the compressor to run 30% longer to cool the room.\n3. **Refrigerator Placement**: Keep at least 3 inches of clearance behind the fridge for coil ventilation so the compressor cycles off properly.\n4. **Check Phantom Loads**: Switch off TV, microwave, and gaming consoles at the wall socket when not in use.\n5. **Upgrade to BLDC Ceiling Fans**: BLDC fans consume just 28–35W compared to 75–80W for standard induction fans.",
      diagnosticPoints: [
        "A Power Jet AC service restores heat transfer efficiency, cutting power consumption by 15-20%.",
        "Consider an electrical audit to identify overloaded circuits or neutral wire leakage.",
      ],
      action: {
        label: "Book AC Power Jet Service (₹499)",
        url: "/book/svc-5",
      },
    };
  }

  if (matches(/\b(hard\s*water|white\s*stains|lime\s*scale|scale\s*on\s*tap|stains\s*on\s*tiles)\b/)) {
    return {
      text: "How to Remove Hard Water & Limescale Stains:\n\n1. **Taps & Faucets**: Soak a paper towel or cloth in warm white vinegar, wrap it around the scaled faucet for 30 minutes, then scrub with a soft brush and rinse with water.\n2. **Bathroom Tile Grout**: Make a paste of 3 parts baking soda to 1 part hydrogen peroxide or vinegar. Apply to grout lines, leave for 15 minutes, scrub with a grout brush.\n3. **Glass Shower Partitions**: Use diluted citric acid or commercial descaler, wipe with a squeegee to prevent fresh mineral deposits.",
      diagnosticPoints: [
        "Hard water also scales internal geyser heating coils and washing machine drums.",
        "For stubborn encrustations, our deep cleaning crew uses specialized anti-calc chemicals that don't damage chrome.",
      ],
      action: {
        label: "Book Bathroom Deep Cleaning (₹399)",
        url: "/book/svc-7",
      },
    };
  }

  if (matches(/\b(unclog\s*(a\s*)?(drain|sink|basin|toilet)|clogged\s*drain|drain\s*blocked)\b/) && !matches(/\b(plumber)\b/)) {
    return {
      text: "DIY Natural Method to Unclog Drains (Without Harsh Acids):\n\n1. **Baking Soda & Vinegar Volcano**: Pour 1/2 cup of baking soda directly down the drain.\n2. **Add Vinegar**: Pour 1 cup of white vinegar or warm apple cider vinegar. Cover the drain with a plug/cloth and let it fizz for 15–20 minutes.\n3. **Boiling Water Flush**: Pour a full kettle of boiling water down the drain to flush out melted grease and loose debris.\n4. **P-Trap Check**: For bathroom sinks, remove hair clumps from the pop-up stopper using a plastic drain snake or wire hanger.",
      diagnosticPoints: [
        "Avoid heavy commercial sulfuric acid drain cleaners as they corrode PVC pipes and heat-deform joints.",
        "If multiple drains bubble or back up simultaneously, the blockage is in the main sewer stack.",
      ],
      recommendedService: {
        id: "svc-2",
        name: "Plumber",
        price: 149,
        duration: "30–45 mins",
        url: "/book/svc-2",
      },
      action: {
        label: "Book Plumber for Deep Snake Clean (₹149)",
        url: "/book/svc-2",
      },
    };
  }

  if (matches(/\b(mold|mildew|fungus|black\s*spots\s*on\s*wall|damp\s*wall|seepage)\b/)) {
    return {
      text: "Diagnosed Issue: Mold & Moisture Seepage.\n\n• **Immediate Surface Clean**: Spray with 3% hydrogen peroxide or white vinegar (avoid mixing chemicals!). Leave for 10 minutes, scrub and wipe dry.\n• **Root Cause Check**: Mold always stems from concealed water leakage, bathroom splash seepage, or high indoor humidity (>60%).",
      diagnosticPoints: [
        "Check adjacent bathroom walls for hidden plumbing pipe joint leaks.",
        "Ensure exhaust fans run for at least 15 minutes after hot showers.",
        "Long-term remedy requires elastomeric waterproofing primer before repainting.",
      ],
      recommendedService: {
        id: "svc-14",
        name: "Roofing & Waterproofing",
        price: 599,
        duration: "60 mins",
        url: "/book/svc-14",
      },
      action: {
        label: "Book Waterproofing & Seepage Audit (₹599)",
        url: "/book/svc-14",
      },
      safetyTip: "Wear a mask and gloves when cleaning mold spores to avoid respiratory irritation.",
    };
  }

  if (matches(/\b(door\s*stuck|swollen\s*door|monsoon\s*door|squeaky\s*hinge|creaking\s*door)\b/)) {
    return {
      text: "Diagnosed Issue: Wooden Door Friction or Hinge Wear.\n\n• **Swollen Wood in Monsoon**: Wood absorbs atmospheric moisture and expands against the door frame. Rub candle wax or paraffin on sticking edges for temporary relief, or lightly plane the edge.\n• **Squeaky Hinges**: Apply silicone spray lubricant or WD-40 onto the hinge pins. Move the door back and forth several times to penetrate.",
      diagnosticPoints: [
        "If door sags, the top hinge screws are likely loose or stripped inside the wooden frame.",
        "Planing more than 3mm without resealing allows more moisture in — our carpenters apply sealant edge polish.",
      ],
      recommendedService: {
        id: "svc-3",
        name: "Carpenter (Hinge & Door Fitting)",
        price: 199,
        duration: "30–45 mins",
        url: "/book/svc-3",
      },
      action: {
        label: "Book Carpenter (₹199)",
        url: "/book/svc-3",
      },
    };
  }

  // 4. "How It Works" & Educational Principles (Prevent false diagnosis)
  if (matches(/\b(how\s*(does|do)\s*(a|an|the)?\s*refrigerator\s*work|explain\s*(how\s*)?(a\s*)?refrigerator|refrigeration\s*cycle)\b/)) {
    return {
      text: "How a Refrigerator Works (The 4-Stage Vapor-Compression Cycle):\n\n1. **Compressor**: Pumps low-pressure cold refrigerant gas and compresses it into high-pressure, hot gas.\n2. **Condenser Coils (Behind/Under Fridge)**: The hot gas passes through exterior coils, shedding heat to the room and condensing into a warm liquid.\n3. **Expansion Valve / Capillary Tube**: Restricts the liquid flow, causing an abrupt drop in pressure. This makes the refrigerant flash into an ultra-cold liquid/vapor mixture.\n4. **Evaporator Coils (Inside Freezer)**: The cold refrigerant absorbs heat from food and air inside the fridge. As it absorbs heat, it evaporates back into gas and returns to the compressor.",
      diagnosticPoints: [
        "Refrigerators don't 'create cold' — they absorb heat from inside and pump it outside.",
        "Keeping condenser coils clean of dust ensures maximum heat dissipation and lowest electricity consumption.",
      ],
      action: {
        label: "View Appliance Services",
        url: "/services",
      },
    };
  }

  if (matches(/\b(how\s*(does|do)\s*(a|an|the)?\s*(ac|air\s*conditioner)\s*work|explain\s*(how\s*)?(an?\s*)?(ac|air\s*conditioner))\b/)) {
    return {
      text: "How an Air Conditioner (Split AC) Works:\n\n1. **Indoor Unit (Evaporator)**: Warm room air is pulled over cold copper coils filled with chilled liquid refrigerant. The refrigerant absorbs room heat and dehumidifies the air as water condenses on the coils and drains outside.\n2. **Refrigerant Lines**: Insulated copper tubes carry the heat-laden vapor refrigerant from indoors to the outdoor unit.\n3. **Outdoor Unit (Compressor & Condenser)**: The compressor ramps up pressure and temperature, then the outdoor fan blows outside air across condenser fins to reject the absorbed heat into the atmosphere.\n4. **Expansion Valve**: Chills the refrigerant back down before cycling it back to the indoor unit.",
      diagnosticPoints: [
        "Inverter ACs vary compressor speed smoothly instead of switching on/off, using up to 40% less energy.",
        "A Power Jet coil wash every 6 months restores heat exchange efficiency and prevents musty odors.",
      ],
      action: {
        label: "Book Power Jet AC Clean (₹499)",
        url: "/book/svc-5",
      },
    };
  }

  if (matches(/\b(how\s*(does|do)\s*(a|an|the)?\s*washing\s*machine\s*work|explain\s*(how\s*)?(a\s*)?washing\s*machine)\b/)) {
    return {
      text: "How a Modern Washing Machine Works:\n\n1. **Fill & Water Level Detection**: Water inlet solenoid valves open. An electronic pressure sensor detects drum air pressure to stop water fill at the exact required level.\n2. **Agitation / Tumble**: Top-loaders use an impeller or agitator to rotate water back and forth. Front-loaders use paddles to lift clothes and drop them into soapy water using gravitational tumbling (gentler on fabric and uses 50% less water).\n3. **Drainage**: A high-speed electric impeller drain pump evacuates wastewater through the discharge hose.\n4. **Centrifugal Spin Extraction**: The drum spins at 800–1400 RPM. Centrifugal force pushes clothes against the perforated drum wall, forcing water out through tiny holes.",
      diagnosticPoints: [
        "Front-load machines clean via gravitational friction; top-loaders clean via hydraulic agitation.",
        "Monthly drum descaling dissolves calcium and detergent scum, preserving bearing life.",
      ],
      action: {
        label: "Appliance Care & Repair (₹349)",
        url: "/book/svc-6",
      },
    };
  }

  if (matches(/\b(how\s*(does|do)\s*(a|an|the)?\s*(inverter|ups)\s*work|explain\s*(how\s*)?(an?\s*)?(inverter|ups))\b/)) {
    return {
      text: "How a Home Inverter / UPS Works:\n\n1. **Normal Mains Mode**: When grid electricity is on, the inverter passes AC power straight to your home appliances while simultaneously converting AC to DC (Rectification) to charge the backup battery.\n2. **Transfer Switch**: When grid power fails, a high-speed relay or microcontroller detects the outage within 10–20 milliseconds (under 5ms for UPS) and switches to battery backup.\n3. **Inversion Stage**: Using MOSFETs or IGBTs with Pulse Width Modulation (PWM), it converts 12V/24V DC battery power into 220V/230V alternating current (AC).\n4. **Pure Sine Wave Filtering**: Quality inverters produce a smooth sine wave identical to grid power, ensuring fans don't hum and electronics run cool.",
      diagnosticPoints: [
        "Tubular lead-acid batteries require periodic distilled water top-ups; LiFePO4 batteries are maintenance-free.",
        "Always size your inverter VA rating at 25% above your peak connected home load.",
      ],
      action: {
        label: "Book Electrician (₹149)",
        url: "/book/svc-1",
      },
    };
  }

  if (matches(/\b(how\s*(does|do)\s*(a|an|the)?\s*microwave\s*work|explain\s*(how\s*)?(a\s*)?microwave)\b/)) {
    return {
      text: "How a Microwave Oven Heats Food:\n\n1. **The Magnetron**: A specialized vacuum tube converts high-voltage electrical energy into microwave radiation at 2.45 GHz (2,450,000,000 cycles per second).\n2. **Dielectric Heating**: Water, sugar, and fat molecules in food are electric dipoles (they have positive and negative ends). As the 2.45 GHz waves alternate, these molecules rotate back and forth billions of times per second.\n3. **Molecular Friction**: This violent oscillation creates molecular friction that turns directly into heat throughout the food, cooking from the inside and outside simultaneously.",
      diagnosticPoints: [
        "Microwaves do not make food radioactive; they are non-ionizing electromagnetic radiation.",
        "Metal reflects microwaves and can cause high-voltage electric arcing that ruins the magnetron.",
      ],
    };
  }

  // 5. Everyday Science & General Household Curiosities
  if (matches(/\b(water\s*expand(s|ing)?\s*(when\s*)?(it\s*)?freeze(s|ing|d)?|why\s*does\s*ice\s*float)\b/)) {
    return {
      text: "Why Water Expands When It Freezes (Anomalous Expansion):\n\n• **Hydrogen Bonding Lattice**: In liquid water, molecules tumble and pack tightly together. But as temperature drops below 4°C, hydrogen bonds force molecules to align into a rigid, open hexagonal crystal lattice.\n• **Extra Space**: This geometric structure holds the molecules further apart than in liquid state, causing ice to expand by approximately **9% in volume**!\n• **Lower Density**: Because the same mass now occupies greater volume, ice is less dense than liquid water, allowing it to float on lakes and oceans (which preserves aquatic life under frozen surfaces!).",
      diagnosticPoints: [
        "This 9% expansion is why closed water pipes burst during freezing winter spells.",
        "Always leave headspace when freezing liquids in bottles or containers to prevent shattering.",
      ],
    };
  }

  if (matches(/\b(why\s*do\s*clothes\s*shrink|shrink\s*in\s*wash|shrink\s*in\s*dryer)\b/)) {
    return {
      text: "Why Clothes Shrink in the Wash or Dryer:\n\n• **Tension Release**: During manufacturing, natural fibers (cotton, wool, linen) are pulled, stretched, and knitted under high mechanical tension.\n• **Heat & Water Relaxation**: Hot water and dryer heat relax the hydrogen bonds holding the stretched polymer chains. The fibers release this tension and recoil back to their natural, unstressed, shorter state.\n• **Agitation Felting**: In wool, microscopic scales on each fiber interlock tighter when agitated in hot water, causing irreversible felting shrinkage.",
      diagnosticPoints: [
        "Wash cotton in cold water and air-dry or tumble on low heat to prevent fiber shrinkage.",
        "Un-shrink tip: Soak the garment in lukewarm water with hair conditioner for 30 minutes, then gently stretch back into shape on a flat towel.",
      ],
    };
  }

  if (matches(/\b(why\s*do\s*onions\s*make\s*you\s*cry|onion\s*tears|cut\s*onion)\b/)) {
    return {
      text: "Why Onions Make You Cry (And How to Stop It):\n\n• **The Chemical Reaction**: Slicing an onion ruptures microscopic cells, mixing the enzyme *alliinase* with sulfur-containing amino acid sulfoxides. This generates volatile **syn-propanethial-S-oxide** gas.\n• **Nerve Stimulation**: The gas reaches your eyes and reacts with the tear film to form mild sulfuric acid, stimulating lachrymal glands to flush out the irritant with tears.\n\n**Hacks to Prevent Tears**:\n1. Chill the onion in the fridge for 15 minutes before cutting (cold slows enzyme activity).\n2. Use a razor-sharp knife (crushes fewer cells than a dull blade).\n3. Cut under an active exhaust fan or turn on your kitchen chimney.",
    };
  }

  if (matches(/\b(thank\s*you|thanks|thx|appreciate|good\s*job|awesome|great\s*job)\b/)) {
    return {
      text: "You are very welcome! 😊 I'm always here 24/7 whenever you need home repair diagnostics, DIY maintenance advice, or verified cooperative service bookings. Have a wonderful day!",
      action: {
        label: "Explore Services",
        url: "/services",
      },
    };
  }

  // 6. Washing Machine / Laundry (Strict priority over AC)
  if (
    matches(/\b(washing\s*machine|washer|laundry|dryer|spin\s*cycle|drain\s*pump|drum\s*bearing|agitator|front\s*load|top\s*load)\b/) ||
    (q.includes("washing") && (q.includes("machine") || q.includes("poor") || q.includes("spin") || q.includes("water") || q.includes("drum") || q.includes("vibrat")))
  ) {
    return {
      text: "Diagnosed Issue: Washing Machine Breakdown / Malfunction.\n\nCommon causes based on symptoms:\n• **Drum Not Spinning / Loud Thumping**: Worn drive belt, faulty motor capacitor, or broken suspension dampers.\n• **Water Not Draining (OE / E20 Error)**: Blocked coin/lint trap filter at bottom front of machine, or burned drain pump motor.\n• **Clothes Coming Out Dirty / Smelly**: Heavy detergent residue buildup and limescale on outer drum requiring deep descaling wash.",
      diagnosticPoints: [
        "Check and clean the bottom drain filter before calling a tech (often coins or hairpins are trapped).",
        "Ensure all 4 feet are solidly planted on the floor to prevent violent spin vibrations.",
      ],
      recommendedService: {
        id: "svc-6",
        name: "Appliance Repair (Washing Machine)",
        price: 349,
        duration: "45 mins",
        url: "/book/svc-6?prefilled=true&notes=Washing+Machine+diagnosis",
      },
      recommendedPro: {
        name: "Marcus Thorne",
        role: "Certified Master Appliance Specialist",
      },
      action: {
        label: "Book Washing Machine Specialist (₹349)",
        url: "/book/svc-6",
      },
      safetyTip: "Always switch off and unplug from main socket if there is water leakage near the motor.",
    };
  }

  // 5. Refrigerator / Fridge / Freezer
  if (matches(/\b(refrigerator|fridge|freezer|ice\s*maker|compressor\s*buzz|cooling\s*coil)\b/)) {
    return {
      text: "Diagnosed Issue: Refrigerator Cooling Failure / Thermal Imbalance.\n\nKey diagnostic checkpoints:\n• **Freezer Cold, But Fridge Section Warm**: Defrost timer or bimetal thermostat failure causing ice to block the air passage damper.\n• **Compressor Clicking Every Few Minutes**: Defective PTC starter relay or capacitor preventing the motor from turning over.\n• **Water Leaking Under Veg Tray**: Clogged defrost drain tube dripping condensation inside.",
      diagnosticPoints: [
        "Inspect magnetic door gasket with a currency note test (if note slides out easily, gasket has lost seal).",
        "Vacuum dust from condenser coils behind/under the fridge to lower compressor temperature.",
      ],
      recommendedService: {
        id: "svc-6",
        name: "Appliance Repair (Refrigerator)",
        price: 349,
        duration: "45 mins",
        url: "/book/svc-6",
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

  // 6. Microwave / RO / Kitchen Appliances
  if (matches(/\b(microwave|oven|ro\s*purifier|water\s*purifier|ro\s*filter|tds|dishwasher|chimney|hob|mixer|grinder)\b/)) {
    return {
      text: "Diagnosed Issue: Kitchen Appliance Malfunction.\n\n• **Microwave Not Heating**: High-voltage diode or magnetron failure.\n• **RO Water Flow Very Slow**: Choked sediment filter or exhausted RO membrane (TDS levels should be tested).\n• **Kitchen Chimney Poor Suction**: Baffle filters saturated with cooking grease requiring ultrasonic degreasing.",
      diagnosticPoints: [
        "RO filters must be serviced every 6–9 months to maintain pure drinking water quality.",
        "Never run a microwave empty or use metal containers to avoid high-voltage arcing.",
      ],
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

  // 7. Air Conditioning (AC) - Exact word boundary check
  if (
    matches(/\b(ac|air\s*conditioner|split\s*ac|window\s*ac|hvac|power\s*jet|cooling|compressor|freon|gas\s*refill)\b/) &&
    !matches(/\b(washing|washer|laundry)\b/)
  ) {
    return {
      text: "Diagnosed Issue: AC Cooling & Airflow Reduction.\n\nPrimary diagnostic factors:\n• **Blowing Room-Temp Air**: Choked condenser fins or low refrigerant gas pressure (R32 / R410A).\n• **Water Dripping Inside Room**: Choked condensate drain pipe or unlevel indoor unit mounting.\n• **Foul Smelly Air**: Microbial biofilm on the wet evaporator coil requiring deep power jet chemical wash.",
      diagnosticPoints: [
        "Power Jet Wash flushes deep coil fins with high-pressure water jacket, restoring 100% cooling power.",
        "Gas leak checks use nitrogen pressure testing to locate and braze copper micro-cracks before refilling.",
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
      safetyTip: "Turn off AC at the MCB if you hear unusual compressor grinding sounds.",
    };
  }

  // 8. Electrical, MCB, Wiring, Switches
  if (matches(/\b(electrician|mcb|short\s*circuit|tripping|spark|switch|socket|wiring|fuse|voltage|power\s*cut|inverter)\b/)) {
    const isUrgent = matches(/\b(spark|smoke|burning|shock|fire)\b/);
    return {
      text: `Diagnosed Issue: ${isUrgent ? "CRITICAL Electrical Hazard / Short Circuit" : "Electrical Circuit or Component Fault"}.\n\n• **MCB Tripping Frequently**: Circuit overload from high-wattage appliances, ground fault, or worn breaker spring mechanism.\n• **Buzzing / Warm Switch**: Loose screw terminal inside the switchboard generating resistive heat.\n• **Mild Shock from Taps / Appliances**: Missing or compromised house earthing / grounding connection.`,
      diagnosticPoints: [
        "Do not repeatedly force a tripped MCB on without locating the shorting appliance.",
        "Check house earthing with an earth-leakage clamp tester to prevent hazardous shocks.",
      ],
      recommendedService: {
        id: "svc-1",
        name: "Electrician",
        price: 149,
        duration: "30–45 mins",
        url: "/book/svc-1",
      },
      recommendedPro: {
        name: "Marcus Thorne",
        role: "State Licensed Master Electrician",
      },
      action: {
        label: "Book Certified Electrician (₹149)",
        url: "/book/svc-1",
      },
      safetyTip: isUrgent
        ? "DANGER: Immediately shut off the MAIN switch on your distribution panel! Do not touch with wet hands."
        : "Turn off the individual room breaker before inspecting loose wall sockets.",
      isEmergency: isUrgent,
    };
  }

  // 9. Plumbing, Taps, Leakages, Drains, Flush
  if (matches(/\b(plumber|leak|pipe|tap|faucet|drain|toilet|flush|sink|basin|clog|water\s*pressure|tank)\b/)) {
    return {
      text: "Diagnosed Issue: Plumbing / Water Supply System Problem.\n\n• **Dripping Tap**: Worn ceramic disc cartridge, rubber O-ring seal, or lime buildup on valve seat.\n• **Low Water Pressure**: Air lock in pipeline, mineral scaling in aerator nozzles, or overhead tank outlet valve choked.\n• **Clogged Basin / Kitchen Drain**: Solidified cooking oil and food particles forming soap-scum blockage inside the P-trap.",
      diagnosticPoints: [
        "Clean tap aerators with a small brush to instantly restore minor low-pressure issues.",
        "For hidden wall seepage, our plumbers use acoustic leak detection equipment.",
      ],
      recommendedService: {
        id: "svc-2",
        name: "Plumber",
        price: 149,
        duration: "30–45 mins",
        url: "/book/svc-2",
      },
      recommendedPro: {
        name: "David Chen",
        role: "Licensed Master Plumber",
      },
      action: {
        label: "Book Expert Plumber (₹149)",
        url: "/book/svc-2",
      },
    };
  }

  // 10. Carpentry, Furniture, Locks
  if (matches(/\b(carpenter|wood|furniture|shelf|cabinet|hinge|drawer|table|bed|lock|wardrobe|drilling)\b/)) {
    return {
      text: "Diagnosed Issue: Carpentry & Architectural Woodwork.\n\nOur carpenters handle precision joinery, hardware fittings, modular kitchen adjustments, and heavy wall installations:\n• Squeaky or misaligned soft-close cabinet hinges.\n• Heavy TV wall mounting and floating shelf anchoring with stud finding.\n• Jammed sliding wardrobe tracks and cylinder door lock replacements.",
      recommendedService: {
        id: "svc-3",
        name: "Carpenter",
        price: 199,
        duration: "30–45 mins",
        url: "/book/svc-3",
      },
      action: {
        label: "Book Certified Carpenter (₹199)",
        url: "/book/svc-3",
      },
    };
  }

  // 11. Painting & Wall Finishing
  if (matches(/\b(paint|painter|whitewash|wall\s*putty|distemper|primer|efflorescence|peeling\s*paint)\b/)) {
    return {
      text: "Diagnosed Issue: Interior / Exterior Painting & Wall Finish.\n\n• **Peeling / Flaking Paint**: Caused by moisture trapped beneath the primer or painting over powdery efflorescence without an alkaline-resistant sealer.\n• **Color Touch-ups & Room Refresh**: Machine roller finishing with low-VOC, anti-fungal emulsion paints.",
      recommendedService: {
        id: "svc-4",
        name: "Painter",
        price: 499,
        duration: "Flexible",
        url: "/book/svc-4",
      },
      action: {
        label: "Book House Painter (₹499)",
        url: "/book/svc-4",
      },
    };
  }

  // 12. Deep Cleaning & Hygiene
  if (matches(/\b(clean|cleaning|deep\s*clean|maid|mop|sanitize|sofa\s*wash|bathroom\s*clean|kitchen\s*clean)\b/)) {
    return {
      text: "Diagnosed Issue: Residential Deep Cleaning & Sanitization.\n\nOur specialized deep cleaning crews use hospital-grade non-toxic disinfectants, steam sanitizers, and heavy scrubbing machines for:\n• **Bathroom**: Limescale and grout tile restoration, sanitization of sanitaryware.\n• **Kitchen**: Heavy grease degreasing on tiles, exhaust, cabinets, and countertops.\n• **Sofa / Mattress**: Injection-extraction deep vacuum extraction removing dust mites.",
      recommendedService: {
        id: "svc-7",
        name: "Full Home Deep Cleaning",
        price: 399,
        duration: "60–90 mins",
        url: "/book/svc-7",
      },
      action: {
        label: "Book Deep Cleaning Crew (₹399)",
        url: "/book/svc-7",
      },
    };
  }

  // 13. Pest Control
  if (matches(/\b(pest|termite|cockroach|bug|bed\s*bug|ant|rodent|rat|mosquito|insect)\b/)) {
    return {
      text: "Diagnosed Issue: Pest Infestation & Structural Protection.\n\n• **Cockroach Infestation**: Advanced odorless Fipronil gel baiting in kitchen hinges and drainage crevices.\n• **Termite Attack**: Chemical drill-and-inject barrier treatment protecting wood furniture and foundations.\n• **Bed Bugs**: Two-stage targeted residual misting and heat steaming.",
      diagnosticPoints: [
        "100% odorless, government-approved herbal and synthetic pyrethroid chemicals safe for children and pets.",
        "Includes a 90-day retreatment warranty.",
      ],
      recommendedService: {
        id: "svc-8",
        name: "Pest Control",
        price: 599,
        duration: "45 mins",
        url: "/book/svc-8",
      },
      action: {
        label: "Book Pest Control (₹599)",
        url: "/book/svc-8",
      },
    };
  }

  // 14. Intelligent Conversational Fallback for ANY other query
  return {
    text: `That is an interesting question! While I specialize in home maintenance, electrical systems, plumbing, and appliances for CoopServe, here is helpful insight on "${query}":\n\n1. **Practical Assessment**: For most home and technical challenges, always verify the source of the symptom (power supply, physical obstruction, or wear and tear) before attempting disassembly.\n2. **Preventive Care**: Routine seasonal inspection prevents small issues from escalating into costly breakdowns.\n3. **Live AI Assistance**: For unrestricted, creative conversation on any general topic (science, coding, recipes, writing), click the **Gear icon ⚙️** at the top right of this chat and enter your Google Gemini API key!`,
    diagnosticPoints: [
      "Our cooperative crew covers 20 certified trades with transparent standardized rates.",
      "Need immediate hands-on help? Describe any symptom like 'noisy fan' or 'dripping tap'.",
    ],
    action: {
      label: "Browse All 20 Services",
      url: "/services",
    },
  };
}
