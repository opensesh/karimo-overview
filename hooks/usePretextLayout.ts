"use client";

import { useRef, useMemo, useState, useEffect } from "react";

// Lazy-load pretext to avoid SSR canvas errors.
// Store the whole module reference to preserve correct branded types.
type PretextModule = typeof import("@chenglou/pretext");
let _mod: PretextModule | null = null;
type Prepared = ReturnType<PretextModule["prepare"]>;

// ─── Single-line truncation check ────────────────────────

export function usePretextTruncation(
  text: string,
  font: string,
  maxWidth: number
): { fits: boolean } {
  const [ready, setReady] = useState(!!_mod);
  const cacheRef = useRef<{ text: string; font: string; prepared: Prepared } | null>(null);

  useEffect(() => {
    if (_mod) { setReady(true); return; }
    import("@chenglou/pretext").then((mod) => {
      _mod = mod;
      setReady(true);
    });
  }, []);

  return useMemo(() => {
    if (!_mod || !ready) return { fits: true };

    let prepared: Prepared;
    if (cacheRef.current?.text === text && cacheRef.current?.font === font) {
      prepared = cacheRef.current.prepared;
    } else {
      prepared = _mod.prepare(text, font);
      cacheRef.current = { text, font, prepared };
    }

    const { lineCount } = _mod.layout(prepared, maxWidth, 20);
    return { fits: lineCount <= 1 };
  }, [text, font, maxWidth, ready]);
}

// ─── Multi-line height measurement ──────────────────────

export function usePretextHeights(
  texts: string[],
  font: string,
  maxWidth: number,
  lineHeight: number
): number[] {
  const [ready, setReady] = useState(!!_mod);
  const cacheRef = useRef<Map<string, Prepared>>(new Map());

  useEffect(() => {
    if (_mod) { setReady(true); return; }
    import("@chenglou/pretext").then((mod) => {
      _mod = mod;
      setReady(true);
    });
  }, []);

  return useMemo(() => {
    if (!_mod || !ready || maxWidth <= 0) return texts.map(() => lineHeight);

    const cache = cacheRef.current;
    const preparedList: Prepared[] = [];

    for (const text of texts) {
      let p = cache.get(text);
      if (!p) {
        p = _mod.prepare(text, font);
        cache.set(text, p);
      }
      preparedList.push(p);
    }

    // Prune stale entries
    const textSet = new Set(texts);
    for (const key of cache.keys()) {
      if (!textSet.has(key)) cache.delete(key);
    }

    const mod = _mod;
    return preparedList.map((p) => mod.layout(p, maxWidth, lineHeight).height);
  }, [texts, font, maxWidth, lineHeight, ready]);
}
