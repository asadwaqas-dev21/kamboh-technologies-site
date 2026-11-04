// Legal pages: privacy, terms, cookies, accessibility, contract information, disclaimer.
// Edit here, then run:  npm run legal   (rebuilds public/<slug>.html)
// Keep these pages in sync with what the site actually does (forms, Ask AI, analytics, providers).

const CO = "Kamboh Technologies (Private) Limited";
const ADDR = "Plot 111, Block A1, PIA Housing Society, Johar Town, Lahore 55030, Pakistan";
const MAIL = '<a href="mailto:info@kambohtechnologies.com">info@kambohtechnologies.com</a>';
const PHONE = '<a href="tel:+923028207226">+92 302 8207226</a>';

export const UPDATED = "2026-11-04";

export const LEGAL = [
  // ---------------------------------------------------------------- PRIVACY
  {
    slug: "privacy-policy",
    nav: "Privacy policy",
    title: "Privacy Policy",
    seoTitle: "Privacy Policy",
    desc: "How Kamboh Technologies collects, uses, stores and protects personal information from our website, Ask Kamboh AI, inquiries and client projects.",
    lead: "This policy explains what personal information we collect when you visit our website, chat with Ask Kamboh AI or work with us, why we collect it, who we share it with and the choices you have.",
    body: `
<div class="callout">
  <p class="callout-h">Privacy at a glance</p>
  <ul>
    <li>We collect only what we need to answer your inquiry, deliver our services and keep the website secure.</li>
    <li><strong>We do not sell your personal information</strong>, and we do not use advertising cookies.</li>
    <li>Analytics cookies are set <strong>only if you click “Accept”</strong> in the cookie banner. You can change your choice anytime.</li>
    <li>Ask Kamboh AI conversations are <strong>not stored in our database</strong>. Only an inquiry you ask the assistant to send is saved.</li>
    <li>You can ask us to access, correct or delete your information by emailing ${MAIL}.</li>
  </ul>
</div>

<h2>Who we are</h2>
<p>This website, <a href="/">kambohtechnologies.com</a>, is operated by <strong>${CO}</strong>, a private limited company incorporated with the Securities and Exchange Commission of Pakistan (SECP CUIN 0297023, FBR NTN G813109), with its office at ${ADDR}.</p>
<p>We are responsible for (the “controller” of) the personal information described in this policy. In this policy, “we”, “us” and “our” mean ${CO}, and “you” means anyone who visits our website, contacts us or works with us.</p>

<h2>Information we collect</h2>
<h3>Information you give us</h3>
<ul>
  <li><strong>Contact form:</strong> your name, email address, company name (optional), the service you are interested in and your project description.</li>
  <li><strong>Ask Kamboh AI:</strong> the messages you type and any image you choose to attach. If you ask the assistant to send an inquiry to our team, it also collects the details you provide, such as your name, phone or email, company, the service you need, your timeline and a short project summary, and <strong>confirms them with you before sending</strong>.</li>
  <li><strong>Email, phone and WhatsApp:</strong> the information you share when you contact us directly.</li>
  <li><strong>Clients:</strong> when you hire us, contract and billing details (such as the signatory’s name and role, company details and tax numbers for invoicing) and the project materials you share with us.</li>
</ul>
<p>Please do not send us sensitive personal information (for example health information, CNIC images, passwords or payment card details) through the website or the AI assistant. Where a service such as SECP registration or tax filing genuinely requires identity documents, we will tell you how to share them securely.</p>

<h3>Information collected automatically</h3>
<ul>
  <li><strong>Server and security logs:</strong> our hosting provider automatically records technical information when pages are requested, such as your IP address, browser type, the page requested and the date and time. This is needed to deliver the website and protect it from abuse.</li>
  <li><strong>Spam and abuse protection:</strong> to limit automated abuse of the contact form and the AI assistant, our server briefly uses your IP address to count requests. These counters are held only in temporary memory and expire within about an hour.</li>
  <li><strong>Analytics (only with your consent):</strong> if you accept analytics cookies, Google Analytics collects information such as the pages you visit, how long you stay, your device and browser type, your approximate location (city or country), how you arrived at our site and whether you submitted the contact form. Google Analytics does not log or store full IP addresses.</li>
  <li><strong>Preferences stored in your browser:</strong> your light or dark theme choice and your cookie choice. See our <a href="/cookie-policy">Cookie Policy</a>.</li>
</ul>

<h3>Information from other sources</h3>
<p>If someone refers you to us, or you ask us to review your existing website, app or business, we may look at publicly available information about your business to prepare a better proposal.</p>

<h2>How we use your information</h2>
<p>We use personal information only for the purposes below. Where data protection laws such as the EU or UK GDPR apply to you, the table also shows the legal basis we rely on.</p>
<div class="table-wrap">
<table>
  <thead><tr><th scope="col">Purpose</th><th scope="col">Information used</th><th scope="col">Legal basis (where applicable)</th></tr></thead>
  <tbody>
    <tr><td>Reply to your inquiry, ask questions and prepare a proposal or quotation</td><td>Contact details, service, project description</td><td>Steps taken at your request before entering a contract; our legitimate interest in responding to business inquiries</td></tr>
    <tr><td>Deliver our services and manage our relationship with clients</td><td>Contact, contract and project information</td><td>Performance of a contract</td></tr>
    <tr><td>Invoicing, accounting, tax and company-law records</td><td>Billing and transaction details</td><td>Compliance with legal obligations</td></tr>
    <tr><td>Answer questions through Ask Kamboh AI</td><td>Chat messages and attached images</td><td>Our legitimate interest in providing instant answers that you choose to request</td></tr>
    <tr><td>Keep the website secure and prevent spam, fraud and abuse</td><td>IP address, technical logs, request counts</td><td>Our legitimate interest in protecting our website and users</td></tr>
    <tr><td>Understand how the website is used and improve it</td><td>Analytics data</td><td>Your consent, which you can withdraw at any time</td></tr>
  </tbody>
</table>
</div>
<p>We do not send marketing newsletters unless you ask to receive them, and every such email will include a way to unsubscribe. We do not make decisions that have legal or similarly significant effects on you based solely on automated processing.</p>

<h2 id="ask-ai">Ask Kamboh AI</h2>
<p>Ask Kamboh AI is an AI assistant that answers questions about our services. To generate replies, your messages (and any image you attach) are sent from our server to <strong>Google’s Gemini API</strong>, which processes them under Google’s terms for that service.</p>
<ul>
  <li>Your conversation is kept only in your browser while the page is open. <strong>We do not store chat transcripts</strong> in our database.</li>
  <li>If you ask the assistant to send an inquiry to our team, the confirmed details are saved as an inquiry and emailed to us, just like a contact form submission.</li>
  <li>If you ask the assistant to fill in the contact form for you, the suggested details are passed to the form through your browser’s temporary session storage and removed as soon as the form is filled. Nothing is sent until you press “Send Inquiry”.</li>
  <li>AI answers can be inaccurate. Our team confirms prices, timelines and every other detail before any commitment.</li>
  <li>Please do not share passwords, payment details or sensitive personal information in the chat.</li>
</ul>

<h2>Cookies and similar technologies</h2>
<p>We use a small number of essential browser storage items (for your theme and cookie choice) and, only if you accept them, Google Analytics cookies. We do not use advertising or cross-site tracking cookies. Full details, including names and durations, are in our <a href="/cookie-policy">Cookie Policy</a>.</p>
<p>You can change your choice at any time using “Cookie settings” in the footer of every page.</p>

<h2>Who we share information with</h2>
<p>We do not sell or rent personal information. We share it only with trusted service providers who help us run our website and business, under contracts that require them to protect it and use it only on our instructions:</p>
<div class="table-wrap">
<table>
  <thead><tr><th scope="col">Provider</th><th scope="col">What they do for us</th><th scope="col">Main location</th></tr></thead>
  <tbody>
    <tr><td>Vercel Inc.</td><td>Website hosting, content delivery and server logs</td><td>United States (global network)</td></tr>
    <tr><td>Google (Firebase / Cloud Firestore)</td><td>Secure storage of inquiries for our team</td><td>United States / Google Cloud regions</td></tr>
    <tr><td>Google (Gemini API)</td><td>Generating Ask Kamboh AI replies</td><td>United States / global</td></tr>
    <tr><td>Google (Analytics)</td><td>Website statistics, only with your consent</td><td>United States / global</td></tr>
    <tr><td>Google (Fonts and Maps)</td><td>Website fonts on every page, and the office map on the Contact page</td><td>United States / global</td></tr>
    <tr><td>Resend</td><td>Delivering inquiry emails to our inbox</td><td>United States</td></tr>
    <tr><td>Meta (WhatsApp)</td><td>Only if you choose to message us on WhatsApp</td><td>Global</td></tr>
  </tbody>
</table>
</div>
<p>We may also share information with our professional advisers (such as lawyers and accountants) under a duty of confidentiality, with government authorities or courts where the law requires it or to respond to a valid legal request, and with a buyer or successor if our business is ever reorganised or sold, in which case this policy will continue to protect your information.</p>

<h2>International transfers</h2>
<p>We are based in Pakistan, and several of our providers process data in the United States and other countries. Where data protection law requires it, we rely on appropriate safeguards for these transfers, such as the standard contractual clauses and data processing terms offered by our providers.</p>

<h2>How long we keep information</h2>
<ul>
  <li><strong>Inquiries that do not become projects:</strong> up to 24 months after our last contact with you, so we can follow up on the same conversation, then deleted.</li>
  <li><strong>Client records:</strong> for the duration of our relationship and afterwards for as long as company and tax laws require us to keep business and accounting records.</li>
  <li><strong>Analytics data:</strong> no longer than 14 months.</li>
  <li><strong>Server logs and abuse counters:</strong> for the short periods set by our hosting provider, and about an hour for request counters.</li>
  <li><strong>Ask Kamboh AI:</strong> chat transcripts are not stored by us. Inquiries sent through the assistant follow the inquiry rule above.</li>
</ul>

<h2>How we protect your information</h2>
<p>We use encryption in transit (HTTPS) across the whole website, store inquiries in a database that cannot be accessed directly from the internet, restrict our admin area to named team members who must sign in, and limit access to personal information to people who need it for their work. No method of transmission or storage is completely secure, but we work to protect your information and will act promptly if we become aware of a security incident.</p>

<h2>Your rights and choices</h2>
<p>Depending on where you live, you may have the right to:</p>
<ul>
  <li><strong>Access</strong> the personal information we hold about you and receive a copy</li>
  <li><strong>Correct</strong> information that is inaccurate or incomplete</li>
  <li><strong>Delete</strong> your information where we no longer need it or you withdraw consent</li>
  <li><strong>Object to or restrict</strong> certain uses, including any direct marketing</li>
  <li><strong>Withdraw consent</strong> at any time, for example to analytics cookies</li>
  <li><strong>Data portability</strong>, receiving your information in a commonly used format</li>
</ul>
<p>To make a request, email ${MAIL} with the subject “Privacy request”. We may need to confirm your identity before acting on it, and we aim to respond within 30 days. You will not be charged for a reasonable request.</p>
<p>If you are in the European Union or United Kingdom, you can also complain to your local data protection authority. If you are in Canada, you can contact the Office of the Privacy Commissioner of Canada. We would appreciate the chance to address your concern first.</p>

<h2>Laws we follow</h2>
<p>We handle personal information in line with the laws of Pakistan, including the Prevention of Electronic Crimes Act 2016 (as amended) and the right to privacy protected by Article 14 of the Constitution of Pakistan. Pakistan’s proposed personal data protection law has not yet been enacted; when it is, we will update this policy and our practices to comply with it. Where we serve clients or visitors in other countries, we also respect the data protection laws that apply to them, such as the EU and UK GDPR and Canada’s PIPEDA.</p>

<h2>Children</h2>
<p>Our website and services are intended for businesses and adults. We do not knowingly collect personal information from anyone under 18. If you believe a child has sent us information, please contact us and we will delete it.</p>

<h2>Links to other websites</h2>
<p>Our website links to other sites, such as Google Maps, Instagram, GitHub, WhatsApp and the SECP. We are not responsible for their privacy practices, so please read their policies.</p>

<h2>Changes to this policy</h2>
<p>We may update this policy when our services, providers or the law change. The “Last updated” date at the top shows when it was last revised. If we make a significant change, we will make it clear on this page.</p>

<h2>Contact us</h2>
<p>For any question about privacy or this policy, contact ${CO} at ${MAIL}, call ${PHONE}, or write to us at ${ADDR}.</p>
`,
  },

  // ---------------------------------------------------------------- TERMS
  {
    slug: "terms-and-conditions",
    nav: "Terms & conditions",
    title: "Terms and Conditions",
    seoTitle: "Terms and Conditions",
    desc: "The terms for using the Kamboh Technologies website, Ask Kamboh AI and our content, including intellectual property, liability and governing law.",
    lead: "These terms govern your use of kambohtechnologies.com, including Ask Kamboh AI and the information we publish. Please read them carefully. By using the website, you agree to them.",
    body: `
<div class="callout">
  <p class="callout-h">In short</p>
  <ul>
    <li>Use the website lawfully and do not try to disrupt, copy or misuse it.</li>
    <li>Our content is general information, not professional legal, tax or financial advice.</li>
    <li>Quotes and AI answers are not binding. Projects are governed by a separate signed agreement.</li>
    <li>These terms are governed by the laws of Pakistan, with the courts at Lahore having jurisdiction.</li>
  </ul>
</div>

<h2>About these terms</h2>
<p>This website is operated by <strong>${CO}</strong> (SECP CUIN 0297023), ${ADDR} (“we”, “us”, “our”). These terms apply to everyone who visits or uses the website (“you”).</p>
<p>These terms cover use of the website only. When you hire us for a project, that work is governed by a separate written agreement, such as a proposal, statement of work or service agreement, which takes priority over these terms for that project. See our <a href="/contract-information">Contract Information</a> page for how our agreements usually work.</p>

<h2>Using our website</h2>
<p>You may browse the website, read and share our articles with a link back to the original, and contact us about our services. When you use the website you agree not to:</p>
<ul>
  <li>Break any law, including the Prevention of Electronic Crimes Act 2016, or help anyone else do so</li>
  <li>Try to gain unauthorised access to the website, our admin area, servers or databases, or test their security without our written permission</li>
  <li>Introduce viruses or harmful code, or overload the website with automated requests</li>
  <li>Scrape, copy or republish substantial parts of the website, or use it to train AI models, without our written permission</li>
  <li>Submit false, misleading, offensive or unlawful information through our forms or AI assistant, or impersonate someone else</li>
  <li>Use the contact form or AI assistant to send spam or unsolicited advertising</li>
</ul>
<p>We may restrict or block access to anyone who breaks these rules.</p>

<h2>Ask Kamboh AI</h2>
<p>Ask Kamboh AI is an automated assistant powered by a third-party AI model. It is provided to help you find information quickly, but:</p>
<ul>
  <li>Its answers are generated automatically and <strong>may be incomplete or wrong</strong>. They are not offers, quotations, guarantees or professional advice.</li>
  <li>Only a written proposal or agreement from our team is binding on us.</li>
  <li>You must not use the assistant for anything unlawful, to try to make it ignore its instructions, or to obtain information unrelated to our services.</li>
  <li>Your use of the assistant is also covered by our <a href="/privacy-policy#ask-ai">Privacy Policy</a>.</li>
</ul>

<h2>Information on this website</h2>
<p>We work to keep the website accurate and up to date, but its content, including blog articles and information about SECP registration and tax filing, is <strong>general information only</strong>. It is not legal, tax, accounting or financial advice and should not be relied on as such. Laws, fees and procedures change; always confirm requirements with the relevant authority or a qualified adviser. See our <a href="/disclaimer">Disclaimer</a>.</p>
<p>Prices, timelines and service descriptions on the website are indicative. They do not form an offer that you can accept, and we may change them at any time.</p>

<h2>Intellectual property</h2>
<p>The website and its content, including text, graphics, designs, illustrations, code, the Kamboh Technologies name and logo, are owned by or licensed to us and are protected by copyright and trademark laws, including the Copyright Ordinance 1962 and the Trade Marks Ordinance 2001 of Pakistan, and international treaties.</p>
<p>You may not use our name, logo or content to suggest that we endorse you or your products. Third-party names and logos shown on the website (for example, technologies we use) belong to their owners and are used only to describe our work.</p>
<p>Ownership of software and designs we create for clients is set out in each client’s agreement, not in these terms.</p>

<h2>Submissions and feedback</h2>
<p>When you send us an inquiry, you confirm that the information is accurate and that you are allowed to share it. If you send us ideas or feedback about our website or services, we may use them without any obligation to you. We will treat project details you share in confidence as described in our <a href="/privacy-policy">Privacy Policy</a> and, where signed, a non-disclosure agreement.</p>

<h2>Links to other websites</h2>
<p>The website contains links to third-party sites and services, such as Google Maps, WhatsApp, Instagram, GitHub and government websites. We do not control them and are not responsible for their content, availability or practices.</p>

<h2>Availability</h2>
<p>We aim to keep the website available and secure, but we do not guarantee that it will always be available, uninterrupted or free of errors. We may change, suspend or withdraw any part of it at any time, for example for maintenance.</p>

<h2>Limitation of liability</h2>
<p>To the fullest extent permitted by law, the website and its content are provided “as is” and “as available”, without warranties of any kind, express or implied. We are not liable for any indirect, incidental or consequential loss, or for loss of profits, revenue, data or business opportunities, arising from your use of, or inability to use, the website or the AI assistant, or from reliance on any information on it.</p>
<p>Nothing in these terms limits or excludes any liability that cannot be limited or excluded under applicable law, including liability for fraud.</p>

<h2>Indemnity</h2>
<p>You agree to compensate us for any claims, losses or costs (including reasonable legal fees) that arise from your misuse of the website or your breach of these terms.</p>

<h2>Electronic communications</h2>
<p>When you contact us through the website, by email or by WhatsApp, you agree that we may reply electronically. Under the Electronic Transactions Ordinance 2002, electronic messages, records and signatures can have legal effect, and we accept electronically signed proposals and agreements.</p>

<h2>Governing law and disputes</h2>
<p>These terms are governed by the laws of the Islamic Republic of Pakistan. We will always try to resolve a concern informally first, so please contact us. If a dispute cannot be resolved, the courts at Lahore, Pakistan will have exclusive jurisdiction, unless the law of your country gives you a right to bring proceedings where you live.</p>

<h2>General</h2>
<ul>
  <li>If any part of these terms is found to be unenforceable, the rest remains in effect.</li>
  <li>If we do not enforce a right immediately, we may still enforce it later.</li>
  <li>These terms, together with our <a href="/privacy-policy">Privacy Policy</a> and <a href="/cookie-policy">Cookie Policy</a>, form the whole agreement about your use of the website.</li>
</ul>

<h2>Changes to these terms</h2>
<p>We may update these terms from time to time. The “Last updated” date at the top shows when they last changed. Continuing to use the website after a change means you accept the updated terms.</p>

<h2>Contact us</h2>
<p>Questions about these terms? Email ${MAIL} or call ${PHONE}.</p>
`,
  },

  // ---------------------------------------------------------------- COOKIES
  {
    slug: "cookie-policy",
    nav: "Cookie policy",
    title: "Cookie Policy",
    seoTitle: "Cookie Policy",
    desc: "Which cookies and browser storage the Kamboh Technologies website uses, why, for how long, and how to change your cookie choice at any time.",
    lead: "We keep cookies to a minimum. This page lists every cookie and browser storage item our website uses, what each one does and how long it lasts.",
    body: `
<div class="callout">
  <p class="callout-h">The short version</p>
  <ul>
    <li><strong>No advertising cookies</strong> and no cross-site tracking.</li>
    <li>Google Analytics cookies are set <strong>only after you click “Accept”</strong>.</li>
    <li>A few essential items remember your theme and your cookie choice.</li>
  </ul>
  <p><button type="button" class="btn btn-outline btn-sm" data-cookie-settings>Change cookie settings</button></p>
</div>

<h2>What cookies are</h2>
<p>Cookies are small text files that a website saves in your browser. Similar technologies, such as <em>local storage</em> and <em>session storage</em>, let a website remember information on your device. In this policy, “cookies” covers all of these.</p>

<h2>Essential storage (always on)</h2>
<p>These items are needed for the website to work as you expect. They do not track you and are never shared with anyone.</p>
<div class="table-wrap">
<table>
  <thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Purpose</th><th scope="col">Duration</th></tr></thead>
  <tbody>
    <tr><td><code>kt-theme</code></td><td>Local storage</td><td>Remembers whether you chose light or dark mode</td><td>Until you clear your browser data</td></tr>
    <tr><td><code>kt-consent</code></td><td>Local storage</td><td>Remembers whether you accepted or rejected analytics cookies, so we do not ask again on every page</td><td>Until you change it or clear your browser data</td></tr>
    <tr><td><code>kt-prefill</code></td><td>Session storage</td><td>Briefly holds details from Ask Kamboh AI when you ask it to fill in the contact form</td><td>Deleted as soon as the form is filled, or when you close the tab</td></tr>
  </tbody>
</table>
</div>

<h2>Analytics cookies (only with your consent)</h2>
<p>If you click “Accept”, we use <strong>Google Analytics 4</strong> to understand how many people visit, which pages are useful and where we can improve. We use Google’s Consent Mode, so these cookies are not set until you accept, and we do not use Analytics for advertising.</p>
<div class="table-wrap">
<table>
  <thead><tr><th scope="col">Name</th><th scope="col">Provider</th><th scope="col">Purpose</th><th scope="col">Duration</th></tr></thead>
  <tbody>
    <tr><td><code>_ga</code></td><td>Google</td><td>Distinguishes one visitor from another</td><td>2 years</td></tr>
    <tr><td><code>_ga_&lt;ID&gt;</code></td><td>Google</td><td>Keeps track of your current visit (session)</td><td>2 years</td></tr>
  </tbody>
</table>
</div>
<p>Analytics data is kept for no longer than 14 months. Google’s own use of this information is described in <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">how Google uses information from sites that use its services</a>.</p>

<h2>Third-party content</h2>
<ul>
  <li><strong>Google Maps (Contact page):</strong> the embedded office map is provided by Google, which may set its own cookies when the map loads. You can use the “Get directions” link instead if you prefer.</li>
  <li><strong>Google Fonts:</strong> our fonts are delivered by Google, which receives your IP address to send the font files. Google Fonts does not set cookies.</li>
  <li><strong>Links to WhatsApp, Instagram and GitHub:</strong> these services set their own cookies only if you open them.</li>
</ul>

<h2>Admin area</h2>
<p>Our private admin area, used only by our team, stores a sign-in session in the browser through Firebase Authentication. Visitors to the public website never receive it.</p>

<h2>How to change your choice</h2>
<p>You can accept or reject analytics cookies at any time using <strong>“Cookie settings”</strong> in the footer of every page, or the button at the top of this page. If you withdraw consent, analytics stops immediately. To remove cookies that were already set, clear the cookies for kambohtechnologies.com in your browser settings.</p>
<p>Most browsers also let you block or delete cookies entirely. Blocking essential storage may mean the website forgets your theme or asks for your cookie choice again.</p>

<h2>Changes and contact</h2>
<p>If we add or change cookies, we will update this page and, where needed, ask for your consent again. For questions, email ${MAIL}. For more about how we handle personal information, read our <a href="/privacy-policy">Privacy Policy</a>.</p>
`,
  },

  // ---------------------------------------------------------------- ACCESSIBILITY
  {
    slug: "accessibility",
    nav: "Accessibility",
    title: "Accessibility Statement",
    seoTitle: "Accessibility Statement",
    desc: "Our commitment to an accessible website: WCAG 2.2 AA goal, the features we have built in, known limitations and how to report a barrier.",
    lead: "We want everyone to be able to use our website, including people who use screen readers, keyboards, magnification or other assistive technologies. This statement explains what we do and how to tell us if something does not work for you.",
    body: `
<h2>Our commitment</h2>
<p>${CO} is committed to making kambohtechnologies.com accessible and usable for as many people as possible. We aim to meet the <strong>Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA</strong>, the internationally recognised standard published by the World Wide Web Consortium (W3C).</p>
<p>We also apply the same principles to the software we build for clients, because accessible products reach more customers and work better for everyone.</p>

<h2>Conformance status</h2>
<p>We believe this website is <strong>partially conformant</strong> with WCAG 2.2 Level AA. “Partially conformant” means that most of the content meets the standard, but some parts may not yet fully do so. The known exceptions are listed below, and we are working on them.</p>

<h2>What we have built in</h2>
<ul>
  <li><strong>Keyboard access:</strong> menus, the services dropdown, accordions, forms and the AI assistant can be used with a keyboard, with a clearly visible focus outline.</li>
  <li><strong>Skip link:</strong> a “Skip to main content” link appears when you press Tab on any page.</li>
  <li><strong>Structure:</strong> each page uses meaningful headings in order, landmarks (header, navigation, main content and footer) and breadcrumb navigation, so screen reader users can move around quickly.</li>
  <li><strong>Text alternatives:</strong> informative images have descriptive alternative text; decorative images and animations are hidden from assistive technology.</li>
  <li><strong>Colour and contrast:</strong> text and controls are designed to meet WCAG contrast ratios in both light and dark mode, and colour is never the only way information is shown.</li>
  <li><strong>Forms:</strong> every field has a visible label; errors are explained in text, linked to the field and announced to screen readers.</li>
  <li><strong>Reduced motion:</strong> if you turn on “reduce motion” in your device settings, we switch off smooth scrolling and decorative animations.</li>
  <li><strong>Resizing and reflow:</strong> pages can be zoomed to 200% and viewed on small phone screens without losing content or needing to scroll sideways.</li>
  <li><strong>Language:</strong> the page language is set so screen readers pronounce content correctly. Ask Kamboh AI can reply in English, Urdu or Roman Urdu.</li>
  <li><strong>Light and dark themes:</strong> you can switch themes at any time from the header.</li>
</ul>

<h2>Known limitations</h2>
<ul>
  <li><strong>Embedded Google Map:</strong> the map on our Contact page is provided by Google and may not be fully accessible. The full address, phone number and a “Get directions” link are always available as plain text beside it.</li>
  <li><strong>AI-generated replies:</strong> Ask Kamboh AI responses are generated automatically and their wording may sometimes be less clear than we would like. You can always contact our team directly instead.</li>
  <li><strong>Visual project previews:</strong> some decorative illustrations of example projects are simplified visuals rather than real interfaces. Their meaning is described in the surrounding text.</li>
  <li><strong>Third-party pages:</strong> links to external sites such as WhatsApp, Instagram, GitHub and government portals lead to content we do not control.</li>
</ul>

<h2>How we test</h2>
<p>We check the website with automated accessibility tools (such as Lighthouse and axe), by navigating pages with a keyboard only, at high zoom levels and on small mobile screens, and we are adding regular screen reader testing to this routine. We review accessibility whenever we add new pages or features, and we last reviewed this statement on the date shown above.</p>

<h2>Compatibility</h2>
<p>The website is designed to work with recent versions of major browsers (Chrome, Edge, Firefox and Safari) on desktop and mobile, and with common assistive technologies such as NVDA, JAWS, VoiceOver and TalkBack. It may not work fully in older browsers.</p>

<h2>Feedback and help</h2>
<p>If you have difficulty using any part of our website, or you need information in a different format, please tell us. We will do our best to help and to fix the problem.</p>
<ul>
  <li>Email: ${MAIL} (subject: “Accessibility”)</li>
  <li>Phone or WhatsApp: ${PHONE}, Monday to Friday, 6am to 10pm Pakistan time</li>
</ul>
<p>Please tell us the page address, what you were trying to do and the problem you met, including the browser and assistive technology you use if possible. We aim to reply within <strong>5 business days</strong>.</p>
`,
  },

  // ---------------------------------------------------------------- CONTRACT INFORMATION
  {
    slug: "contract-information",
    nav: "Contract information",
    title: "Contract Information",
    seoTitle: "Contract Information and How We Work",
    desc: "How Kamboh Technologies contracts work: proposals, statements of work, payments, invoicing, ownership of code, confidentiality, warranty and support.",
    lead: "Clear contracts make good projects. This page explains how our agreements are usually structured, so you know what to expect before we start. Your own signed agreement always sets the exact terms.",
    body: `
<h2>Our company details</h2>
<p>Contracts and invoices are issued by our registered company. These details are useful for vendor registration and procurement:</p>
<div class="table-wrap">
<table class="kv">
  <tbody>
    <tr><th scope="row">Legal name</th><td>${CO}</td></tr>
    <tr><th scope="row">Company type</th><td>Private limited company, incorporated in Pakistan</td></tr>
    <tr><th scope="row">SECP CUIN</th><td>0297023</td></tr>
    <tr><th scope="row">FBR NTN</th><td>G813109</td></tr>
    <tr><th scope="row">Office address</th><td>${ADDR}</td></tr>
    <tr><th scope="row">Email</th><td>${MAIL}</td></tr>
    <tr><th scope="row">Phone</th><td>${PHONE} · <a href="tel:+14168715643">+1 (416) 871-5643</a></td></tr>
    <tr><th scope="row">Working hours</th><td>Monday to Friday, 6am to 10pm (Pakistan time)</td></tr>
  </tbody>
</table>
</div>
<p>Copies of our certificate of incorporation and NTN certificate are available on request for vendor onboarding. You can also verify our registration on the SECP website, as explained on our <a href="/about#registration">About page</a>.</p>

<h2>How an engagement works</h2>
<ol>
  <li><strong>Discovery.</strong> We discuss your goals, users, features, timeline and budget, and ask questions until the scope is clear. If you need confidentiality from the first conversation, we are happy to sign a non-disclosure agreement (NDA) first.</li>
  <li><strong>Proposal and quotation.</strong> We send a written proposal with the scope, deliverables, timeline, price and payment schedule. Unless it says otherwise, a quotation is valid for 30 days.</li>
  <li><strong>Agreement.</strong> Work starts once the proposal or a service agreement (sometimes with a statement of work, or SOW) is accepted in writing by an authorised person and the first payment is received. Electronic signatures and written email acceptance are valid under the Electronic Transactions Ordinance 2002.</li>
  <li><strong>Delivery in milestones.</strong> Larger projects are split into milestones, such as design, development phases, testing and launch, each with clear deliverables you review and approve.</li>
  <li><strong>Launch, handover and support.</strong> We deploy, hand over the agreed code, credentials and documentation, and provide the support described in your agreement.</li>
</ol>

<h2>What your agreement covers</h2>
<p>Every project agreement sets out, at a minimum:</p>
<ul>
  <li>The scope of work and the deliverables, including what is <em>not</em> included</li>
  <li>The timeline and milestones, and what we need from you to keep to them</li>
  <li>The price, currency, payment schedule and taxes</li>
  <li>How changes to the scope are requested, priced and approved</li>
  <li>Ownership of the work, confidentiality and use of third-party components</li>
  <li>Acceptance testing, warranty, support and maintenance</li>
  <li>How either party can end the agreement, and how disputes are resolved</li>
</ul>

<h2>Pricing models</h2>
<div class="table-wrap">
<table>
  <thead><tr><th scope="col">Model</th><th scope="col">How it works</th><th scope="col">Best for</th></tr></thead>
  <tbody>
    <tr><td>Fixed price</td><td>An agreed price for a clearly defined scope, paid by milestone</td><td>Projects with well-defined requirements</td></tr>
    <tr><td>Time and materials</td><td>You pay for the hours actually worked at agreed rates, with regular reports</td><td>Evolving products and ongoing development</td></tr>
    <tr><td>Monthly retainer</td><td>A fixed monthly fee for an agreed amount of support, maintenance or growth work</td><td>Maintenance, SEO and long-term partnerships</td></tr>
  </tbody>
</table>
</div>

<h2>Payments and invoicing</h2>
<ul>
  <li><strong>Schedule:</strong> most projects start with an advance payment, with the balance due on agreed milestones and before final handover. The exact percentages are in your proposal.</li>
  <li><strong>Currency:</strong> clients in Pakistan are usually invoiced in Pakistani rupees (PKR); international clients are usually invoiced in US dollars (USD) or another agreed currency.</li>
  <li><strong>Invoices:</strong> issued by ${CO} with our NTN. Payment terms are stated on each invoice.</li>
  <li><strong>Taxes:</strong> where applicable, provincial sales tax on services is charged in addition to our fees and shown separately, and withholding tax is handled as required by the Income Tax Ordinance 2001. Rates follow the law in force when the invoice is issued.</li>
  <li><strong>Payment methods:</strong> bank transfer to our company account. We will never ask you to pay into a personal account; if you receive such a request, please call us to confirm.</li>
  <li><strong>Third-party costs:</strong> hosting, domains, app store accounts, paid APIs, AI usage and government fees (for example SECP or FBR fees) are paid by the client, either directly or reimbursed at cost, and are listed separately.</li>
</ul>

<h2>Change requests</h2>
<p>New ideas often come up during a project, and that is normal. Any change to the agreed scope is described in writing with its impact on price and timeline, and is only carried out once you approve it. This keeps the budget predictable for both sides.</p>

<h2>Ownership of the work</h2>
<ul>
  <li>Once all payments for a deliverable are made, <strong>you own the custom code, designs and content we create specifically for you</strong>, and we transfer it to your accounts and repositories.</li>
  <li>We keep ownership of our pre-existing tools, libraries and know-how, and grant you a permanent licence to use any of them included in your product.</li>
  <li>Open-source components remain under their own licences, which we choose carefully so they are suitable for commercial use.</li>
  <li>Unless you ask us not to, we may mention that we worked with you and show non-confidential parts of the work in our portfolio.</li>
</ul>

<h2>Confidentiality and data</h2>
<p>We keep your business information, code and data confidential, and only share it with team members who need it for your project. We can sign your NDA or provide ours. Where we handle personal data on your behalf, we do so only on your instructions and can sign a data processing agreement. Read our <a href="/privacy-policy">Privacy Policy</a> for how we handle personal information.</p>

<h2>Testing, acceptance and warranty</h2>
<ul>
  <li>Each milestone has an agreed review period. If you report issues, we fix anything that does not meet the agreed scope before it is accepted.</li>
  <li>After launch, a <strong>warranty period</strong> (stated in your agreement) covers fixing defects in our work at no extra cost.</li>
  <li>New features, changes in requirements and issues caused by third-party services, hosting or edits by others are outside the warranty and can be covered by a support plan.</li>
</ul>

<h2>Support and maintenance</h2>
<p>Software needs care after launch: security updates, operating system and browser changes, backups and monitoring. We offer optional monthly maintenance plans with agreed response times, so your product stays secure and up to date.</p>

<h2>SECP registration and tax filing services</h2>
<p>For our <a href="/services/secp-company-registration">SECP company registration</a> and <a href="/services/tax-filing">tax filing</a> services, we prepare and submit documents based on the information you provide. You remain responsible for the accuracy and completeness of that information and for signing filings where the law requires it. Government fees are separate from our service fee, and approval timelines are decided by the relevant authority.</p>

<h2>Ending an agreement</h2>
<p>Either party can end an agreement as set out in it, usually with written notice. If a project ends early, you pay for the work completed up to that point, and we hand over that work once it is paid for. Confidentiality and ownership terms continue after the agreement ends.</p>

<h2>Disputes and governing law</h2>
<p>Our agreements are governed by the laws of Pakistan, including the Contract Act 1872. If a disagreement arises, both sides first try to resolve it through good-faith discussion between senior representatives. If that does not work, the agreement sets out the next step, which is usually arbitration or the courts at Lahore. International clients may agree a different arrangement in their contract.</p>

<h2>Questions before you sign?</h2>
<p>We are happy to walk you through any part of our agreement or adapt it to your organisation’s requirements. Email ${MAIL}, call ${PHONE}, or <a href="/contact">send us your project details</a>.</p>
<p><em>This page is a general summary of how our agreements usually work. It is not itself a contract; the terms of your signed agreement apply to your project.</em></p>
`,
  },

  // ---------------------------------------------------------------- DISCLAIMER
  {
    slug: "disclaimer",
    nav: "Disclaimer",
    title: "Disclaimer",
    seoTitle: "Disclaimer",
    desc: "Important information about the content on the Kamboh Technologies website: general information only, not legal or tax advice, AI answers and examples.",
    lead: "Our website is designed to be helpful and accurate, but its content has limits. Please read this disclaimer before relying on anything you find here.",
    body: `
<h2>General information only</h2>
<p>The content on kambohtechnologies.com, including our service pages, blog articles, guides and FAQs, is published for general information. It is not tailored to your circumstances and is not a substitute for professional advice.</p>

<h2>Not legal, tax or financial advice</h2>
<p>Articles and pages about SECP company registration, tax filing, contracts or regulations explain processes in general terms. They are <strong>not legal, tax, accounting or financial advice</strong>. Laws, fees, deadlines and procedures in Pakistan and elsewhere change regularly. Before acting, confirm the current requirements with the relevant authority, such as the SECP or FBR, or a qualified professional. When you hire us for these services, the advice we give you is set out in our engagement with you.</p>

<h2>Ask Kamboh AI</h2>
<p>Answers from our AI assistant are generated automatically by a third-party AI model. They can be incomplete, out of date or wrong, and they are not offers, quotes or commitments. Our team confirms every detail before any agreement.</p>

<h2>Prices, timelines and estimates</h2>
<p>Any costs, timelines or estimates mentioned on the website or in articles are indicative and depend on the scope of each project. Only a written proposal from our team is binding.</p>

<h2>Examples and project previews</h2>
<p>Some projects and interface previews on our website are concept examples created to illustrate the kind of work we do. Where this is the case, we describe them as examples. Results described for any project depend on many factors and are not a promise of similar results for your business.</p>

<h2>Reviews and testimonials</h2>
<p>Any review cards marked “Sample” are layout placeholders, not real client reviews. We only publish genuine client feedback as real reviews, and we never pay for reviews. Individual experiences vary.</p>

<h2>External links and trademarks</h2>
<p>Links to other websites are provided for convenience; we do not control or endorse their content. Names and logos of technologies, platforms and organisations mentioned on the website belong to their owners and are used only to describe our work. Their use does not imply any partnership or endorsement unless we say so.</p>

<h2>Accuracy and updates</h2>
<p>We review our content regularly, but we cannot guarantee that everything is complete, current or free of errors at all times. If you spot something that is wrong or out of date, please tell us at ${MAIL} and we will correct it.</p>

<h2>Limitation of liability</h2>
<p>To the fullest extent permitted by law, ${CO} is not liable for any loss or damage arising from reliance on the content of this website. Our full terms are in our <a href="/terms-and-conditions">Terms and Conditions</a>.</p>
`,
  },
];
