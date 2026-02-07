"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Message = {
  sender: "me" | "them";
  text: string;
};

export default function ConnectionsPage() {
  const connections = ["Alex Rivera", "Jordan Kim", "Sam Patel"];

  const [selected, setSelected] = useState(connections[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [endorsements, setEndorsements] = useState<Record<string, number>>({});
  const [endorsed, setEndorsed] = useState<Record<string, boolean>>({});

  // Load messages
  useEffect(() => {
    const saved = localStorage.getItem("messages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save messages
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  // Load endorsements
  useEffect(() => {
    const saved = localStorage.getItem("endorsements");
    if (saved) setEndorsements(JSON.parse(saved));
    const savedFlag = localStorage.getItem("endorsed");
    if (savedFlag) setEndorsed(JSON.parse(savedFlag));
  }, []);

  // Save endorsements
  useEffect(() => {
    localStorage.setItem("endorsements", JSON.stringify(endorsements));
  }, [endorsements]);

  useEffect(() => {
    localStorage.setItem("endorsed", JSON.stringify(endorsed));
  }, [endorsed]);

  const handleEndorse = () => {
    setEndorsements((prev) => ({
      ...prev,
      [selected]: (prev[selected] || 0) + 1,
    }));
    setEndorsed((prev) => ({ ...prev, [selected]: true }));
  };

  const handleRetract = () => {
    setEndorsements((prev) => ({
      ...prev,
      [selected]: Math.max(0, (prev[selected] || 0) - 1),
    }));
    setEndorsed((prev) => ({ ...prev, [selected]: false }));
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => ({
      ...prev,
      [selected]: [
        ...(prev[selected] || []),
        { sender: "me", text: input },
      ],
    }));

    setInput("");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
      {/* Floating background */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(8)].map((_, i) => (
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
        <div className="bg-gradient-to-br from-red-600 to-red-900 px-6 pt-8 pb-4 text-white">
          <h1 className="text-xl font-semibold">Connections</h1>
          <p className="text-sm text-white/90">
            Network & communicate professionally
          </p>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-3 h-[540px]">
          {/* LEFT — Connections */}
          <div className="border-r border-zinc-800 bg-zinc-950 p-3 overflow-y-auto">
            {connections.map((name) => (
              <button
                key={name}
                onClick={() => setSelected(name)}
                className={`w-full rounded-lg px-3 py-2 mb-1 text-left text-sm transition ${
                  selected === name
                    ? "bg-red-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* RIGHT — Chat */}
          <div className="col-span-2 flex flex-col bg-zinc-900">
            {/* Chat Header */}
            <div className="border-b border-zinc-800 px-4 py-3 text-sm text-zinc-300 flex items-center justify-between">
              <div>
                Chat with <span className="text-red-500">{selected}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-zinc-300">
                  Endorsements:{' '}
                  <span className="font-semibold text-white">
                    {endorsements[selected] || 0}
                  </span>
                </div>

                {endorsed[selected] ? (
                  <button
                    onClick={handleRetract}
                    className="rounded-md bg-zinc-800 px-3 py-1 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition"
                  >
                    Retract
                  </button>
                ) : (
                  <button
                    onClick={handleEndorse}
                    className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 transition"
                  >
                    Endorse
                  </button>
                )}
              </div>
            </div>

            {/* Messages (SCROLLABLE, FOOTER SAFE) */}
            <div className="flex-1 overflow-y-auto px-4 py-3 pb-[90px] space-y-3">
              {(messages[selected] || []).map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    msg.sender === "me"
                      ? "ml-auto bg-red-600 text-white"
                      : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-zinc-800 p-3 flex gap-2 bg-zinc-900">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
              />
              <button
                onClick={sendMessage}
                className="rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER (NON-OVERLAPPING) */}
        <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 px-6 pb-4 pt-2">
          <Link
            href="/homePage"
            className="block w-full rounded-full border-2 border-red-600 py-3 text-center font-semibold text-red-500 hover:bg-red-600 hover:text-white transition"
          >
            Back to Home
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
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}