/**
 * Prebid.js Header Tag — Prebid Stack Builder v3.0
 * Publisher
 * Aangemaakt: 30-9-2026
 *
 * MODULES: consentManagementTcf, tcfControl, gptPreAuction, priceFloors, currency, nativeRendering, sizeMapping, video, debugging, sharedIdSystem
 * HOST: zie script host instelling
 */

/* ═══════════════════════════════════════════════════════════════════════
   ADTECHTOOL — publisher context object
   Beschikbaar als window.ADTECHTOOL voor targeting en debugging
   ═══════════════════════════════════════════════════════════════════════ */
var ADTECHTOOL = window.ADTECHTOOL || {};

(function initADTECHTOOL() {
  // Screen size detectie
  var width = document.documentElement.clientWidth;
  var screenSize;
  if (width <= 768)        screenSize = "small";
  else if (width <= 1024)  screenSize = "medium";
  else if (width <= 1264)   screenSize = "large";
  else                             screenSize = "extralarge";

  // Taal detectie
  var primaryLang = document.documentElement.lang.toLowerCase().split("-")[0] || "unknown";

  // Zet alle publisher metadata
  Object.assign(ADTECHTOOL, {
    siteSlug:   "website.nl",
    schainAsi:  "website.nl",
    schainSid:  "TODO_GAM_NETWORK",
    // amazonSid: "TODO",
    categories: true,
    centering:  true,
    adhesive:   false,
    adrefresh:  false,
    ivtBlockingEnabled: false,
    screensize: screenSize,
    language:   primaryLang,
    pagetype:   null  // Stel in via ADTECHTOOL.setPageType()
  });

  // Helper om pagetype in te stellen
  ADTECHTOOL.setPageType = function(type) {
    console.log("[ADTECHTOOL] pagetype:", type);
    ADTECHTOOL.pagetype = type;
  };

  // Bekende pagetypes:
  //   ADTECHTOOL.setPageType("article"); // Artikel pagina
  //   ADTECHTOOL.setPageType("homepage"); // Voorpagina
  //   ADTECHTOOL.setPageType("section"); // Sectie/rubriek pagina
})();

/* ═══════════════════════════════════════════════════════════════════════
   sChain object
   ═══════════════════════════════════════════════════════════════════════ */
var SCHAIN = {
  ver: "1.0",
  complete: 1,
  nodes: [{ asi: "website.nl", hp: 1, sid: "TODO_GAM_NETWORK" }]
};

/* ═══════════════════════════════════════════════════════════════════════
   Google Publisher Tag (GPT)
   ═══════════════════════════════════════════════════════════════════════ */
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];

