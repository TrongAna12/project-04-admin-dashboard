"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { AuthFormShell } from "@/components/forms/AuthFormShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authForgotPassword } from "@/services/api";

interface ForgotForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<ForgotForm>({ defaultValues: { email: "" } });

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await authForgotPassword(data.email);
      setMessage("A reset link has been sent to your email.");
    } catch (err) {
      setError("Unable to send reset link right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      title="Forgot password"
      description="Enter your email and we will send you a reset link."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {message ? (
          <div className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-700">{message}</div>
        ) : null}
        {error ? (
          <div className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-200">Email address</label>
          <Input type="email" placeholder="admin@example.com" {...register("email", { required: true })} disabled={loading} />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Remembered your password? <Link href="/auth/login" className="text-blue-600 hover:text-blue-700">Sign in</Link>
      </div>
    </AuthFormShell>
  );
}
