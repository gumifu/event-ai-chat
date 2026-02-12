"use client";

type SearchFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  showSubmitButton?: boolean;
  className?: string;
  /** When set, clicking the input opens AI chat instead of typing */
  onOpenChat?: () => void;
};

export function SearchForm({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "AI Search",
  showSubmitButton = false,
  className = "",
  onOpenChat,
}: SearchFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenChat) return;
    const q = value.trim();
    if (q) onSubmit(q);
  };

  const handleInputClick = () => {
    if (onOpenChat) onOpenChat();
  };

  return (
    <form onSubmit={handleSubmit} className={`flex w-full items-center gap-2 ${className}`}>
      <div
        className="relative flex min-w-0 flex-1 items-center"
        role={onOpenChat ? "button" : undefined}
        onClick={onOpenChat ? handleInputClick : undefined}
        onKeyDown={onOpenChat ? (e) => e.key === "Enter" && handleInputClick() : undefined}
        tabIndex={onOpenChat ? 0 : undefined}
      >
        <span className="absolute left-4 text-[var(--muted)]" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder={onOpenChat ? "AI Search — click to chat" : placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={!!onOpenChat}
          onClick={onOpenChat ? handleInputClick : undefined}
          className={`w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 pl-11 pr-12 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] ${onOpenChat ? "cursor-pointer" : ""}`}
          aria-label={onOpenChat ? "Open AI Search chat" : "AI Search"}
        />
        <span className="absolute right-3 flex items-center gap-1 text-[var(--muted)]" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
          </svg>
        </span>
      </div>
    </form>
  );
}
