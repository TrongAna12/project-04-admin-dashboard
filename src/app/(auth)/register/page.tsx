"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFormShell } from "@/components/forms/AuthFormShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormData } from "@/schemas/authSchema";
import { authRegister } from "@/services/api";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    setServerError("");
    setLoading(true);

    try {
      await authRegister(values);
      router.push("/auth/login");
    } catch (error) {
      setServerError("Unable to register, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell title="Create account" description="Register a new admin account to access the dashboard.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError ? (
          <div className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-700">
            {serverError}
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-200">Full name</label>
          <Input type="text" placeholder="Nguyen Van A" {...register("name")} disabled={loading} />
          {errors.name ? <p className="mt-2 text-xs text-rose-600">{errors.name.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-200">Email</label>
          <Input type="email" placeholder="admin@example.com" {...register("email")} disabled={loading} />
          {errors.email ? <p className="mt-2 text-xs text-rose-600">{errors.email.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-200">Password</label>
          <Input type="password" placeholder="••••••••" {...register("password")} disabled={loading} />
          {errors.password ? <p className="mt-2 text-xs text-rose-600">{errors.password.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-200">Confirm password</label>
          <Input type="password" placeholder="••••••••" {...register("confirmPassword")} disabled={loading} />
          {errors.confirmPassword ? <p className="mt-2 text-xs text-rose-600">{errors.confirmPassword.message}</p> : null}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account? <Link href="/auth/login" className="text-blue-600 hover:text-blue-700">Sign in</Link>
      </div>
    </AuthFormShell>
  );
}
