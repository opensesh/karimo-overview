"use client";

import type React from "react";

interface BackgroundPlusProps {
  plusSize?: number;
  plusColor?: string;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function BackgroundPlus({
  plusSize = 48,
  plusColor = "#363230",
  backgroundColor = "transparent",
  className,
  style,
}: BackgroundPlusProps) {
  const encodedColor = encodeURIComponent(plusColor);

  return (
    <div
      className={`absolute inset-0 h-full w-full pointer-events-none ${className ?? ""}`}
      style={{
        backgroundColor,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='${plusSize}' height='${plusSize}' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodedColor}' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        maskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        animation: "plus-pulse 8s var(--ease-in-out) infinite",
        ...style,
      }}
    />
  );
}
