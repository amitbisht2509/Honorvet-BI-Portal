/**
 * config.js — HonorVet Dashboard Portal
 * =============================================================================
 * THIS IS THE ONLY FILE YOU NORMALLY NEED TO EDIT.
 *
 * It contains three things:
 *   1. HVBI.auth        — security settings + SHA-256 password hashes
 *   2. HVBI.departments — the six cards on the landing page
 *   3. HVBI.dashboards  — the dashboards (and Power BI URLs) per department
 *
 * Everything the UI renders (card counts, "last updated" labels, search,
 * navigation, authentication) is derived from this file at runtime. See
 * README.md for step-by-step recipes.
 * =============================================================================
 */

window.HVBI = window.HVBI || {};

/* ===========================================================================
 * 1. AUTHENTICATION
 * ===========================================================================
 * Passwords are NEVER stored in this file — only their SHA-256 hashes.
 *
 * The hash is computed over:   saltPrefix + departmentKey + "|" + password
 * e.g. for Executive:          "HVBI|v1|executive|Exec@HVT2026"
 *
 * TO CHANGE A PASSWORD:
 *   Open tools/hash-generator.html in your browser, pick the department, type
 *   the new password, and paste the generated hash over the old `passwordHash`
 *   value below. Commit and push. (Details in README.md §2.)
 *
 * DEFAULT PASSWORDS SHIPPED WITH THIS BUILD — CHANGE THESE BEFORE ROLLOUT:
 *   Executive      Exec@HVT2026
 *   HR             HR@HVT2026
 *   Healthcare     Health@HVT2026
 *   IT             IT@HVT2026
 *   NON-IT         NonIT@HVT2026
 *   Pharmaceutical Pharma@HVT2026
 * =========================================================================== */
HVBI.auth = {
  // Salt namespace. Changing this invalidates every hash below, so if you
  // edit it you must regenerate all six hashes.
  saltPrefix: "HVBI|v1|",

  // sessionStorage key holding the signed session record.
  sessionKey: "hvbi.session",

  // Mixed into the session signature so a session cannot be hand-typed as
  // easily. Change it to force every open tab to re-authenticate.
  sessionSecret: "hvbi-portal-session-2026",

  // Maximum session lifetime in minutes (the session also dies when the
  // browser tab is closed, because it lives in sessionStorage).
  maxSessionMinutes: 480,

  // Brute-force throttle for the login popup.
  maxAttempts: 5,
  lockoutSeconds: 30,
};

/* ===========================================================================
 * 2. DEPARTMENTS  (the six landing-page cards)
 * ===========================================================================
 * key          Internal id. Must match the key used in HVBI.dashboards below.
 * name         Card title.
 * page         The protected page this department unlocks.
 * tagline      Short description shown on the card.
 * icon         Icon keyword (see ICONS in js/app.js for the full list).
 * from / to    Gradient colors for the card's icon tile and accents.
 * passwordHash SHA-256 hash — see the note in section 1.
 * =========================================================================== */
HVBI.departments = [
  {
    key: "executive",
    name: "Executive",
    page: "executive.html",
    tagline: "Company-wide performance, revenue and strategic KPIs for leadership.",
    icon: "trending",
    from: "#14B8A6",
    to: "#0EA5E9",
    passwordHash: "efb2f654af300286aaf4872498338a3ddd15962a5349484ca038b99bfdd3d6cb",
  },
  {
    key: "hr",
    name: "HR",
    page: "hr.html",
    tagline: "Workforce analytics across headcount, attrition, attendance and hiring.",
    icon: "users",
    from: "#8B5CF6",
    to: "#6366F1",
    passwordHash: "df6ed8a7b0dd25df96e1be134de0c4bf44d3de444aeb42260530f562b04c21af",
  },
  {
    // Healthcare is a HUB, not a portal: it asks for no password and instead
    // lists the delivery-manager sub-portals defined in HVBI.subPortals below.
    // Each of those has its own password. See README section 5b.
    key: "healthcare",
    name: "Healthcare",
    page: "healthcare.html",
    tagline: "Healthcare vertical requisitions, coverage and placement analytics.",
    icon: "heart",
    from: "#22D3EE",
    to: "#14B8A6",
    requiresAuth: false,   // no login screen — the sub-portals gate access
  },
  {
    key: "it",
    name: "IT",
    page: "it.html",
    tagline: "IT vertical pipeline health, recruiter output and delivery metrics.",
    icon: "server",
    from: "#0EA5E9",
    to: "#3B82F6",
    passwordHash: "caadeb95900b7db57343bd8f02d7c8ca23a9d456f2379fc59f22a1a8e39d3a88",
  },
  {
    key: "nonit",
    name: "NON-IT",
    page: "nonit.html",
    tagline: "Non-IT vertical requisitions, submissions and recruiter performance.",
    icon: "briefcase",
    from: "#FBBF24",
    to: "#F97316",
    passwordHash: "9497620423696424874397bf7bd8cba391577ee5b43a6356d5445f6ea57c25cd",
  },
  {
    key: "pharma",
    name: "Pharmaceutical",
    page: "pharma.html",
    tagline: "Pharmaceutical vertical hiring, coverage and client analytics.",
    icon: "flask",
    from: "#F43F5E",
    to: "#D946EF",
    passwordHash: "ac46e7f35be8ded4dd1e8609b9f3b84aaab2574c8da74a48da8237e2f6f958f5",
  },
];

