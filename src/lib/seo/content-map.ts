export type SeoRouteId =
  | "ai_virtual_try_on"
  | "ai_fashion_photography"
  | "indian_fashion"
  | "swimwear"
  | "cost_roi"
  | "batch_generation"
  | "model_identity"
  | "competitor_alternatives"
  | "brand_review";

export type SeoKeywordEntry = {
  keyword: string;
  category: string;
  intent: "Commercial" | "Informational" | "Navigational";
  opportunityScore: number;
  routeId: SeoRouteId;
};

export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoComparison = {
  headers: string[];
  rows: string[][];
};

export type SeoPageContent = {
  routeId: SeoRouteId;
  slug: string;
  title: string;
  description: string;
  h1: string;
  definition: string;
  intro: string;
  steps: string[];
  faqs: SeoFaq[];
  comparison?: SeoComparison;
  internalLinks: Array<{ href: string; label: string }>;
};

export const seoKeywordInventory: SeoKeywordEntry[] = [
  {
    keyword: "ai virtual try-on for ecommerce",
    category: "Pillar - AI Virtual Try-On",
    intent: "Commercial",
    opportunityScore: 7,
    routeId: "ai_virtual_try_on",
  },
  {
    keyword: "best ai virtual try-on tools",
    category: "Pillar - AI Virtual Try-On",
    intent: "Commercial",
    opportunityScore: 7,
    routeId: "ai_virtual_try_on",
  },
  {
    keyword: "virtual try-on for fashion brands",
    category: "Pillar - AI Virtual Try-On",
    intent: "Informational",
    opportunityScore: 8,
    routeId: "ai_virtual_try_on",
  },
  {
    keyword: "how does virtual try-on work",
    category: "Pillar - AI Virtual Try-On",
    intent: "Informational",
    opportunityScore: 6,
    routeId: "ai_virtual_try_on",
  },
  {
    keyword: "ai fashion photography",
    category: "Pillar - AI Fashion Photography",
    intent: "Informational",
    opportunityScore: 7,
    routeId: "ai_fashion_photography",
  },
  {
    keyword: "ai fashion model generator",
    category: "Pillar - AI Fashion Photography",
    intent: "Commercial",
    opportunityScore: 8,
    routeId: "ai_fashion_photography",
  },
  {
    keyword: "how to create product photos without photoshoot",
    category: "Pillar - AI Fashion Photography",
    intent: "Informational",
    opportunityScore: 8,
    routeId: "ai_fashion_photography",
  },
  {
    keyword: "ai product photography clothing",
    category: "Pillar - AI Fashion Photography",
    intent: "Commercial",
    opportunityScore: 7,
    routeId: "ai_fashion_photography",
  },
  {
    keyword: "saree product photography",
    category: "Pillar - Indian Fashion",
    intent: "Informational",
    opportunityScore: 9,
    routeId: "indian_fashion",
  },
  {
    keyword: "ai saree catalogue images",
    category: "Pillar - Indian Fashion",
    intent: "Informational",
    opportunityScore: 9,
    routeId: "indian_fashion",
  },
  {
    keyword: "lehenga catalogue photography",
    category: "Pillar - Indian Fashion",
    intent: "Informational",
    opportunityScore: 9,
    routeId: "indian_fashion",
  },
  {
    keyword: "ethnic wear catalogue images",
    category: "Pillar - Indian Fashion",
    intent: "Informational",
    opportunityScore: 9,
    routeId: "indian_fashion",
  },
  {
    keyword: "virtual try-on platform for indian fashion",
    category: "Pillar - Indian Fashion",
    intent: "Informational",
    opportunityScore: 9,
    routeId: "indian_fashion",
  },
  {
    keyword: "bridal wear catalogue photography ai",
    category: "Pillar - Indian Fashion",
    intent: "Informational",
    opportunityScore: 9,
    routeId: "indian_fashion",
  },
  {
    keyword: "swimwear catalogue images ai",
    category: "Pillar - Swimwear",
    intent: "Commercial",
    opportunityScore: 9,
    routeId: "swimwear",
  },
  {
    keyword: "virtual try-on swimwear brands",
    category: "Pillar - Swimwear",
    intent: "Commercial",
    opportunityScore: 9,
    routeId: "swimwear",
  },
  {
    keyword: "ai bikini product photography",
    category: "Pillar - Swimwear",
    intent: "Informational",
    opportunityScore: 9,
    routeId: "swimwear",
  },
  {
    keyword: "fashion photoshoot cost india",
    category: "Pillar - Cost & ROI",
    intent: "Informational",
    opportunityScore: 8,
    routeId: "cost_roi",
  },
  {
    keyword: "how much does a fashion photoshoot cost",
    category: "Pillar - Cost & ROI",
    intent: "Informational",
    opportunityScore: 7,
    routeId: "cost_roi",
  },
  {
    keyword: "replace fashion photoshoot with ai",
    category: "Pillar - Cost & ROI",
    intent: "Informational",
    opportunityScore: 8,
    routeId: "cost_roi",
  },
  {
    keyword: "batch product image generation fashion",
    category: "Sub-cluster - Batch Generation",
    intent: "Informational",
    opportunityScore: 8,
    routeId: "batch_generation",
  },
  {
    keyword: "bulk fashion product photography ai",
    category: "Sub-cluster - Batch Generation",
    intent: "Commercial",
    opportunityScore: 8,
    routeId: "batch_generation",
  },
  {
    keyword: "shopify ai product photos fashion",
    category: "Sub-cluster - Batch Generation",
    intent: "Informational",
    opportunityScore: 7,
    routeId: "batch_generation",
  },
  {
    keyword: "ai product photography for amazon sellers india",
    category: "Sub-cluster - Batch Generation",
    intent: "Informational",
    opportunityScore: 9,
    routeId: "batch_generation",
  },
  {
    keyword: "custom ai model for ecommerce",
    category: "Sub-cluster - Model Identity",
    intent: "Commercial",
    opportunityScore: 9,
    routeId: "model_identity",
  },
  {
    keyword: "consistent model photos ai",
    category: "Sub-cluster - Model Identity",
    intent: "Informational",
    opportunityScore: 9,
    routeId: "model_identity",
  },
  {
    keyword: "ai model photo generator for clothing brand",
    category: "Sub-cluster - Model Identity",
    intent: "Commercial",
    opportunityScore: 8,
    routeId: "model_identity",
  },
  {
    keyword: "fashn ai alternative",
    category: "Sub-cluster - Competitor Alternatives",
    intent: "Commercial",
    opportunityScore: 9,
    routeId: "competitor_alternatives",
  },
  {
    keyword: "vue.ai alternative",
    category: "Sub-cluster - Competitor Alternatives",
    intent: "Commercial",
    opportunityScore: 8,
    routeId: "competitor_alternatives",
  },
  {
    keyword: "mirrorfit ai review",
    category: "Sub-cluster - Brand",
    intent: "Navigational",
    opportunityScore: 10,
    routeId: "brand_review",
  },
];