googletag.cmd.push(function () {

  // ── Responsive size mappings ────────────────────────────────────────
  var mappingBillboard = googletag.sizeMapping()
    .addSize([1024, 0], [[728,90],[970,90],[970,250]])
    .addSize([768,  0], [[728,90]])
    .addSize([0,    0], []).build();

  var mappingBillboardSkin = googletag.sizeMapping()
    .addSize([1265, 0], [[728,90],[970,90],[970,250],[10,10]])
    .addSize([1024, 0], [[728,90],[970,90],[970,250],[1,1]])
    .addSize([768,  0], [[728,90]])
    .addSize([0,    0], []).build();

  var mappingLeaderboard = googletag.sizeMapping()
    .addSize([1024, 0], [[728,90]])
    .addSize([768,  0], [[728,90]])
    .addSize([0,    0], []).build();

  var mappingSkyscraper = googletag.sizeMapping()
    .addSize([1024, 0], [[160,600],[120,600]])
    .addSize([768,  0], [[120,600],[160,600]])
    .addSize([0,    0], []).build();

  var mappingHpa = googletag.sizeMapping()
    .addSize([768,  0], [[300,250],[120,600],[160,600],[300,600]])
    .addSize([0,    0], []).build();

  var mappingMediumRectangle = googletag.sizeMapping()
    .addSize([768,  0], [[300,250]])
    .addSize([0,    0], []).build();

  var mappingLargeRectangle = googletag.sizeMapping()
    .addSize([768,  0], [[336,280],[300,250]])
    .addSize([0,    0], []).build();

  var mappingMobile = googletag.sizeMapping()
    .addSize([768,  0], [])
    .addSize([0,    0], [[300,250],[320,240],[300,100],[300,50],[320,50],[320,100]]).build();

  var mappingMobileLeaderboard = googletag.sizeMapping()
    .addSize([768,  0], [])
    .addSize([0,    0], [[300,100],[320,100],[300,50],[320,50]]).build();

  var mappingInterscroller = googletag.sizeMapping()
    .addSize([768,  0], [])
    .addSize([0,    0], [[320,500],[300,250],[320,240],[300,600],[300,100],[300,50],[320,50],[320,100]]).build();

  var ATT_SLOT_MAPPING = {
    "BILLBOARD":       { sizes: [[728,90],[970,90],[970,250]],                      mapping: mappingBillboard },
    "BILLBOARDSKIN":   { sizes: [[728,90],[970,90],[970,250],[10,10]],              mapping: mappingBillboardSkin },
    "LEADERBOARD":     { sizes: [[728,90]],                                         mapping: mappingLeaderboard },
    "SKYSCRAPER":      { sizes: [[160,600],[120,600]],                              mapping: mappingSkyscraper },
    "HPA":             { sizes: [[300,250],[120,600],[160,600],[300,600]],          mapping: mappingHpa },
    "MEDIUMRECTANGLE": { sizes: [[300,250]],                                        mapping: mappingMediumRectangle },
    "LARGERECTANGLE":  { sizes: [[336,280],[300,250]],                              mapping: mappingLargeRectangle },
    "MOBILERECTANGLE": { sizes: [[300,250],[320,240],[300,100],[300,50],[320,50],[320,100]], mapping: mappingMobile },
    "MOBILELEADERBOARD":{ sizes: [[300,100],[320,100],[300,50],[320,50]],           mapping: mappingMobileLeaderboard },
    "INTERSCROLLER":   { sizes: [[320,500],[300,250],[320,240],[300,600],[300,100],[300,50],[320,50],[320,100]], mapping: mappingInterscroller },
    "NATIVE":          { sizes: ["fluid"],                                          mapping: ["fluid"] }
  };

  var gptSlots = [];
  var clientWidth = document.documentElement.clientWidth;

  // ── GPT configuratie ──────────────────────────────────────────────────
  googletag.pubads().disableInitialLoad();
  googletag.pubads().enableSingleRequest();
  googletag.pubads().collapseEmptyDivs(true);
  googletag.pubads().setCentering(true);
  // disableVisibilityPolicyService — voorkomt dat lazy-loaded divs als niet-zichtbaar worden gelabeld
  googletag.pubads().disableVisibilityPolicyService();

  // ── Lazy load instellingen ────────────────────────────────────────────
  googletag.pubads().enableLazyLoad({
    fetchMarginPercent:  100,
    renderMarginPercent: 25,
    mobileScaling:       1
  });

  // ── Lazy load event listeners (debug via ?adtech in URL) ─────────────
  googletag.pubads().addEventListener("slotRequested", function(event) {
    if (window.location.search.indexOf("adtech") > -1) {
      console.log("[ATT] slotRequested:", event.slot.getSlotElementId());
    }
  });
  googletag.pubads().addEventListener("slotOnload", function(event) {
    if (window.location.search.indexOf("adtech") > -1) {
      console.log("[ATT] slotOnload:", event.slot.getSlotElementId());
    }
  });

  // ── PageType en test targeting ─────────────────────────────────────────
  if (ADTECHTOOL.pagetype) {
    googletag.pubads().setTargeting("PageType", ADTECHTOOL.pagetype);
  }
  if (window.location.search.indexOf("adtech_test") > -1) {
    googletag.pubads().setTargeting("is_test_environment", "true");
  }

  // ── ADTECHTOOL → GAM targeting loop ──────────────────────────────────
  // Alle ADTECHTOOL keys worden automatisch als GAM key-values ingesteld
  try {
    var attKeys = Object.entries(ADTECHTOOL);
    for (var k = 0; k < attKeys.length; k++) {
      var key = attKeys[k][0];
      var val = attKeys[k][1];
      if (typeof val === "string" && val.length > 0) {
        googletag.pubads().setTargeting(key, val);
      } else if (Array.isArray(val) && val.length > 0) {
        googletag.pubads().setTargeting(key, val);
      } else if (typeof val === "boolean") {
        googletag.pubads().setTargeting(key, String(val));
      }
    }
  } catch(e) { console.warn("[ATT] Targeting loop fout:", e); }

  googletag.enableServices();
});

