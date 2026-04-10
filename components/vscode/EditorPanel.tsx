"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import {
  VSCODE,
  FILE_CONTENTS,
  getFileExtension,
  getExtColor,
} from "@/lib/vscode-data";

// ─── File name lookup ─────────────────────────────────────

const CONTENT_KEY_TO_FILENAME: Record<string, string> = {
  prd: "PRD_framer-cms-migration.md",
  status: "status.json",
  tasks: "tasks.yaml",
  execution: "execution_plan.yaml",
  findings: "findings.md",
  recommendations: "recommendations.md",
  metrics: "metrics.json",
  "briefs-overview": "briefs.overview.md",
  "brief-t001": "T001_image-download-script.md",
  "brief-t002": "T002_typescript-schemas.md",
  "brief-t005": "T005_framer-cms-migration.md",
  "brief-t006": "T006_framer-cms-migration.md",
  "brief-t010": "T010_project-detail-page.md",
  "brief-t011": "T011_blog-mdx-renderer.md",
  "brief-t016": "T016_seo-metadata.md",
  "brief-t020": "T020_about-images.md",
  "research-summary": "summary.md",
  "research-findings": "findings.md",
  "research-meta": "meta.json",
  "internal-structure": "structure.md",
  "internal-deps": "dependencies.md",
  "internal-patterns": "patterns.md",
  "internal-errors": "errors.md",
  "external-practices": "best-practices.md",
  "external-libs": "libraries.md",
  "external-refs": "references.md",
  "external-sources": "sources.yaml",
};

export function getFileName(contentKey: string): string {
  return CONTENT_KEY_TO_FILENAME[contentKey] ?? contentKey;
}

// ─── Tab ──────────────────────────────────────────────────

function Tab({
  contentKey,
  active,
  onSelect,
  onClose,
}: {
  contentKey: string;
  active: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  const filename = getFileName(contentKey);
  const color = getExtColor(filename);

  return (
    <button
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs shrink-0 group"
      style={{
        background: active ? VSCODE.tabActiveBg : VSCODE.tabInactiveBg,
        color: active ? VSCODE.text : VSCODE.textDim,
        borderRight: `1px solid ${VSCODE.border}`,
        borderTop: active ? `1px solid ${VSCODE.accent}` : "1px solid transparent",
      }}
      onClick={onSelect}
    >
      <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: color }} />
      <span className="truncate max-w-[120px]">{filename}</span>
      <span
        className="w-4 h-4 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: VSCODE.textDim }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        role="button"
        aria-label={`Close ${filename}`}
      >
        &times;
      </span>
    </button>
  );
}

// ─── Code View ────────────────────────────────────────────

const PRISM_LANG_MAP: Record<string, string> = {
  markdown: "markdown",
  json: "json",
  yaml: "yaml",
  typescript: "typescript",
  tsx: "tsx",
  javascript: "javascript",
  bash: "bash",
};

function CodeView({ contentKey }: { contentKey: string }) {
  const file = FILE_CONTENTS[contentKey];
  if (!file) return null;

  const prismLang = PRISM_LANG_MAP[file.language] ?? "markdown";

  return (
    <Highlight theme={themes.vsDark} code={file.content.trimEnd()} language={prismLang}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre
          className="flex-1 overflow-auto text-[13px] leading-5 py-2"
          style={{ background: "transparent", margin: 0, fontFamily: "var(--font-mono, monospace)" }}
        >
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line });
            return (
              <div key={i} {...lineProps} className="flex">
                <span
                  className="w-12 text-right pr-4 shrink-0 select-none"
                  style={{ color: VSCODE.textDim }}
                >
                  {i + 1}
                </span>
                <span className="flex-1">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}

// ─── Empty State ──────────────────────────────────────────

function EmptyEditor() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke={VSCODE.textDim}
        strokeWidth="0.5"
        opacity="0.4"
      >
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
      <span className="text-xs" style={{ color: VSCODE.textDim }}>
        Select a file to preview
      </span>
    </div>
  );
}

// ─── Editor Panel ─────────────────────────────────────────

interface EditorPanelProps {
  activeFile: string | null;
  openTabs: string[];
  onTabSelect: (contentKey: string) => void;
  onTabClose: (contentKey: string) => void;
}

export const EditorPanel = memo(function EditorPanel({
  activeFile,
  openTabs,
  onTabSelect,
  onTabClose,
}: EditorPanelProps) {
  return (
    <div
      className="row-start-2 flex flex-col min-w-0 overflow-hidden"
      style={{ background: VSCODE.bg }}
    >
      {/* Tab bar */}
      {openTabs.length > 0 && (
        <div
          className="flex overflow-x-auto shrink-0"
          style={{
            background: VSCODE.sidebarBg,
            borderBottom: `1px solid ${VSCODE.border}`,
          }}
        >
          {openTabs.map((key) => (
            <Tab
              key={key}
              contentKey={key}
              active={key === activeFile}
              onSelect={() => onTabSelect(key)}
              onClose={() => onTabClose(key)}
            />
          ))}
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeFile && FILE_CONTENTS[activeFile] ? (
            <motion.div
              key={activeFile}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              data-vscode-scroll
              className="flex-1 overflow-auto"
            >
              <CodeView contentKey={activeFile} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1"
            >
              <EmptyEditor />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
