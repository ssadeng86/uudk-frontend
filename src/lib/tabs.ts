import type { Tab } from "@/layouts/AppLayout";

const KEY = "openTabs";

export function loadTabsFromLocal(): Tab[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTabsToLocal(tabs: Tab[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(tabs));
  } catch {}
}
