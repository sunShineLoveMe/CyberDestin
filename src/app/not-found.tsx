import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-deep-space-black text-white">
      <h2 className="font-orbitron text-4xl font-bold text-neon-purple mb-4">
        404 - Page Not Found
      </h2>
      <p className="font-rajdhani text-xl text-cyan-tech mb-8">
        The destiny you seek is not here.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-hot-pink text-white font-bold rounded-lg hover:bg-opacity-80 transition-all font-inter"
      >
        Return to Reality
      </Link>
    </div>
  );
}
