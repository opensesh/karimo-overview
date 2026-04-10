"use client";

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileNode, VSCODE, getFileExtension, getExtColor } from "@/lib/vscode-data";

// ─── File Icon ────────────────────────────────────────────

function FileIcon({ filename }: { filename: string }) {
  const ext = getFileExtension(filename);
  const color = getExtColor(filename);

  const labels: Record<string, string> = {
    md: "M",
    json: "{}",
    yaml: "Y",
    ts: "TS",
    tsx: "TS",
    js: "JS",
    sh: "#",
  };

  return (
    <span
      className="w-4 h-4 flex items-center justify-center text-[9px] font-bold shrink-0"
      style={{ color }}
    >
      {labels[ext] ?? "\u00b7"}
    </span>
  );
}

// ─── Chevron ──────────────────────────────────────────────

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="shrink-0 transition-transform duration-150"
      style={{
        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
        color: VSCODE.textDim,
      }}
    >
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

// ─── Folder Icon ──────────────────────────────────────────

function FolderIcon({ expanded }: { expanded: boolean }) {
  if (expanded) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="#dcb67a" className="shrink-0">
        <path d="M1.5 3A1.5 1.5 0 0 1 3 1.5h3.19a1.5 1.5 0 0 1 1.06.44l.75.75a.5.5 0 0 0 .35.15H13A1.5 1.5 0 0 1 14.5 4.34v.16H2v-.16A1.5 1.5 0 0 1 3 3h0zM1.62 6l.88 6.15A1.5 1.5 0 0 0 3.98 13.5h8.04a1.5 1.5 0 0 0 1.48-1.35L14.38 6H1.62z" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#dcb67a" className="shrink-0">
      <path d="M1.5 3A1.5 1.5 0 0 1 3 1.5h3.19a1.5 1.5 0 0 1 1.06.44l.75.75a.5.5 0 0 0 .35.15H13A1.5 1.5 0 0 1 14.5 4.34V12A1.5 1.5 0 0 1 13 13.5H3A1.5 1.5 0 0 1 1.5 12V3z" />
    </svg>
  );
}

// ─── Tree Node ────────────────────────────────────────────

interface FileTreeNodeProps {
  node: FileNode;
  depth: number;
  activeFile: string | null;
  onFileSelect: (contentKey: string) => void;
  revealedPaths: Set<string>;
  parentPath: string;
}

const FileTreeNode = memo(function FileTreeNode({
  node,
  depth,
  activeFile,
  onFileSelect,
  revealedPaths,
  parentPath,
}: FileTreeNodeProps) {
  const [expanded, setExpanded] = useState(depth === 0);
  const path = parentPath ? `${parentPath}/${node.name}` : node.name;
  const isDir = node.type === "directory";
  const isActive = !isDir && node.contentKey === activeFile;

  const handleClick = () => {
    if (isDir) {
      setExpanded((p) => !p);
    } else if (node.contentKey) {
      onFileSelect(node.contentKey);
    }
  };

  return (
    <li>
      <button
        className="flex items-center gap-1 w-full text-left py-[1px] pr-2 transition-colors duration-75"
        style={{
          paddingLeft: `${8 + depth * 16}px`,
          background: isActive ? VSCODE.selectionBg : "transparent",
          color: VSCODE.text,
          fontSize: "13px",
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = VSCODE.hoverBg;
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = "transparent";
        }}
        onClick={handleClick}
      >
        {isDir ? (
          <>
            <Chevron expanded={expanded} />
            <FolderIcon expanded={expanded} />
          </>
        ) : (
          <>
            <span className="w-4 shrink-0" />
            <FileIcon filename={node.name} />
          </>
        )}
        <span className="truncate ml-0.5" style={{ fontFamily: "var(--font-mono, monospace)" }}>
          {node.name}
        </span>
      </button>

      {isDir && (
        <AnimatePresence initial={false}>
          {expanded && node.children && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              {node.children.map((child) => (
                <FileTreeNode
                  key={child.name}
                  node={child}
                  depth={depth + 1}
                  activeFile={activeFile}
                  onFileSelect={onFileSelect}
                  revealedPaths={revealedPaths}
                  parentPath={path}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
});

// ─── File Tree ────────────────────────────────────────────

interface FileTreeProps {
  tree: FileNode;
  activeFile: string | null;
  onFileSelect: (contentKey: string) => void;
  revealedPaths: Set<string>;
}

export const FileTree = memo(function FileTree({
  tree,
  activeFile,
  onFileSelect,
  revealedPaths,
}: FileTreeProps) {
  return (
    <div
      data-vscode-scroll
      className="row-start-2 overflow-y-auto overflow-x-hidden select-none"
      style={{
        background: VSCODE.sidebarBg,
        borderRight: `1px solid ${VSCODE.border}`,
      }}
    >
      {/* Explorer header */}
      <div
        className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: VSCODE.textDim }}
      >
        Explorer
      </div>

      <ul>
        {tree.children?.map((child) => (
          <FileTreeNode
            key={child.name}
            node={child}
            depth={0}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
            revealedPaths={revealedPaths}
            parentPath={tree.name}
          />
        ))}
      </ul>
    </div>
  );
});
