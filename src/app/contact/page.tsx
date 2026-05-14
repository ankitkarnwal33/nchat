import ContactUsForm from "@/src/components/ContactUsForm";
import { Metadata } from "next";
import { Footer } from "../ho/page";
import Header from "@/src/components/Header";

export const metadata: Metadata = {
  title: "Contact Us | ChatNinjas",
  description:
    "Get in touch with our support team for any questions or assistance.",
  keywords: ["Contact Us", "ChatNinjas", "Help Center", "Support"],
  authors: [{ name: "ChatNinjas", url: "https://chatninjas.in" }],
  alternates: {
    canonical: "https://chatninjas.in/contact-us",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "Contact Us | ChatNinjas",
    description: "Contact Us | ChatNinjas",
    url: "https://chatninjas.in",
  },
};

export default function Page() {
  return (
    <div className="w-full">
      <Header />
      <section className="bg-primary/3 flex flex-col md:flex-row px-5 md:px-10 mt-5 md:py-20 py-10 gap-10">
        <div className="container mx-auto py-10 flex-1 ">
          <h1 className="text-4xl font-bold mb-5">Contact Us</h1>
          <p className="text-lg text-gray-500 max-w-xl">
            We are here to help you. Please fill out the form below and we will
            get back to you as soon as possible.
          </p>
          <h2 className="text-normal text-gray-500 mt-5">
            Or write mail to us on{" "}
            <span className="text-amber-500 text-semibold ">
              karnwalankit89@gmail.com
            </span>{" "}
          </h2>
        </div>
        <ContactUsForm />
      </section>
      <Footer />
    </div>
  );
}
