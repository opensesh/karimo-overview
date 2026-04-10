"use client";

import { memo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChatMessage, VSCODE } from "@/lib/vscode-data";

// ─── Typing Dots ──────────────────────────────────────────

function TypingDots() {
  return (
    <span className="inline-flex gap-1 items-center ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full"
          style={{
            background: VSCODE.textDim,
            animation: `vscode-dot-pulse 1.2s infinite ${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  );
}

// ─── Message Bubble ───────────────────────────────────────

function MessageBubble({
  message,
  isLatest,
}: {
  message: ChatMessage;
  isLatest: boolean;
}) {
  const isSystem = message.role === "system";
  const isTool = message.role === "tool";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="text-[12px] leading-relaxed"
      style={{
        fontFamily: "var(--font-mono, monospace)",
        color: isSystem
          ? VSCODE.textDim
          : isTool
            ? "#4ec9b0"
            : VSCODE.textBright,
      }}
    >
      {isTool && (
        <span className="text-[10px] opacity-60 mr-1">&gt;</span>
      )}
      {isSystem && (
        <span className="text-[10px] opacity-60 mr-1">//</span>
      )}
      {message.content}
      {isLatest && !isSystem && <TypingDots />}
    </motion.div>
  );
}

// ─── Chat Panel ───────────────────────────────────────────

interface ChatPanelProps {
  messages: ChatMessage[];
  currentTime: number;
  fillHeight?: boolean;
}

export const ChatPanel = memo(function ChatPanel({
  messages,
  currentTime: _currentTime,
  fillHeight,
}: ChatPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div
      className={`flex flex-col overflow-hidden ${fillHeight ? "h-full" : "row-start-2"}`}
      style={{
        background: VSCODE.sidebarBg,
        borderLeft: fillHeight ? undefined : `1px solid ${VSCODE.border}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{ borderBottom: `1px solid ${VSCODE.border}` }}
      >
        {/* Claude icon */}
        <div
          className="w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold"
          style={{ background: "#6b5ce7", color: "#fff" }}
        >
          C
        </div>
        <span className="text-xs font-medium" style={{ color: VSCODE.text }}>
          Claude Code
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        data-vscode-scroll
        className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3"
        style={{ overscrollBehavior: "contain" }}
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            isLatest={i === messages.length - 1}
          />
        ))}
      </div>
    </div>
  );
});
