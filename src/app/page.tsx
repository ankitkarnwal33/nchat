import { Button } from "../components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Header from "../components/Header";
import Link from "next/link";
import Hero from "@/src/components/Hero";
import {
  ComplianceSection,
  FeaturesSection,
  HowItWorksSection,
  ProblemSection,
  PricingSection,
  SolutionSection,
  CTASection,
  Footer,
} from "./ho/page";

export const metadata = {
  title: "ChatNinjas - Instagram Automation",
  description:
    "ChatNinjas - Automate your Instagram replies and never miss a lead again",
};

export default async function Home() {
  return (
    <div className="h-screen w-full relative">
      <Header />
      {/* Dashed Top Fade Grid */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, #754e13 1px, transparent 1px),
        linear-gradient(to bottom, #754e13 1px, transparent 1px)
      `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <div className="relative z-1 px-4 sm:px-6 md:px-0 flex flex-col items-center justify-center h-screen">
        <Hero />
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Link href="/login">
            <Button className=" text-base rounded-full px-6" size="lg">
              <ArrowRightIcon className="size-4" />
              Start Free Trial
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button
              className=" text-base rounded-full px-6"
              size="lg"
              variant="outline"
            >
              <ArrowRightIcon className="size-4" />
              {/* <Instagram className="size-4" /> */}
              Connect Instagram
            </Button>
          </Link>
        </div>
      </div>
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <ComplianceSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
