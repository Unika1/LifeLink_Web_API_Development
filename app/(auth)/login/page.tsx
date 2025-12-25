"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const raw = localStorage.getItem("mock_user");
    if (!raw) {
      alert("No registered user found. Please register first.");
      router.push("/register");
      return;
    }

    const user = JSON.parse(raw) as { email: string; password: string };

    if (email === user.email && password === user.password) {
      localStorage.setItem("mock_logged_in", "true");
      router.push("/dashboard");
    } else {
      alert("Invalid email or password (mock).");
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center text-zinc-900">
      <h1 className="mb-8 text-2xl font-semibold text-zinc-900">Sign In</h1>

      <div className="grid w-full grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          <span className="text-base font-semibold">G</span>
          Sign In With Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white py-2 text-sm text-zinc-700 hover:bg-zinc-50"
        >
          <span className="text-base font-semibold">f</span>
          Sign In With Facebook
        </button>
      </div>

      <div className="my-8 flex w-full items-center gap-4">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs text-zinc-400">— OR —</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <form className="w-full" onSubmit={handleLogin}>
        <div className="relative">
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

        <button
          type="submit"
          className="mt-8 w-full rounded-md bg-[#d4002a] py-3 text-sm font-semibold text-white hover:bg-[#b70024]"
        >
          Sign in
        </button>
      </form>

      <div className="mt-6 text-sm text-zinc-500">
        No Account?{" "}
        <Link href="/register" className="text-sky-600 hover:underline">
          Create One!
        </Link>
      </div>
    </div>
  );
}
