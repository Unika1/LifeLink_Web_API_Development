"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema, type RegisterFormValues } from "../schema";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = (values: RegisterFormValues) => {
    localStorage.setItem("mock_user", JSON.stringify(values));
    alert("Registration successful. Please login.");
    router.push("/login");
  };

  return (
    <div className="flex w-full max-w-md flex-col text-zinc-900">
      <h1 className="mb-8 text-center text-2xl font-semibold">Create Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        {/* Full Name */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border-b border-zinc-300 bg-transparent py-3 text-sm
                       text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-500"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-6">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border-b border-zinc-300 bg-transparent py-3 text-sm
                       text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-500"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border-b border-zinc-300 bg-transparent py-3 pr-10 text-sm
                       text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-500"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁"}
          </button>

          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full rounded-md bg-red-600 py-3 text-sm font-semibold text-white
                     hover:bg-red-700 disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
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
