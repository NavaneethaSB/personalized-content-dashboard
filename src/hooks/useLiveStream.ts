import { useState, useEffect, useRef } from "react";
import { ContentItem } from "@/types";

interface UseLiveStreamOptions {
  enabled: boolean;
  onNewItem?: (item: ContentItem) => void;
}

export function useLiveStream({ enabled, onNewItem }: UseLiveStreamOptions) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [incomingItems, setIncomingItems] = useState<ContentItem[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    const es = new EventSource("/api/stream");
    eventSourceRef.current = es;

    es.addEventListener("connected", () => {
      setIsConnected(true);
    });

    es.addEventListener("new_content", (e) => {
      try {
        const item: ContentItem = JSON.parse(e.data);
        setIncomingItems((prev) => [item, ...prev]);
        if (onNewItem) {
          onNewItem(item);
        }
      } catch (err) {
        console.warn("Failed to parse SSE payload", err);
      }
    });

    es.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [enabled, onNewItem]);

  const clearIncoming = () => {
    setIncomingItems([]);
  };

  return { isConnected, incomingItems, clearIncoming };
}
