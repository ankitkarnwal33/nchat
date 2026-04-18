import Link from "next/link";

export default function EmailTemplate() {
  return (
    <div className="bg-white p-4 rounded-lg text-black">
      <h1>Hello World</h1>
      <h2>Ankit Karnwal</h2>
      <p>ankit@wheatless.in</p>
      <p>This is a test email</p>
      <Link href="https://www.google.com">Click here</Link>
    </div>
  );
}
