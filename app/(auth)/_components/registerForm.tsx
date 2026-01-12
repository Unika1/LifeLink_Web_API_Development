"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema, type RegisterFormValues } from "../schema";

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
      {children}
    </span>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...userToSave } = values;
    localStorage.setItem("mock_user", JSON.stringify(userToSave));
    router.push("/login");
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/60">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Create Account</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Join LifeLink and continue securely
        </p>
      </div>

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs font-medium text-zinc-400">SIGN UP</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First + Last name */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div className="relative">
              <FieldIcon>👤</FieldIcon>
              <input
                type="text"
                placeholder="First name"
                {...register("firstName")}
                className="w-full rounded-xl border border-zinc-300 bg-white px-10 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <FieldIcon>👤</FieldIcon>
              <input
                type="text"
                placeholder="Last name"
                {...register("lastName")}
                className="w-full rounded-xl border border-zinc-300 bg-white px-10 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <FieldIcon>✉️</FieldIcon>
            <input
              type="email"
              placeholder="Email address"
              {...register("email")}
              className="w-full rounded-xl border border-zinc-300 bg-white px-10 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <FieldIcon>🔒</FieldIcon>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className="w-full rounded-xl border border-zinc-300 bg-white px-10 py-3 pr-12 text-sm text-zinc-900 outline-none transition focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              aria-label="Toggle password visibility"
            >
              👁
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <FieldIcon>🔑</FieldIcon>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className="w-full rounded-xl border border-zinc-300 bg-white px-10 py-3 pr-12 text-sm text-zinc-900 outline-none transition focus:border-[#d4002a] focus:ring-4 focus:ring-red-100"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              aria-label="Toggle confirm password visibility"
            >
              👁
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-[#d4002a] py-3 text-sm font-semibold text-white shadow-lg shadow-red-200/60 transition hover:bg-[#b70024] active:scale-[0.99]"
        >
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#d4002a] hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
