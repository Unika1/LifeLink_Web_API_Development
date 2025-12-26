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
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
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
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
      <h1 className="mb-2 text-center text-2xl font-semibold text-zinc-900">
        Create Account
      </h1>
      <p className="mb-8 text-center text-sm text-zinc-500">
        Create your account to continue
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <input
            type="text"
            placeholder="Full name"
            {...register("fullName")}
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-red-500"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email address"
            {...register("email")}
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-red-500"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-900 outline-none focus:border-red-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            aria-label="Toggle password visibility"
          >
            👁
          </button>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-red-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            aria-label="Toggle password visibility"
          >
            👁
          </button>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="text-red-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
