"use client";

import AuthCard from "@/app/_components/authCard";
import FormInput from "@/app/_components/formInput";
import SocialButton from "@/app/_components/socialButton";
import Link from "next/link";


export default function LoginPage() {
  return (
    <AuthCard title="Sign In">
      {/* Social buttons */}
      <div className="mt-8 grid w-full grid-cols-2 gap-4">
        <SocialButton label="Sign In With Google" />
        <SocialButton label="Sign In With Facebook" />
      </div>

      {/* OR divider */}
      <div className="my-8 flex w-full items-center gap-4">
        <div className="h-px flex-1 bg-zinc-200" />
        <div className="text-xs font-medium text-zinc-400">— OR —</div>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      {/* Inputs */}
      <FormInput placeholder="Email Address" />
      <FormInput type="password" placeholder="Password" />

      {/* Button */}
      <button
        type="button"
        className="mt-8 w-full rounded-md bg-[#d4002a] py-3 text-sm font-semibold text-white hover:bg-[#b70024]"
      >
        Sign in
      </button>

      {/* Footer link */}
      <div className="mt-6 text-center text-sm text-zinc-500">
        No Account?{" "}
        <Link href="/register" className="text-sky-600 hover:underline">
          Create One!
        </Link>
      </div>
    </AuthCard>
  );
}
