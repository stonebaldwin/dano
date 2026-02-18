import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container card">
        <h1>Page not found</h1>
        <p>The page you requested does not exist.</p>
        <Link href="/">Return to homepage</Link>
      </div>
    </section>
  );
}
