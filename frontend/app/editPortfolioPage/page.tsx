"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ---------- Types ---------- */

type ResumeFile = {
  name: string;
  url: string;
};

type ExperienceItem = {
  text: string;
  images?: string[]; // allow multiple images
};

/* ---------- Helpers ---------- */

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* ---------- Page ---------- */

export default function PortfolioPage() {
  const [resume, setResume] = useState<ResumeFile[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [connections, setConnections] = useState<string[]>([]);

  const [tempExperience, setTempExperience] = useState("");
  const [tempGenres, setTempGenres] = useState("");
  const [tempConnections, setTempConnections] = useState("");

  const resumeInputRef = useRef<HTMLInputElement>(null);

  /* ---------- Load ---------- */
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

  /* ---------- Save ---------- */
  const savePortfolio = (key: string, value: any) => {
    const saved = localStorage.getItem("portfolio");
    const data = saved ? JSON.parse(saved) : {};
    data[key] = value;
    localStorage.setItem("portfolio", JSON.stringify(data));
  };

  /* ---------- Remove Helper ---------- */
  const removeItem = <T,>(
    index: number,
    list: T[],
    setList: (v: T[]) => void,
    key: string
  ) => {
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
    savePortfolio(key, updated);
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

      {/* Frame */}
      <div className="relative flex h-[720px] w-[560px] flex-col rounded-[28px] bg-zinc-900 shadow-[0_10px_50px_rgba(220,38,38,0.35)] overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 to-red-900 px-6 pt-10 pb-5 text-white">
          <div className="mb-2 text-center text-4xl">🎥</div>
          <h1 className="text-2xl font-semibold">Your Portfolio</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-2 gap-4">

            {/* LEFT */}
            <div className="flex flex-col gap-4">

              {/* Resume */}
              <Section title="Resume">
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await fileToBase64(file);
                    const updated = [...resume, { name: file.name, url }];
                    setResume(updated);
                    savePortfolio("resume", updated);
                  }}
                />

                <button
                  onClick={() => resumeInputRef.current?.click()}
                  className="w-full rounded-lg border border-red-600 py-2 text-sm text-red-500 hover:bg-red-600 hover:text-white transition"
                >
                  Upload Resume
                </button>

                <RemovableList
                  items={resume.map(r => r.name)}
                  remove={(i) => removeItem(i, resume, setResume, "resume")}
                />
              </Section>

              {/* Experience */}
              <Section title="Previous Experience">
                <textarea
                  value={tempExperience}
                  onChange={(e) => setTempExperience(e.target.value)}
                  rows={3}
                  placeholder="Describe experience..."
                  className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
                />

                <button
                  onClick={() => {
                    if (!tempExperience.trim()) return;
                    const updated = [...experience, { text: tempExperience.trim(), images: [] }];
                    setExperience(updated);
                    setTempExperience("");
                    savePortfolio("experience", updated);
                  }}
                  className="mt-2 w-full rounded-lg border border-red-600 py-2 text-sm text-red-500"
                >
                  Add Experience
                </button>

                <div className="mt-3 space-y-3">
                  {experience.map((exp, i) => (
                    <ExperienceCard
                      key={i}
                      exp={exp}
                      onAddImage={async (file) => {
                        const img = await fileToBase64(file);
                        const updated = [...experience];
                        updated[i].images = [...(updated[i].images || []), img];
                        setExperience(updated);
                        savePortfolio("experience", updated);
                      }}
                      onRemove={() =>
                        removeItem(i, experience, setExperience, "experience")
                      }
                      onRemoveImage={(imgIdx) => {
                        const updated = [...experience];
                        updated[i].images = updated[i].images?.filter((_, idx) => idx !== imgIdx);
                        setExperience(updated);
                        savePortfolio("experience", updated);
                      }}
                    />
                  ))}
                </div>
              </Section>

              {/* Genres */}
              <Section title="Movie Genres">
                <input
                  value={tempGenres}
                  onChange={(e) => setTempGenres(e.target.value)}
                  placeholder="Add genre"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
                />
                <button
                  onClick={() => {
                    if (!tempGenres.trim()) return;
                    const updated = [...genres, tempGenres.trim()];
                    setGenres(updated);
                    setTempGenres("");
                    savePortfolio("genres", updated);
                  }}
                  className="mt-2 w-full rounded-lg border border-red-600 py-2 text-sm text-red-500"
                >
                  Add Genre
                </button>

                <RemovableList
                  items={genres}
                  remove={(i) => removeItem(i, genres, setGenres, "genres")}
                />
              </Section>

              {/* Connections */}
              <Section title="Connections">
                <textarea
                  value={tempConnections}
                  onChange={(e) => setTempConnections(e.target.value)}
                  rows={2}
                  placeholder="Add connection..."
                  className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
                />
                <button
                  onClick={() => {
                    if (!tempConnections.trim()) return;
                    const updated = [...connections, tempConnections.trim()];
                    setConnections(updated);
                    setTempConnections("");
                    savePortfolio("connections", updated);
                  }}
                  className="mt-2 w-full rounded-lg border border-red-600 py-2 text-sm text-red-500"
                >
                  Add Connection
                </button>

                <RemovableList
                  items={connections}
                  remove={(i) => removeItem(i, connections, setConnections, "connections")}
                />
              </Section>
            </div>

            {/* RIGHT — Preview */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 overflow-y-auto">

              {/* Resume Preview */}
              <PreviewBlock title="Resume Files">
                {resume.length === 0 ? (
                  <p className="text-xs text-zinc-500">No resumes uploaded</p>
                ) : (
                  resume.map((r, i) => (
                    <p key={i} className="text-xs text-zinc-300">
                      📄 {r.name}
                    </p>
                  ))
                )}
              </PreviewBlock>

              {/* Experience Text Preview */}
              <PreviewBlock title="Experience">
                {experience.length === 0 ? (
                  <p className="text-xs text-zinc-500">No experience added</p>
                ) : (
                  experience.map((e, i) => (
                    <p key={i} className="mb-2 text-xs text-zinc-300">
                      • {e.text}
                    </p>
                  ))
                )}
              </PreviewBlock>

              {/* Experience Image Gallery */}
              <PreviewBlock title="Experience Gallery">
                {experience.filter(e => e.images?.length).length === 0 ? (
                  <p className="text-xs text-zinc-500">No images uploaded</p>
                ) : (
                  <div className="space-y-2">
                    {experience.map((e, i) =>
                      e.images?.length ? (
                        <div key={i}>
                          <p className="text-xs text-zinc-300 mb-1">• {e.text}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {e.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                className="rounded-md border border-zinc-800"
                              />
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </PreviewBlock>

              {/* Genres Preview */}
              <PreviewBlock title="Genres">
                {genres.length === 0 ? (
                  <p className="text-xs text-zinc-500">No genres added</p>
                ) : (
                  <p className="text-xs text-zinc-300">
                    {genres.join(", ")}
                  </p>
                )}
              </PreviewBlock>

              {/* Connections Preview */}
              <PreviewBlock title="Connections">
                {connections.length === 0 ? (
                  <p className="text-xs text-zinc-500">No connections added</p>
                ) : (
                  connections.map((c, i) => (
                    <p key={i} className="text-xs text-zinc-300">
                      • {c}
                    </p>
                  ))
                )}
              </PreviewBlock>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2">
          <Link
            href="/viewPublishedProfilePage"
            className="flex-1 rounded-full border-2 border-red-600 py-3 text-center font-semibold text-red-500 hover:bg-red-600 hover:text-white transition"
          >
            View Published
          </Link>

          <Link
            href="/homePage"
            className="flex-1 rounded-full border-2 border-red-600 py-3 text-center font-semibold text-red-500 hover:bg-red-600 hover:text-white transition"
          >
            Home
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(110vh); }
          100% { transform: translateY(-20vh); }
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

function RemovableList({
  items,
  remove,
}: {
  items: string[];
  remove: (i: number) => void;
}) {
  return (
    <ul className="mt-2 text-xs text-zinc-300 space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex justify-between">
          <span>{item}</span>
          <button onClick={() => remove(i)} className="text-red-500">
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}

function ExperienceCard({
  exp,
  onAddImage,
  onRemove,
  onRemoveImage,
}: {
  exp: ExperienceItem;
  onAddImage: (file: File) => void;
  onRemove: () => void;
  onRemoveImage: (imgIdx: number) => void;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 p-2 text-xs text-zinc-300">
      <p>{exp.text}</p>

      {/* Images */}
      <div className="mt-2 flex flex-wrap gap-2">
        {exp.images?.map((img, idx) => (
          <div key={idx} className="relative">
            <img
              src={img}
              className="rounded-md w-16 h-16 object-cover border border-zinc-700"
            />
            <button
              onClick={() => onRemoveImage(idx)}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-between items-center">
        <label className="cursor-pointer text-red-500">
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onAddImage(file);
            }}
          />
        </label>

        <button onClick={onRemove} className="text-red-500">
          ❌ Experience
        </button>
      </div>
    </div>
  );
}

function PreviewBlock({ title, children }: any) {
  if (!children) return null;
  return (
    <div className="mb-4">
      <h4 className="mb-1 text-sm font-semibold text-red-500">{title}</h4>
      {children}
    </div>
  );
}
