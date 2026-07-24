// All portfolio content lives here — edit this one file to update the site.

export const profile = {
  name: "Srujana Challuri",
  roles: [
    "AI / Machine Learning Engineer",
    "Software Developer",
    "Graduate Research Assistant",
  ],
  headline: "Software Developer · Backend + Full-Stack · Machine Learning & LLM Research",
  intro:
    "I build reliable software across the stack — enterprise backends, full-stack web apps, and AI systems — and I care about work that actually ships and creates impact.",
  location: "Milwaukee, Wisconsin, United States",
  email: "srujanachalluri@gmail.com",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/srujana-challuri/" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "Email", href: "mailto:srujanachalluri@gmail.com" },
  ],
};

export const about = {
  paragraphs: [
    "I'm currently pursuing my Master's in Computer Science at Concordia University Wisconsin (Milwaukee), where I wear three hats — Graduate Assistant at the Concordia Bible Institute, Research Assistant on two active AI research projects, and full-stack developer.",
    "Before grad school I spent 3+ years as a Backend Developer at Accenture on large-scale enterprise integration for the Sony LIV platform, where I independently designed and migrated 50+ interfaces to production and led enterprise upgrades across IBM App Connect Enterprise, Java, WebSphere, and MDMCE.",
    "My work spans REST APIs and integration services in Java, .NET, and ESQL through to modern full-stack apps on Next.js and Supabase, and machine-learning research in drug discovery and LLM evaluation.",
  ],
  focus: ["LLMs & Agentic AI", "Full-Stack Web", "Enterprise Integration", "ML for Science"],
};

