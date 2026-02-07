"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clear } from "console";

export default function PortfolioPage() {
  const [resume, setResume] = useState("");
  const [experience, setExperience] = useState("");
  const [genres, setGenres] = useState("");
  const [connections, setConnections] = useState("");

  // Load saved portfolio
  useEffect(() => {
    const saved = localStorage.getItem("portfolio");
    if (saved) {
      const data = JSON.parse(saved);
      setResume(data.resume || "");
      setExperience(data.experience || "");
      setGenres(data.genres || "");
      setConnections(data.connections || "");
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem(
      "portfolio",
      JSON.stringify({ resume, experience, genres, connections })
    );
  }, [resume, experience, genres, connections]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
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

      {/* Phone Frame */}
      <div className="relative h-[720px] w-[560px] rounded-[28px] bg-zinc-900 shadow-[0_10px_50px_rgba(220,38,38,0.35)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 to-red-900 px-6 pt-10 pb-5 text-white">
          <div className="mb-2 text-center text-4xl">🎥</div>
          <h1 className="text-2xl font-semibold">Your Portfolio</h1>
          <p className="text-sm text-white/90">
            Edit and view your professional profile
          </p>
        </div>

        {/* Split View */}
        <div className="grid grid-cols-2 gap-4 px-5 py-4 h-[580px]">
          {/* LEFT — Edit */}
          <div className="flex flex-col gap-3 overflow-y-auto pr-2">
            <Section title="Resume">
              <Textarea value={resume} setValue={setResume} placeholder="Paste or write your resume..." />
            </Section>

            <Section title="Previous Experience">
              <Textarea value={experience} setValue={setExperience} placeholder="Past projects, roles, studios..." />
            </Section>

            <Section title="Movie Genres">
              <Input value={genres} setValue={setGenres} placeholder="Drama, Action, Indie..." />
            </Section>

            <Section title="Connections">
              <Textarea value={connections} setValue={setConnections} placeholder="Who you know & how you're connected" />
            </Section>
          </div>

          {/* RIGHT — Live Preview */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 overflow-y-auto">
            <PreviewBlock title="Resume" content={resume} />
            <PreviewBlock title="Experience" content={experience} />
            <PreviewBlock title="Genres" content={genres} />
            <PreviewBlock title="Connections" content={connections} />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
          <Link
            href="/page3"
            className="block w-full rounded-full border-2 border-red-600 py-3 text-center font-semibold text-red-500 hover:bg-red-600 hover:text-white transition"
          >
            Back to Home
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

/* ---------- Components ---------- */

function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-zinc-400">{title}</h3>
      {children}
    </div>
  );
}

function Input({ value, setValue, placeholder }: any) {
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
    />
  );
}

function Textarea({ value, setValue, placeholder }: any) {
  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
    />
  );
}

function PreviewBlock({ title, content }: any) {
  if (!content) return null;
  return (
    <div className="mb-4">
      <h4 className="mb-1 text-sm font-semibold text-red-500">{title}</h4>
      <p className="text-xs whitespace-pre-wrap text-zinc-300">
        {content}
      </p>
    </div>
  );
}
