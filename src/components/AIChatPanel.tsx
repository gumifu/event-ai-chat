"use client";

import { useState, useRef, useEffect } from "react";

export type ChatMessage = { role: "user" | "assistant"; content: string };

type AIChatPanelProps = {
  onClose: () => void;
  locationLabel: string;
};

const WELCOME_MESSAGE =
  "Hi! I can help you find events. Ask me for something like \"jazz nights\", \"tech meetups\", or \"weekend sports\" and I’ll suggest events near you.";

export function AIChatPanel({ onClose, locationLabel }: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, location: locationLabel }),
      });
      const data = await res.json();
      const reply = data.reply ?? "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn’t get a response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-[var(--background)]">
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </span>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">AI Search</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "rounded-br-md bg-[var(--accent)]/20 text-[var(--foreground)]"
                    : "rounded-bl-md border border-[var(--border)] bg-[#5c6370] text-white"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-[var(--border)] bg-[#5c6370] px-4 py-3 text-white">
                <span className="text-sm">Thinking…</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)] p-3"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] pr-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="AI Search"
            disabled={loading}
            className="min-w-0 flex-1 bg-transparent py-3 pl-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none disabled:opacity-60"
            aria-label="Message"
          />
          <span className="text-[var(--muted)]" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--muted)]" aria-hidden>
            <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
          </svg>
        </div>
      </form>
    </div>
  );
}
