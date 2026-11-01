export const personal = {
  name: "Harsh Pratap Singh",
  initials: "HPS",
  role: "Software Engineer · Full-Stack Developer · AI/ML",
  email: "harshpsingh2005@gmail.com",
  location: "Gurugram, Haryana, India",
  linkedin: "https://www.linkedin.com/in/harshpsingh676767/",
  leetcode: "https://leetcode.com/u/harshps/",
  // TODO: add GitHub profile URL once confirmed.
  github: "https://github.com/harsh-pratapsingh24",
  resume: "/resume/harsh-pratap-singh-resume.pdf",
};

export const experience = [
  {
    organization: "Dotnitron Technologies",
    role: "Software Development Engineer Intern",
    period: "Jul 2026 — Aug 2026",
    tag: "SDE / AI Research",
    description:
      "Contributed to software development, research and testing, including exploration of Retrieval-Augmented Generation approaches, product features and application quality.",
    skills: ["RAG", "AI engineering", "Full-stack", "Testing"],
  },
  {
    organization: "VentureX",
    role: "Tech Intern",
    period: "Jun 2026 — Jul 2026",
    tag: "Product Engineering",
    description:
      "Contributed to TicketSync, a full-stack institutional complaint-management platform, with a focus on frontend experience and application functionality.",
    skills: ["Frontend", "UX", "Web platform"],
  },
  {
    organization: "Alumni Association · BML Munjal University",
    role: "Technical Intern",
    period: "Jun 2025 — Jul 2025",
    tag: "Data Engineering",
    description:
      "Digitized and organized 7,000+ alumni records using Python and MySQL, improving data accessibility for engagement initiatives.",
    skills: ["Python", "MySQL", "Data operations"],
  },
  {
    organization: "ACM BMU Student Chapter",
    role: "Extended Executive Committee Member",
    period: "Aug 2024 — Jun 2025",
    tag: "Community",
    description:
      "Participated in organizing technical events, workshops and student engagement initiatives.",
    skills: ["Events", "Technical community"],
  },
];

export const projects = [
  {
    id: "01",
    title: "PsyTrace",
    subtitle: "AI therapist",
    category: "AI/ML",
    description:
      "An AI-powered conversational experience designed around real-time emotion analysis and personalized reflection.",
    features: [
      "Emotion-aware conversations",
      "Personalized memory",
      "Mood pattern summaries",
    ],
    stack: ["Next.js", "Node.js", "MongoDB", "Groq", "Llama 3"],
    status: "Built",
    accent: "blue",
  },
  {
    id: "02",
    title: "TicketSync",
    subtitle: "Complaint intelligence",
    category: "Full-Stack",
    description:
      "A multi-tenant grievance-resolution workflow connecting students and campus administrators in one responsive system.",
    features: ["Live ticket tracking", "Role-based access", "SLA visibility"],
    stack: ["JavaScript", "Vite", "Firebase", "Firestore"],
    status: "Built",
    accent: "white",
  },
  {
    id: "03",
    title: "NutriGuard",
    subtitle: "Food intelligence",
    category: "AI/ML",
    description:
      "Image-led nutritional analysis that turns food photos into practical nutritional insights and healthier alternatives.",
    features: ["Food image analysis", "Nutrition estimates", "Health scoring"],
    stack: ["Python", "Streamlit", "Gemini API"],
    status: "Live",
    accent: "blue",
    live: "https://harshpratap-nutriguard.streamlit.app/",
    repository: "https://github.com/harsh-pratapsingh24/JOE-APP",
  },
  {
    id: "04",
    title: "Stocks Prediction Model",
    subtitle: "Forecasting intelligence",
    category: "AI/ML",
    description:
      "A data application bringing market history, forecasting and news sentiment into a single research-oriented view.",
    features: [
      "Time-series forecasts",
      "Candlestick views",
      "Sentiment analysis",
    ],
    stack: ["Python", "Prophet", "yfinance", "VADER"],
    status: "In refinement",
    accent: "white",
  },
];

export const skills = [
  ["Programming", ["Python", "C++", "Java", "JavaScript", "TypeScript", "SQL"]],
  ["Frontend", ["HTML5", "CSS3", "React", "Next.js", "Tailwind CSS", "Vite"]],
  ["Backend", ["Node.js", "FastAPI", "REST APIs", "WebSockets", "JWT"]],
  ["Data", ["MySQL", "MongoDB", "PostgreSQL", "Firebase", "Cloud Firestore"]],
  [
    "AI / ML",
    ["LLM integration", "Groq", "Gemini", "Forecasting", "Sentiment"],
  ],
  ["Tools", ["Git", "GitHub", "Docker", "Linux", "Inngest", "Streamlit"]],
] as const;
