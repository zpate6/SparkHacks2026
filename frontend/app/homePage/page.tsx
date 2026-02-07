"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, X, MessageCircle, User, Star, MapPin, Briefcase, Film } from "lucide-react";
import Link from "next/link";

interface Profile {
  id: number;
  name: string;
  role: string;
  distance: string;
  image: string;
  bio: string;
  tags: string[];
}

const MOCK_PROFILES: Profile[] = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Director",
    distance: "2 miles away",
    image: "/profiles/director.png",
    bio: "Visionary director seeking passionate actors for an upcoming indie sci-fi thriller. Let's create magic together. 🎬✨",
    tags: ["Feature Film", "Sci-Fi", "Indie"],
  },
  {
    id: 2,
    name: "Sarah Miller",
    role: "Actress",
    distance: "5 miles away",
    image: "/profiles/actress.png",
    bio: "Classically trained actress with 5 years of theater experience. Looking for challenging roles in drama and historical pieces.",
    tags: ["Drama", "Theater", "Lead"],
  },
  {
    id: 3,
    name: "Marcus Thorne",
    role: "Cinematographer",
    distance: "1 mile away",
    image: "/profiles/filmmaker.png",
    bio: "Capturing the gritty reality of urban life. Specializing in low-light and handheld camera work.",
    tags: ["Documentary", "Urban", "Raw"],
  },
];

interface User {
  name?: string;
  email: string;
  type: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  const handleSwipe = (dir: "left" | "right") => {
    setDirection(dir);
    setTimeout(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % MOCK_PROFILES.length);
      setDirection(null);
    }, 300);
  };

  if (!user) return null;

  const currentProfile = MOCK_PROFILES[currentProfileIndex];

  return (
    <div className="flex h-screen w-full flex-col bg-black text-white overflow-hidden font-sans">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 pt-14 md:pt-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-900 shadow-lg shadow-red-900/40">
            <span className="text-xl">🎬</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Entertainment <span className="text-red-600">Tinder</span>
          </h1>
        </div>
        <button
          className="rounded-full bg-zinc-900 p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </header>

      {/* Main Card Area */}
      <main className="flex-1 px-4 py-2 flex flex-col items-center justify-center relative">
        <div className="relative w-full max-w-sm h-[65vh] md:h-[600px]">
          {/* Background Cards (Mock Stack Effect) */}
          <div className="absolute top-4 scale-95 opacity-50 w-full h-full rounded-[32px] bg-zinc-800 border border-zinc-700 origin-bottom transform transition-all duration-300"></div>
          <div className="absolute top-2 scale-[0.97] opacity-70 w-full h-full rounded-[32px] bg-zinc-800 border border-zinc-700 origin-bottom transform transition-all duration-300"></div>

          {/* Active Card */}
          <div
            className={`absolute w-full h-full rounded-[32px] bg-zinc-900 overflow-hidden shadow-2xl shadow-black border border-zinc-800 transition-transform duration-300 ease-out ${direction === "left"
              ? "-translate-x-[150%] rotate-[-20deg]"
              : direction === "right"
                ? "translate-x-[150%] rotate-[20deg]"
                : ""
              }`}
          >
            {/* Image */}
            <div className="relative h-[65%] w-full">
              <Image
                src={currentProfile.image}
                alt={currentProfile.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-90" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 w-full p-6 flex flex-col gap-3 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent pt-12">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-3xl font-bold text-white leading-tight">
                    {currentProfile.name}
                  </h2>
                  <span className="rounded-full bg-red-600/20 px-2.5 py-0.5 text-xs font-medium text-red-500 border border-red-600/30">
                    {currentProfile.role}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{currentProfile.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={14} />
                    <span>Available</span>
                  </div>
                </div>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3">
                {currentProfile.bio}
              </p>

              <div className="flex flex-wrap gap-2 mt-1">
                {currentProfile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400 border border-zinc-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Overlay indicators */}
            {direction === 'left' && (
              <div className="absolute top-8 right-8 text-4xl font-bold text-red-500 border-4 border-red-500 rounded-lg px-4 py-2 transform rotate-12 opacity-80">NOPE</div>
            )}
            {direction === 'right' && (
              <div className="absolute top-8 left-8 text-4xl font-bold text-green-500 border-4 border-green-500 rounded-lg px-4 py-2 transform -rotate-12 opacity-80">LIKE</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center gap-6 z-10">
          <button
            onClick={() => handleSwipe("left")}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-red-500 shadow-lg transition active:scale-95 hover:bg-zinc-700 hover:text-red-400 border border-zinc-700"
          >
            <X size={32} strokeWidth={2.5} />
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-blue-400 shadow-lg transition active:scale-95 hover:bg-zinc-800 hover:text-blue-300 border border-zinc-800">
            <Star size={20} fill="currentColor" className="text-blue-400" />
          </button>

          <button
            onClick={() => handleSwipe("right")}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-900 text-white shadow-lg shadow-red-900/50 transition active:scale-95 hover:from-red-500 hover:to-red-800"
          >
            <Heart size={32} fill="currentColor" strokeWidth={0} />
          </button>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="border-t border-zinc-800 bg-zinc-950 px-6 py-4 pb-8 md:pb-4">
        <ul className="flex items-center justify-around">
          <li>
            <Link href="/homePage" className="flex flex-col items-center gap-1 text-red-600">
              <Film size={24} strokeWidth={2.5} />
            </Link>
          </li>
          {/* this is the star */}
          {/* <li>
            <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition">
              <Star size={24} />
            </button>
          </li> */}
          <li>
            <Link href="/communicationPage" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition">
              <MessageCircle size={24} />
            </Link>
          </li>
          <li>
            <Link href="/portfolioPage" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition">
              <User size={24} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
