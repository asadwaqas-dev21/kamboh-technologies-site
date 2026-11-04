import { ADDRESS, COMPANY_NAME, EMAIL, NTN, PHONE_DISPLAY, SECP_CUIN, SITE_URL, WHATSAPP_HREF } from "./contact";

type Service = { id: string; slug: string; title: string; summary: string; included: string[]; stack: string[] };

/** The seven services, as described on /services. */
export const SERVICES: Service[] = [
  {
    id: "mobile",
    slug: "mobile-app-development",
    title: "Mobile App Development",
    summary: "iOS and Android apps from one Flutter codebase, with offline support, push notifications and app-store release handled for the client.",
    included: ["Product scoping and screen-by-screen user flows", "Flutter app for iOS and Android from one codebase", "Sign-in, payments, push notifications and offline mode", "App Store and Google Play submission", "Crash reporting and post-launch updates"],
    stack: ["Flutter", "Dart", "Firebase", "REST APIs"],
  },
  {
    id: "web",
    slug: "web-application-development",
    title: "Web Application Development",
    summary: "Fast, accessible web apps and portals built with React and Next.js, from customer dashboards to booking systems.",
    included: ["Responsive interfaces that work on every screen size", "Customer portals, dashboards and admin panels", "Roles, permissions and secure sign-in", "Accessibility and performance checks before launch", "Hosting, deployment and staging environments"],
    stack: ["React", "Next.js", "Node.js", "PostgreSQL"],
  },
  {
    id: "custom",
    slug: "custom-software-development",
    title: "Custom Software Solutions",
    summary: "Inventory, HR, billing or operations software shaped around how the client's team works, replacing spreadsheets and manual steps.",
    included: ["Process mapping with the people who do the work", "Inventory, HR, billing and operations modules", "Data migration from spreadsheets or older systems", "Reports and exports managers use", "Training and handover documentation"],
    stack: ["React", "Node.js", "Supabase", "PostgreSQL"],
  },
  {
    id: "uiux",
    slug: "ui-ux-design",
    title: "UI/UX Design",
    summary: "Research-led interface design, clickable prototypes and design systems developers can build from directly.",
    included: ["User research and journey mapping", "Wireframes and high-fidelity screens", "Clickable prototypes for feedback and testing", "A reusable design system", "Developer-ready handoff"],
    stack: ["User flows", "Prototype", "Design system", "Handoff files"],
  },
  {
    id: "api",
    slug: "backend-api-development",
    title: "Backend & API Development",
    summary: "Secure APIs, databases and integrations with payment gateways, ERPs and third-party services, documented and built to grow.",
    included: ["Database design for integrity and reporting", "Versioned REST APIs with clear documentation", "Payment gateway, ERP and third-party integrations", "Authentication, permissions and audit logs", "Background jobs, backups and monitoring"],
    stack: ["Node.js", "REST APIs", "PostgreSQL", "Supabase"],
  },
  {
    id: "ai",
    slug: "ai-automation",
    title: "AI-Powered Automation",
    summary: "Practical AI for real workflows: document processing, support assistants and automations that take repetitive work off a team. Starts with one measurable task.",
    included: ["Finding the repetitive tasks worth automating", "Reading invoices, forms and documents into business systems", "Support and internal knowledge assistants", "Human review steps where accuracy matters", "Usage and quality tracking"],
    stack: [],
  },
  {
    id: "seo",
    slug: "seo-digital-growth",
    title: "SEO & Digital Growth",
    summary: "Technical SEO, site speed and clear content structure so the right customers can find a business, with honest reporting.",
    included: ["Technical SEO audit and fixes", "Page speed and Core Web Vitals improvements", "Site structure, metadata and structured data", "Analytics and search console setup", "Monthly reports in plain language"],
    stack: [],
  },
];

/**
 * Plain-text fact sheet used as the only knowledge base of the on-site AI assistant (/api/chat).
 * Everything here is taken from the website's own pages. No prices, ratings or client names are published.
 */
