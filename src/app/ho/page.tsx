"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Hero from "@/src/components/Hero";

// ─── Animation Variants ───────────────────────────────────────────────────────
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: EASE_OUT },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, delay: i * 0.08, ease: EASE_OUT },
  }),
};

// ─── Reusable Section Wrapper ─────────────────────────────────────────────────
function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: "💬",
    title: "Comment → DM Automation",
    desc: "Automatically send a DM when someone comments on your post — zero delay.",
  },
  {
    icon: "🤖",
    title: "Smart Auto Replies",
    desc: "Reply instantly to comments and messages using intelligent response flows.",
  },
  {
    icon: "🔗",
    title: "Link Sharing in DM",
    desc: "Send links directly via DM after any engagement trigger.",
  },

  {
    icon: "🎯",
    title: "Custom Triggers",
    desc: "Fire actions based on keywords, specific posts, or user behavior patterns.",
  },
  {
    icon: "🔄",
    title: "Multi-Step Automation",
    desc: "Comment → Reply → DM → Follow-up — entire funnels, fully automated.",
  },
];

const compliance = [
  "Built using official Meta APIs only",
  "Follows Instagram & Facebook platform policies",
  "No scraping, no fake engagement",
  "Designed for long-term brand growth",
];

const results = [
  {
    icon: "💰",
    label: "Higher Conversions",
    desc: "Turn comment engagement directly into paying customers.",
  },
  {
    icon: "📥",
    label: "Automatic Leads",
    desc: "Capture leads around the clock — even while you sleep.",
  },
  {
    icon: "⏱",
    label: "Hours Saved",
    desc: "Stop replying manually. Let the system do the heavy lifting.",
  },
  {
    icon: "🚀",
    label: "Effortless Scale",
    desc: "Handle 10x the engagement without any extra resources.",
  },
];

const steps = [
  {
    num: "01",
    title: "Connect your Instagram account securely",
    desc: "Authorize via official Meta OAuth - safe, private, and revocable anytime.",
  },
  {
    num: "02",
    title: "Create your automation flows",
    desc: "Set up comment triggers, DM sequences, and keyword-based responses in minutes.",
  },
  {
    num: "03",
    title: "Let the system engage and convert",
    desc: "Your automations run 24/7, turning followers into leads and customers.",
  },
];

const pricing = [
  {
    tier: "Starter",
    tagline: "For individuals getting started",
    price: "Free trial",
    highlight: false,
  },
  {
    tier: "Growth",
    tagline: "For scaling businesses",
    price: "Pro features",
    highlight: true,
  },
  {
    tier: "Agency",
    tagline: "For agencies & high-volume automation",
    price: "Unlimited",
    highlight: false,
  },
];

const useCases = [
  "Creators & Influencers",
  "Coaches & Course Sellers",
  "E-commerce Brands",
  "Agencies",
];

// ─── Sub-Components ───────────────────────────────────────────────────────────
function NavBar() {
  return (
    <motion.nav
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <span className="font-serif text-xl font-bold text-primary tracking-tight">
        Nchat
      </span>
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-1.5 rounded-[var(--radius)] border border-border text-sm text-foreground bg-transparent hover:bg-secondary transition-colors cursor-pointer"
        >
          Log in
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-1.5 rounded-[var(--radius)] bg-primary text-primary-foreground text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
        >
          Get Started Free
        </motion.button>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    // <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
    //   {/* Radial glow */}
    //   <div
    //     className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
    //     style={{
    //       background:
    //         "radial-gradient(circle, color-mix(in oklch, var(--primary) 20%, transparent) 0%, transparent 68%)",
    //     }}
    //   />

    //   <Section className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto">
    //     <motion.span
    //       variants={fadeUp}
    //       className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-accent text-accent-foreground border border-border"
    //     >
    //       🔒 Official Meta API · Zero Ban Risk
    //     </motion.span>

    //     <motion.h1
    //       variants={fadeUp}
    //       custom={1}
    //       className="font-serif text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-foreground"
    //     >
    //       Instagram Automation{" "}
    //       <span className="text-primary">That Won&apos;t</span> Get You Banned
    //     </motion.h1>

    //     <motion.p
    //       variants={fadeUp}
    //       custom={2}
    //       className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
    //     >
    //       Built entirely on the official Meta Graph API — no shady bots, no
    //       scraping, no risk. Scale your engagement while staying fully
    //       compliant.
    //     </motion.p>

    //     <motion.div
    //       variants={fadeUp}
    //       custom={3}
    //       className="flex flex-col sm:flex-row gap-3 mt-2"
    //     >
    //       <motion.button
    //         whileHover={{ scale: 1.04 }}
    //         whileTap={{ scale: 0.97 }}
    //         className="px-7 py-3.5 rounded-[var(--radius)] bg-primary text-primary-foreground font-bold text-base cursor-pointer hover:opacity-90 transition-opacity shadow-md"
    //       >
    //         Start for Free →
    //       </motion.button>
    //       <motion.button
    //         whileHover={{ scale: 1.03 }}
    //         whileTap={{ scale: 0.97 }}
    //         className="px-7 py-3.5 rounded-[var(--radius)] border border-border bg-transparent text-foreground font-semibold text-base cursor-pointer hover:bg-secondary transition-colors"
    //       >
    //         See How It Works
    //       </motion.button>
    //     </motion.div>

    //     <motion.div
    //       variants={fadeUp}
    //       custom={4}
    //       className="flex flex-wrap justify-center gap-2 mt-4"
    //     >
    //       {[
    //         "✅ Meta Compliant",
    //         "🚫 No Bans",
    //         "⚡ Instant Setup",
    //         "📊 Real Analytics",
    //       ].map((pill) => (
    //         <span
    //           key={pill}
    //           className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-border"
    //         >
    //           {pill}
    //         </span>
    //       ))}
    //     </motion.div>
    //   </Section>
    // </section>
    <Hero />
  );
}

