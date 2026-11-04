// Extra, in-depth content for the service detail pages, keyed by service id.
// Used by scripts/build-service-pages.mjs together with service-pages.data.mjs.
// Keep it practical and factual: no prices, client names, statistics or guaranteed timelines.

export const EXTRA = {
  mobile: {
    chips: ["iOS + Android", "One Flutter codebase", "Store release included"],
    problems: [
      ["Two separate apps cost twice as much to build and maintain.", "One Flutter codebase runs natively on iOS and Android, so every feature and fix ships to both at once."],
      ["Apps get rejected or delayed in App Store review.", "We prepare store listings, privacy details and review notes, and handle submission until the app is live."],
      ["The app works in testing but crashes for real users.", "Crash reporting and device testing catch problems early, and we fix them in regular updates."],
    ],
    features: [
      ["Native look and feel", "Smooth animations and platform-correct navigation on iPhone and Android."],
      ["Secure sign-in", "Email, phone or social login with secure session handling."],
      ["Payments in the app", "Card, wallet and in-app purchases connected to your payment provider."],
      ["Push notifications", "Order updates, reminders and campaigns that bring users back."],
      ["Works offline", "Key screens and data stay available on weak or no connection."],
      ["Admin panel", "A web dashboard to manage users, content and orders behind the app."],
    ],
    deliverables: ["iOS and Android apps live on the App Store and Google Play", "Full source code in your own repository", "Design files for every screen", "Admin panel and backend, if included in scope", "Handover documentation and store account access"],
    prepare: ["A short description of the app idea and who it is for", "The 3 to 5 most important things users must be able to do", "Any apps you like (or dislike) as references", "Your logo and brand colours, if you have them", "Apple and Google developer accounts, or we can help you set them up"],
    whyStack: "Flutter gives one codebase with native performance on both platforms, and Firebase adds sign-in, notifications and real-time data without building it from scratch.",
    moreFaqs: [
      ["Can you add an admin panel to manage the app?", "Yes. Most apps need one, and we build it as a web dashboard connected to the same backend."],
      ["Do you maintain the app after launch?", "Yes. We offer ongoing support for updates, new OS versions, fixes and new features."],
    ],
  },
  web: {
    chips: ["React + Next.js", "Fast and SEO-friendly", "Hosting included"],
    problems: [
      ["Your team runs the business on spreadsheets and email.", "A web app gives everyone one place for data, with the right access for each role."],
      ["The current system is slow and breaks on phones.", "Responsive, server-rendered pages load fast on any device and screen size."],
      ["Every change to the old system is risky and expensive.", "Clean, reusable components and code reviews make the app safe and easy to change."],
    ],
    features: [
      ["Role-based access", "Admins, staff and customers each see exactly what they should."],
      ["Dashboards and reports", "Live numbers and exportable reports instead of manual spreadsheets."],
      ["Customer portal", "Customers can log in, book, pay, track orders or download documents."],
      ["Integrations", "Connect payments, email, maps, ERPs and other tools you already use."],
      ["Fast on every device", "Server rendering and optimised assets for quick first loads."],
      ["Secure by design", "Authentication, permissions, input validation and audit logs."],
    ],
    deliverables: ["A live web application on your domain", "Full source code in your own repository", "Staging and production environments", "Admin and user documentation", "Hosting setup and access handed over to you"],
    prepare: ["Who will use the system and what each role needs to do", "Your current process: spreadsheets, forms or tools you use today", "Must-have features for the first version", "Any systems it must connect to (payments, ERP, email)", "Your domain name, if you already have one"],
    whyStack: "React and Next.js are widely used and well supported, so your app is fast, search-friendly and easy for any developer to maintain later.",
    moreFaqs: [
      ["Will the web app work on phones?", "Yes. Every screen is designed responsively and tested on phones, tablets and desktops."],
      ["Can it grow with my business?", "Yes. We plan the data model and structure for the growth you expect and add features in later phases."],
    ],
  },
  custom: {
    chips: ["Built around your process", "Data migration", "Team training"],
    problems: [
      ["Off-the-shelf software forces your team to change how it works.", "We build the tool around your real process, so adoption is quick and natural."],
      ["Data is scattered across spreadsheets, chats and paper.", "One central system with clean, searchable data and a single source of truth."],
      ["Managers chase people for numbers every week.", "Reports and dashboards update automatically from the data your team already enters."],
    ],
    features: [
      ["Inventory and stock", "Stock levels, transfers, low-stock alerts and multi-branch tracking."],
      ["Billing and invoices", "Invoices, payments and customer balances in one place."],
      ["HR and staff", "Staff records, attendance, leave and roles."],
      ["Approvals and workflows", "Requests move through the right people automatically."],
      ["Reports and exports", "The reports your managers use, exportable to Excel or PDF."],
      ["Access control", "Each user sees only the modules and data they need."],
    ],
    deliverables: ["A working system tailored to your process", "Your existing data migrated and checked", "Training for your team", "Admin and user documentation", "Source code and hosting access handed over"],
    prepare: ["A walkthrough of the process you want to improve", "Sample spreadsheets, forms or documents you use today", "Who uses the system and what each person needs", "The reports managers need most", "Any existing software it must work alongside"],
    whyStack: "A React interface on a Node.js and PostgreSQL backend gives a reliable, fast system with data integrity, and Supabase adds secure sign-in and permissions.",
    moreFaqs: [
      ["Can it work across multiple branches?", "Yes. Multi-branch setups with shared data and branch-level access are common in our projects."],
      ["Can we start small and add modules later?", "Yes. We usually launch with the most valuable module first and add more in later phases."],
    ],
  },
  uiux: {
    chips: ["User research", "Clickable prototype", "Design system"],
    problems: [
      ["Users get confused and drop off before finishing a task.", "We map the user journey and remove the friction points that cause drop-off."],
      ["Development starts before anyone has seen the product.", "A clickable prototype lets you test and change ideas before paying for code."],
      ["Every new screen looks a little different.", "A design system with reusable components keeps the product consistent."],
    ],
    features: [
      ["User research", "Interviews and reviews to understand real user needs."],
      ["Journey mapping", "Step-by-step flows for each key task in the product."],
      ["Wireframes", "Layout and structure agreed before visual design."],
      ["High-fidelity design", "Polished screens in your brand for mobile and desktop."],
      ["Clickable prototype", "Try the product on your phone or laptop before it is built."],
      ["Design system", "Colours, typography and components ready for developers."],
    ],
    deliverables: ["User flows for the key tasks", "High-fidelity screens for mobile and desktop", "A clickable prototype", "A design system with reusable components", "Developer-ready handoff files and specs"],
    prepare: ["Who your users are and what they need to achieve", "Your brand guidelines, logo and colours", "Screenshots of the current product, if redesigning", "Products or websites you like as references", "Any feedback or complaints you have heard from users"],
    whyStack: "Designing in reusable components means developers can build directly from the design system, which saves time and keeps the product consistent.",
    moreFaqs: [
      ["Do you design for both mobile and desktop?", "Yes. Screens are designed for the devices your users actually use."],
      ["Can you work with our existing developers?", "Yes. We hand off developer-ready files and stay available for questions during build."],
    ],
  },
  api: {
    chips: ["REST APIs", "Payment and ERP integrations", "Documented"],
    problems: [
      ["Apps are slow because the backend was not designed to scale.", "We design the database and queries for performance from day one."],
      ["Systems do not talk to each other, so staff re-enter data.", "APIs and integrations move data automatically between your tools."],
      ["No one knows how the backend works or how to change it.", "Versioned, documented APIs with clear structure any developer can follow."],
    ],
    features: [
      ["Database design", "Structured data built for integrity, reporting and growth."],
      ["Versioned REST APIs", "Stable endpoints your apps and partners can rely on."],
      ["Payment gateways", "Secure online payments connected to your orders and invoices."],
      ["Third-party integrations", "ERPs, email, SMS, maps and other services connected."],
      ["Authentication and permissions", "Secure access with roles, tokens and audit logs."],
      ["Monitoring and backups", "Logging, alerts and backups so problems are caught early."],
    ],
    deliverables: ["A secure, deployed backend and database", "API documentation for your developers and partners", "Configured integrations with your chosen services", "Monitoring, logging and backup setup", "Source code and infrastructure access handed over"],
    prepare: ["Which apps or systems will use the API", "The services you need to connect (payments, ERP, SMS)", "Your existing database or data, if any", "Expected number of users and growth", "Any security or compliance requirements"],
    whyStack: "Node.js with PostgreSQL is a proven, high-performance combination, and REST APIs are understood by every developer and platform.",
    moreFaqs: [
      ["Do you write automated tests?", "Yes. Critical endpoints and flows are covered by automated tests before release."],
      ["Can the API serve both our app and website?", "Yes. One backend can power your mobile apps, website and partner integrations."],
    ],
  },
  ai: {
    chips: ["Practical AI", "Human review built in", "Measured results"],
    problems: [
      ["Staff spend hours copying data from invoices and forms.", "AI reads documents and enters the data into your systems for review."],
      ["The same customer questions are answered again and again.", "A support assistant answers common questions from your own information."],
      ["AI feels risky and hard to start with.", "We start with one clear task, keep people in the loop and measure the results."],
    ],
    features: [
      ["Document processing", "Extract data from invoices, receipts, forms and PDFs."],
      ["Support assistants", "Answer customer questions from your website and documents."],
      ["Internal knowledge assistant", "Help your team find policies and information quickly."],
      ["Workflow automation", "Trigger actions in your systems from emails, forms or files."],
      ["Human review steps", "People approve results wherever accuracy matters."],
      ["Usage and quality tracking", "See how often it is used and how accurate it is."],
    ],
    deliverables: ["A working automation for your chosen task", "Integration with your documents, inbox or systems", "A review step for your team where needed", "Usage and accuracy reporting", "Documentation and a plan for the next tasks"],
    prepare: ["The repetitive task you want to automate", "A few real examples of the documents or questions involved", "Where the data comes from and where it should go", "Who should review the results", "How you will measure success (time saved, errors reduced)"],
    whyStack: "Modern AI models are combined with your own data and a human review step, so automations are useful from day one and stay under your control.",
    moreFaqs: [
      ["Is our data safe?", "We design automations to use only the data needed for the task and keep access restricted to your team."],
      ["Do we need technical staff to use it?", "No. Automations are built to fit into tools your team already uses."],
    ],
  },
  seo: {
    chips: ["Technical SEO", "Core Web Vitals", "Plain-language reports"],
    problems: [
      ["Your website gets visitors but few enquiries.", "We improve structure, speed and calls to action so the right visitors get in touch."],
      ["Google does not show your pages for important searches.", "Technical fixes, metadata and structured data help search engines understand your site."],
      ["The website is slow, especially on phones.", "Image, code and loading improvements make pages fast on every device."],
    ],
    features: [
      ["Technical SEO audit", "Crawl, indexing and site-health issues found and prioritised."],
      ["Speed optimisation", "Core Web Vitals improvements for faster loading."],
      ["On-page SEO", "Titles, descriptions, headings and content structure."],
      ["Structured data", "Schema markup so Google can show rich results."],
      ["Local SEO", "Google Business Profile and local search signals."],
      ["Analytics and reporting", "Search Console, analytics and monthly plain-language reports."],
    ],
    deliverables: ["A prioritised SEO audit", "Technical and on-page fixes applied", "Speed improvements with before and after scores", "Search Console and analytics set up", "Monthly reports on changes and results"],
    prepare: ["Access to your website and hosting", "Your Google Search Console and Analytics, if set up", "The services and locations you want to be found for", "Your main competitors", "Any SEO work done in the past"],
    whyStack: "Technical foundations come first, because content cannot rank on a website that search engines struggle to crawl, load or understand.",
    moreFaqs: [
      ["Do you write content too?", "We advise on content structure and the pages you need, and can help plan topics based on real searches."],
      ["Do you help with Google Business Profile?", "Yes. Local SEO, including your Google Business Profile, is part of the service."],
    ],
  },
  secp: {
    chips: ["Private limited and SMC", "Name to certificate", "NTN registration"],
    problems: [
      ["The SECP process and forms are confusing for first-time founders.", "We guide you step by step and prepare the documents for you."],
      ["Company names get rejected and delay registration.", "We check availability and suggest alternatives before reserving your name."],
      ["After incorporation, founders do not know what to file next.", "You get NTN registration and a clear list of your yearly compliance filings."],
    ],
    features: [
      ["Name availability check", "Search and reserve a suitable company name."],
      ["Company structure advice", "Private limited or single member company, directors and shareholding."],
      ["Incorporation documents", "Memorandum and Articles of Association prepared."],
      ["Online SECP filing", "Incorporation filed through the SECP online system."],
      ["NTN registration", "Company registered with the FBR after incorporation."],
      ["Compliance guidance", "A checklist of annual returns and filings to keep the company in good standing."],
    ],
    deliverables: ["Reserved company name", "Certificate of incorporation from the SECP", "Company NTN registration with the FBR", "Copies of your incorporation documents", "A yearly compliance checklist"],
    prepare: ["Two or three proposed company names", "CNICs of all directors and shareholders", "Registered office address", "The main business activity of the company", "Shareholding split between members"],
    whyStack: "Everything is filed through the official SECP and FBR online systems, so you receive genuine, verifiable registration documents.",
    moreFaqs: [
      ["Can overseas Pakistanis register a company?", "Yes, subject to SECP requirements. We guide you on the documents needed."],
      ["Can I verify my company after registration?", "Yes. SECP certificates can be verified online through the SECP's verification service."],
    ],
  },
  tax: {
    chips: ["FBR compliant", "Annual returns", "Active taxpayer status"],
    problems: [
      ["Deadlines are missed and penalties pile up.", "We track your deadlines and remind you well before each filing."],
      ["You are not sure which returns and statements your company must file.", "We review your position and give you a clear list of what is due."],
      ["Not being on the Active Taxpayers List causes higher tax deductions.", "Timely filing helps your company stay on the Active Taxpayers List."],
    ],
    features: [
      ["NTN registration", "Company registered with the FBR and its online profile set up."],
      ["Income tax returns", "Annual company returns prepared and filed."],
      ["Withholding statements", "Withholding tax statements prepared and submitted."],
      ["Records guidance", "What to keep, how to organise invoices and receipts."],
      ["Deadline reminders", "Alerts before every upcoming filing."],
      ["Notice support", "Help understanding FBR notices and next steps."],
    ],
    deliverables: ["Filed income tax return with proof of submission", "Withholding statements filed where applicable", "Updated FBR profile", "A records checklist for the next year", "Deadline calendar for upcoming filings"],
    prepare: ["Company NTN and FBR login, if already registered", "Bank statements for the tax year", "Sales and purchase invoices", "Salary and expense records", "Copies of previous returns, if any"],
    whyStack: "Returns are filed through the FBR's official IRIS system, and you receive acknowledgements for every submission.",
    moreFaqs: [
      ["Do you also file for individuals?", "Our focus is company filing. Contact us to discuss individual needs case by case."],
      ["What if we missed previous years?", "We review what is outstanding and explain the options to bring your filings up to date."],
    ],
  },
};
