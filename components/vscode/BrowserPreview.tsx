"use client";

import { memo } from "react";
import { VSCODE } from "@/lib/vscode-data";

interface BrowserPreviewProps {
  url: string;
  imageSrc: string;
}

export const BrowserPreview = memo(function BrowserPreview({
  url,
  imageSrc,
}: BrowserPreviewProps) {
  return (
    <div className="flex flex-col h-full" style={{ background: VSCODE.bg }}>
      {/* Browser toolbar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 shrink-0"
        style={{
          background: VSCODE.sidebarBg,
          borderBottom: `1px solid ${VSCODE.border}`,
        }}
      >
        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <NavButton>
            <path d="M15 18l-6-6 6-6" />
          </NavButton>
          <NavButton>
            <path d="M9 6l6 6-6 6" />
          </NavButton>
          <NavButton>
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </NavButton>
        </div>

        {/* URL bar */}
        <div
          className="flex items-center gap-2 flex-1 min-w-0 px-2.5 py-1 rounded"
          style={{
            background: VSCODE.bg,
            border: `1px solid ${VSCODE.border}`,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={VSCODE.textDim}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span
            className="text-xs truncate"
            style={{ color: VSCODE.textDim, fontFamily: "var(--font-mono, monospace)" }}
          >
            {url}
          </span>
        </div>
      </div>

      {/* Image viewport */}
      <div
        className="flex-1 min-h-0 overflow-hidden"
        style={{ background: VSCODE.bg }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="Browser preview"
          className="w-full h-full"
          style={{ objectFit: "contain", objectPosition: "top center" }}
        />
      </div>
    </div>
  );
});

function NavButton({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-6 h-6 flex items-center justify-center rounded"
      style={{ color: VSCODE.textDim }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </div>
  );
}
