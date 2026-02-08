"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordData } from "../schema";
import { handleRequestPasswordReset } from "@/lib/actions/auth-actions";

export default function ForgotPasswordForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordData) => {
    setStatus("idle");
    setMessage("");

    const res = await handleRequestPasswordReset(values.email);

    if (res.success) {
      setStatus("success");
      setMessage(
        res.message || "If the email is registered, a reset link has been sent."
      );
      return;
    }

    setStatus("error");
    setMessage(res.message || "Failed to request password reset");
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
      <h1 className="mb-2 text-center text-2xl font-semibold text-zinc-900">
        Forgot Password
      </h1>
      <p className="mb-6 text-center text-sm text-zinc-500">
        Enter your email and we will send you a reset link
      </p>

      {status === "success" && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          ✓ {message}
        </div>
      )}
      {status === "error" && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          ✕ {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <button
          type="submit"
          className="w-full rounded-md bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          Send Reset Link
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Remembered your password?{" "}
        <Link href="/login" className="text-red-600 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
