const OPENAI_API_KEY = String(
  process.env.OPENAI_API_KEY || process.env.AI_ASSISTANT_API_KEY || ""
).trim();
const OPENAI_MODEL = String(
  process.env.OPENAI_MODEL || process.env.AI_ASSISTANT_MODEL || "gpt-4.1-mini"
).trim();
const OPENAI_API_URL = String(
  process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions"
).trim();

const commonBreeds = [
  "labrador",
  "golden retriever",
  "german shepherd",
  "beagle",
  "pug",
  "indie",
  "indian pariah",
  "shihtzu",
  "shih tzu",
  "husky",
  "rottweiler",
  "doberman",
  "pomeranian",
  "spitz",
  "cocker spaniel",
  "dachshund",
  "boxer",
  "great dane",
  "saint bernard",
  "poodle",
];

const emergencyKeywords = [
  "blood",
  "bloody stool",
  "bloody vomit",
  "cannot breathe",
  "can't breathe",
  "collapsed",
  "collapse",
  "fainted",
  "foaming",
  "poison",
  "poisoned",
  "seizure",
  "seizures",
  "not eating",
  "refusing food",
  "cannot stand",
  "can't stand",
  "not walking",
  "rapid breathing",
];

const issueProfiles = [
  {
    id: "digestive",
    label: "digestive discomfort",
    keywords: [
      "vomit",
      "vomiting",
      "diarrhea",
      "diarrhoea",
      "loose stool",
      "stool",
      "poop",
      "constipation",
      "gas",
      "bloated",
      "bloating",
      "tummy",
      "stomach",
      "appetite",
      "not eating",
    ],
    analysis:
      "This sounds closest to a digestion-related issue. That can happen when food is not sitting well, the routine changed suddenly, treats were too rich, or the gut is feeling stressed.",
    morningPlan:
      "Start the day with fresh water, a calm potty walk, and a measured breakfast so you can watch appetite, stool quality, and belly comfort.",
    afternoonPlan:
      "Keep movement gentle, avoid lots of random treats, and give the stomach a quieter stretch in the middle of the day.",
    eveningPlan:
      "Serve dinner on time, skip oily leftovers, and keep an eye on vomiting, diarrhea, or obvious bloating before bedtime.",
    dietTips: [
      "Avoid sudden food changes and rich table scraps while the stomach feels unsettled.",
      "Offer smaller measured meals instead of overloading one feeding.",
      "Track stool, appetite, and any foods that seem to trigger discomfort.",
    ],
  },
  {
    id: "dental",
    label: "oral care trouble",
    keywords: [
      "bad breath",
      "breath",
      "teeth",
      "tooth",
      "gums",
      "gum",
      "plaque",
      "tartar",
      "mouth",
      "drool",
      "drooling",
      "chewing",
      "dental",
    ],
    analysis:
      "The pattern points toward mouth or dental discomfort. Bad breath, chewing hesitation, plaque build-up, or gum irritation often show up slowly and then start affecting appetite and mood.",
    morningPlan:
      "Do a quick look at the mouth before breakfast, notice breath changes, and offer food in a calm setting where chewing looks comfortable.",
    afternoonPlan:
      "Use easy chewing options and short check-ins instead of rough mouth play if the gums or teeth seem sensitive.",
    eveningPlan:
      "Finish the day by noticing breath, drool, chewing behavior, and whether one side of the mouth seems more uncomfortable.",
    dietTips: [
      "Choose routine-friendly food habits and avoid constant sugary or sticky extras.",
      "Watch for reluctance to chew, pawing at the mouth, or extra drooling.",
      "A simple daily oral-care habit usually works better than occasional deep efforts.",
    ],
  },
  {
    id: "joint",
    label: "mobility or joint stiffness",
    keywords: [
      "joint",
      "stiff",
      "stiffness",
      "limp",
      "limping",
      "stairs",
      "arthritis",
      "hip",
      "elbow",
      "mobility",
      "leg pain",
      "difficulty walking",
    ],
    analysis:
      "This feels more like a mobility or joint comfort concern. It often shows up as slower movement, stiffness after rest, hesitation with stairs, or less interest in play.",
    morningPlan:
      "Begin with a slow warm-up walk, easy stretching through normal movement, and a non-rushed breakfast routine.",
    afternoonPlan:
      "Use shorter, controlled activity instead of jump-heavy play, and give plenty of traction on slippery floors.",
    eveningPlan:
      "End the day with a gentle walk, a warm and comfortable resting spot, and less stair use if movement looks stiff.",
    dietTips: [
      "Keep body weight in a comfortable range because extra weight can add joint pressure.",
      "Favor consistent low-impact movement over weekend-style bursts of hard exercise.",
      "Use rugs or traction where your dog usually slips or hesitates.",
    ],
  },
  {
    id: "skin",
    label: "skin or coat sensitivity",
    keywords: [
      "itch",
      "itching",
      "scratch",
      "scratching",
      "skin",
      "coat",
      "allergy",
      "allergies",
      "dandruff",
      "hot spot",
      "shedding",
      "redness",
    ],
    analysis:
      "This sounds like skin or coat sensitivity. Scratching, licking, redness, or heavy shedding can be linked to irritation, allergies, grooming gaps, or broader nutrition support needs.",
    morningPlan:
      "Check the skin quickly during the first petting session, look at paws and ears, and start meals on a consistent schedule.",
    afternoonPlan:
      "Wipe paws after outdoor time when needed and keep the coat brushed so you notice redness or flakes early.",
    eveningPlan:
      "Use calm brushing or coat checks at night and note whether the scratching gets worse after meals, walks, or bedding changes.",
    dietTips: [
      "Stay consistent with meals so it is easier to notice what helps or irritates the skin.",
      "Keep bedding, paws, and high-contact spots clean and dry.",
      "Track flare-ups around weather, treats, grooming products, or outdoor exposure.",
    ],
  },
  {
    id: "energy",
    label: "energy, mood, or routine stress",
    keywords: [
      "low energy",
      "tired",
      "fatigue",
      "fatigued",
      "lethargic",
      "lethargy",
      "weak",
      "anxious",
      "anxiety",
      "restless",
      "not sleeping",
      "sleeping all day",
      "sad",
      "behavior",
      "barking too much",
    ],
    analysis:
      "This looks like a daily routine, stress, or low-energy concern. Changes in energy, sleep, restlessness, or mood can sometimes be tied to discomfort, overstimulation, or not enough routine predictability.",
    morningPlan:
      "Keep wake-up, walk, and breakfast timing steady so the day starts with a predictable rhythm.",
    afternoonPlan:
      "Use a balanced mix of calm enrichment and light movement instead of letting the day swing between boredom and overexcitement.",
    eveningPlan:
      "Give a gentle wind-down routine with quiet time, consistent dinner timing, and a calm sleep setup.",
    dietTips: [
      "Stay steady with mealtimes, sleep cues, and exercise timing for a few days before judging progress.",
      "Notice whether energy dips happen around heat, overactivity, skipped meals, or poor sleep.",
      "Add enrichment that settles the mind instead of only high-intensity stimulation.",
    ],
  },
  {
    id: "general",
    label: "general wellness support",
    keywords: [],
    analysis:
      "There is enough here to say your dog could use calmer observation and routine support, even if the exact cause is not fully clear yet.",
    morningPlan:
      "Start with water, a calm walk, and a consistent breakfast so you can notice appetite, energy, and mood early.",
    afternoonPlan:
      "Keep movement moderate, hydration easy to access, and the middle of the day predictable.",
    eveningPlan:
      "Wrap up with dinner on schedule, a little calm engagement, and a final comfort check before sleep.",
    dietTips: [
      "Keep meals measured and consistent for a few days so patterns become easier to spot.",
      "Track appetite, bathroom changes, energy, and any obvious triggers.",
      "Use simple routines before changing too many things at once.",
    ],
  },
];

