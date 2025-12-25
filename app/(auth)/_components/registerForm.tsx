"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const fullName = String(form.get("fullName") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "").trim();

    const user = { fullName, email, password };

    localStorage.setItem("mock_user", JSON.stringify(user));

    alert("Registration successful. Please login.");
    router.push("/login");
  }

  return (
    <div className="flex w-full max-w-md flex-col text-zinc-900">
      <h1 className="mb-8 text-center text-2xl font-semibold">
        Create Account
      </h1>

      <form onSubmit={handleRegister}>
        {/* Full name */}
        <input
          name="fullName"
          type="text"
          placeholder="Full Name"
          className="mb-6 w-full border-b border-zinc-300 bg-transparent py-3
                     text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
          required
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="mb-6 w-full border-b border-zinc-300 bg-transparent py-3
                     text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
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
            minLength={6}
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
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="text-sky-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
