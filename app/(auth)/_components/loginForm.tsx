"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormValues } from "../schema";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    const raw = localStorage.getItem("mock_user");
    if (!raw) {
      alert("Please register first");
      router.push("/register");
      return;
    }

    const user = JSON.parse(raw);
    if (
      values.email.trim().toLowerCase() === user.email.toLowerCase() &&
      values.password === user.password
    ) {
      router.push("/auth/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
      <h1 className="mb-2 text-center text-2xl font-semibold text-zinc-900">
        Sign In
      </h1>
      <p className="mb-8 text-center text-sm text-zinc-500">
        Welcome back, please login
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="Email address"
            {...register("email")}
            className="w-full rounded-md border border-zinc-300 px-4 py-3
                       text-sm text-zinc-900 outline-none
                       focus:border-red-500"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
            className="w-full rounded-md border border-zinc-300 px-4 py-3
                       text-sm text-zinc-900 outline-none
                       focus:border-red-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
          >
            👁
          </button>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-red-600 py-3
                     text-sm font-semibold text-white hover:bg-red-700"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Don’t have an account?{" "}
        <Link href="/register" className="text-red-600 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
