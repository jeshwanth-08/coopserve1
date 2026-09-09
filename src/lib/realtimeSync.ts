/**
 * CoopServe Real-Time Synchronization Bus
 * Enables parallel, instant status synchronization across provider, member, and admin interfaces
 */

export interface StatusChangeEvent {
  requestId: string;
  status: string;
  timestamp: string;
  note?: string;
  providerName?: string;
}

const CHANNEL_NAME = "coopserve_status_sync";
const STORAGE_KEY = "coopserve_last_status_event";

/**
 * Broadcasts a status update event in parallel across all browser tabs and components
 */
export function broadcastStatusUpdate(event: StatusChangeEvent) {
  if (typeof window === "undefined") return;

  const payload = {
    ...event,
    _syncTimestamp: Date.now(),
  };

  // 1. Modern BroadcastChannel API for multi-tab sync
  try {
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channel.postMessage(payload);
      channel.close();
    }
  } catch (err) {
    console.warn("BroadcastChannel error:", err);
  }

  // 2. LocalStorage event as reliable cross-tab fallback
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota or access errors
  }

  // 3. Same-tab CustomEvent for components in current window
  try {
    window.dispatchEvent(
      new CustomEvent("coopserve:status_change", { detail: payload })
    );
  } catch (err) {
    console.warn("CustomEvent error:", err);
  }
}

/**
 * Subscribes to real-time status updates and invokes callback immediately on arrival
 */
export function subscribeToStatusUpdates(
  callback: (event: StatusChangeEvent) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  let channel: BroadcastChannel | null = null;

  // 1. BroadcastChannel listener
  if ("BroadcastChannel" in window) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (msg) => {
        if (msg.data && msg.data.requestId) {
          callback(msg.data);
        }
      };
    } catch (err) {
      console.warn("BroadcastChannel init error:", err);
    }
  }

  // 2. Storage event listener (fires in other tabs when localStorage changes)
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed && parsed.requestId) {
          callback(parsed);
        }
      } catch {}
    }
  };
  window.addEventListener("storage", handleStorage);

  // 3. Same-window custom event listener
  const handleCustom = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail && detail.requestId) {
      callback(detail);
    }
  };
  window.addEventListener("coopserve:status_change", handleCustom);

  // Return unsubscribe cleanup function
  return () => {
    if (channel) {
      try {
        channel.close();
      } catch {}
    }
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("coopserve:status_change", handleCustom);
  };
}
