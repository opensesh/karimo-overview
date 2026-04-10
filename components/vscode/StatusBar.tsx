"use client";

import { VSCODE, getFileExtension, EXT_LANG } from "@/lib/vscode-data";

interface StatusBarProps {
  activeFile: string | null;
  activeFileName: string | null;
}

export function StatusBar({ activeFile, activeFileName }: StatusBarProps) {
  const ext = activeFileName ? getFileExtension(activeFileName) : "";
  const lang = ext ? EXT_LANG[ext] ?? "Plain Text" : "";

  return (
    <div
      className="col-span-full flex items-center justify-between px-3 text-[11px] select-none"
      style={{ background: VSCODE.statusBarBg, color: "#fff" }}
    >
      <div className="flex items-center gap-3">
        {/* Branch */}
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.5 9.5c0-.97-.75-1.75-1.75-1.75a1.75 1.75 0 0 0-1.69 1.3 3.04 3.04 0 0 1-2.56-2.99V4.5A1.75 1.75 0 0 0 4.25 1 1.75 1.75 0 0 0 2.5 2.75c0 .76.49 1.4 1.17 1.64v3.22a4.55 4.55 0 0 0 4.39 4.14 1.75 1.75 0 0 0 1.69 1.5A1.75 1.75 0 0 0 11.5 11.5V9.5zM4.25 3.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm5.5 9a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />
          </svg>
          feat/framer-cms-migration
        </span>
      </div>

      <div className="flex items-center gap-3">
        {activeFile && (
          <>
            <span className="capitalize">{lang}</span>
            <span>UTF-8</span>
          </>
        )}
      </div>
    </div>
  );
}