// Accenture is pinned first (not strictly reverse-chronological) — it's the
// headline experience for interviews. `summary` is optional on any entry.
export const experience = [
  {
    role: "Software Engineer",
    org: "Accenture",
    period: "May 2021 — Jul 2024",
    location: "India · On-site",
    caseStudy: "ibm-ace-enterprise-integration",
    summary:
      "3+ years as a Backend Developer on large-scale enterprise integration for the Sony LIV platform — designing ACE message flows and integration services end to end, and leading the IBM ACE v11 → v12 platform migration from architecture design through post-production support.",
    // Full stack for this role — named to match the Toolkit marquee.
    tags: [
      "IBM App Connect Enterprise (ACE v11/v12)",
      "ESQL",
      "Java",
      "IBM MQ",
      "Kafka",
      "Message Flows & Sub-flows",
      "REST APIs",
      "SOAP Web Services",
      "Service Orchestration",
      "DFDL",
      "XML/JSON Transformation",
      "Event-Driven Messaging",
      "Pub/Sub Messaging",
      "JDBC",
      "HTTP(S)",
      "File-Based Flows",
      "SQL",
      "Git & Jenkins",
      "CI/CD",
      "HTTPS/TLS Security",
    ],
    points: [
      "Designed and developed IBM App Connect Enterprise (ACE) message flows, sub-flows, and integration services in ESQL and Java, supporting consistent, reliable data exchange across enterprise systems.",
      "Built and secured REST APIs and SOAP web services with service orchestration, integrating ACE with IBM MQ, HTTP(S), JDBC, and file-based flows using synchronous, asynchronous, and pub/sub integration patterns.",
      "Modelled and transformed XML and JSON payloads with DFDL schemas, message models, and message sets to bridge disparate data formats between upstream and downstream applications.",
      "Implemented event-driven integrations with Kafka for decoupled, high-throughput messaging across services.",
      "Led the end-to-end IBM ACE v11 to v12 platform migration, owning architecture design, bar file / policy / security-profile configuration, deployment strategy, and post-production support.",
      "Secured integration flows by configuring HTTPS/TLS keystores and trust stores, security profiles, and policies, and hardening endpoints across enterprise systems.",
      "Built CI/CD automation with Git and Jenkins for integration services, and configured monitoring, logging, and alerting to improve observability and reduce mean-time-to-recovery.",
      "Troubleshot integration issues and performance bottlenecks, tuning message flows and optimizing database queries and caching strategies to improve reliability, resiliency, throughput, and response times.",
      "Collected, cleaned, and validated data across integrations to uphold data integrity and quality standards.",
      "Partnered cross-functionally with IT and business teams on solution design, estimation, and code reviews — identifying data-related challenges and implementing scalable solutions that improved operational efficiency.",
      "Authored solution-architecture documents, design decisions, runbooks, and support logs, and configured monitoring profiles to standardize delivery and speed up troubleshooting.",
    ],
  },
  {
    role: "Graduate Research Assistant — LLM Evaluation (Medical AI)",
    org: "Concordia University Wisconsin",
    period: "May 2026 — Present",
    location: "Milwaukee, WI",
    tags: ["LLM Evaluation", "Benchmarking", "Medical AI"],
    points: [
      "Built a taxonomy of LLM fidelity / faithfulness benchmarks across 5 categories, from behavioral tests to internal hidden-state probing.",
      "Designed original reasoning-probe tests (distractor, transitive-chain, fake-entity) and benchmarked ChatGPT, Claude, Gemini, and local Llama 3.2.",
      "Showed fidelity ≠ fluency — small models sounded confident while breaking logic or hallucinating facts.",
      "Mapped fidelity methods to benchmarks: FaithDial, TruthfulQA, StrategyQA, ROSCOE, ProcessBench.",
      "Ran open-weight LLMs locally (LM Studio, GPT4All, Ollama) on constrained hardware; studied LLM-as-a-judge on 962 clinical MedQA questions (BioMistral-7B) using Cohen's kappa for evaluator agreement.",
    ],
  },
  {
    role: "Graduate Research Assistant — AI-Driven Drug Discovery",
    org: "Concordia University Wisconsin",
    period: "Apr 2026 — Present",
    location: "Milwaukee, WI",
    tags: ["QSAR", "XGBoost", "RDKit", "Optuna"],
    points: [
      "Curated 917 bioactive compounds from ChEMBL and engineered pIC50 targets from raw IC50 data for the Delta-Opioid Receptor.",
      "Generated 3,600+ molecular features (Mordred descriptors + Morgan fingerprints) with RDKit.",
      "Built a stacking ensemble (XGBoost, LightGBM, Random Forest, Extra Trees) with Optuna tuning.",
      "Ensured scientific rigor: no data leakage, 5-fold cross-validation, honest R² reporting.",
      "Deployed the model to predict potency of new, unseen molecules.",
    ],
  },
  {
    role: "Graduate Student Assistant — AI Content & Full-Stack Developer",
    org: "Concordia Bible Institute",
    period: "Aug 2025 — Present",
    location: "Mequon, WI",
    tags: ["Next.js", "Supabase", "Python", "OpenAI"],
    points: [
      "Automated transcript processing for 500+ podcast videos with Python + OpenAI, cutting manual effort by 89%.",
      "Generated 500+ AI-powered study guides from podcast transcripts, making learning content accessible.",
      "Built macro automation to standardize and format guides at scale for consistent, publish-ready output.",
      "Drove 55% audience growth across YouTube and other platforms via AI-assisted design and thumbnail optimization; turned performance analysis into a 40% engagement lift.",
      "Built and deployed a full-stack study-guide platform on Next.js, Supabase, and Vercel — integrated CashNet payments with secure server-to-server confirmation, and gated premium PDFs behind auth + short-lived signed URLs.",
    ],
  },
  {
    role: "Full-Stack Developer Intern",
    org: "Spanglish Events · spanglishevents.com (live)",
    period: "Mar 2026 — May 2026",
    location: "Remote",
    tags: ["Next.js", "TypeScript", "Supabase", "REST APIs"],
    points: [
      "Developed and deployed a live production website using Next.js, TypeScript, and Supabase.",
      "Built responsive, mobile-first UI with reusable components, clean navigation, and scroll animations.",
      "Designed and integrated REST APIs and a Supabase database for dynamic event content.",
      "Engineered core logic: 3-tier event sorting, recurring events, and fuzzy duplicate detection with admin override.",
      "Built an admin dashboard for content management (featured events, archiving, media uploads); handled DevOps — DNS/email setup, deployment, and agile ticket tracking.",
    ],
  },
  {
    role: "Technical Trainer",
    org: "Talentio Academy",
    period: "Jan 2021 — May 2021",
    location: "Hyderabad, India",
    tags: ["Teaching", "Java", "Python", "React", "SQL"],
    points: [
      "Trained 1,000+ students in programming, web applications, Python with Data Structures, Java, React, and SQL.",
      "Designed 50+ mock tests and problem-solving exercises, boosting placement readiness by 65%.",
    ],
  },
];

export const projects = [
  {
    number: "01",
    title: "Delta-Opioid QSAR Model",
    kind: "Machine Learning · Drug Discovery",
    blurb:
      "A stacking-ensemble QSAR pipeline predicting the potency (pIC50) of molecules against the Delta-Opioid Receptor from 3,600+ engineered molecular features.",
    stack: ["Python", "RDKit", "XGBoost", "LightGBM", "Optuna"],
  },
  {
    number: "02",
    title: "LLM Fidelity Evaluation",
    kind: "AI Research · Benchmarking",
    blurb:
      "Original reasoning-probe benchmarks testing whether LLMs reason correctly, not just fluently — across ChatGPT, Claude, Gemini, and local Llama 3.2.",
    stack: ["LLMs", "Ollama", "LM Studio", "BioMistral-7B"],
  },
  {
    number: "03",
    title: "AI Study-Guide Platform",
    kind: "Full-Stack · Production",
    blurb:
      "A full-stack platform that turns 500+ podcast transcripts into AI-generated study guides, with gated premium PDFs and CashNet payment integration.",
    stack: ["Next.js", "Supabase", "OpenAI", "Vercel"],
  },
  {
    number: "04",
    title: "Spanglish Events",
    kind: "Full-Stack · Live Site",
    blurb:
      "A live production event platform with recurring-event logic, fuzzy duplicate detection, and a full admin dashboard for content management.",
    stack: ["Next.js", "TypeScript", "Supabase", "REST"],
  },
  {
    number: "05",
    title: "Real-Time 2D Pose Estimation",
    kind: "Computer Vision · Internship",
    blurb:
      "A real-time human pose estimation model reaching 90%+ accuracy on live video, optimized with GPU acceleration for 30% faster inference.",
    stack: ["Python", "OpenCV", "CNNs", "AI/ML"],
  },
  {
    number: "06",
    title: "Real-Time Object Detection",
    kind: "Computer Vision · Internship",
    blurb:
      "A computer-vision model detecting objects in live video streams at 90% accuracy, with real-time alerts improving prototype responsiveness by 50%.",
    stack: ["Python", "OpenCV", "Deep Learning"],
  },
];

