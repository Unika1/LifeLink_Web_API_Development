// app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-semibold text-zinc-800">Sign In</h1>

      {/* Social buttons */}
      <div className="mt-8 grid w-full grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          <span className="text-base">G</span>
          Sign In With Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          <span className="text-base">f</span>
          Sign In With Facebook
        </button>
      </div>

      {/* OR divider */}
      <div className="my-8 flex w-full items-center gap-4">
        <div className="h-px flex-1 bg-zinc-200" />
        <div className="text-xs font-medium text-zinc-400">— OR —</div>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      {/* Form */}
      <form className="w-full">
        {/* Email */}
        <div className="relative">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400">
            ✉
          </span>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border-b border-zinc-200 py-3 pl-7 pr-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
          />
        </div>

        {/* Password */}
        <div className="relative mt-5">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400">
            🔑
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border-b border-zinc-200 py-3 pl-7 pr-10 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        {/* Submit */}
        <button
          type="button"
          className="mt-8 w-full rounded-md bg-[#d4002a] py-3 text-sm font-semibold text-white hover:bg-[#b70024]"
        >
          Sign in
        </button>
      </form>

      {/* Footer link */}
      <div className="mt-6 text-sm text-zinc-500">
        No Account?{" "}
        <Link href="/register" className="text-sky-600 hover:underline">
          Create One!
        </Link>
      </div>
    </div>
  );
}