export function buildBusinessFacts(): string {
  const services = SERVICES.map(
    (s) =>
      `### ${s.title} (${SITE_URL}/services/${s.slug})\n${s.summary}\nIncluded:\n${s.included.map((i) => `- ${i}`).join("\n")}` +
      (s.stack.length ? `\nTypical stack: ${s.stack.join(", ")}` : ""),
  ).join("\n\n");

  return `# ${COMPANY_NAME}

> Software house in Johar Town, Lahore, Pakistan. Designs and builds mobile apps, web platforms and custom business software for companies in Pakistan and abroad.

## Key facts
- Address: ${ADDRESS}
- Phone: ${PHONE_DISPLAY}
- WhatsApp: ${WHATSAPP_HREF}
- Email: ${EMAIL}
- Website: ${SITE_URL}
- Contact form: ${SITE_URL}/contact
- Registered with SECP (Corporate Unique Identification No. ${SECP_CUIN}), incorporated 5 June 2025 under the Companies Act, 2017
- FBR NTN: ${NTN}, income tax status active
- Works with clients at home and abroad, with video calls, a shared project board and updates scheduled around the client's time zone
- Office hours: Monday to Friday, 6:00 AM to 10:00 PM Pakistan time (PKT); closed Saturday and Sunday
- Prices: not published. Every project gets a written scope and estimate after a short discovery call.

## Leadership
- Asad Waqas: Chief Executive Officer
- Ahmad Waqas: Director
- Abdul Sattar: Finance Manager
- Faisal Naveed: Business Development Manager

## Services (7)
${services}

## Ways to work together
- Fixed-scope project: clear scope, timeline and estimate agreed up front; milestone-based delivery; launch and handover.
- Dedicated team: developers and designers working as an extension of the client's team; flexible priorities each sprint; shared board and sprint demos; scale up or down.
- Support and maintenance: ongoing care for live products, whether Kamboh built them or not; updates and security patches; monitoring and bug fixes; small improvements each month.

## Process (5 phases)
1. Discovery: learn how the business works, who the users are and what success looks like. Output: clear scope, priorities and an estimate before anything is built.
2. Strategy & Design: map user journeys, design and prototype the key screens; the client clicks through the product before code is written.
3. Development: short sprints with a working version shared at the end of each one.
4. Quality Assurance: every release tested across devices, browsers and edge cases, with automated checks on critical flows.
5. Launch & Evolution: deployment and app-store release, then monitoring, support and improvements.

## How a project starts
1. The team reads the inquiry and replies with questions.
2. A short discovery call about goals, users, timeline and budget.
3. A written scope with priorities, assumptions and an estimate.
4. Kickoff: project board set up, starting with discovery and design.

## Technology stack
Mobile: Flutter, Dart. Web: React, Next.js, JavaScript. Services: Node.js, REST APIs. Data and auth: Firebase, Supabase, PostgreSQL.
Practices on every project: code review on every change, automated tests for critical flows, separate staging and production, automated builds and deployments, error tracking and monitoring, documentation and clean handover.

## Frequently asked questions
- Estimates: a short discovery call, then a scope document listing features, priorities and assumptions; the estimate is based on that scope.
- Clients outside Pakistan: yes, with regular video calls, a shared project board and updates around the client's time zone.
- Code ownership: set out in the project agreement; in a typical client project the code, designs and documentation are handed over at the end.
- Taking over an existing app: yes, starting with a code review to list risks and quick wins, then a plan to stabilise and improve it.
- After launch: monitoring, fixes and dependency updates; many clients continue with a support plan or dedicated team.

## Example work
The projects page (${SITE_URL}/projects) shows four EXAMPLE CONCEPTS, not real client case studies: a business management platform (Next.js, PostgreSQL), a mobile commerce app (Flutter, Firebase), a custom CRM (React, Node.js, Supabase) and a digital service booking platform (Next.js, Flutter, Supabase).
`;
}
