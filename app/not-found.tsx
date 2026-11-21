import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center px-6 text-center">
      <div>
        <p className="label justify-center">404</p>
        <h1 className="mt-4 font-serif text-6xl font-bold">Page not found</h1>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-lapis-700 px-6 py-3 font-semibold text-ivory">
          Back home
        </Link>
      </div>
    </main>
  );
}