const productCatalog = {
  "everyday-one": {
    productId: "everyday-one",
    name: "45 in 1 Everyday Daily Multivitamin",
    route: "/product",
  },
  "doggie-dental": {
    productId: "doggie-dental",
    name: "Doggie Dental Powder",
    route: "/doggie-dental",
  },
  "daily-duo": {
    productId: "daily-duo",
    name: "Daily Duo: Multivitamin + Dental Powder",
    route: "/daily-duo",
  },
};

const cleanText = (value = "") =>
  String(value)
    .replace(/\s+/g, " ")
    .trim();

const capitalizeSentence = (value = "") => {
  const normalizedValue = cleanText(value);

  if (!normalizedValue) {
    return "";
  }

  return normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1);
};

const dedupeList = (items) => {
  const seen = new Set();

  return items.filter((item) => {
    const normalizedValue = cleanText(item).toLowerCase();

    if (!normalizedValue || seen.has(normalizedValue)) {
      return false;
    }

    seen.add(normalizedValue);
    return true;
  });
};

const extractAgeContext = (description = "") => {
  const normalizedDescription = String(description);
  const yearMatch = normalizedDescription.match(
    /(\d+(?:\.\d+)?)\s*(?:year|years|yr|yrs)\s*(?:old)?/i
  );

  if (yearMatch) {
    const years = Number(yearMatch[1]);

    if (!Number.isFinite(years)) {
      return null;
    }

    return {
      label: `${years} year${years === 1 ? "" : "s"} old`,
      stage: years >= 7 ? "senior" : years < 1 ? "puppy" : "adult",
    };
  }

  const monthMatch = normalizedDescription.match(
    /(\d+(?:\.\d+)?)\s*(?:month|months|mo|mos)\s*(?:old)?/i
  );

  if (!monthMatch) {
    return null;
  }

  const months = Number(monthMatch[1]);

  if (!Number.isFinite(months)) {
    return null;
  }

  return {
    label: `${months} month${months === 1 ? "" : "s"} old`,
    stage: "puppy",
  };
};

