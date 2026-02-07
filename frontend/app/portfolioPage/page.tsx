"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PortfolioPage() {
  const [resume, setResume] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [connections, setConnections] = useState<string[]>([]);

  const [tempResume, setTempResume] = useState("");
  const [tempExperience, setTempExperience] = useState("");
  const [tempGenres, setTempGenres] = useState("");
  const [tempConnections, setTempConnections] = useState("");

  // Load saved portfolio from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("portfolio");
    if (saved) {
      const data = JSON.parse(saved);
      setResume(data.resume || []);
      setExperience(data.experience || []);
      setGenres(data.genres || []);
      setConnections(data.connections || []);
    }
  }, []);

  // Save portfolio to localStorage
  const savePortfolio = (key: string, value: string[]) => {
    const saved = localStorage.getItem("portfolio");
    const data = saved ? JSON.parse(saved) : {};
    data[key] = value;
    localStorage.setItem("portfolio", JSON.stringify(data));
  };

  // Handle Enter key for input/textarea
  const handleEnter = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
    tempValue: string,
    setTemp: (v: string) => void,
    list: string[],
    setList: (v: string[]) => void,
    key: string
  ) => {
    if (e.key === "Enter" && tempValue.trim() !== "") {
      e.preventDefault();
      const updatedList = [...list, tempValue.trim()];
      setList(updatedList);
      setTemp("");
      savePortfolio(key, updatedList);
    }
  };

  // Remove item from list
  const removeItem = (
    index: number,
    list: string[],
    setList: (v: string[]) => void,
    key: string
  ) => {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
    savePortfolio(key, updatedList);
  };

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
      <div className="relative flex h-[720px] w-[560px] flex-col rounded-[28px] bg-zinc-900 shadow-[0_10px_50px_rgba(220,38,38,0.35)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 to-red-900 px-6 pt-10 pb-5 text-white">
          <div className="mb-2 text-center text-4xl">🎥</div>
          <h1 className="text-2xl font-semibold">Your Portfolio</h1>
          <p className="text-sm text-white/90">
            Press Enter to save items, click ❌ to remove
          </p>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-2 gap-4 min-h-full">

            {/* LEFT — Edit */}
            <div className="flex flex-col gap-4">
              <Section title="Resume">
                <Textarea
                  value={tempResume}
                  setValue={setTempResume}
                  placeholder="Write resume item and press Enter..."
                  onEnter={(e) =>
                    handleEnter(e, tempResume, setTempResume, resume, setResume, "resume")
                  }
                />
                <RemovableList
                  items={resume}
                  remove={(i) => removeItem(i, resume, setResume, "resume")}
                />
              </Section>

              <Section title="Previous Experience">
                <Textarea
                  value={tempExperience}
                  setValue={setTempExperience}
                  placeholder="Write experience and press Enter..."
                  onEnter={(e) =>
                    handleEnter(
                      e,
                      tempExperience,
                      setTempExperience,
                      experience,
                      setExperience,
                      "experience"
                    )
                  }
                />
                <RemovableList
                  items={experience}
                  remove={(i) => removeItem(i, experience, setExperience, "experience")}
                />
              </Section>

              <Section title="Movie Genres">
                <Input
                  value={tempGenres}
                  setValue={setTempGenres}
                  placeholder="Type genre and press Enter..."
                  onEnter={(e) =>
                    handleEnter(e, tempGenres, setTempGenres, genres, setGenres, "genres")
                  }
                />
                <RemovableList
                  items={genres}
                  remove={(i) => removeItem(i, genres, setGenres, "genres")}
                />
              </Section>

              <Section title="Connections">
                <Textarea
                  value={tempConnections}
                  setValue={setTempConnections}
                  placeholder="Add connections and press Enter..."
                  onEnter={(e) =>
                    handleEnter(
                      e,
                      tempConnections,
                      setTempConnections,
                      connections,
                      setConnections,
                      "connections"
                    )
                  }
                />
                <RemovableList
                  items={connections}
                  remove={(i) => removeItem(i, connections, setConnections, "connections")}
                />
              </Section>
            </div>

            {/* RIGHT — Live Preview */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 overflow-y-auto">
              <PreviewBlock title="Resume" content={resume.join("\n")} />
              <PreviewBlock title="Experience" content={experience.join("\n")} />
              <PreviewBlock title="Genres" content={genres.join(", ")} />
              <PreviewBlock title="Connections" content={connections.join("\n")} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-6 py-4 bg-zinc-900">
          <Link
            href="/homePage"
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

function Input({ value, setValue, placeholder, onEnter }: any) {
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={onEnter}
      placeholder={placeholder}
      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
    />
  );
}

function Textarea({ value, setValue, placeholder, onEnter }: any) {
  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={onEnter}
      placeholder={placeholder}
      rows={3}
      className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
    />
  );
}

// List with remove buttons
function RemovableList({ items, remove }: { items: string[]; remove: (i: number) => void }) {
  return (
    <ul className="mt-1 max-h-32 overflow-y-auto text-xs text-zinc-300 list-disc list-inside">
      {items.map((item, idx) => (
        <li key={idx} className="flex justify-between items-center">
          <span>{item}</span>
          <button
            onClick={() => remove(idx)}
            className="ml-2 text-red-500 hover:text-red-400 font-bold"
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}

function PreviewBlock({ title, content }: any) {
  if (!content) return null;
  return (
    <div className="mb-4">
      <h4 className="mb-1 text-sm font-semibold text-red-500">{title}</h4>
      <p className="text-xs whitespace-pre-wrap text-zinc-300">{content}</p>
    </div>
  );
}
