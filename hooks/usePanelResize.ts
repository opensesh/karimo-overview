"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// ─── Constants ───────────────────────────────────────────

const ACTIVITY_BAR_WIDTH = 48;
const DRAG_HANDLE_WIDTH = 4; // 2 handles × 4px each = 8px total
const MIN_EXPLORER = 120;
const MIN_EDITOR = 200;
const MIN_CHAT = 200;
const DEFAULT_EXPLORER = 240;
const DEFAULT_CHAT = 320;

// ─── Types ───────────────────────────────────────────────

type DragTarget = "explorer" | "chat" | null;

interface UsePanelResizeReturn {
  explorerWidth: number;
  chatWidth: number;
  editorWidth: number;
  isDragging: boolean;
  onExplorerDragStart: (e: React.PointerEvent) => void;
  onChatDragStart: (e: React.PointerEvent) => void;
  onDoubleClickExplorer: () => void;
  onDoubleClickChat: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

// ─── Hook ────────────────────────────────────────────────

export function usePanelResize(): UsePanelResizeReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [explorerWidth, setExplorerWidth] = useState(DEFAULT_EXPLORER);
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT);
  const [isDragging, setIsDragging] = useState(false);

  // Mutable drag state (no re-renders during drag)
  const dragRef = useRef<{
    target: DragTarget;
    startX: number;
    startWidth: number;
    rafId: number | null;
  }>({ target: null, startX: 0, startWidth: 0, rafId: null });

  // Compute available space for editor
  const getContainerWidth = useCallback(() => {
    return containerRef.current?.offsetWidth ?? 1200;
  }, []);

  const editorWidth = Math.max(
    MIN_EDITOR,
    getContainerWidth() - ACTIVITY_BAR_WIDTH - explorerWidth - chatWidth - DRAG_HANDLE_WIDTH * 2
  );

  // Clamp widths respecting all minimums
  const clamp = useCallback(
    (target: DragTarget, newWidth: number): number => {
      const total = getContainerWidth() - ACTIVITY_BAR_WIDTH - DRAG_HANDLE_WIDTH * 2;

      if (target === "explorer") {
        const maxExplorer = total - MIN_EDITOR - chatWidth;
        return Math.max(MIN_EXPLORER, Math.min(newWidth, maxExplorer));
      } else {
        const maxChat = total - MIN_EDITOR - explorerWidth;
        return Math.max(MIN_CHAT, Math.min(newWidth, maxChat));
      }
    },
    [getContainerWidth, explorerWidth, chatWidth]
  );

  // Pointer move handler
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const { target, startX, startWidth } = dragRef.current;
      if (!target) return;

      // Cancel any pending rAF
      if (dragRef.current.rafId !== null) return;

      dragRef.current.rafId = requestAnimationFrame(() => {
        dragRef.current.rafId = null;
        const delta = e.clientX - startX;

        if (target === "explorer") {
          const newWidth = clamp("explorer", startWidth + delta);
          setExplorerWidth(newWidth);
        } else {
          // Chat: dragging right = shrinking chat
          const newWidth = clamp("chat", startWidth - delta);
          setChatWidth(newWidth);
        }
      });
    },
    [clamp]
  );

  // Pointer up handler
  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      el.releasePointerCapture(e.pointerId);
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerup", handlePointerUp);

      if (dragRef.current.rafId !== null) {
        cancelAnimationFrame(dragRef.current.rafId);
        dragRef.current.rafId = null;
      }

      dragRef.current.target = null;
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    },
    [handlePointerMove]
  );

  // Start drag for explorer handle
  const onExplorerDragStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture(e.pointerId);
      el.addEventListener("pointermove", handlePointerMove);
      el.addEventListener("pointerup", handlePointerUp);

      dragRef.current = {
        target: "explorer",
        startX: e.clientX,
        startWidth: explorerWidth,
        rafId: null,
      };

      setIsDragging(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [explorerWidth, handlePointerMove, handlePointerUp]
  );

  // Start drag for chat handle
  const onChatDragStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture(e.pointerId);
      el.addEventListener("pointermove", handlePointerMove);
      el.addEventListener("pointerup", handlePointerUp);

      dragRef.current = {
        target: "chat",
        startX: e.clientX,
        startWidth: chatWidth,
        rafId: null,
      };

      setIsDragging(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [chatWidth, handlePointerMove, handlePointerUp]
  );

  // Double-click to reset
  const onDoubleClickExplorer = useCallback(() => {
    setExplorerWidth(DEFAULT_EXPLORER);
  }, []);

  const onDoubleClickChat = useCallback(() => {
    setChatWidth(DEFAULT_CHAT);
  }, []);

  // Handle window resize — re-clamp widths
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      const total = getContainerWidth() - ACTIVITY_BAR_WIDTH - DRAG_HANDLE_WIDTH * 2;
      const minTotal = MIN_EXPLORER + MIN_EDITOR + MIN_CHAT;
      if (total < minTotal) return; // Too small, don't adjust

      setExplorerWidth((prev) => {
        const maxExplorer = total - MIN_EDITOR - chatWidth;
        return Math.min(prev, maxExplorer);
      });
      setChatWidth((prev) => {
        const maxChat = total - MIN_EDITOR - explorerWidth;
        return Math.min(prev, maxChat);
      });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [getContainerWidth, explorerWidth, chatWidth]);

  return {
    explorerWidth,
    chatWidth,
    editorWidth,
    isDragging,
    onExplorerDragStart,
    onChatDragStart,
    onDoubleClickExplorer,
    onDoubleClickChat,
    containerRef,
  };
}
