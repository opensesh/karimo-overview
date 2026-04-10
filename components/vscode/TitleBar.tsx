"use client";

import { VSCODE } from "@/lib/vscode-data";

export function TitleBar() {
  return (
    <div
      className="col-span-full flex items-center px-3 select-none"
      style={{ background: VSCODE.titleBarBg }}
    >
      {/* Traffic lights */}
      <div className="flex gap-2 shrink-0">
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: VSCODE.red }}
        />
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: VSCODE.yellow }}
        />
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: VSCODE.green }}
        />
      </div>

      {/* Centered title */}
      <span
        className="flex-1 text-center text-xs font-medium truncate"
        style={{ color: VSCODE.textDim }}
      >
        KARIMO &mdash; framer-cms-migration
      </span>

      {/* Spacer to balance traffic lights */}
      <div className="w-[52px] shrink-0" />
    </div>
  );
}