export function ProblemSection() {
  return (
    <section className="px-6 py-24 bg-secondary/30">
      <Section className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-14">
          <h2 className="font-serif text-4xl md:text-5xl font-extrabold mt-3 text-foreground leading-tight">
            Tired of Risky Instagram Bots?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: "🚫",
              title: "Account Bans",
              desc: "Unofficial tools violate Meta's terms - your account can be permanently suspended overnight.",
            },
            {
              icon: "💥",
              title: "Sudden Breakdowns",
              desc: "Unauthorized APIs break without warning. Your entire automation stops - so does your revenue.",
            },
            {
              icon: "⚖️",
              title: "Policy Violations",
              desc: "Using scraping tools puts you in direct conflict with Meta's platform policies.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              variants={scaleIn}
              custom={i}
              className="rounded-[var(--radius)] border border-destructive/20 bg-destructive/5 p-6 flex flex-col gap-3"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-serif text-lg font-bold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={fadeUp}
          className="text-center mt-10 text-muted-foreground text-base font-semibold"
        >
          👉 If you&apos;re serious about building a long-term brand, this is
          dangerous territory.
        </motion.p>
      </Section>
    </section>
  );
}

export function SolutionSection() {
  return (
    <section className="px-6 py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 60%)",
        }}
      />
      <Section className="max-w-5xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div className="flex flex-col gap-5">
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-serif text-4xl md:text-5xl font-extrabold leading-tight text-foreground"
            >
              Built on Official Meta API - Safe, Secure, Scalable
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-muted-foreground text-base leading-relaxed"
            >
              Our platform uses the official Meta Instagram Graph API - the same
              infrastructure Meta itself relies on. This is how Instagram
              automation is meant to be done.
            </motion.p>
            <motion.button
              variants={fadeUp}
              custom={3}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="self-start px-6 py-3 rounded-[var(--radius)] bg-primary text-primary-foreground font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity"
            >
              Start Building →
            </motion.button>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { icon: "🔒", label: "Full compliance with Meta policies" },
              { icon: "🚫", label: "Zero risk of bans or shadow restrictions" },
              {
                icon: "⚡",
                label: "Reliable performance - no sudden breakdowns",
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                custom={i}
                className="flex items-center gap-4 p-4 rounded-[var(--radius)] border border-border bg-card hover:border-ring transition-colors"
              >
                <span className="text-2xl w-10 text-center">{item.icon}</span>
                <span className="text-sm font-semibold text-card-foreground">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </section>
  );
}

export function FeatureCard({
  icon,
  title,
  desc,
  index,
}: {
  icon: string;
  title: string;
  desc: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      variants={scaleIn}
      custom={index}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`rounded-[var(--radius)] border p-6 flex flex-col items-center justify-center gap-3 cursor-default transition-all duration-300 ${
        hovered
          ? "bg-accent border-ring -translate-y-1 shadow-md"
          : "bg-card border-border"
      }`}
    >
      <span className="text-4xl">{icon}</span>
      <h3 className="font-serif text-base font-bold text-card-foreground">
        {title}
      </h3>
      <p className="text-sm  text-center text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section className="px-6 py-24 bg-muted/40">
      <Section className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-14">
          <h2 className="font-serif text-4xl md:text-5xl font-extrabold mt-3 text-foreground">
            Powerful Automation That Actually Works
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </Section>
    </section>
  );
}