/* ═══════════════════════════════════════════════════════════════════════
   Prebid.js — configuratie loopt PARALLEL aan GPT (niet erin genest)
   Zie: developers.google.com/publisher-ads-audits/reference/audits/gpt-bids-parallel
   ═══════════════════════════════════════════════════════════════════════ */
var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function () {
  pbjs.setConfig({
    bidderTimeout:      1500,
    maxRequestsPerOrigin: 4,
    enableSendAllBids:  true,
    useBidCache:        true,
    enableTIDs:         true,

    debug: (window.location.search.indexOf("pbjs_debug=true") > -1),

    priceGranularity: "dense",

    // ── GPT Pre-Auction (GPID) ────────────────────────────────────────
    gptPreAuction: {
      useDefaultPreAuction: true
    },

    // ── Consent Management (TCF 2.2) ──────────────────────────────────
    consentManagement: {
      gdpr: {
        cmpApi:           "iab",
        timeout:          2500,
        actionTimeout:    10000,
        defaultGdprScope: true,

        rules: [
      { purpose: "storage",            enforcePurpose: true, enforceVendor: true },
      { purpose: "basicAds",           enforcePurpose: true, enforceVendor: true },
      { purpose: "personalizedAds",    enforcePurpose: true, enforceVendor: true, eidsRequireP4Consent: true },
      { purpose: "measurement",        enforcePurpose: true, enforceVendor: true },
      { purpose: "transmitPreciseGeo", enforcePurpose: true }
        ]
      }

    },

    // ── User IDs & User Sync ──────────────────────────────────────────
    userSync: {
      userIds: [
      { name: "sharedId", params: { syncTime: 86400 }, storage: { name: "sharedid", type: "cookie", expires: 28 } }
      ],
      filterSettings: { all: { bidders: "*", filter: "include" } },
      syncDelay:      2000,
      syncsPerBidder: 5
    },

    // ── Price Floors ──────────────────────────────────────────────────
    floors: {
      enforcement: { enforceJS: true, enforcePBS: false },
      data: {
        currency: "EUR", skipRate: 0,
        schema: { fields: ["mediaType", "size"] },
        values: {
          'banner|300x250': 0.50,
          'banner|728x90': 0.40,
          'banner|160x600': 0.35,
          'banner|320x50': 0.20,
          'banner|970x250': 0.75,
          'banner|*': 0.30,
          'video|*': 1.50,
          'native|*': 0.40
        }
      },
    },

    // ── Currency ──────────────────────────────────────────────────────
    currency: {
      adServerCurrency:     "EUR",
      granularityMultiplier: 1,
      defaultRates: {
            "USD": {
                  "EUR": 0.92
            },
            "GBP": {
                  "EUR": 1.17
            }
      }
    },

    // ── Prebid Cache (voor video) ─────────────────────────────────────
    cache: { url: "https://prebid.adnxs.com/pbc/v1/cache" }

  }); // einde setConfig

  // ── sChain per bidder ─────────────────────────────────────────────
  pbjs.setBidderConfig({
    bidders: ["*"],
    config: { schain: SCHAIN }
  });

  // ── Bidder Settings ───────────────────────────────────────────────
  pbjs.bidderSettings = {
    standard: {
      suppressEmptyKeys:         true,
      storageAllowed:            true,
      allowAlternateBidderCodes: true,
      adserverTargeting: [
        { key: "hb_bidder",  val: function(bid) { return bid.bidderCode; } },
        { key: "hb_adid",    val: function(bid) { return bid.adId; } },
        { key: "hb_pb",      val: function(bid) { return bid.pbDg; } },
        { key: "hb_size",    val: function(bid) { return bid.size; } },
        { key: "hb_source",  val: function(bid) { return bid.source; } },
        { key: "hb_format",  val: function(bid) { return bid.mediaType; } },
        { key: "hb_deal",    val: function(bid) { return bid.dealId || ""; } }
      ]
    }
  };

  // TODO: voeg ad units toe via het Ad Slots tabblad

  // ── Auction: parallel aan GPT laden ──────────────────────────────
  // CORRECT: pbjs.requestBids staat los van googletag.cmd.push
  // Zie: developers.google.com/publisher-ads-audits/reference/audits/gpt-bids-parallel
  pbjs.requestBids({
    bidsBackHandler: sendAdserverRequest,
    timeout: 1500
  });

  function sendAdserverRequest() {
    if (pbjs.adserverRequestSent) return;
    pbjs.adserverRequestSent = true;
    ADTECHTOOL.prebidDone = true;
    googletag.cmd.push(function () {
      pbjs.setTargetingForGPTAsync();
      googletag.pubads().refresh();
    });
  }

  // Failsafe: roep GAM aan als Prebid te lang duurt
  setTimeout(sendAdserverRequest, 1500);

}); // einde pbjs.que.push

