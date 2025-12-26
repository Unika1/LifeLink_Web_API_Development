import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-zinc-100">
      <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
        {/* Left panel */}
        <div className="hidden items-center justify-center bg-[#b8dfe2] md:flex">
          <div className="flex flex-col items-center gap-4 text-center">
            <Image
              src="/LifeLink.png"
              alt="LifeLink logo"
              width={180}
              height={180}
              priority
            />
            <h1 className="text-3xl font-semibold tracking-wide text-zinc-900">
              LifeLink
            </h1>
            <p className="max-w-xs text-sm text-zinc-700">
              Connecting lives digitally
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex items-center justify-center bg-white md:rounded-l-[48px]">
          <div className="w-full max-w-md px-8 py-16">{children}</div>
        </div>
      </div>

      {/* Mobile logo */}
      <div className="bg-[#b8dfe2] py-10 md:hidden">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/LifeLink.png"
            alt="LifeLink logo"
            width={120}
            height={120}
          />
          <div className="text-2xl font-semibold tracking-wide text-zinc-900">
            LifeLink
          </div>
          <Link href="/" className="text-xs text-zinc-700 underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
