"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line
    setFloatingItems([...Array(10)].map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${12 + Math.random() * 10}s`,
    })));
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...data,
            type: "login",
          })
        );
        router.push("/homePage");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Floating background */}
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
      <div className="relative h-[600px] w-[520px] overflow-hidden rounded-[28px] bg-zinc-900 shadow-[0_10px_50px_rgba(220,38,38,0.35)]">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 to-red-900 px-6 pt-10 pb-5 text-white">
          <div className="mb-4 text-center text-4xl">🎬</div>
          <h1 className="text-2xl font-semibold">Entertainment Tinder</h1>
          <p className="mt-1 text-sm text-white/90">
            Connect with industry professionals
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-2 border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

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

          <button
            onClick={handleLogin}
            className="mt-3 w-full rounded-full bg-gradient-to-br from-red-600 to-red-900 py-3.5 text-lg font-semibold text-white transition active:scale-95"
          >
            Login
          </button>

          <Link
            href="/signUpPage"
            className="mt-2 w-full rounded-full border-2 border-red-600 py-3.5 text-lg font-semibold text-red-500 text-center block hover:bg-red-600 hover:text-white transition active:scale-95"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Animation */}
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
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