// Three marquee rows. Each row scrolls in the opposite direction to its
// neighbour, so keep the rows roughly the same length for a balanced look.
export const tools = {
  rows: [
    [
      "Python",
      "Java",
      "TypeScript",
      "JavaScript",
      ".NET / C#",
      "SQL",
      "ESQL",
      "Next.js",
      "React",
      "Node.js",
    ],
    [
      "IBM App Connect Enterprise (ACE v11/v12)",
      "IBM MQ",
      "Kafka",
      "REST APIs",
      "SOAP Web Services",
      "Message Flows & Sub-flows",
      "Event-Driven Messaging",
      "Pub/Sub Messaging",
      "XML/JSON Transformation",
      "Service Orchestration",
      "DFDL",
      "JDBC",
      "HTTP(S)",
      "File-Based Flows",
    ],
    [
      "AWS",
      "Vercel",
      "Supabase",
      "Docker",
      "Git",
      "Jenkins",
      "GitHub Actions",
      "CI/CD",
      "PyTorch",
      "RDKit",
      "XGBoost",
      "OpenAI API",
    ],
  ],
};

export const skills = [
  {
    group: "Integration & Middleware",
    items: ["IBM App Connect Enterprise (ACE)", "IBM MQ", "ESQL", "Message Flows", "SOAP/REST APIs", "Kafka", "Event-Driven Messaging", "XML/JSON Transformation"],
  },
  {
    group: "Languages & Runtime",
    items: ["Java", "Python", "TypeScript", "JavaScript", ".NET / C#", "SQL"],
  },
  {
    group: "Full-Stack & Web",
    items: ["Next.js", "React", "Node.js", "Supabase", "Responsive Design"],
  },
  {
    group: "Cloud & DevOps",
    items: ["AWS (S3, CodePipeline)", "GitHub Actions", "Vercel", "CI/CD", "Docker"],
  },
];

// The featured resource — your AI Interview Coach. Flip `live` to true and set
// `href` to the deployed URL once it's shipped.
export const featuredResource = {
  emoji: "🎤",
  title: "AI Interview Coach",
  tagline: "Practice interviews with an AI that adapts to your resume.",
  description:
    "A mobile-first PWA that runs mock interviews with voice, generates resume-tailored questions, scores your answers, and gamifies your prep. Built with React, FastAPI, Groq, and Firebase.",
  stack: ["React / Vite", "FastAPI", "Groq", "Firebase", "PWA"],
  live: false, // set true when deployed
  href: "https://github.com/srujanachalluri", // TODO: replace with live app URL
  ctaLive: "Try it live",
  ctaSoon: "Launching soon",
};

// Curated links you'd hand a job-seeker or fellow ML engineer — taste, not self-promo.
export const resourceLinks = [
  {
    title: "My GitHub",
    note: "Source for the projects on this site — QSAR pipeline, LLM probes, and more.",
    href: "https://github.com/srujanachalluri",
  },
  {
    title: "LLM Fidelity Benchmarks",
    note: "The evaluation suites I map my reasoning probes to: TruthfulQA, StrategyQA, ROSCOE, ProcessBench.",
    href: "https://github.com/sylinrl/TruthfulQA",
  },
  {
    title: "RDKit",
    note: "The cheminformatics toolkit behind the Delta-Opioid feature engineering.",
    href: "https://www.rdkit.org/",
  },
];

export const education = [
  {
    school: "Concordia University Wisconsin",
    degree: "Master of Science — Computer Science",
    grade: "GPA 4.0 / 4.0",
    detail:
      "Focused on software development and AI/ML. Research Assistant on LLM Evaluation and AI-Driven Drug Discovery. Coursework: Data Structures & Algorithms, Database Systems, Machine Learning, Web Development, Software Engineering, Cloud Computing.",
  },
  {
    school: "RGUKT Basar",
    degree: "Bachelor of Technology — Computer Science",
    grade: "Grade 9.6 / 10",
    detail:
      "Foundations in DBMS, data mining, and software engineering, with early research internships in computer vision and deep learning.",
  },
];
