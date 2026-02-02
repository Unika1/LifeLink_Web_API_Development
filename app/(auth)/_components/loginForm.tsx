"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "../schema";
import { handleLogin } from "@/lib/actions/auth-actions";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginData) => {
    setLoginError("");

    const res = await handleLogin(values);

    if (!res.success) {
      setLoginError(res.message || "Invalid email or password");
      return;
    }

    // Redirect based on user role
    if (res.data?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };


  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
      <h1 className="mb-2 text-center text-2xl font-semibold text-zinc-900">
        Login
      </h1>
      <p className="mb-6 text-center text-sm text-zinc-500">
        Welcome back, please login
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              ✉️
            </span>
            <input
              type="email"
              placeholder="Email address"
              {...register("email")}
              className="w-full rounded-md border border-zinc-300 py-3 pl-10 pr-3 text-sm text-zinc-900 outline-none focus:border-red-500"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              🔒
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full rounded-md border border-zinc-300 py-3 pl-10 pr-10 text-sm text-zinc-900 outline-none focus:border-red-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            >
              👁
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Login error (wrong password / no account) */}
        {loginError && (
          <p className="text-center text-sm text-red-600">{loginError}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
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
