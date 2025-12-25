"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const fullName = String(form.get("fullName") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    // mock "register" = save to localStorage
    const user = { fullName, email, password };
    localStorage.setItem("mock_user", JSON.stringify(user));

    alert("Registered (mock). Now login!");
    router.push("/login");
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center text-zinc-900">
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900">
        Create Account
      </h1>

      <div className="grid w-full grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          <span className="text-base font-semibold">G</span>
          Sign Up With Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          <span className="text-base font-semibold">f</span>
          Sign Up With Facebook
        </button>
      </div>

      <div className="my-8 flex w-full items-center gap-4">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs text-zinc-400">— OR —</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <form className="w-full" onSubmit={handleRegister}>
        <div className="relative">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400">
            👤
          </span>
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            className="w-full border-b border-zinc-300 py-3 pl-7 pr-2 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-500"
            required
          />
        </div>

        <div className="relative mt-5">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400">
            ✉
          </span>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full border-b border-zinc-300 py-3 pl-7 pr-2 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-500"
            required
          />
        </div>

        <div className="relative mt-5">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-400">
            🔑
          </span>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border-b border-zinc-300 py-3 pl-7 pr-10 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-500"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        <button
          type="submit"
          className="mt-8 w-full rounded-md bg-[#d4002a] py-3 text-sm font-semibold text-white hover:bg-[#b70024]"
        >
          Create Account
        </button>
      </form>

      <div className="mt-6 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="text-sky-600 hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
