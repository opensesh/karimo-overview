"use client";

import { VSCODE, FileNode, ChatMessage } from "@/lib/vscode-data";
import { TitleBar } from "./TitleBar";
import { ActivityBar } from "./ActivityBar";
import { FileTree } from "./FileTree";
import { EditorPanel } from "./EditorPanel";
import { ChatPanel } from "./ChatPanel";
import { StatusBar } from "./StatusBar";
import { getFileName } from "./EditorPanel";

export type MobilePanel = "files" | "editor" | "chat";

interface VSCodeEmulatorProps {
  tree: FileNode;
  activeFile: string | null;
  openTabs: string[];
  visibleMessages: ChatMessage[];
  revealedPaths: Set<string>;
  currentTime: number;
  onFileSelect: (contentKey: string) => void;
  onTabSelect: (contentKey: string) => void;
  onTabClose: (contentKey: string) => void;
  mobilePanel?: MobilePanel;
  onMobilePanelChange?: (panel: MobilePanel) => void;
}

// ─── Mobile Panel Tabs ────────────────────────────────────

function MobilePanelTabs({
  active,
  onChange,
}: {
  active: MobilePanel;
  onChange: (panel: MobilePanel) => void;
}) {
  const tabs: { id: MobilePanel; label: string }[] = [
    { id: "files", label: "Files" },
    { id: "editor", label: "Editor" },
    { id: "chat", label: "Chat" },
  ];

  return (
    <div
      className="flex shrink-0"
      style={{ borderBottom: `1px solid ${VSCODE.border}`, background: VSCODE.sidebarBg }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex-1 px-3 py-2 text-xs font-medium transition-colors cursor-pointer"
          style={{
            color: active === tab.id ? VSCODE.text : VSCODE.textDim,
            borderBottom:
              active === tab.id
                ? `2px solid ${VSCODE.accent}`
                : "2px solid transparent",
            background: active === tab.id ? VSCODE.bg : "transparent",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── Desktop Layout ───────────────────────────────────────

function DesktopLayout({
  tree,
  activeFile,
  openTabs,
  visibleMessages,
  revealedPaths,
  currentTime,
  onFileSelect,
  onTabSelect,
  onTabClose,
}: Omit<VSCodeEmulatorProps, "mobilePanel" | "onMobilePanelChange">) {
  const activeFileName = activeFile ? getFileName(activeFile) : null;

  return (
    <div
      className="grid overflow-hidden rounded-xl shadow-2xl h-full"
      style={{
        gridTemplateColumns: "48px 240px 1fr 320px",
        gridTemplateRows: "36px 1fr 24px",
        border: `1px solid ${VSCODE.border}`,
        background: VSCODE.bg,
      }}
    >
      <TitleBar />
      <ActivityBar />
      <FileTree
        tree={tree}
        activeFile={activeFile}
        onFileSelect={onFileSelect}
        revealedPaths={revealedPaths}
      />
      <EditorPanel
        activeFile={activeFile}
        openTabs={openTabs}
        onTabSelect={onTabSelect}
        onTabClose={onTabClose}
      />
      <ChatPanel messages={visibleMessages} currentTime={currentTime} />
      <StatusBar activeFile={activeFile} activeFileName={activeFileName} />
    </div>
  );
}

// ─── Mobile Layout ────────────────────────────────────────

function MobileLayout({
  tree,
  activeFile,
  openTabs,
  visibleMessages,
  revealedPaths,
  currentTime,
  onFileSelect,
  onTabSelect,
  onTabClose,
  mobilePanel,
  onMobilePanelChange,
}: VSCodeEmulatorProps & {
  mobilePanel: MobilePanel;
  onMobilePanelChange: (panel: MobilePanel) => void;
}) {
  const activeFileName = activeFile ? getFileName(activeFile) : null;

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl shadow-2xl h-full"
      style={{
        border: `1px solid ${VSCODE.border}`,
        background: VSCODE.bg,
      }}
    >
      <TitleBar />
      <MobilePanelTabs active={mobilePanel} onChange={onMobilePanelChange} />

      {/* Panel content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {mobilePanel === "files" && (
          <FileTree
            tree={tree}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
            revealedPaths={revealedPaths}
            fillHeight
          />
        )}
        {mobilePanel === "editor" && (
          <EditorPanel
            activeFile={activeFile}
            openTabs={openTabs}
            onTabSelect={onTabSelect}
            onTabClose={onTabClose}
            fillHeight
          />
        )}
        {mobilePanel === "chat" && (
          <ChatPanel
            messages={visibleMessages}
            currentTime={currentTime}
            fillHeight
          />
        )}
      </div>

      <StatusBar activeFile={activeFile} activeFileName={activeFileName} />
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────

export function VSCodeEmulator(props: VSCodeEmulatorProps) {
  const { mobilePanel, onMobilePanelChange, ...rest } = props;

  // If mobile props are provided, render mobile layout
  if (mobilePanel !== undefined && onMobilePanelChange !== undefined) {
    return (
      <MobileLayout
        {...rest}
        mobilePanel={mobilePanel}
        onMobilePanelChange={onMobilePanelChange}
      />
    );
  }

  return <DesktopLayout {...rest} />;
}