export const seoPages: SeoPageContent[] = [
  {
    routeId: "ai_virtual_try_on",
    slug: "/ai-virtual-try-on-for-ecommerce",
    title: "AI Virtual Try-On for Ecommerce | MirrorFit AI",
    description:
      "A practical guide to AI virtual try-on for fashion ecommerce: how it works, when to use it, and what to evaluate before choosing a platform.",
    h1: "AI Virtual Try-On for Ecommerce Brands",
    definition:
      "AI virtual try-on generates realistic fashion catalogue images of a model wearing a specific garment without a physical photoshoot.",
    intro:
      "Most guides mix shopper try-on tools with brand production tools. This page is only for fashion sellers who need catalogue-ready, model-consistent outputs.",
    steps: [
      "Upload model face, front-body, and side-body references.",
      "Upload garment front or flat-lay images with core detail notes.",
      "Describe the shoot in plain language and run generation.",
      "Review identity, garment fidelity, and composition before export.",
    ],
    faqs: [
      {
        question: "What is AI virtual try-on in ecommerce?",
        answer:
          "It is a production workflow where a brand uploads model and garment references and gets product-ready model-worn images without running a studio shoot.",
      },
      {
        question: "Can AI virtual try-on replace all photoshoots?",
        answer:
          "For many SKU and catalogue workflows, yes. Brands still keep occasional physical shoots for campaign-level creative or complex edge cases.",
      },
      {
        question: "What matters most when choosing a tool?",
        answer:
          "Identity consistency, garment fidelity, category support, and operational throughput are the four selection criteria that most impact catalogue outcomes.",
      },
      {
        question: "Does this work for Indian and swimwear categories?",
        answer:
          "Yes, if the platform is designed for commercial fashion workflows and not only consumer try-on demos.",
      },
    ],
    internalLinks: [
      { href: "/ai-fashion-photography", label: "AI Fashion Photography Guide" },
      { href: "/swimwear-ai-catalogue", label: "Swimwear Catalogue Workflow" },
      { href: "/model-identity-lock", label: "Model Identity Lock Guide" },
      { href: "/fashion-photoshoot-cost-india", label: "Cost and ROI Breakdown" },
    ],
  },
  {
    routeId: "ai_fashion_photography",
    slug: "/ai-fashion-photography",
    title: "AI Fashion Photography Guide | MirrorFit AI",
    description:
      "How AI fashion photography works for catalogue teams, where it performs best, and how to improve garment realism and output quality.",
    h1: "AI Fashion Photography for Catalogue Teams",
    definition:
      "AI fashion photography is a workflow that turns garment and model references into production-ready catalogue visuals with realistic fit and fabric behavior.",
    intro:
      "The practical win is speed and consistency. The practical risk is weak references. Teams that standardize inputs get stronger outputs.",
    steps: [
      "Create a reusable model profile with high-quality references.",
      "Store garments with front, back, and detail images in one library.",
      "Generate draft outputs first, then apply quick-fix refinements.",
      "Export marketplace and social crops from approved generations.",
    ],
    faqs: [
      {
        question: "How is this different from basic image generation?",
        answer:
          "Catalogue-focused workflows enforce model identity, garment fidelity, and production framing, not just visual creativity.",
      },
      {
        question: "What causes weak garment accuracy?",
        answer:
          "Low-resolution garment inputs, missing detail angles, and vague prompts usually reduce seam, texture, and silhouette fidelity.",
      },
      {
        question: "How many references are needed for reliability?",
        answer:
          "At minimum: one face image, one full-body front image, and one full-body side image, plus a front or flat-lay garment image.",
      },
      {
        question: "Can this handle batch operations?",
        answer:
          "Yes. Batch-oriented workflows are designed to process multiple SKUs with one approved model identity and shared brand defaults.",
      },
    ],
    internalLinks: [
      { href: "/batch-generation-fashion", label: "Batch Generation Playbook" },
      { href: "/indian-fashion-ai-catalogue", label: "Indian Fashion Coverage" },
      { href: "/competitor-alternatives", label: "Competitor Alternatives" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    routeId: "indian_fashion",
    slug: "/indian-fashion-ai-catalogue",
    title: "AI Catalogue Images for Indian Fashion | MirrorFit AI",
    description:
      "Generate saree, lehenga, bridal blouse, and ethnicwear catalogue images with model consistency and garment detail preservation.",
    h1: "Indian Fashion AI Catalogue Workflow",
    definition:
      "Indian fashion AI catalogue generation focuses on preserving drape, embroidery, blouse structure, and model identity across ethnicwear categories.",
    intro:
      "Sarees and lehengas are detail-heavy garments. The workflow succeeds when input references clearly show construction, drape direction, and texture.",
    steps: [
      "Capture garment fronts with visible embroidery and neckline construction.",
      "Use neutral model references with consistent lighting and posture.",
      "Generate front view first, then back and side variants.",
      "Run detail checks for blouse cut, drape direction, and fabric texture.",
    ],
    faqs: [
      {
        question: "Can AI show saree drape and pallu correctly?",
        answer:
          "It can when references are clear and the prompt calls out drape behavior explicitly; weak references reduce structural fidelity.",
      },
      {
        question: "Does this support bridal blouses and back designs?",
        answer:
          "Yes, bridal blouse features are supported in commercial catalogue framing with adult, authorized references.",
      },
      {
        question: "Can teams generate Myntra and Amazon-ready outputs?",
        answer:
          "Yes, the workflow can export marketplace-friendly crops and image packs after quality review.",
      },
      {
        question: "What improves ethnicwear quality fastest?",
        answer:
          "Detailed garment inputs, model identity lock, and iterative quick-fix runs for drape and embellishment corrections.",
      },
    ],
    internalLinks: [
      { href: "/ai-virtual-try-on-for-ecommerce", label: "Core Try-On Guide" },
      { href: "/batch-generation-fashion", label: "Bulk SKU Generation" },
      { href: "/fashion-photoshoot-cost-india", label: "Cost Comparison" },
      { href: "/pricing", label: "Plans" },
    ],
  },
  {
    routeId: "swimwear",
    slug: "/swimwear-ai-catalogue",
    title: "AI Swimwear Catalogue Images | MirrorFit AI",
    description:
      "A practical swimwear and resortwear catalogue guide: safe commercial framing, model consistency, and garment fidelity without policy noise.",
    h1: "AI Swimwear Catalogue Generation",
    definition:
      "Swimwear AI catalogue generation is a commercial fashion workflow for adult, authorized models where outputs remain tasteful, product-focused, and non-explicit.",
    intro:
      "Teams need commercial outputs, not blocked jobs. The operational fix is category-aware language, strong references, and consistent catalogue framing.",
    steps: [
      "Confirm adult and authorized model references before generation.",
      "Upload clear garment fronts and detail angles for straps and seams.",
      "Use commercial catalogue prompts instead of suggestive language.",
      "Apply quick fixes for garment fidelity and face consistency as needed.",
    ],
    faqs: [
      {
        question: "Is swimwear generation always blocked by AI systems?",
        answer:
          "No. Commercial adult swimwear requests can be valid when framing is professional and non-explicit.",
      },
      {
        question: "What language should prompts use?",
        answer:
          "Use terms like swimwear catalogue, product-focused, and tasteful commercial styling instead of suggestive descriptors.",
      },
      {
        question: "Can this support bikinis and one-piece suits?",
        answer:
          "Yes, adult commercial categories including bikinis and one-piece swimwear are supported in compliant catalogue workflows.",
      },
      {
        question: "How do I reduce retries?",
        answer:
          "Provide face/front/side model references and strong garment inputs so the generation system has enough anchor data.",
      },
    ],
    internalLinks: [
      { href: "/ai-fashion-photography", label: "AI Photography Fundamentals" },
      { href: "/model-identity-lock", label: "Identity Consistency Guide" },
      { href: "/competitor-alternatives", label: "Alternative Tools" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    routeId: "cost_roi",
    slug: "/fashion-photoshoot-cost-india",
    title: "AI vs Photoshoot Cost for Fashion Brands in India | MirrorFit AI",
    description:
      "A direct cost and time comparison between traditional fashion photoshoots and AI virtual try-on workflows for Indian ecommerce teams.",
    h1: "Fashion Photoshoot Cost vs AI Workflow",
    definition:
      "For recurring SKU work, AI virtual try-on can reduce time-to-catalogue from weeks to minutes while lowering per-image production costs.",
    intro:
      "The right comparison is not one hero campaign versus one AI output. It is recurring catalogue throughput across dozens or hundreds of SKUs.",
    steps: [
      "Estimate monthly SKU volume and required view count per SKU.",
      "Calculate traditional shoot cost including studio, model, and post.",
      "Estimate AI generation cost using expected monthly output volume.",
      "Compare time-to-launch and consistency across both workflows.",
    ],
    comparison: {
      headers: ["Metric", "Traditional Shoot", "AI Try-On Workflow"],
      rows: [
        ["Time to first usable image", "Days to weeks", "Minutes"],
        ["Per-SKU operational overhead", "High", "Low"],
        ["Model consistency at scale", "Varies by shoot", "High with identity lock"],
        ["Repeat launch velocity", "Low", "High"],
      ],
    },
    faqs: [
      {
        question: "Is AI always cheaper than a photoshoot?",
        answer:
          "For recurring catalogue production, AI is typically lower cost because model, studio, and scheduling overhead are removed from each SKU cycle.",
      },
      {
        question: "When should brands still run physical shoots?",
        answer:
          "Campaign hero assets, highly artistic concepts, and complex set productions still benefit from physical shoots.",
      },
      {
        question: "What is the biggest ROI factor?",
        answer:
          "Launch speed. Faster image turnaround directly improves time-to-market for new product drops.",
      },
      {
        question: "How does batch generation change ROI?",
        answer:
          "Batch mode compounds savings because one model identity and one workflow can cover many SKUs in a single run.",
      },
    ],
    internalLinks: [
      { href: "/batch-generation-fashion", label: "Batch Cost Multiplier" },
      { href: "/indian-fashion-ai-catalogue", label: "Indian Fashion Use Cases" },
      { href: "/mirrorfit-ai-review", label: "MirrorFit Review" },
      { href: "/pricing", label: "Plan Comparison" },
    ],
  },
  {
    routeId: "batch_generation",
    slug: "/batch-generation-fashion",
    title: "Batch Generation for Fashion SKUs | MirrorFit AI",
    description:
      "How to generate large fashion catalogue sets quickly with one model profile, one garment library, and repeatable quality controls.",
    h1: "Batch Generation for Fashion Catalogues",
    definition:
      "Batch generation is a production workflow that renders many SKU images in one operation while keeping model identity and visual style consistent.",
    intro:
      "This route targets Shopify and Amazon sellers that need repeatable throughput without re-running a full manual shoot process for every SKU.",
    steps: [
      "Prepare one approved model profile with complete references.",
      "Upload garments with front and detail shots in a structured library.",
      "Apply brand memory defaults for lighting, framing, and output pack.",
      "Generate in batches, then approve or request revisions per thread.",
    ],
    faqs: [
      {
        question: "How many SKUs can be processed in one cycle?",
        answer:
          "That depends on queue configuration and plan limits, but the workflow is designed for high-volume SKU throughput with consistent outputs.",
      },
      {
        question: "Can I generate marketplace crops automatically?",
        answer:
          "Yes, output packs can include marketplace and social-ready aspect ratios after generation.",
      },
      {
        question: "Does batch mode reduce consistency?",
        answer:
          "Not when model references and brand defaults are stable; it usually improves consistency versus ad hoc manual shoots.",
      },
      {
        question: "Can reviewers approve in-thread?",
        answer:
          "Yes, approvals and revision requests are logged in the same shoot thread for traceability.",
      },
    ],
    internalLinks: [
      { href: "/ai-fashion-photography", label: "Core Workflow" },
      { href: "/model-identity-lock", label: "Identity Lock" },
      { href: "/fashion-photoshoot-cost-india", label: "ROI Math" },
      { href: "/pricing", label: "Plans" },
    ],
  },
  {
    routeId: "model_identity",
    slug: "/model-identity-lock",
    title: "Model Identity Lock for AI Fashion Images | MirrorFit AI",
    description:
      "How to keep face and body consistency stable across generations with structured model references and identity-aware repair loops.",
    h1: "Model Identity Lock and Consistency",
    definition:
      "Identity lock is the process of preserving face geometry, skin tone, and body proportions across repeated AI generations for the same model profile.",
    intro:
      "If your model looks like a different person every time, your reference pack or generation pipeline is under-constrained.",
    steps: [
      "Collect face, front-body, and side-body references in neutral lighting.",
      "Use consistent camera distance and posture across references.",
      "Apply strict identity language in prompts and quick-fix passes.",
      "Score each attempt for face and body consistency before delivery.",
    ],
    faqs: [
      {
        question: "Why does identity drift happen?",
        answer:
          "Identity drift usually comes from weak references, mixed camera conditions, or prompts that prioritize style over identity constraints.",
      },
      {
        question: "What are the mandatory references?",
        answer:
          "Face, full-body front, and full-body side references are required for stable identity lock.",
      },
      {
        question: "Can this preserve body proportions too?",
        answer:
          "Yes, body consistency is scored alongside face identity so retries can improve proportional accuracy before final output.",
      },
      {
        question: "What if consistency still fails?",
        answer:
          "Use cleaner neutral references and rerun; if needed, regenerate with stronger identity constraints and lower stylistic variance.",
      },
    ],
    internalLinks: [
      { href: "/ai-virtual-try-on-for-ecommerce", label: "Try-On Overview" },
      { href: "/swimwear-ai-catalogue", label: "Swimwear Constraints" },
      { href: "/batch-generation-fashion", label: "Batch Workflow" },
      { href: "/mirrorfit-ai-review", label: "Product Review" },
    ],
  },
  {
    routeId: "competitor_alternatives",
    slug: "/competitor-alternatives",
    title: "MirrorFit AI Alternatives and Comparisons | MirrorFit AI",
    description:
      "Compare catalogue-oriented alternatives with a practical lens: model upload flexibility, identity consistency, category coverage, and operational control.",
    h1: "Alternatives and Comparisons for Fashion Teams",
    definition:
      "A useful alternative comparison focuses on production outcomes: consistency, garment fidelity, category support, and workflow reliability at SKU scale.",
    intro:
      "This page helps evaluation-stage buyers shortlist tools based on operational requirements, not just one-off visual demos.",
    steps: [
      "List your must-have categories and compliance requirements.",
      "Evaluate model upload and identity consistency capabilities.",
      "Test garment fidelity and retry behavior on your own references.",
      "Choose the platform that minimizes launch friction over time.",
    ],
    comparison: {
      headers: ["Evaluation Point", "MirrorFit", "Typical General Tool"],
      rows: [
        ["Custom model profile support", "Yes", "Limited or fixed avatars"],
        ["Face/body consistency workflow", "Score + retry loop", "Inconsistent"],
        ["Category handling (swimwear/ethnicwear)", "Commercial-first", "Often restricted"],
        ["Chat-first beginner flow", "Yes", "Usually control-heavy"],
      ],
    },
    faqs: [
      {
        question: "What should I check in an alternative review?",
        answer:
          "Check identity consistency, garment fidelity, category compatibility, and retry behavior under real production prompts.",
      },
      {
        question: "Do alternatives differ mainly on output quality?",
        answer:
          "Quality matters, but operational reliability and category handling are often the bigger reason teams switch tools.",
      },
      {
        question: "Can one platform fit every fashion category?",
        answer:
          "Many tools are strong in narrow scenarios; category breadth is a core evaluation factor for ecommerce teams.",
      },
      {
        question: "Should I run a pilot before migrating?",
        answer:
          "Yes, a small SKU pilot with your own references gives the clearest signal before full rollout.",
      },
    ],
    internalLinks: [
      { href: "/ai-virtual-try-on-for-ecommerce", label: "Virtual Try-On Pillar" },
      { href: "/model-identity-lock", label: "Identity Lock Criteria" },
      { href: "/swimwear-ai-catalogue", label: "Swimwear Coverage" },
      { href: "/pricing", label: "Plan Fit" },
    ],
  },
  {
    routeId: "brand_review",
    slug: "/mirrorfit-ai-review",
    title: "MirrorFit AI Review (2026) | MirrorFit AI",
    description:
      "A transparent review of MirrorFit AI for fashion catalogue workflows: strengths, constraints, ideal use cases, and operational fit.",
    h1: "MirrorFit AI Review",
    definition:
      "MirrorFit AI is a chat-first virtual try-on platform built for fashion ecommerce teams that need model-consistent, garment-accurate catalogue outputs.",
    intro:
      "This review is intentionally practical. It explains where MirrorFit performs best and where teams should still keep fallback processes.",
    steps: [
      "Define your category mix and expected monthly SKU volume.",
      "Run a pilot with one model profile and five representative garments.",
      "Measure identity stability, garment fidelity, and approval speed.",
      "Scale only after reviewing output quality and team workflow fit.",
    ],
    faqs: [
      {
        question: "Who gets the most value from MirrorFit?",
        answer:
          "Teams with recurring catalogue updates and high SKU velocity usually benefit most from the chat-first production workflow.",
      },
      {
        question: "What are current limitations?",
        answer:
          "Complex garment structures can still need iterative retries; high-quality references remain the biggest quality driver.",
      },
      {
        question: "Is the platform beginner-friendly?",
        answer:
          "Yes. The primary flow is conversational and requests only missing inputs, so non-technical users can finish jobs with minimal setup.",
      },
      {
        question: "Can this support approval loops?",
        answer:
          "Yes, share and approval events are tracked in-thread to support revision cycles and production history.",
      },
    ],
    internalLinks: [
      { href: "/ai-fashion-photography", label: "Photography Workflow Guide" },
      { href: "/batch-generation-fashion", label: "Batch Production Flow" },
      { href: "/competitor-alternatives", label: "Alternatives" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
];

export function pageBySlug(slug: string) {
  return seoPages.find((entry) => entry.slug === slug) ?? null;
}

export function keywordsForRoute(routeId: SeoRouteId) {
  return seoKeywordInventory.filter((entry) => entry.routeId === routeId);
}