/* ═══════════════════════════════════════════════════════════════════════
   ADTECHTOOL — Content Categorisering
   IAB Tier 1 detectie + Brand Safety (bsuit)
   ═══════════════════════════════════════════════════════════════════════ */
(function initCategories() {

  // IAB Tier 1 categorieën — trefwoordenlijsten
  var iabCategories = {
    "IAB1": ["arts", "entertainment", "books", "literature", "celebrity", "gossip", "fine art", "humor", "movies", "music", "television", "film", "concert", "album", "actor", "actress", "singer", "band", "comedy", "theater", "podcast", "radio", "show", "song", "soundtrack", "documentary", "animation", "musical", "opera", "gallery"],
    "IAB2": ["automotive", "auto parts", "auto repair", "buying car", "selling car", "car culture", "certified pre-owned", "convertible", "coupe", "crossover", "diesel", "electric vehicle", "hatchback", "hybrid", "luxury car", "minivan", "motorcycle", "off-road", "performance vehicle", "pickup", "roadside assistance", "sedan", "truck", "vintage car", "wagon", "suv", "car dealer", "car review", "vehicle", "tire", "engine", "lease"],
    "IAB3": ["business", "advertising", "agriculture", "biotech", "biomedical", "business software", "construction", "forestry", "government", "green solutions", "human resources", "logistics", "marketing", "metals", "enterprise", "corporate", "industry", "startup", "management", "b2b", "supply chain", "manufacturing", "consulting"],
    "IAB4": ["careers", "career planning", "college", "financial aid", "job fair", "job search", "resume", "nursing", "scholarship", "telecommuting", "military", "career advice", "employment", "hiring", "recruitment", "interview", "internship", "salary", "job listing", "workforce", "professional development"],
    "IAB5": ["education", "7-12 education", "adult education", "art history", "college administration", "college life", "distance learning", "english second language", "language learning", "graduate school", "homeschooling", "homework", "study tips", "K-6", "private school", "special education", "studying business", "university", "school", "teacher", "student", "classroom", "curriculum", "tutoring", "academic", "degree"],
    "IAB6": ["family", "parenting", "adoption", "babies", "toddlers", "daycare", "preschool", "pregnancy", "special needs kids", "eldercare", "children", "kids", "mothers", "fathers", "baby", "newborn", "child development", "pediatric", "parent", "siblings", "grandparents", "babysitter"],
    "IAB7": ["health", "fitness", "exercise", "ADD", "ADHD", "AIDS", "HIV", "allergies", "alternative medicine", "arthritis", "asthma", "autism", "bipolar", "brain tumor", "cancer", "cholesterol", "chronic fatigue", "chronic pain", "cold flu", "deafness", "dental care", "depression", "dermatology", "diabetes", "epilepsy", "acid reflux", "headache", "migraine", "heart disease", "herbs", "holistic healing", "incontinence", "infertility", "nutrition", "orthopedics", "anxiety", "physical therapy", "psychiatry", "psychology", "senior health", "sleep disorders", "smoking cessation", "substance abuse", "thyroid", "weight loss", "women health", "men health", "wellness", "diet", "yoga", "meditation", "pharmacy", "doctor", "hospital", "medicine", "vitamin", "supplement"],
    "IAB8": ["food", "drink", "american cuisine", "barbecue", "grilling", "cajun", "creole", "chinese cuisine", "cocktails", "beer", "coffee", "tea", "cuisine", "desserts", "baking", "dining out", "food allergies", "french cuisine", "healthy cooking", "lowfat", "italian cuisine", "japanese cuisine", "mexican cuisine", "vegan", "vegetarian", "wine", "recipe", "restaurant", "cooking", "meal", "snack", "breakfast", "lunch", "dinner", "grocery", "chef", "kitchen", "ingredient", "flavor", "gourmet"],
    "IAB9": ["hobbies", "interests", "arts crafts", "beadwork", "birdwatching", "board games", "puzzles", "candle making", "soap making", "card games", "chess", "cigars", "collecting", "comic books", "drawing", "sketching", "freelance writing", "genealogy", "guitar", "home recording", "jewelry making", "magic", "illusion", "needlework", "painting", "photography", "radio", "roleplaying games", "sci-fi", "fantasy", "scrapbooking", "screenwriting", "stamps", "coins", "video games", "computer games", "woodworking", "model building", "knitting"],
    "IAB10": ["home", "garden", "appliances", "entertaining", "environmental safety", "gardening", "home repair", "home theater", "interior decorating", "landscaping", "remodeling", "construction", "furniture", "decor", "kitchen", "bathroom", "bedroom", "lighting", "flooring", "renovation", "diy", "plumbing", "roofing", "lawn", "outdoor", "patio", "cleaning", "storage", "window", "door"],
    "IAB11": ["law", "government", "politics", "immigration", "legal issues", "US government", "commentary", "legislation", "policy", "regulation", "court", "attorney", "lawyer", "justice", "senate", "congress", "parliament", "election", "voting", "democracy", "civil rights", "constitution", "political party", "bill", "amendment", "public policy", "international law", "human rights"],
    "IAB12": ["news", "international news", "national news", "local news", "breaking news", "headline", "journalism", "reporter", "newspaper", "press", "media", "broadcast", "editorial", "column", "analysis", "investigation", "current events", "world news", "politics news", "sports news", "business news"],
    "IAB13": ["personal finance", "investing", "credit", "debt", "loans", "financial news", "financial planning", "hedge fund", "insurance", "mutual funds", "options", "retirement planning", "stocks", "tax planning", "savings", "budget", "mortgage", "banking", "interest rate", "portfolio", "401k", "pension", "cryptocurrency", "ETF", "dividend", "net worth", "wealth", "financial advisor"],
    "IAB14": ["society", "dating", "divorce", "gay life", "marriage", "senior living", "teens", "weddings", "ethnic", "community", "culture", "social issues", "relationships", "family life", "lifestyle", "dating apps", "LGBTQ", "singles", "social justice", "civil rights", "activism", "nonprofit"],
    "IAB15": ["science", "astrology", "biology", "chemistry", "geology", "paranormal", "physics", "space", "astronomy", "geography", "botany", "weather", "research", "experiment", "discovery", "evolution", "genetics", "ecology", "neuroscience", "quantum", "laboratory", "scientist", "climate", "environment", "technology", "innovation", "data", "analysis"],
    "IAB16": ["pets", "aquariums", "birds", "cats", "dogs", "large animals", "reptiles", "veterinary", "medicine", "pet care", "animal", "dog breed", "cat breed", "fish", "hamster", "rabbit", "horse", "livestock", "shelter", "adoption", "grooming", "training", "puppy", "kitten", "vet"],
    "IAB17": ["sports", "auto racing", "baseball", "bicycling", "bodybuilding", "boxing", "canoeing", "kayaking", "cheerleading", "climbing", "cricket", "figure skating", "fly fishing", "football", "freshwater fishing", "golf", "horse racing", "horses", "hunting", "shooting", "inline skating", "martial arts", "mountain biking", "NASCAR", "olympics", "paintball", "motorcycles", "basketball", "ice hockey", "rodeo", "rugby", "running", "jogging", "sailing", "saltwater fishing", "scuba diving", "skateboarding", "skiing", "snowboarding", "surfing", "swimming", "table tennis", "tennis", "volleyball", "walking", "wakeboard", "soccer", "football", "cycling", "athletics", "sport", "tournament", "championship", "league", "match", "game", "player", "team", "coach"],
    "IAB18": ["style", "fashion", "beauty", "body art", "jewelry", "clothing", "accessories", "makeup", "cosmetics", "skincare", "haircare", "luxury fashion", "designer", "brand", "outfit", "trend", "collection", "wardrobe", "shoes", "handbag", "watches", "perfume", "nail", "eyewear", "lingerie", "apparel", "retail", "boutique"],
    "IAB19": ["technology", "computing", "3D graphics", "animation", "antivirus", "software", "cameras", "camcorders", "cell phones", "computer certification", "computer networking", "peripherals", "computer reviews", "data centers", "databases", "desktop publishing", "video", "email", "graphics software", "DVD", "internet technology", "Java", "JavaScript", "Mac", "MP3", "MIDI", "network security", "palmtops", "PDA", "PC support", "shareware", "freeware", "Unix", "Visual Basic", "web design", "HTML", "web search", "Windows", "AI", "machine learning", "cloud", "cybersecurity", "mobile", "app", "blockchain", "IoT", "startup", "developer", "programming", "coding", "data science", "SaaS", "API"],
    "IAB20": ["travel", "adventure travel", "Africa", "air travel", "Australia", "New Zealand", "bed breakfast", "budget travel", "business travel", "camping", "Canada", "Caribbean", "cruises", "Eastern Europe", "Europe", "France", "Greece", "honeymoon", "getaway", "hotels", "Italy", "Japan", "Mexico", "Central America", "national parks", "South America", "spas", "theme parks", "traveling with kids", "United Kingdom", "vacation", "tourism", "flight", "airline", "hotel", "resort", "destination", "trip", "itinerary", "passport", "visa", "luggage", "backpacking", "hostel", "roadtrip", "sightseeing", "beach", "mountain"],
    "IAB21": ["real estate", "apartments", "architects", "buying home", "selling home", "property", "mortgage", "rental", "housing", "real estate agent", "broker", "house", "condo", "investment property", "commercial real estate", "land", "development", "construction", "remodeling", "lease", "tenant", "landlord"],
    "IAB22": ["shopping", "contests", "freebies", "couponing", "comparison", "engines", "deals", "discount", "sale", "coupon", "promo code", "online shopping", "e-commerce", "retail", "store", "product review", "wishlist", "gift", "black friday", "cyber monday", "marketplace", "cart", "checkout", "delivery", "return policy"],
    "IAB23": ["religion", "spirituality", "alternative religions", "atheism", "agnosticism", "Buddhism", "Catholicism", "Christianity", "Hinduism", "Islam", "Judaism", "Latter-Day Saints", "pagan", "Wiccan", "faith", "prayer", "church", "mosque", "temple", "synagogue", "bible", "quran", "torah", "spiritual", "meditation", "mindfulness", "afterlife", "soul", "divine"]
  };

  // Unsafe categorieën — brand safety signalen
  var unsafeCategories = {
    "IAB25-1": ["unmoderated", "user generated content", "ugc", "anonymous post", "uncensored forum", "chan", "imageboard"],
    "IAB25-2": ["extreme violence", "graphic violence", "gore", "brutal killing", "torture video", "execution video", "beheading", "massacre footage", "snuff", "violent imagery", "graphic injury", "decapitation"],
    "IAB25-3": ["pornography", "porn", "xxx", "adult content", "sex video", "nude", "naked", "erotic", "hardcore", "softcore", "pornstar", "explicit", "adult film", "camgirl", "onlyfans", "escort", "prostitution", "strip club", "webcam sex"],
    "IAB25-4": ["profanity", "explicit language", "offensive", "vulgar", "crude", "obscene language", "curse words", "expletive", "swearing"],
    "IAB25-5": ["hate speech", "racism", "antisemitism", "islamophobia", "homophobia", "white supremacy", "neo-nazi", "extremism", "radicalization", "hate crime", "discrimination", "xenophobia", "bigotry", "slur", "white nationalist", "terrorist propaganda", "jihad", "extremist"],
    "IAB26-1": ["illegal", "piracy", "hacking", "exploit", "darkweb", "dark web", "contraband", "weapons trafficking", "drug trafficking", "human trafficking", "child abuse", "cybercrime", "fraud", "counterfeit"],
    "IAB26-3": ["spyware", "malware", "virus", "trojan", "ransomware", "keylogger", "rootkit", "adware", "phishing", "scam", "hack tool", "exploit kit", "botnet"]
  };

  // Scan paginatekst op trefwoorden
  function scanCategories(categories, minMatches) {
    var pageText = document.body ? document.body.innerText : "";
    var matched = [];
    Object.keys(categories).forEach(function(cat) {
      var hits = 0;
      categories[cat].forEach(function(word) {
        var re = new RegExp("\\b" + word.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&") + "\\b", "i");
        if (re.test(pageText)) hits++;
      });
      if (hits >= minMatches) matched.push(cat);
    });
    return matched;
  }

  function run() {
    try {
      // IAB Tier 1 categorisering
      var iabMatches = scanCategories(iabCategories, 4);
      ADTECHTOOL["iabtier1category"] = iabMatches;
      if (iabMatches.length > 0) {
        googletag.cmd.push(function() {
          googletag.pubads().setTargeting("iab_tier1_category", iabMatches);
        });
        console.log("[ADTECHTOOL] IAB categorieën:", iabMatches.join(", "));
      }

      // Brand safety — bsuit
      var unsafeMatches = scanCategories(unsafeCategories, 2);
      var bsuit = unsafeMatches.length > 0 ? "no" : "yes";
      ADTECHTOOL["bsuit"] = bsuit;
      if (unsafeMatches.length > 0) {
        ADTECHTOOL["unsafe_categories"] = unsafeMatches;
        console.warn("[ADTECHTOOL] Unsafe content gedetecteerd:", unsafeMatches.join(", "));
      }
      googletag.cmd.push(function() {
        googletag.pubads().setTargeting("bsuit", bsuit);
        if (unsafeMatches.length > 0) {
          googletag.pubads().setTargeting("unsafe_categories", unsafeMatches);
        }
      });
      console.log("[ADTECHTOOL] bsuit:", bsuit);
    } catch(e) {
      console.warn("[ADTECHTOOL] Categorie detectie fout:", e);
    }
  }

  // Wacht op DOM — run meteen als al geladen
  if (document.readyState !== "loading") run();
  else document.addEventListener("DOMContentLoaded", run);

})();

/* ═══════════════════════════════════════════════════════════════════════
   Scripts laden
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  function loadScript(src) {
    var s = document.createElement("script"); s.src = src; s.async = true;
    document.head.appendChild(s);
  }
  // GPT
  loadScript("https://securepubads.g.doubleclick.net/tag/js/gpt.js");
  // Prebid.js — custom build via github
  // Modules: consentManagementTcf, tcfControl, gptPreAuction, priceFloors, currency, nativeRendering, … (10 totaal)
  loadScript("https://raw.githubusercontent.com/jurhey/preb/main/prebid.js");
})();