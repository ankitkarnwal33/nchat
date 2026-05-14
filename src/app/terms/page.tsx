"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/src/components/Header";

const NAV_ITEMS = [
  { id: "description", number: "01", label: "Description of Service" },
  { id: "user-responsibilities", number: "02", label: "User Responsibilities" },
  { id: "instagram-compliance", number: "03", label: "Instagram Compliance" },
  { id: "automation-behavior", number: "04", label: "Automation Behavior" },
  { id: "messaging-rule", number: "05", label: "24-Hour Messaging Rule" },
  { id: "account-access", number: "06", label: "Account Access" },
  { id: "subscription", number: "07", label: "Subscription & Payments" },
  { id: "availability", number: "08", label: "Service Availability" },
  { id: "liability", number: "09", label: "Limitation of Liability" },
  { id: "termination", number: "10", label: "Termination" },
  { id: "changes", number: "11", label: "Changes to Terms" },
  { id: "contact", number: "12", label: "Contact" },
];

function Tag({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "green" | "red" | "warning";
}) {
  const variants = {
    default: "bg-secondary text-secondary-foreground border-border",
    green: "bg-accent text-accent-foreground border-accent",
    red: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-primary/10 text-primary border-primary/20",
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
  variant?: "default" | "green" | "red" | "warning";
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
                  : variant === "warning"
                    ? "bg-primary"
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

function Callout({
  label,
  items,
  variant = "red",
}: {
  label: string;
  items: string[];
  variant?: "red" | "warning" | "accent";
}) {
  const styles: Record<string, { wrap: string; label: string }> = {
    red: {
      wrap: "bg-destructive/5 border-destructive/15",
      label: "text-destructive",
    },
    warning: {
      wrap: "bg-primary/5 border-primary/15",
      label: "text-primary",
    },
    accent: {
      wrap: "bg-accent/40 border-accent",
      label: "text-accent-foreground",
    },
  };
  const s = styles[variant];
  return (
    <div className={`mt-6 p-4 rounded-xl border ${s.wrap}`}>
      <p
        className={`text-xs font-mono font-medium uppercase tracking-widest mb-3 ${s.label}`}
      >
        {label}
      </p>
      <BulletList
        items={items}
        variant={
          variant === "red"
            ? "red"
            : variant === "warning"
              ? "warning"
              : "green"
        }
      />
    </div>
  );
}

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState("description");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
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

      <div className="min-h-screen bg-background text-foreground">
        <Header />
        {/* ── Mobile header ── */}
        <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-background/90 backdrop-blur border-b border-border">
          <span className="font-display text-foreground text-base font-semibold">
            Terms & Conditions
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
          {/* ── Sidebar ── */}
          <aside
            className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 sticky top-0 h-screen overflow-y-auto py-12"
            style={{
              background: "var(--sidebar)",
              borderRight: "1px solid var(--sidebar-border)",
            }}
          >
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
                Terms & Conditions
              </p>
              <p
                className="font-mono text-[11px] mt-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div
              className="mx-7 mb-6 h-px"
              style={{ background: "var(--sidebar-border)" }}
            />

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
                      : { borderColor: "transparent" }
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

            <div className="mt-auto px-7 pt-8">
              <Tag variant="warning">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                Legally Binding
              </Tag>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="flex-1 min-w-0 px-6 sm:px-10 lg:px-16 py-12 lg:py-20">
            {/* Hero */}
            <div className="mb-16 pb-12 border-b border-border">
              <div className="flex flex-wrap gap-2 mb-6">
                <Tag variant="warning">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  Active Agreement
                </Tag>
                <Tag>Version 1.0</Tag>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight mb-5">
                <span className="text-foreground">Terms &</span>
                <br />
                <span className="text-muted-foreground">Conditions</span>
              </h1>
              <p className="text-muted-foreground text-sm font-mono max-w-lg leading-relaxed">
                Welcome to{" "}
                <span className="text-primary font-medium">ChatNinjas</span>. By
                using our platform, you agree to the following terms. Please
                read them carefully before continuing.
              </p>
            </div>

            <div className="space-y-16">
              {/* 01 */}
              <section id="description" className="scroll-mt-24">
                <SectionHeading number="01" title="Description of Service" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    <span className="text-primary font-medium">ChatNinjas</span>{" "}
                    provides Instagram automation tools that allow users to:
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { icon: "💬", text: "Automatically reply to comments" },
                      { icon: "📨", text: "Send direct messages" },
                      { icon: "⚙️", text: "Create automation workflows" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-2 p-4 rounded-xl bg-card border border-border hover:border-ring/50 transition-colors"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-muted-foreground text-sm leading-snug">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 02 */}
              <section id="user-responsibilities" className="scroll-mt-24">
                <SectionHeading number="02" title="User Responsibilities" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    You agree:
                  </p>
                  <BulletList
                    items={[
                      "To use the platform in compliance with Instagram policies",
                      "Not to send spam or abusive content",
                      "Not to misuse automation for illegal activities",
                    ]}
                  />
                </div>
              </section>

              {/* 03 */}
              <section id="instagram-compliance" className="scroll-mt-24">
                <SectionHeading number="03" title="Instagram Compliance" />
                <div className="pl-9 space-y-2">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    You acknowledge:
                  </p>
                  <BulletList
                    items={[
                      "Our app operates using Meta APIs",
                      "You must comply with Instagram's Platform Policies",
                      "Violations may result in suspension of your account",
                    ]}
                  />
                  <Callout
                    label="We are not responsible for"
                    variant="red"
                    items={[
                      "Instagram account bans",
                      "API restrictions imposed by Meta",
                    ]}
                  />
                </div>
              </section>

              {/* 04 */}
              <section id="automation-behavior" className="scroll-mt-24">
                <SectionHeading number="04" title="Automation Behavior" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    You are responsible for:
                  </p>
                  <BulletList
                    items={[
                      "Messages sent through automations",
                      "Content of replies and DMs",
                    ]}
                  />
                  {/* Highlighted note */}
                  <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-accent/40 border border-accent">
                    <span className="text-lg mt-0.5">🛠️</span>
                    <p className="text-accent-foreground text-sm font-mono leading-relaxed">
                      We provide tools — you control how they are used.
                    </p>
                  </div>
                </div>
              </section>

              {/* 05 */}
              <section id="messaging-rule" className="scroll-mt-24">
                <SectionHeading number="05" title="24-Hour Messaging Rule" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our platform respects Instagram&apos;s 24-hour messaging
                    policy. You agree not to attempt:
                  </p>
                  <BulletList
                    items={[
                      "Sending messages outside allowed windows",
                      "Circumventing platform restrictions",
                    ]}
                  />
                  <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-accent">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-foreground" />
                    <span className="text-accent-foreground text-xs font-mono font-medium">
                      Compliant with Meta&apos;s messaging policies
                    </span>
                  </div>
                </div>
              </section>

              {/* 06 */}
              <section id="account-access" className="scroll-mt-24">
                <SectionHeading number="06" title="Account Access" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To use our service:
                  </p>
                  <BulletList
                    items={[
                      "You must connect your Instagram account",
                      "You grant permission to send messages on your behalf",
                    ]}
                  />
                  <p className="mt-5 text-muted-foreground/60 text-sm font-mono border-t border-border pt-4">
                    You may{" "}
                    <span className="text-primary font-medium">
                      revoke access anytime
                    </span>{" "}
                    from your account settings.
                  </p>
                </div>
              </section>

              {/* 07 */}
              <section id="subscription" className="scroll-mt-24">
                <SectionHeading number="07" title="Subscription & Payments" />
                <div className="pl-9">
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      {
                        icon: "💳",
                        label: "Paid Features",
                        text: "Some features may require a paid subscription",
                      },
                      {
                        icon: "🔁",
                        label: "Refund Policy",
                        text: "Payments are non-refundable unless stated otherwise",
                      },
                      {
                        icon: "📢",
                        label: "Pricing Changes",
                        text: "Pricing may change with prior notice to users",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-2 p-4 rounded-xl bg-card border border-border hover:border-ring/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.icon}</span>
                          <span className="text-foreground text-xs font-mono font-semibold uppercase tracking-wider">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-sm leading-snug">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 08 */}
              <section id="availability" className="scroll-mt-24">
                <SectionHeading number="08" title="Service Availability" />
                <div className="pl-9 space-y-2">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We aim for high uptime but do not guarantee:
                  </p>
                  <BulletList
                    items={["Continuous availability", "Error-free operation"]}
                  />
                  <Callout
                    label="We are not liable for"
                    variant="red"
                    items={[
                      "Downtime or service interruptions",
                      "API failures from Instagram",
                    ]}
                  />
                </div>
              </section>

              {/* 09 */}
              <section id="liability" className="scroll-mt-24">
                <SectionHeading number="09" title="Limitation of Liability" />
                <div className="pl-9 space-y-2">
                  <Callout
                    label="We are not responsible for"
                    variant="red"
                    items={[
                      "Loss of data",
                      "Instagram account penalties",
                      "Business losses due to automation",
                    ]}
                  />
                  <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-secondary border border-border">
                    <span className="text-lg mt-0.5">⚠️</span>
                    <p className="text-muted-foreground text-sm font-mono leading-relaxed">
                      Use the service at your own risk.
                    </p>
                  </div>
                </div>
              </section>

              {/* 10 */}
              <section id="termination" className="scroll-mt-24">
                <SectionHeading number="10" title="Termination" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We may suspend or terminate accounts if:
                  </p>
                  <BulletList
                    items={[
                      "Terms are violated",
                      "Abuse or spam is detected",
                      "Platform misuse occurs",
                    ]}
                  />
                </div>
              </section>

              {/* 11 */}
              <section id="changes" className="scroll-mt-24">
                <SectionHeading number="11" title="Changes to Terms" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We may update these terms at any time.{" "}
                    <span className="text-foreground font-mono text-xs bg-secondary px-1.5 py-0.5 rounded border border-border">
                      Continued use implies acceptance
                    </span>{" "}
                    of any revised terms.
                  </p>
                </div>
              </section>

              {/* 12 */}
              <section id="contact" className="scroll-mt-24">
                <SectionHeading number="12" title="Contact" />
                <div className="pl-9">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    If you have questions about these Terms and Conditions:
                  </p>
                  <div className="space-y-3 max-w-sm">
                    {[
                      {
                        icon: "✉️",
                        label: "Email",
                        value: "KARNWALANKIT89@GMAIL.COM",
                      },
                      {
                        icon: "🌐",
                        label: "Website",
                        value: "https://chatninjas.in",
                      },
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
                By using our platform, you agree to these Terms and Conditions.
                <br />© ChatNinjas · All rights reserved.
              </p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
