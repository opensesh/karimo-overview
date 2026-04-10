"use client";

import { VSCODE, FileNode, ChatMessage } from "@/lib/vscode-data";
import { TitleBar } from "./TitleBar";
import { ActivityBar } from "./ActivityBar";
import { FileTree } from "./FileTree";
import { EditorPanel } from "./EditorPanel";
import { ChatPanel } from "./ChatPanel";
import { StatusBar } from "./StatusBar";
import { getFileName } from "./EditorPanel";

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
}

export function VSCodeEmulator({
  tree,
  activeFile,
  openTabs,
  visibleMessages,
  revealedPaths,
  currentTime,
  onFileSelect,
  onTabSelect,
  onTabClose,
}: VSCodeEmulatorProps) {
  const activeFileName = activeFile ? getFileName(activeFile) : null;

  return (
    <div
      className="grid overflow-hidden rounded-xl shadow-2xl"
      style={{
        gridTemplateColumns: "48px 240px 1fr 320px",
        gridTemplateRows: "36px 1fr 24px",
        height: "clamp(500px, calc(100vh - 280px), 700px)",
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