/* ===========================================================================
 * 2b. SUB-PORTALS
 * ===========================================================================
 * A department listed here shows a second selection screen instead of its own
 * dashboards: the parent card opens with no password, and each sub-portal below
 * has its own password and its own dashboard page.
 *
 * Keyed by the PARENT department's key. Each sub-portal takes the same fields
 * as a department, plus:
 *
 * role     Shown under the name on the card (e.g. "Delivery Manager").
 * parent   The parent department key. Drives the breadcrumb, the back button,
 *          and where a failed auth check sends the visitor.
 *
 * Its `key` must also exist in HVBI.dashboards below.
 *
 * DEFAULT PASSWORDS — CHANGE BEFORE ROLLOUT:
 *   Sunita Chauhan   Sunita@HVT2026
 *   Nitish Sharma    Nitish@HVT2026
 * =========================================================================== */
HVBI.subPortals = {
  healthcare: [
    {
      key: "healthcare-sunita",
      name: "Sunita Chauhan",
      role: "Delivery Manager",
      parent: "healthcare",
      page: "healthcare-sunita.html",
      tagline: "Healthcare delivery portfolio managed by Sunita Chauhan — requisitions, coverage and placements.",
      icon: "users",
      from: "#22D3EE",
      to: "#0EA5E9",
      passwordHash: "3b69ab2308e519ffdde685def39745c61fb2549ada1950d07aacc7431de3d5e5",
    },
    {
      key: "healthcare-nitish",
      name: "Nitish Sharma",
      role: "Delivery Manager",
      parent: "healthcare",
      page: "healthcare-nitish.html",
      tagline: "Healthcare delivery portfolio managed by Nitish Sharma — requisitions, coverage and placements.",
      icon: "users",
      from: "#14B8A6",
      to: "#10B981",
      passwordHash: "c85e24cad005bc82b94998fe110be92761941368c3741a95ed55fcf58cc84e84",
    },
  ],
};

/* ===========================================================================
 * 3. DASHBOARDS
 * ===========================================================================
 * One array per department key. Each dashboard object:
 *
 * id          (required) Unique within its department. Used in the viewer URL.
 * name        (required) Card title.
 * description (required) One-line summary shown on the card.
 * icon        (required) Icon keyword — see ICONS in js/app.js.
 * url         (required) Power BI report URL. Leave "" until you have it; the
 *             card then renders in a clearly-marked "Not configured" state
 *             instead of opening a broken report.
 * refreshed   (optional) ISO date "YYYY-MM-DD" of the last data refresh.
 *             Shown on the card and used for the department's "Last updated".
 * embeddable  (optional) Set to false for reports you already know block
 *             iframes — the viewer then goes straight to the new-tab fallback.
 *
 * SECURITY: a "Publish to web" URL (app.powerbi.com/view?r=...) is PUBLIC to
 * anyone who has the link, with no Power BI sign-in and no Row-Level Security.
 * Use standard app.powerbi.com report links for confidential data. See
 * README.md §9.
 * =========================================================================== */
