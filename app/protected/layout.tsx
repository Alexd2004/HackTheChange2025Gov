import Image from "next/image";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen ">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 w-full max-w-8xl items-center px-6">
          <div className="flex w-full items-center gap-4">
            <div className="flex flex-1 items-center">
              <Image
                src="/Canada_web.svg"
                alt="Canada Flag"
                width={120}
                height={50}
                className="h-10 w-auto"
                priority
              />
            </div>
            <Link
              href="/"
              className="flex flex-1 justify-center text-4xl text-gray-900"
            >
              UrbanSignal
            </Link>
            <div className="flex flex-1 items-center justify-end">
              <Link
                href="/protected/ai-analytics"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                AI Analytics
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-8xl flex-1 px-6 py-4">
        {children}
      </div>
    </main>
  );
}
