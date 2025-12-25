"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "").trim();

    const savedUser = localStorage.getItem("mock_user");

    if (!savedUser) {
      alert("No user found. Please register first.");
      router.push("/register");
      return;
    }

    const user = JSON.parse(savedUser);

    if (email === user.email && password === user.password) {
      router.push("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col text-zinc-900">
      <h1 className="mb-8 text-center text-2xl font-semibold">Sign In</h1>

      <form onSubmit={handleLogin}>
        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="mb-6 w-full border-b border-zinc-300 bg-transparent py-3 text-sm
                     text-zinc-900 placeholder:text-zinc-400 outline-none"
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border-b border-zinc-300 bg-transparent py-3 pr-10
                       text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400"
          >
            👁
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-8 w-full rounded-md bg-red-600 py-3
                     text-sm font-semibold text-white hover:bg-red-700"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        No account?{" "}
        <Link href="/register" className="text-sky-600 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
