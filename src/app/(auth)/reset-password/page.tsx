"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFormShell } from "@/components/forms/AuthFormShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/schemas/authSchema";
import { useState } from "react";
import { authResetPassword } from "@/services/api";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values: ResetPasswordFormData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await authResetPassword(values.password, values.confirmPassword);
      setSuccess("Your password has been reset successfully.");
    } catch (err) {
      setError("Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      title="Reset password"
      description="Create a new password for your account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {success && <div className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-700">{success}</div>}
        {error && <div className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-200">New password</label>
          <Input type="password" placeholder="••••••••" {...register("password")} disabled={loading} />
          {errors.password ? <p className="mt-2 text-xs text-rose-600">{errors.password.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-200">Confirm password</label>
          <Input type="password" placeholder="••••••••" {...register("confirmPassword")} disabled={loading} />
          {errors.confirmPassword ? <p className="mt-2 text-xs text-rose-600">{errors.confirmPassword.message}</p> : null}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting password..." : "Reset password"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Return to <Link href="/auth/login" className="text-blue-600 hover:text-blue-700">Sign in</Link>
      </div>
    </AuthFormShell>
  );
}
