"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex w-full max-w-md flex-col items-center text-zinc-900">
      {/* Title */}
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900">
        Create Account
      </h1>

      {/* Social buttons */}
      <div className="grid w-full grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md
                     border border-zinc-200 bg-white py-2
                     text-sm text-zinc-700 hover:bg-zinc-50"
        >
          <span className="text-base font-semibold">G</span>
          Sign Up With Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md
                     border border-zinc-200 bg-white py-2
                     text-sm text-zinc-700 hover:bg-zinc-50"
        >
          <span className="text-base font-semibold">f</span>
          Sign Up With Facebook
        </button>
      </div>

      {/* OR divider */}
      <div className="my-8 flex w-full items-center gap-4">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs text-zinc-400">— OR —</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      {/* Form */}
      <form className="w-full">
        {/* Full Name */}
        <div className="relative">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400">
            👤
          </span>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border-b border-zinc-300 py-3 pl-7 pr-2
                       bg-transparent text-sm text-zinc-900
                       placeholder:text-zinc-400 outline-none
                       focus:border-zinc-500"
          />
        </div>

        {/* Email */}
        <div className="relative mt-5">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400">
            ✉
          </span>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border-b border-zinc-300 py-3 pl-7 pr-2
                       bg-transparent text-sm text-zinc-900
                       placeholder:text-zinc-400 outline-none
                       focus:border-zinc-500"
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
            className="w-full border-b border-zinc-300 py-3 pl-7 pr-10
                       bg-transparent text-sm text-zinc-900
                       placeholder:text-zinc-400 outline-none
                       focus:border-zinc-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-0 top-1/2 -translate-y-1/2
                       text-zinc-400 hover:text-zinc-600"
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        {/* Submit */}
        <button
          type="button"
          className="mt-8 w-full rounded-md bg-[#d4002a]
                     py-3 text-sm font-semibold text-white
                     hover:bg-[#b70024]"
        >
          Create Account
        </button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="text-sky-600 hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
