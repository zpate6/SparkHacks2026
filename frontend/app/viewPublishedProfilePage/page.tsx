"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ---------- Types ---------- */

type ResumeFile = {
  name: string;
  url: string;
};

type ExperienceItem = {
  text: string;
  image?: string;
};

export default function ViewPublishedPortfolioPage() {
  const [resume, setResume] = useState<ResumeFile[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [connections, setConnections] = useState<string[]>([]);

  /* ---------- Load from localStorage ---------- */
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

  return (
    <div className="relative min-h-screen bg-black px-8 py-10">
      <div className="mx-auto w-full max-w-5xl min-h-[85vh] rounded-2xl bg-zinc-950 border border-zinc-800 p-8 shadow-xl flex flex-col">

        {/* Header */}
        <div className="mb-6 text-center">
            <h1 className="text-3xl font-semibold text-white">
                🎬 Published Portfolio
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
                Public profile preview
            </p>
        </div>


        {/* PREVIEW CONTENT */}
        <div className="space-y-6 flex-1 overflow-y-auto">
          <PreviewBlock title="Resume">
            {resume.length === 0 ? (
              <Empty text="No resumes uploaded" />
            ) : (
              resume.map((r, i) => (
                <p key={i} className="text-xs text-zinc-300">
                  📄 {r.name}
                </p>
              ))
            )}
          </PreviewBlock>

          <PreviewBlock title="Experience">
            {experience.length === 0 ? (
              <Empty text="No experience added" />
            ) : (
              experience.map((e, i) => (
                <p key={i} className="mb-1 text-xs text-zinc-300">
                  • {e.text}
                </p>
              ))
            )}
          </PreviewBlock>

          <PreviewBlock title="Experience Gallery">
            {experience.filter(e => e.image).length === 0 ? (
              <Empty text="No images uploaded" />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {experience
                  .filter(e => e.image)
                  .map((e, i) => (
                    <img
                      key={i}
                      src={e.image}
                      className="rounded-md border border-zinc-800"
                    />
                  ))}
              </div>
            )}
          </PreviewBlock>

          <PreviewBlock title="Genres">
            {genres.length === 0 ? (
              <Empty text="No genres listed" />
            ) : (
              <p className="text-xs text-zinc-300">
                {genres.join(", ")}
              </p>
            )}
          </PreviewBlock>

          <PreviewBlock title="Connections">
            {connections.length === 0 ? (
              <Empty text="No connections added" />
            ) : (
              connections.map((c, i) => (
                <p key={i} className="text-xs text-zinc-300">
                  • {c}
                </p>
              ))
            )}
          </PreviewBlock>

        </div>

        {/* NAV BUTTON */}
        <div className="flex gap-2">
          <Link
            href="/editPortfolioPage"
            className="flex-1 rounded-full border-2 border-red-600 py-3 text-center font-semibold text-red-500 hover:bg-red-600 hover:text-white transition"
          >
            Edit Profile
          </Link>

          <Link
            href="/homePage"
            className="flex-1 rounded-full border-2 border-red-600 py-3 text-center font-semibold text-red-500 hover:bg-red-600 hover:text-white transition"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI Components ---------- */

function PreviewBlock({ title, children }: any) {
  if (!children) return null;
  return (
    <div>
      <h4 className="mb-1 text-sm font-semibold text-red-500">{title}</h4>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-xs text-zinc-500 italic">{text}</p>;
}
