import Link from "next/link";
import { UserRound } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen ">
      <header className="border-b ">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-semibold text-gray-900">
            Leeam Demons
          </Link>
          <div className="flex items-center">
            <UserRound className="h-6 w-6 text-gray-500" aria-hidden={true} />
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </div>
    </main>
  );
}