export function ComplianceSection() {
  return (
    <section className="px-6 py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 60%, color-mix(in oklch, var(--primary) 12%, transparent) 0%, transparent 55%)",
        }}
      />
      <Section className="max-w-4xl mx-auto relative z-10">
        <motion.div variants={fadeUp} className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
            Why Compliance Matters
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Instagram is strict about automation. Using the wrong tools can
            permanently damage your account. We do things differently.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {compliance.map((item, i) => (
            <motion.div
              key={item}
              variants={fadeUp}
              custom={i}
              className="flex items-center gap-4 p-5 rounded-[var(--radius)] border border-border bg-card hover:bg-accent hover:border-ring transition-all duration-300"
            >
              <span className="text-primary font-black text-xl">✓</span>
              <span className="text-sm font-semibold text-card-foreground">
                {item}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          className="mt-10 text-center p-5 rounded-[var(--radius)] border border-primary/30 bg-primary/5"
        >
          <p className="text-sm font-bold text-foreground">
            💡 Your account safety is our top priority - not a feature, but a
            foundation.
          </p>
        </motion.div>
      </Section>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section className="px-6 py-24 bg-secondary/30">
      <Section className="max-w-3xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-14">
          <h2 className="font-serif text-4xl md:text-5xl font-extrabold mt-3 text-foreground">
            Live in 3 Simple Steps
          </h2>
        </motion.div>

        <div className="flex flex-col gap-8 relative">
          <div className="absolute left-6 top-12 bottom-12 w-px bg-border hidden md:block" />
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              custom={i}
              className="flex gap-5 items-start relative"
            >
              <div className="w-12 h-12 shrink-0 rounded-full bg-primary text-primary-foreground font-black text-sm flex items-center justify-center font-mono z-10">
                {step.num}
              </div>
              <div className="pt-2">
                <h3 className="font-serif text-lg font-bold text-foreground mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </section>
  );
}

export function ResultsSection() {
  return (
    <section className="px-6 py-24">
      <Section className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-14">
          <h2 className="font-serif text-4xl md:text-5xl font-extrabold mt-3 text-foreground">
            Turn Engagement into Revenue
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {results.map((r, i) => (
            <motion.div
              key={r.label}
              variants={scaleIn}
              custom={i}
              className="rounded-[var(--radius)] border border-border bg-card p-6 text-center flex flex-col gap-3 hover:border-ring hover:shadow-sm transition-all duration-300"
            >
              <span className="text-4xl">{r.icon}</span>
              <h3 className="font-serif text-base font-bold text-card-foreground">
                {r.label}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-5">
            Built For
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {useCases.map((u) => (
              <span
                key={u}
                className="px-5 py-2 rounded-full border border-border bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-accent hover:border-ring transition-colors cursor-default"
              >
                {u}
              </span>
            ))}
          </div>
        </motion.div>
      </Section>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="px-6 py-24 bg-muted/40">
      <Section className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-14">
          <h2 className="font-serif text-4xl md:text-5xl font-extrabold mt-3 text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-muted-foreground text-base">
            No hidden charges. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {pricing.map((p, i) => (
            <motion.div
              key={p.tier}
              variants={scaleIn}
              custom={i}
              whileHover={{ scale: 1.03, y: -4 }}
              className={`rounded-[var(--radius)] p-7 flex flex-col gap-4 relative overflow-hidden transition-shadow duration-300 ${
                p.highlight
                  ? "bg-primary border-2 border-primary shadow-lg"
                  : "bg-card border border-border hover:border-ring hover:shadow-sm"
              }`}
            >
              {p.highlight && (
                <span className="absolute top-4 right-4 bg-accent text-accent-foreground text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Popular
                </span>
              )}
              <div>
                <h3
                  className={`font-serif text-2xl font-extrabold mb-1 ${
                    p.highlight ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {p.tier}
                </h3>
                <p
                  className={`text-sm ${p.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {p.tagline}
                </p>
              </div>
              <div
                className={`text-lg font-black font-mono ${p.highlight ? "text-primary-foreground" : "text-primary"}`}
              >
                {p.price}
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`mt-auto w-full py-2.5 rounded-[var(--radius)] font-bold text-sm cursor-pointer transition-all ${
                  p.highlight
                    ? "bg-primary-foreground text-primary hover:opacity-90"
                    : "border border-border bg-transparent text-foreground hover:bg-secondary"
                }`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </Section>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="px-6 py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 65%)",
        }}
      />
      <Section className="max-w-2xl mx-auto text-center relative z-10">
        <motion.h2
          variants={fadeUp}
          className="font-serif text-4xl md:text-6xl font-extrabold text-foreground leading-tight"
        >
          Ready to Automate the Right Way?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={1}
          className="mt-5 text-muted-foreground text-lg leading-relaxed"
        >
          Join thousands of creators, brands, and agencies using InstaFlow to
          grow safely on Instagram.
        </motion.p>
        <motion.div
          variants={fadeUp}
          custom={2}
          className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-[var(--radius)] bg-primary text-primary-foreground font-black text-base cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
          >
            Start for Free — No Card Required
          </motion.button>
        </motion.div>
        <motion.p
          variants={fadeUp}
          custom={3}
          className="mt-5 text-xs text-muted-foreground"
        >
          Official Meta API · GDPR Compliant · Cancel Anytime
        </motion.p>
      </Section>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10 bg-background">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-serif text-lg font-bold text-primary">
          InstaFlow
        </span>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} InstaFlow. Built on the Official Meta
          API. Not affiliated with Meta Platforms, Inc.
        </p>
        <div className="flex gap-5 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="bg-background text-foreground font-sans min-h-screen overflow-x-hidden">
      <NavBar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <ComplianceSection />
      <HowItWorksSection />
      <ResultsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
