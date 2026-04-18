"use client";

import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  {
    id: "information-we-collect",
    number: "01",
    label: "Information We Collect",
  },
  { id: "how-we-use", number: "02", label: "How We Use Your Information" },
  { id: "instagram-data", number: "03", label: "Instagram Data Usage" },
  { id: "data-storage", number: "04", label: "Data Storage & Security" },
  { id: "data-retention", number: "05", label: "Data Retention" },
  { id: "sharing", number: "06", label: "Sharing of Information" },
  { id: "your-rights", number: "07", label: "Your Rights" },
  { id: "third-party", number: "08", label: "Third-Party Services" },
  { id: "changes", number: "09", label: "Changes to This Policy" },
  { id: "contact", number: "10", label: "Contact Us" },
];

function Tag({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "green" | "red";
}) {
  const variants = {
    default: "bg-secondary text-secondary-foreground border-border",
    green: "bg-accent text-accent-foreground border-accent",
    red: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-start gap-5 mb-8">
      <span className="font-mono text-xs text-muted-foreground/40 pt-1.5 select-none">
        {number}
      </span>
      <h2 className="font-display text-2xl font-bold text-foreground leading-snug tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function BulletList({
  items,
  variant = "default",
}: {
  items: string[];
  variant?: "default" | "green" | "red";
}) {
  return (
    <ul className="space-y-2.5 mt-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${
              variant === "green"
                ? "bg-accent-foreground"
                : variant === "red"
                  ? "bg-destructive"
                  : "bg-primary"
            }`}
          />
          <span className="text-muted-foreground text-sm leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SubSection({
  label,
  content,
  list,
  notList,
  notLabel,
  footer,
  contactItems,
}: {
  label?: string;
  content?: string;
  list?: string[];
  notList?: string[];
  notLabel?: string;
  footer?: string;
  contactItems?: { icon: string; label: string; value: string }[];
}) {
  return (
    <div className="mt-7 first:mt-0">
      {label && (
        <h3 className="text-foreground/80 text-sm font-semibold font-mono mb-3 uppercase tracking-widest">
          {label}
        </h3>
      )}
      {content && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {content}
        </p>
      )}
      {list && <BulletList items={list} />}
      {notLabel && (
        <div className="mt-6">
          <p className="text-destructive text-sm font-mono font-medium mb-2">
            {notLabel}
          </p>
          <BulletList items={notList || []} variant="red" />
        </div>
      )}
      {footer && (
        <p className="mt-5 text-muted-foreground/60 text-sm font-mono border-t border-border pt-4">
          {footer}
        </p>
      )}
      {contactItems && (
        <div className="mt-5 flex flex-col gap-3">
          {contactItems.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
            >
              <span className="text-base">{c.icon}</span>
              <span className="text-muted-foreground/60 text-xs font-mono uppercase tracking-wider w-14">
                {c.label}
              </span>
              <span className="text-primary text-sm font-mono">{c.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("information-we-collect");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el && observerRef.current) observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileNavOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
      `}</style>

      {/* Root: bg-background / text-foreground */}
      <div className="min-h-screen bg-background text-foreground">
        {/* ── Mobile header ── */}
        <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-background/90 backdrop-blur border-b border-border">
          <span className="font-display text-foreground text-base font-semibold">
            Privacy Policy
          </span>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-mono"
          >
            {mobileNavOpen ? "✕ Close" : "☰ Sections"}
          </button>
        </div>

        {/* ── Mobile nav dropdown ── */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[57px] z-40 bg-card border-b border-border shadow-lg">
            <nav className="p-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activeSection === item.id
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  }`}
                >
                  <span className="font-mono text-xs text-muted-foreground/40 w-6">
                    {item.number}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        <div className="flex max-w-[1200px] mx-auto">
          {/* ── Sidebar ── Uses --sidebar and --sidebar-border from your theme ── */}
          <aside
            className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 sticky top-0 h-screen overflow-y-auto py-12"
            style={{
              background: "var(--sidebar)",
              borderRight: "1px solid var(--sidebar-border)",
            }}
          >
            {/* Brand */}
            <div className="px-7 mb-8">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                Legal
              </p>
              <p
                className="font-display text-lg font-semibold leading-snug"
                style={{ color: "var(--sidebar-foreground)" }}
              >
                Privacy Policy
              </p>
              <p
                className="font-mono text-[11px] mt-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                Last updated: [Add Date]
              </p>
            </div>

            <div
              className="mx-7 mb-6 h-px"
              style={{ background: "var(--sidebar-border)" }}
            />

            {/* Nav */}
            <nav className="flex flex-col gap-0.5 px-3">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="group flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all duration-200 border"
                  style={
                    activeSection === item.id
                      ? {
                          background: "var(--sidebar-accent)",
                          color: "var(--sidebar-accent-foreground)",
                          borderColor: "var(--sidebar-ring)",
                        }
                      : {
                          borderColor: "transparent",
                        }
                  }
                >
                  <span
                    className="font-mono text-[10px] w-5 shrink-0 transition-colors"
                    style={{
                      color:
                        activeSection === item.id
                          ? "var(--sidebar-primary)"
                          : "var(--muted-foreground)",
                    }}
                  >
                    {item.number}
                  </span>
                  <span
                    className="text-[12.5px] leading-snug transition-colors"
                    style={{
                      color:
                        activeSection === item.id
                          ? "var(--sidebar-accent-foreground)"
                          : "var(--muted-foreground)",
                      fontWeight: activeSection === item.id ? "500" : "400",
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>

            {/* Compliance badge */}
            <div className="mt-auto px-7 pt-8">
              <Tag variant="green">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-foreground inline-block" />
                Meta API Compliant
              </Tag>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="flex-1 min-w-0 px-6 sm:px-10 lg:px-16 py-12 lg:py-20">
            {/* Hero */}
            <div className="mb-16 pb-12 border-b border-border">
              <div className="flex flex-wrap gap-2 mb-6">
                <Tag variant="green">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-foreground inline-block" />
                  Active Policy
                </Tag>
                <Tag>Version 1.0</Tag>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight mb-5">
                <span className="text-foreground">Privacy</span>
                <br />
                <span className="text-muted-foreground">Policy</span>
              </h1>
              <p className="text-muted-foreground text-sm font-mono max-w-lg leading-relaxed">
                Welcome to{" "}
                <span className="text-primary font-medium">
                  [Your App Name]
                </span>
                . This Privacy Policy explains how we collect, use, and protect
                your information when you use our Instagram automation platform
                — including automated comment replies and direct messaging via
                Meta APIs.
              </p>
            </div>

            <div className="space-y-16">
              {/* 01 */}
              <section id="information-we-collect" className="scroll-mt-24">
                <SectionHeading number="01" title="Information We Collect" />
                <div className="space-y-8 pl-9">
                  <SubSection
                    label="A. Account Information"
                    content="When you sign up, we may collect:"
                    list={["Name", "Email address", "Profile image"]}
                  />
                  <div className="h-px bg-border" />
                  <SubSection
                    label="B. Instagram Account Data"
                    content="When you connect your Instagram account, we may access:"
                    list={[
                      "Instagram username and user ID",
                      "Profile picture",
                      "Access tokens (securely stored)",
                      "Media (posts, captions, comments)",
                    ]}
                  />
                  <div className="h-px bg-border" />
                  <SubSection
                    label="C. User Interaction Data"
                    content="We collect:"
                    list={[
                      "Comments on your posts",
                      "Messages sent to your account",
                      "Automation triggers and responses",
                    ]}
                  />
                  <div className="h-px bg-border" />
                  <SubSection
                    label="D. Technical Data"
                    list={[
                      "IP address",
                      "Device/browser information",
                      "Usage logs",
                    ]}
                  />
                </div>
              </section>

              {/* 02 */}
              <section id="how-we-use" className="scroll-mt-24">
                <SectionHeading
                  number="02"
                  title="How We Use Your Information"
                />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We use your data to:
                  </p>
                  <BulletList
                    items={[
                      "Provide automation features (comment replies, DMs)",
                      "Process webhook events from Instagram",
                      "Improve performance and user experience",
                      "Ensure compliance with Instagram policies",
                      "Prevent abuse, spam, and fraud",
                    ]}
                  />
                </div>
              </section>

              {/* 03 */}
              <section id="instagram-data" className="scroll-mt-24">
                <SectionHeading number="03" title="Instagram Data Usage" />
                <div className="pl-9 space-y-6">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our app uses the{" "}
                    <span className="text-foreground font-mono text-xs bg-secondary px-1.5 py-0.5 rounded border border-border">
                      Meta (Instagram) Graph API
                    </span>{" "}
                    and complies with Meta&apos;s Platform Policies. We only
                    access data necessary to:
                  </p>
                  <BulletList
                    variant="green"
                    items={[
                      "Detect comments and messages",
                      "Trigger automations",
                      "Send replies on your behalf",
                    ]}
                  />
                  {/* Destructive callout */}
                  <div className="mt-6 p-4 rounded-xl bg-destructive/5 border border-destructive/15">
                    <p className="text-destructive text-xs font-mono font-medium uppercase tracking-widest mb-3">
                      We do NOT
                    </p>
                    <BulletList
                      variant="red"
                      items={[
                        "Access private messages without permission",
                        "Sell or misuse Instagram data",
                      ]}
                    />
                  </div>
                </div>
              </section>

              {/* 04 */}
              <section id="data-storage" className="scroll-mt-24">
                <SectionHeading number="04" title="Data Storage & Security" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    We implement industry-standard security measures:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      {
                        icon: "🔐",
                        text: "Encrypted storage of access tokens",
                      },
                      { icon: "☁️", text: "Secure servers (e.g., AWS EC2)" },
                      {
                        icon: "🚦",
                        text: "Rate limiting and abuse prevention",
                      },
                      {
                        icon: "🛡️",
                        text: "Database protection via auth & access control",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border hover:border-ring/50 transition-colors"
                      >
                        <span className="text-lg shrink-0 mt-0.5">
                          {item.icon}
                        </span>
                        <span className="text-muted-foreground text-sm leading-snug">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 05 */}
              <section id="data-retention" className="scroll-mt-24">
                <SectionHeading number="05" title="Data Retention" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We retain data only as long as necessary:
                  </p>
                  <BulletList
                    items={[
                      "Automation logs: retained for analytics and debugging",
                      "User interaction data: maintained for 24-hour messaging compliance",
                      "You may request deletion at any time",
                    ]}
                  />
                </div>
              </section>

              {/* 06 */}
              <section id="sharing" className="scroll-mt-24">
                <SectionHeading number="06" title="Sharing of Information" />
                <div className="pl-9">
                  {/* "We do NOT sell" — accent pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-accent mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-foreground" />
                    <span className="text-accent-foreground text-xs font-mono font-medium">
                      We do NOT sell your data
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We may share data only:
                  </p>
                  <BulletList
                    items={[
                      "With Meta APIs (to perform automations)",
                      "When required by law",
                      "To protect our platform from abuse",
                    ]}
                  />
                </div>
              </section>

              {/* 07 */}
              <section id="your-rights" className="scroll-mt-24">
                <SectionHeading number="07" title="Your Rights" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    You have the right to:
                  </p>
                  <BulletList
                    items={[
                      "Access your data",
                      "Request correction",
                      "Request deletion",
                      "Disconnect your Instagram account",
                    ]}
                  />
                  <p className="mt-6 text-muted-foreground/60 text-sm font-mono border-t border-border pt-5">
                    To exercise these rights, contact us at:{" "}
                    <span className="text-primary">[your email]</span>
                  </p>
                </div>
              </section>

              {/* 08 */}
              <section id="third-party" className="scroll-mt-24">
                <SectionHeading number="08" title="Third-Party Services" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    We use:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Meta (Instagram Graph API)",
                      "Cloud providers (e.g., AWS)",
                      "Analytics tools (optional)",
                    ].map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-secondary-foreground text-xs font-mono"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 text-muted-foreground/60 text-sm font-mono">
                    These services have their own privacy policies.
                  </p>
                </div>
              </section>

              {/* 09 */}
              <section id="changes" className="scroll-mt-24">
                <SectionHeading number="09" title="Changes to This Policy" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We may update this policy from time to time. Users will be
                    notified of significant changes via email or a prominent
                    notice on our platform.
                  </p>
                </div>
              </section>

              {/* 10 */}
              <section id="contact" className="scroll-mt-24">
                <SectionHeading number="10" title="Contact Us" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    If you have questions about this Privacy Policy:
                  </p>
                  <div className="space-y-3 max-w-sm">
                    {[
                      { icon: "✉️", label: "Email", value: "[your email]" },
                      { icon: "🌐", label: "Website", value: "[your domain]" },
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-ring hover:bg-accent/30 transition-all cursor-pointer group"
                      >
                        <span className="text-xl">{c.icon}</span>
                        <div>
                          <p className="text-muted-foreground/50 text-[10px] font-mono uppercase tracking-widest">
                            {c.label}
                          </p>
                          <p className="text-primary text-sm font-mono group-hover:text-chart-1 transition-colors">
                            {c.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-20 pt-10 border-t border-border">
              <p className="text-muted-foreground/40 text-xs font-mono leading-relaxed">
                By using our platform, you agree to this Privacy Policy.
                <br />© [Your App Name] · All rights reserved.
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
