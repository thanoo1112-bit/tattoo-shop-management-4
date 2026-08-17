"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Utility to convert VAPID base64 string to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function AdminNotifier() {
  const supabase = createClient();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      // Auto-subscribe if already granted
      if (Notification.permission === "granted") {
        registerServiceWorkerAndSubscribe();
      }
    }

    // Setup Realtime Audio Fallback
    const channel = supabase
      .channel("admin-appointments-insert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "appointments" },
        (payload) => {
          console.log("New booking received in realtime!", payload);
          playAudioAlert();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const playAudioAlert = () => {
    try {
      const audio = new Audio("/new-booking.mp3");
      audio.play().catch(e => console.error("Audio play failed (maybe blocked by browser):", e));
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const registerServiceWorkerAndSubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered with scope:", registration.scope);

      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          console.error("VAPID public key not found in environment variables");
          return;
        }

        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      }

      // Send subscription to backend
      await fetch("/api/web-push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription })
      });

      console.log("Push subscription saved successfully");
    } catch (error) {
      console.error("Error during service worker registration or subscription:", error);
    }
  };

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        await registerServiceWorkerAndSubscribe();
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  // If unsupported or already granted/denied, don't show the prompt UI
  if (!isSupported || permission !== "default") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background-dark border border-border-dark p-4 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.8)] max-w-sm animate-slide-up">
      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-1">เปิดการแจ้งเตือน?</h3>
          <p className="text-xs text-text-secondary">รับการแจ้งเตือนทันทีเมื่อมีลูกค้าจองคิวใหม่เข้ามา</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button 
          onClick={requestPermission}
          className="flex-1 bg-white text-black text-xs font-bold uppercase tracking-widest py-2 rounded-sm hover:bg-accent-silver transition-colors"
        >
          อนุญาต (Allow)
        </button>
        <button 
          onClick={() => setPermission("denied")}
          className="flex-1 bg-transparent border border-border-dark text-text-secondary text-xs font-bold uppercase tracking-widest py-2 rounded-sm hover:text-white transition-colors"
        >
          ไว้ทีหลัง
        </button>
      </div>
    </div>
  );
}
