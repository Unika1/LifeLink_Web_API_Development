// app/(auth)/layout.tsx
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-zinc-100">
      <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
        {/* Left panel */}
        <div className="relative hidden items-center justify-center bg-[#b8dfe2] md:flex">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/LifeLink.png"
              alt="LifeLink logo"
              width={180}
              height={180}
              priority
            />
            <div className="text-3xl font-semibold tracking-wide text-zinc-900">
              LifeLink
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="relative flex items-center justify-center bg-white md:rounded-l-[48px]">
          {/* language dropdown (UI only) */}
          <div className="absolute right-6 top-6">
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700"
            >
              English (UK)
              <span className="text-xs">▾</span>
            </button>
          </div>

          <div className="w-full max-w-md px-8 py-16">{children}</div>
        </div>
      </div>

      {/* Mobile logo (top) */}
      <div className="md:hidden bg-[#b8dfe2] py-10">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/lifelink.png"
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
