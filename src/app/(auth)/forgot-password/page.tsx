"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="bg-surface-2 border border-white/8 rounded-2xl p-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Check your inbox</h2>
          <p className="text-slate-400 mb-2">
            We sent a password reset link to
          </p>
          <p className="text-white font-medium mb-8">{email}</p>
          <p className="text-sm text-slate-500 mb-6">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button onClick={() => setSent(false)} className="text-indigo-400 hover:text-indigo-300">
              try again
            </button>
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Forgot your password?</h1>
        <p className="text-slate-400">No worries. Enter your email and we&apos;ll send you a reset link.</p>
      </div>

      <div className="bg-surface-2 border border-white/8 rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            iconLeft={<Mail size={16} />}
            fullWidth
            required
          />
          <Button type="submit" fullWidth loading={loading} size="lg">
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors">
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