const extractBreedContext = (description = "") => {
  const normalizedDescription = String(description).toLowerCase();
  const matchedBreed = commonBreeds.find((breed) => normalizedDescription.includes(breed));

  if (!matchedBreed) {
    return null;
  }

  return matchedBreed
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const detectMatchedProfiles = (description = "") => {
  const normalizedDescription = String(description).toLowerCase();
  const matches = issueProfiles
    .map((profile) => {
      const score = profile.keywords.reduce((runningTotal, keyword) => {
        return runningTotal + (normalizedDescription.includes(keyword) ? 1 : 0);
      }, 0);

      return {
        profile,
        score,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((firstEntry, secondEntry) => secondEntry.score - firstEntry.score)
    .slice(0, 3)
    .map((entry) => entry.profile);

  if (matches.length > 0) {
    return matches;
  }

  return [issueProfiles.find((profile) => profile.id === "general")];
};

const buildSafetyNote = (description = "") => {
  const normalizedDescription = String(description).toLowerCase();
  const hasEmergencySignal = emergencyKeywords.some((keyword) =>
    normalizedDescription.includes(keyword)
  );

  if (!hasEmergencySignal) {
    return "";
  }

  return "Because you mentioned potentially urgent signs, please contact a vet as soon as possible, especially if your dog is struggling to breathe, unable to stand, has blood in vomit or stool, or keeps refusing food and water.";
};

const buildContextSentence = ({ ageContext, breedContext, profiles }) => {
  const contextBits = [];

  if (ageContext?.stage === "senior") {
    contextBits.push(
      `Because you mentioned a ${ageContext.label} dog, age-related comfort and recovery can play a bigger role here.`
    );
  } else if (ageContext?.stage === "puppy") {
    contextBits.push(
      `Because you mentioned a ${ageContext.label} dog, a gentle and very consistent routine matters even more.`
    );
  }

  if (breedContext) {
    contextBits.push(
      `${breedContext} dogs can sometimes show patterns a little differently, so it helps to watch energy, appetite, and comfort together instead of focusing on only one symptom.`
    );
  }

  if (profiles.length > 1) {
    const secondaryLabels = profiles
      .slice(1)
      .map((profile) => profile.label)
      .join(" and ");
    contextBits.push(`I would also keep an eye on how this overlaps with ${secondaryLabels}.`);
  }

  return contextBits.join(" ");
};

const buildProblemUnderstanding = ({ ageContext, breedContext, profiles, safetyNote }) => {
  const primaryProfile = profiles[0];
  const contextSentence = buildContextSentence({
    ageContext,
    breedContext,
    profiles,
  });

  return cleanText([primaryProfile.analysis, contextSentence, safetyNote].join(" "));
};

const buildRoutineSection = (profiles, key) => {
  const [primaryProfile, ...secondaryProfiles] = profiles;
  const additions = secondaryProfiles
    .map((profile) => cleanText(profile[key]))
    .filter(Boolean)
    .slice(0, 1);

  return cleanText([primaryProfile?.[key] || "", ...additions].join(" "));
};

const buildDietAndCareTips = (profiles, safetyNote) => {
  const tips = profiles.flatMap((profile) => profile.dietTips || []);

  if (safetyNote) {
    tips.push("If urgent symptoms are escalating, skip home experimentation and call your vet quickly.");
  }

  tips.push("Keep fresh water available and note any sudden change in appetite, sleep, or behavior.");

  return dedupeList(tips).slice(0, 5).map(capitalizeSentence);
};

const buildProductReason = (productId, profiles) => {
  const profileIds = profiles.map((profile) => profile.id);
  const hasDental = profileIds.includes("dental");
  const hasGeneralSupportConcern = profileIds.some((id) =>
    ["digestive", "joint", "skin", "energy", "general"].includes(id)
  );

  if (productId === "doggie-dental") {
    return "A good fit when bad breath, plaque, tartar, chewing discomfort, or gum support is part of the concern.";
  }

  if (productId === "daily-duo") {
    return "Helpful when you want body wellness and oral care covered in one repeatable daily routine.";
  }

  if (hasGeneralSupportConcern || hasDental) {
    return "Supports a more complete daily wellness routine for digestion, immunity, mobility, skin, and overall consistency.";
  }

  return "Useful as everyday support when you want broader wellness coverage built into one simple habit.";
};

const buildRecommendedProducts = (profiles) => {
  const profileIds = profiles.map((profile) => profile.id);
  const productIds = [];

  if (profileIds.includes("dental") && profileIds.length > 1) {
    productIds.push("daily-duo");
  }

  if (profileIds.includes("dental")) {
    productIds.push("doggie-dental");
  }

  if (profileIds.some((id) => ["digestive", "joint", "skin", "energy", "general"].includes(id))) {
    productIds.push("everyday-one");
  }

  if (productIds.length === 0) {
    productIds.push("everyday-one");
  }

  if (!productIds.includes("daily-duo") && profileIds.length > 1) {
    productIds.push("daily-duo");
  }

  return dedupeList(productIds)
    .slice(0, 3)
    .map((productId) => ({
      ...productCatalog[productId],
      reason: buildProductReason(productId, profiles),
    }));
};

const buildFinalNote = ({ ageContext, safetyNote }) => {
  const stageNote =
    ageContext?.stage === "senior"
      ? "Senior dogs really benefit from gentle consistency and early attention to small changes."
      : ageContext?.stage === "puppy"
        ? "Young dogs usually do best when routines stay simple, calm, and very steady."
        : "Small, consistent daily habits make a bigger difference than occasional big efforts.";

  const urgencyLine = safetyNote
    ? "If anything feels worse or more urgent, please let a vet step in quickly."
    : "If the pattern keeps going, gets worse, or starts affecting eating, sleep, or comfort, a vet check is the safest next move.";

  return cleanText(
    `${stageNote} You are doing the right thing by paying attention early, and that kind of care goes a long way in keeping your dog comfortable, happy, and full of life. ${urgencyLine}`
  );
};

const buildFallbackDogHealthPlan = (description = "") => {
  const ageContext = extractAgeContext(description);
  const breedContext = extractBreedContext(description);
  const profiles = detectMatchedProfiles(description);
  const safetyNote = buildSafetyNote(description);

  return {
    source: "guided",
    safetyNote,
    problemUnderstanding: buildProblemUnderstanding({
      ageContext,
      breedContext,
      profiles,
      safetyNote,
    }),
    dailyRoutine: {
      morning: buildRoutineSection(profiles, "morningPlan"),
      afternoon: buildRoutineSection(profiles, "afternoonPlan"),
      evening: buildRoutineSection(profiles, "eveningPlan"),
    },
    dietAndCareTips: buildDietAndCareTips(profiles, safetyNote),
    recommendedProducts: buildRecommendedProducts(profiles),
    finalNote: buildFinalNote({ ageContext, safetyNote }),
  };
};

const parseJsonReply = (value = "") => {
  const normalizedValue = cleanText(value)
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  if (!normalizedValue) {
    return null;
  }

  return JSON.parse(normalizedValue);
};

const sanitizeModelGuidance = (value, fallbackValue) => {
  const normalizedValue = cleanText(value);
  return normalizedValue ? normalizedValue : fallbackValue;
};

const sanitizeModelArray = (value, fallbackValue) => {
  if (!Array.isArray(value)) {
    return fallbackValue;
  }

  const normalizedItems = dedupeList(
    value.map((item) => sanitizeModelGuidance(item, "")).filter(Boolean)
  )
    .slice(0, 5)
    .map(capitalizeSentence);

  return normalizedItems.length > 0 ? normalizedItems : fallbackValue;
};

const generateOpenAiSections = async ({ description, fallbackResponse }) => {
  if (!OPENAI_API_KEY) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  const systemPrompt = [
    "You are a professional AI Pet Health Assistant.",
    "A user will describe their dog's problem, behavior, or health concern.",
    "Understand the issue deeply, identify likely causes if mentioned, create a simple daily routine, suggest diet and care habits, and end with a warm reassuring note.",
    "Keep the tone caring, clear, friendly, and not too technical.",
    "Do not prescribe medication or claim certainty.",
    "If symptoms sound urgent, clearly advise a vet check.",
    "Return only JSON with this exact shape:",
    '{"problemUnderstanding":"string","dailyRoutine":{"morning":"string","afternoon":"string","evening":"string"},"dietAndCareTips":["string"],"finalNote":"string"}',
  ].join(" ");

  const userPrompt = [
    `Dog description: ${description}`,
    "Build supportive care guidance using concise natural language.",
    "Keep each daily routine field to 1-2 sentences.",
    "Keep dietAndCareTips to 3-5 short tips.",
  ].join("\n");

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.7,
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    const rawResponseText = await response.text();

    if (!response.ok) {
      throw new Error(rawResponseText || "AI request failed.");
    }

    const parsedPayload = JSON.parse(rawResponseText || "{}");
    const rawContent = parsedPayload?.choices?.[0]?.message?.content || "";
    const parsedContent = parseJsonReply(rawContent);

    if (!parsedContent || typeof parsedContent !== "object") {
      return null;
    }

    return {
      source: "ai",
      problemUnderstanding: sanitizeModelGuidance(
        parsedContent.problemUnderstanding,
        fallbackResponse.problemUnderstanding
      ),
      dailyRoutine: {
        morning: sanitizeModelGuidance(
          parsedContent.dailyRoutine?.morning,
          fallbackResponse.dailyRoutine.morning
        ),
        afternoon: sanitizeModelGuidance(
          parsedContent.dailyRoutine?.afternoon,
          fallbackResponse.dailyRoutine.afternoon
        ),
        evening: sanitizeModelGuidance(
          parsedContent.dailyRoutine?.evening,
          fallbackResponse.dailyRoutine.evening
        ),
      },
      dietAndCareTips: sanitizeModelArray(
        parsedContent.dietAndCareTips,
        fallbackResponse.dietAndCareTips
      ),
      finalNote: sanitizeModelGuidance(parsedContent.finalNote, fallbackResponse.finalNote),
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

export const buildDogHealthAssistantReply = async ({ description = "" } = {}) => {
  const fallbackResponse = buildFallbackDogHealthPlan(description);

  try {
    const modelSections = await generateOpenAiSections({
      description,
      fallbackResponse,
    });

    if (!modelSections) {
      return fallbackResponse;
    }

    return {
      ...fallbackResponse,
      ...modelSections,
    };
  } catch {
    return fallbackResponse;
  }
};

