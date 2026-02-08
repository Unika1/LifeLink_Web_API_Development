"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordData } from "../schema";
import { handleResetPassword } from "@/lib/actions/auth-actions";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordData) => {
    if (!token) {
      setStatus("error");
      setMessage("Reset token is missing.");
      return;
    }

    setStatus("idle");
    setMessage("");

    const res = await handleResetPassword(token, values.newPassword);

    if (res.success) {
      setStatus("success");
      setMessage(res.message || "Password reset successful.");
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    setStatus("error");
    setMessage(res.message || "Reset failed");
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
      <h1 className="mb-2 text-center text-2xl font-semibold text-zinc-900">
        Reset Password
      </h1>
      <p className="mb-6 text-center text-sm text-zinc-500">
        Enter your new password below
      </p>

      {!token && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          ✕ Reset token is missing. Please use the link from your email.
        </div>
      )}

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
              🔒
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              {...register("newPassword")}
              className="w-full rounded-md border border-zinc-300 py-3 pl-10 pr-10 text-sm text-zinc-900 outline-none focus:border-red-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
              aria-label="Toggle password visibility"
            >
              👁
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              🔑
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className="w-full rounded-md border border-zinc-300 py-3 pl-10 pr-10 text-sm text-zinc-900 outline-none focus:border-red-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
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
          disabled={!token}
          className="w-full rounded-md bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          Reset Password
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Back to{" "}
        <Link href="/login" className="text-red-600 hover:underline">
          login
        </Link>
      </p>
    </div>
  );
}
