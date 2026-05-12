"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AuthFormShell } from "@/components/forms/AuthFormShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authVerifyOtp } from "@/services/api";

interface OtpForm {
  code: string;
}

export default function OtpPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<OtpForm>({ defaultValues: { code: "" } });

  const onSubmit = async (values: OtpForm) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await authVerifyOtp(values.code);
      setMessage("OTP verified successfully. Redirecting to dashboard...");
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      title="OTP verification"
      description="Enter the code sent to your email or phone to complete sign in."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {message && <div className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-700">{message}</div>}
        {error && <div className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-200">Verification code</label>
          <Input type="text" placeholder="123456" {...register("code", { required: true })} disabled={loading} />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify code"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Didn’t receive a code? <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700">Resend</Link>
      </div>
    </AuthFormShell>
  );
}
