"use client";

import { memo, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChatMessage, VSCODE } from "@/lib/vscode-data";
import { usePretextHeights } from "@/hooks/usePretextLayout";

// ─── Claude Logo (from hero section) ─────────────────────

function ClaudeLogo({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-label="Claude"
    >
      <path d="m3.127 10.604 3.135-1.76.053-.153-.053-.085H6.11l-.525-.032-1.791-.048-1.554-.065-1.505-.08-.38-.081L0 7.832l.036-.234.32-.214.455.04 1.009.069 1.513.105 1.097.064 1.626.17h.259l.036-.105-.089-.065-.068-.064-1.566-1.062-1.695-1.121-.887-.646-.48-.327-.243-.306-.104-.67.435-.48.585.04.15.04.593.456 1.267.981 1.654 1.218.242.202.097-.068.012-.049-.109-.181-.9-1.626-.96-1.655-.428-.686-.113-.411a2 2 0 0 1-.068-.484l.496-.674L4.446 0l.662.089.279.242.411.94.666 1.48 1.033 2.014.302.597.162.553.06.17h.105v-.097l.085-1.134.157-1.392.154-1.792.052-.504.25-.605.497-.327.387.186.319.456-.045.294-.19 1.23-.37 1.93-.243 1.29h.142l.161-.16.654-.868 1.097-1.372.484-.545.565-.601.363-.287h.686l.505.751-.226.775-.707.895-.585.759-.839 1.13-.524.904.048.072.125-.012 1.897-.403 1.024-.186 1.223-.21.553.258.06.263-.218.536-1.307.323-1.533.307-2.284.54-.028.02.032.04 1.029.098.44.024h1.077l2.005.15.525.346.315.424-.053.323-.807.411-3.631-.863-.872-.218h-.12v.073l.726.71 1.331 1.202 1.667 1.55.084.383-.214.302-.226-.032-1.464-1.101-.565-.497-1.28-1.077h-.084v.113l.295.432 1.557 2.34.08.718-.112.234-.404.141-.444-.08-.911-1.28-.94-1.44-.759-1.291-.093.053-.448 4.821-.21.246-.484.186-.403-.307-.214-.496.214-.98.258-1.28.21-1.016.19-1.263.112-.42-.008-.028-.092.012-.953 1.307-1.448 1.957-1.146 1.227-.274.109-.477-.247.045-.44.266-.39 1.586-2.018.956-1.25.617-.723-.004-.105h-.036l-4.212 2.736-.75.096-.324-.302.04-.496.154-.162 1.267-.871z" />
    </svg>
  );
}

// ─── Session Tabs ─────────────────────────────────────────

const SESSION_TABS = [
  { id: "research", label: "/karimo:research" },
  { id: "plan", label: "/karimo:plan" },
  { id: "run", label: "/karimo:run" },
  { id: "merge", label: "/karimo:merge" },
] as const;

const PHASE_START_TIMES: Record<string, number> = {
  research: 0,
  plan: 8000,
  run: 14000,
  merge: 32000,
};

function SessionTabs({ activePhase, currentTime }: { activePhase: string; currentTime: number }) {
  const visibleTabs = SESSION_TABS.filter(
    (tab) => currentTime >= (PHASE_START_TIMES[tab.id] ?? 0)
  );

  return (
    <div
      className="flex shrink-0 overflow-x-auto"
      style={{
        background: VSCODE.sidebarBg,
        borderBottom: `1px solid ${VSCODE.border}`,
        scrollbarWidth: "none",
      }}
    >
      {visibleTabs.map((tab) => {
        const isActive = tab.id === activePhase;
        return (
          <div
            key={tab.id}
            className="flex items-center px-3 py-1.5 text-[11px] shrink-0 cursor-default"
            style={{
              background: isActive ? VSCODE.bg : "transparent",
              color: isActive ? VSCODE.text : VSCODE.textDim,
              borderRight: `1px solid ${VSCODE.border}`,
              borderBottom: isActive
                ? `1px solid ${VSCODE.bg}`
                : "1px solid transparent",
              marginBottom: isActive ? "-1px" : "0",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            {tab.label}
          </div>
        );
      })}
    </div>
  );
}

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

// ─── Active Phase Helper ──────────────────────────────────

function getActivePhase(currentTime: number): string {
  if (currentTime < 8000) return "research";
  if (currentTime < 14000) return "plan";
  if (currentTime < 32000) return "run";
  return "merge";
}

// ─── Chat Panel ───────────────────────────────────────────

interface ChatPanelProps {
  messages: ChatMessage[];
  currentTime: number;
  fillHeight?: boolean;
  panelWidth?: number;
  isDragging?: boolean;
}

export const ChatPanel = memo(function ChatPanel({
  messages,
  currentTime,
  fillHeight,
  panelWidth,
  isDragging,
}: ChatPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activePhase = getActivePhase(currentTime);

  // Pretext: pre-compute message heights during drag to avoid DOM reflows
  const messageTexts = useMemo(() => messages.map((m) => m.content), [messages]);
  const contentWidth = panelWidth ? panelWidth - 24 : 0; // px-3 = 12px each side
  const pretextHeights = usePretextHeights(
    messageTexts,
    "12px monospace",
    contentWidth,
    18 // leading-relaxed ~1.625 * 12px
  );

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const savedY = window.scrollY;
      el.scrollTop = el.scrollHeight;
      if (window.scrollY !== savedY) {
        window.scrollTo({ top: savedY });
      }
    }
  }, [messages.length]);

  return (
    <div
      className={`flex flex-col overflow-hidden ${fillHeight ? "h-full" : "row-start-2"}`}
      style={{
        width: panelWidth,
        flexShrink: panelWidth ? 0 : undefined,
        contain: panelWidth ? ("layout style" as const) : undefined,
        background: VSCODE.sidebarBg,
        borderLeft: `1px solid ${VSCODE.border}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0"
        style={{ borderBottom: `1px solid ${VSCODE.border}` }}
      >
        <span style={{ color: "#D4A574" }}>
          <ClaudeLogo size={14} />
        </span>
        <span className="text-xs font-medium truncate" style={{ color: VSCODE.text }}>
          Claude Code
        </span>
      </div>

      {/* Session tabs */}
      <SessionTabs activePhase={activePhase} currentTime={currentTime} />

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        data-vscode-scroll
        className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3"
        style={{ overscrollBehavior: "contain" }}
      >
        {messages.map((msg, i) => {
          const heightStyle = isDragging && pretextHeights[i]
            ? { height: pretextHeights[i] }
            : undefined;
          return (
            <div key={i} style={heightStyle}>
              <MessageBubble
                message={msg}
                isLatest={i === messages.length - 1}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});
