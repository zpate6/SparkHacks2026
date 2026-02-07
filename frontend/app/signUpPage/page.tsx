"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createNewUser } from "@/lib/api";
import { User } from "@/types";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    profession: 'ACTOR', // Default from your Enum list
    zipcode: '',
    image: '',
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [userType, setUserType] = useState("Studios");
  const [floatingItems, setFloatingItems] = useState<Array<{ left: string, delay: string, duration: string }>>([]);
  const router = useRouter();

  const USER_TYPES = [
    "Studios",
    "Producer",
    "Directors",
    "Scriptwriter",
    "Actors",
    "Musicians"
  ];

  useEffect(() => {
    // eslint-disable-next-line
    setFloatingItems([...Array(10)].map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${12 + Math.random() * 10}s`,
    })));
  }, []);

  const handleSignUp = async () => {

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.profession || !formData.zipcode || !confirm) {
      alert("Please fill out all fields");
      return;
    }

    if (formData["password"] !== confirm) {
      alert("Passwords do not match");
      return;
    }


    try {
      // 1. Send data to your Spring Boot backend
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
        alert('User created successfully!');
        router.push('/homePage'); // Redirect to swiping home page
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Floating background */}
      <div className="pointer-events-none absolute inset-0">
        {floatingItems.map((item, i) => (
          <span
            key={i}
            className="absolute animate-float text-3xl opacity-20"
            style={{
              left: item.left,
              animationDelay: item.delay,
              animationDuration: item.duration,
            }}
          >
            🎬
          </span>
        ))}
      </div>

      {/* Phone frame */}
      <div className="relative h-[780px] w-[520px] overflow-hidden rounded-[28px] bg-zinc-900 shadow-[0_10px_50px_rgba(220,38,38,0.35)]">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 to-red-900 px-6 pt-10 pb-5 text-white">
          <div className="mb-4 text-center text-4xl">🎬</div>
          <h1 className="text-2xl font-semibold">Create Account</h1>
          <p className="mt-1 text-sm text-white/90">
            Join Entertainment Tinder now
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto max-h-[510px]">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">
              User Type
            </label>
            <div className="relative">
              <select
                value={formData["profession"]}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="w-full appearance-none rounded-xl border-2 border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-600"
              >
                {USER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">
              First Name
            </label>
            <input
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="rounded-xl border-2 border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">
              Last Name
            </label>
            <input
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="rounded-xl border-2 border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">
              Zip Code
            </label>
            <input
              placeholder="Zip Code"
              value={formData.zipcode}
              onChange={(e) => setFormData({...formData, zipcode: e.target.value})}
              className="rounded-xl border-2 border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({ ...formData, image: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="rounded-xl border-2 border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-400">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
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
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="rounded-xl border-2 border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </div>

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

          <button
            onClick={handleSignUp}
            className="mt-3 w-full rounded-full bg-gradient-to-br from-red-600 to-red-900 py-3.5 text-lg font-semibold text-white transition active:scale-95"
          >
            Sign Up
          </button>

          <Link
            href="/"
            className="mt-2 w-full rounded-full border-2 border-red-600 py-3.5 text-lg font-semibold text-red-500 text-center block hover:bg-red-600 hover:text-white transition active:scale-95"
          >
            Back to Login
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
