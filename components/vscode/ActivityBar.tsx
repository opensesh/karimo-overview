"use client";

import { VSCODE } from "@/lib/vscode-data";

function ActivityIcon({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className="w-full flex items-center justify-center py-2.5 relative"
      style={{ color: active ? VSCODE.text : VSCODE.textDim }}
    >
      {active && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
          style={{ background: VSCODE.text }}
        />
      )}
      {children}
    </div>
  );
}

export function ActivityBar() {
  return (
    <div
      className="row-start-2 flex flex-col items-center pt-1"
      style={{ background: VSCODE.activityBarBg }}
    >
      {/* Files (active) */}
      <ActivityIcon active>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 7V17C3 18.1 3.9 19 5 19H19C20.1 19 21 18.1 21 17V9C21 7.9 20.1 7 19 7H11L9 5H5C3.9 5 3 5.9 3 7Z" />
        </svg>
      </ActivityIcon>

      {/* Search */}
      <ActivityIcon>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="6" />
          <path d="M15.5 15.5L20 20" />
        </svg>
      </ActivityIcon>

      {/* Source Control */}
      <ActivityIcon>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="6" r="2" />
          <circle cx="12" cy="18" r="2" />
          <circle cx="18" cy="12" r="2" />
          <path d="M12 8V16" />
          <path d="M12 8C12 10 14 12 18 12" />
        </svg>
      </ActivityIcon>

      {/* Extensions */}
      <ActivityIcon>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="8" height="8" rx="1" />
          <rect x="13" y="3" width="8" height="8" rx="1" />
          <rect x="3" y="13" width="8" height="8" rx="1" />
          <rect x="13" y="13" width="8" height="8" rx="1" />
        </svg>
      </ActivityIcon>
    </div>
  );
}
