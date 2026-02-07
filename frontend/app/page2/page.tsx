"use client";

import { useState } from "react";
import Link from "next/link";
//hrllo
export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="absolute animate-float text-3xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${12 + Math.random() * 10}s`,
            }}
          >
            🎬
          </span>
        ))}
      </div>

      {/* Phone frame */}
      <div className="relative h-[700px] w-[520px] overflow-hidden rounded-[28px] bg-zinc-900 shadow-[0_10px_50px_rgba(220,38,38,0.35)]">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 to-red-900 px-6 pt-10 pb-5 text-white">
          <div className="mb-4 text-center text-4xl">🎬</div>
          <h1 className="text-2xl font-semibold">Create Account</h1>
          <p className="mt-1 text-sm text-white/90">
            Join Entertainment Tinder now
          </p>
        </div>

        {/* Content */}
          <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto max-h-[430px]">
          {/* First Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">
              First & Last Name
            </label>
            <input
              type="First Name"
              placeholder="First Last"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-2 border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-2 border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-2 border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-xl border-2 border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

          {/* Sign Up button */}
          <button className="mt-3 w-full rounded-full bg-gradient-to-br from-red-600 to-red-900 py-3.5 text-lg font-semibold text-white transition active:scale-95">
            Sign Up
          </button>

          {/* Back button */}
          <Link
            href="/"
            className="mt-2 w-full rounded-full border-2 border-red-600 py-3.5 text-lg font-semibold text-red-500 text-center block hover:bg-red-600 hover:text-white transition active:scale-95"
          >
            Back to Login
          </Link>
        </div>
      </div>

      {/* Floating animation */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(110vh);
          }
          100% {
            transform: translateY(-20vh);
          }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