HVBI.dashboards = {
  executive: [
    {
      id: "overview",
      name: "Executive Overview",
      description: "Company-wide KPIs, revenue trend and strategic performance summary.",
      icon: "trending",
      url: "https://app.powerbi.com/view?r=eyJrIjoiNDFmNzI2MjQtZTA4MS00OWJjLWE5ZDQtZmYzZDhhNDdkYzk0IiwidCI6IjBmYmYxYzgyLWM3OWUtNDFkYi05YWQzLThkMTQ3MDk3MzcxYyIsImMiOjJ9",
      refreshed: "2026-08-03",
    },
    {
      id: "performance",
      name: "Performance Dashboard",
      description: "Goal completion, review cycles and performance rating distribution.",
      icon: "target",
      url: "https://app.powerbi.com/view?r=eyJrIjoiODRjMmVmZGEtZDc3Yi00MzgwLTg2MzItYjA5NDE2NTA1ODRlIiwidCI6IjBmYmYxYzgyLWM3OWUtNDFkYi05YWQzLThkMTQ3MDk3MzcxYyIsImMiOjJ9&pageName=861a97b53fb1d275be02",
      refreshed: "2026-08-03",
    },
    {
      id: "dailyActivity",
      name: "Daily Activity",
      description: "Day-over-day submissions, interviews and recruiter activity volume.",
      icon: "calendar",
      url: "https://app.powerbi.com/view?r=eyJrIjoiOTIzNDM5MDYtYjQxOC00N2UzLWJlNzYtZGQzOThkMjhlODE4IiwidCI6IjBmYmYxYzgyLWM3OWUtNDFkYi05YWQzLThkMTQ3MDk3MzcxYyIsImMiOjJ9&pageName=95451a584b4cc1ebdb57",
      refreshed: "2026-08-02",
    },
    {
      id: "revenue",
      name: "Revenue Dashboard",
      description: "Revenue by vertical, client and period against target.",
      icon: "dollar",
      url: "",
    },
    {
      id: "financial",
      name: "Financial Dashboard",
      description: "Margin, cost of delivery and financial health indicators.",
      icon: "chart",
      url: "",
    },
    {
      id: "kpi",
      name: "KPI Dashboard",
      description: "Scorecard of the organisation's tracked KPIs and thresholds.",
      icon: "gauge",
      url: "",
    },
    {
      id: "recruitmentSummary",
      name: "Recruitment Summary",
      description: "Consolidated hiring funnel across every business vertical.",
      icon: "clipboard",
      url: "",
    },
  ],

  hr: [
    {
      id: "attrition",
      name: "Attrition Dashboard",
      description: "Voluntary and involuntary attrition trend, reasons and hotspots.",
      icon: "trendingDown",
      url: "https://app.powerbi.com/view?r=eyJrIjoiMzIxNmM2NWUtNzMyYy00ODkyLTljNGEtYmNkMGY0OTMyY2RiIiwidCI6IjBmYmYxYzgyLWM3OWUtNDFkYi05YWQzLThkMTQ3MDk3MzcxYyIsImMiOjJ9",
      refreshed: "2026-08-03",
    },
    {
      id: "attendance",
      name: "Attendance Dashboard",
      description: "Attendance, leave utilisation and shift adherence by team.",
      icon: "calendar",
      url: "",
    },
    {
      id: "headcount",
      name: "Headcount Dashboard",
      description: "Active headcount by department, location and employment type.",
      icon: "users",
      url: "",
    },
    {
      id: "hiring",
      name: "Hiring Dashboard",
      description: "Open roles, offer conversion and time-to-fill across the org.",
      icon: "userPlus",
      url: "",
    },
    {
      id: "performance",
      name: "Performance Dashboard",
      description: "Appraisal cycle progress and rating distribution by function.",
      icon: "target",
      url: "",
    },
  ],

  /* Healthcare has no dashboards of its own — it is a hub. Each delivery
   * manager below gets their own copy of the six healthcare reports so their
   * Power BI URLs can point at differently-filtered reports. */
  "healthcare-sunita": [
    {
      id: "executiveSummary",
      name: "Executive Summary",
      description: "Top-level view of Sunita's healthcare delivery performance.",
      icon: "trending",
      url: "",
    },
    {
      id: "requisitionReport",
      name: "Requisition Report",
      description: "Open, on-hold and closed requisitions with ageing analysis.",
      icon: "clipboard",
      url: "",
    },
    {
      id: "coverageReport",
      name: "Coverage Report",
      description: "Requisition coverage ratio and submission depth per client.",
      icon: "shield",
      url: "",
    },
    {
      id: "clientReport",
      name: "Client Report",
      description: "Client-level volume, fill rate and revenue contribution.",
      icon: "building",
      url: "",
    },
    {
      id: "performanceReport",
      name: "Performance Report",
      description: "Recruiter and team productivity across Sunita's desk.",
      icon: "gauge",
      url: "",
    },
    {
      id: "activeCandidates",
      name: "Active Candidates",
      description: "Live candidate pipeline by stage, speciality and location.",
      icon: "users",
      url: "",
    },
  ],

  "healthcare-nitish": [
    {
      id: "executiveSummary",
      name: "Executive Summary",
      description: "Top-level view of Nitish's healthcare delivery performance.",
      icon: "trending",
      url: "",
    },
    {
      id: "requisitionReport",
      name: "Requisition Report",
      description: "Open, on-hold and closed requisitions with ageing analysis.",
      icon: "clipboard",
      url: "",
    },
    {
      id: "coverageReport",
      name: "Coverage Report",
      description: "Requisition coverage ratio and submission depth per client.",
      icon: "shield",
      url: "",
    },
    {
      id: "clientReport",
      name: "Client Report",
      description: "Client-level volume, fill rate and revenue contribution.",
      icon: "building",
      url: "",
    },
    {
      id: "performanceReport",
      name: "Performance Report",
      description: "Recruiter and team productivity across Nitish's desk.",
      icon: "gauge",
      url: "",
    },
    {
      id: "activeCandidates",
      name: "Active Candidates",
      description: "Live candidate pipeline by stage, speciality and location.",
      icon: "users",
      url: "",
    },
  ],

  it: [
    {
      id: "hiring",
      name: "IT Hiring",
      description: "IT requisition intake, offers released and joiners by month.",
      icon: "userPlus",
      url: "",
    },
    {
      id: "recruiters",
      name: "IT Recruiters",
      description: "Recruiter-level submissions, interviews and placement output.",
      icon: "users",
      url: "",
    },
    {
      id: "pipeline",
      name: "IT Pipeline",
      description: "Candidate pipeline health and stage-to-stage conversion.",
      icon: "database",
      url: "",
    },
    {
      id: "performance",
      name: "IT Performance",
      description: "Delivery SLAs, fill rate and turnaround time for the IT desk.",
      icon: "gauge",
      url: "",
    },
  ],

  nonit: [
    {
      id: "hiring",
      name: "NON-IT Hiring",
      description: "Non-IT requisition intake, offers and joiners by month.",
      icon: "userPlus",
      url: "",
    },
    {
      id: "pipeline",
      name: "NON-IT Pipeline",
      description: "Candidate pipeline health and stage-to-stage conversion.",
      icon: "database",
      url: "",
    },
    {
      id: "recruiters",
      name: "NON-IT Recruiters",
      description: "Recruiter-level submissions, interviews and placement output.",
      icon: "users",
      url: "",
    },
    {
      id: "performance",
      name: "NON-IT Performance",
      description: "Delivery SLAs, fill rate and turnaround time for the non-IT desk.",
      icon: "gauge",
      url: "",
    },
  ],

  pharma: [
    {
      id: "hiring",
      name: "Pharma Hiring",
      description: "Pharmaceutical requisition intake, offers and joiners by month.",
      icon: "userPlus",
      url: "",
    },
    {
      id: "coverage",
      name: "Pharma Coverage",
      description: "Requisition coverage ratio and submission depth per client.",
      icon: "shield",
      url: "",
    },
    {
      id: "performance",
      name: "Pharma Performance",
      description: "Recruiter and team productivity across the pharma desk.",
      icon: "gauge",
      url: "",
    },
    {
      id: "clients",
      name: "Pharma Clients",
      description: "Client-level volume, fill rate and revenue contribution.",
      icon: "building",
      url: "",
    },
  ],
};

