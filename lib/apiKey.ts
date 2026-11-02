"use client";

import { useSyncExternalStore } from "react";

// BYOK：使用者的 OpenAI API Key 只存在自己瀏覽器的 localStorage
const STORAGE_KEY = "openai-api-key";
// 同一個分頁內改 localStorage 不會觸發 storage 事件，所以自己發一個事件通知訂閱者
const CHANGE_EVENT = "openai-api-key-change";

export function getApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    // 無痕模式或封鎖網站資料時，localStorage 可能丟錯
    return "";
  }
}

export function setApiKey(key: string) {
  try {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearApiKey() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // 其他分頁修改時同步
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** 回傳目前的 Key；null 代表還在伺服器端／尚未讀取，空字串代表沒設定 */
export function useApiKey(): string | null {
  return useSyncExternalStore(subscribe, getApiKey, () => null);
}
