import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#b8dfe2] flex items-center justify-center font-bold">
              L
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">LifeLink</p>
              <p className="text-xs text-zinc-500">Connecting lives digitally</p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-[#d4002a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b70024]"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#b8dfe2] blur-3xl opacity-70" />
          <div className="absolute -bottom-28 right-16 h-72 w-72 rounded-full bg-red-200 blur-3xl opacity-40" />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Manage health info.
              <span className="block text-[#d4002a]">Stay connected.</span>
            </h1>

            <p className="mt-4 max-w-xl text-base text-zinc-600">
              LifeLink is a simple platform concept to help people securely
              connect with essential health details and support—designed with a
              clean, user-friendly experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-md bg-[#d4002a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#b70024]"
              >
                Create account
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Hero card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="rounded-xl bg-zinc-50 p-5">
                <p className="mt-2 text-lg font-semibold">
                  Your profile snapshot
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-zinc-200 bg-white p-4">
                    <p className="text-xs text-zinc-500">Blood Group</p>
                    <p className="mt-1 text-sm font-semibold">O+</p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-4">
                    <p className="text-xs text-zinc-500">Emergency Contact</p>
                    <p className="mt-1 text-sm font-semibold">Saved</p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-4">
                    <p className="text-xs text-zinc-500">Allergies</p>
                    <p className="mt-1 text-sm font-semibold">2 items</p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-white p-4">
                    <p className="text-xs text-zinc-500">Medications</p>
                    <p className="mt-1 text-sm font-semibold">3 items</p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-4">
                  <p className="text-xs text-zinc-500">Next step</p>
                  <p className="mt-1 text-sm font-semibold">
                    Log in to access your dashboard
                  </p>
                  <div className="mt-3 flex gap-3">
                    <Link
                      href="/login"
                      className="rounded-md bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
                    >
                      Go to Login
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold hover:bg-zinc-100"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Why LifeLink?</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: "Health information, when it matters",
              desc: "LifeLink helps users keep important health details organised and accessible, especially in situations where quick access can make a real difference."
            },
            {
              title: "Designed for clarity and ease",
              desc: "The platform focuses on a clean and simple experience so users can register, sign in, and navigate without confusion or unnecessary steps.",
            },
            {
              title: "Scalable authentication flow",
              desc: "LifeLink implements a complete authentication journey—from registration to dashboard access—designed to evolve into a secure, role-based system in later development phases.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 h-10 w-10 rounded-xl bg-[#b8dfe2] flex items-center justify-center">
                ✓
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} LifeLink
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/login" className="text-zinc-600 hover:text-zinc-900">
              Login
            </Link>
            <Link href="/register" className="text-zinc-600 hover:text-zinc-900">
              Register
            </Link>
            <Link
              href="/auth/dashboard"
              className="text-zinc-600 hover:text-zinc-900"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
