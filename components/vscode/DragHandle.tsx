"use client";

import { useState } from "react";
import { VSCODE } from "@/lib/vscode-data";

interface DragHandleProps {
  onPointerDown: (e: React.PointerEvent) => void;
  onDoubleClick: () => void;
  isDragging: boolean;
}

export function DragHandle({ onPointerDown, onDoubleClick, isDragging }: DragHandleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const active = isDragging || isHovered;

  return (
    <div
      className="relative shrink-0 z-10"
      style={{
        width: 4,
        cursor: "col-resize",
      }}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wider invisible hit area */}
      <div
        className="absolute inset-y-0"
        style={{
          left: -4,
          right: -4,
        }}
      />
      {/* Visible indicator line */}
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 transition-all duration-150"
        style={{
          width: active ? 2 : 1,
          background: active ? VSCODE.accent : VSCODE.border,
          opacity: active ? 1 : 0.5,
        }}
      />
    </div>
  );
}