/* ===========================================================================
 * Derived helpers — no need to edit below this line.
 * =========================================================================== */

/** Sub-portals of a department, or [] if it has none. */
HVBI.getSubPortals = function (key) {
  return (HVBI.subPortals && HVBI.subPortals[key]) || [];
};

/** Every sub-portal across every department, flattened. */
HVBI.allSubPortals = function () {
  var all = [];
  Object.keys(HVBI.subPortals || {}).forEach(function (parent) {
    all = all.concat(HVBI.subPortals[parent]);
  });
  return all;
};

/**
 * Look up a portal by key. Searches top-level departments first, then
 * sub-portals, so auth.js and the page controllers treat both identically.
 */
HVBI.getDepartment = function (key) {
  var match = HVBI.departments.find(function (d) {
    return d.key === key;
  });
  if (match) return match;
  return HVBI.allSubPortals().find(function (d) {
    return d.key === key;
  }) || null;
};

/** True when a portal is a hub that delegates access to its sub-portals. */
HVBI.isHub = function (key) {
  return HVBI.getSubPortals(key).length > 0;
};

/**
 * Dashboards for a portal. A hub department has none of its own, so it
 * reports its sub-portals' dashboards combined — that keeps the landing-page
 * card counts honest without duplicating any configuration.
 */
HVBI.getDashboards = function (key) {
  if (HVBI.isHub(key)) {
    return HVBI.getSubPortals(key).reduce(function (list, sub) {
      return list.concat(HVBI.dashboards[sub.key] || []);
    }, []);
  }
  return HVBI.dashboards[key] || [];
};

HVBI.getDashboard = function (key, id) {
  return HVBI.getDashboards(key).find(function (d) {
    return String(d.id) === String(id);
  }) || null;
};

/** Most recent `refreshed` date across a department, or null if none set. */
HVBI.getLastUpdated = function (key) {
  return HVBI.getDashboards(key).reduce(function (latest, d) {
    if (!d.refreshed) return latest;
    return !latest || d.refreshed > latest ? d.refreshed : latest;
  }, null);
};
