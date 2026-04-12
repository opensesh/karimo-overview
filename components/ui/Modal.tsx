"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  /** Allow user to toggle fullscreen */
  allowFullscreen?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-3xl",
  allowFullscreen = false,
}: ModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    },
    [onClose, isFullscreen]
  );

  useEffect(() => {
    if (!isOpen) {
      setIsFullscreen(false);
      return;
    }
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            className={`
              relative overflow-hidden rounded-xl bg-bg-primary border border-border-secondary
              ${isFullscreen
                ? "w-full h-full max-w-none max-h-none rounded-none"
                : `w-full ${maxWidth} max-h-[90vh]`
              }
            `}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-secondary shrink-0">
                <h3 className="text-display text-base text-fg-primary">
                  {title}
                </h3>
                <div className="flex items-center gap-2">
                  {allowFullscreen && (
                    <button
                      onClick={() => setIsFullscreen((f) => !f)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-border-secondary text-fg-tertiary hover:text-fg-primary hover:border-border-primary transition-colors cursor-pointer"
                      aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? (
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="4 14 4 10 0 10" transform="translate(1,1)" />
                          <polyline points="10 0 10 4 14 4" transform="translate(1,1)" />
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="0 6 0 0 6 0" transform="translate(1,1)" />
                          <polyline points="14 8 14 14 8 14" transform="translate(0,0)" />
                        </svg>
                      )}
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-border-secondary text-fg-tertiary hover:text-fg-primary hover:border-border-primary transition-colors cursor-pointer"
                  >
                    <span className="text-sm leading-none">&times;</span>
                  </button>
                </div>
              </div>
            )}

            {/* Body */}
            <div className={`p-5 overflow-y-auto flex-1 ${isFullscreen ? "flex flex-col" : ""}`}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
