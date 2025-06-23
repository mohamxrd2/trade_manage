// components/NetworkChecker.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function NetworkChecker() {
  const router = useRouter();

  useEffect(() => {
    const checkOnlineStatus = () => {
      if (!navigator.onLine) {
        router.push("/offline");
      }
    };

    // Vérifie au montage
    checkOnlineStatus();

    // Écoute les changements
    window.addEventListener("online", checkOnlineStatus);
    window.addEventListener("offline", checkOnlineStatus);

    return () => {
      window.removeEventListener("online", checkOnlineStatus);
      window.removeEventListener("offline", checkOnlineStatus);
    };
  }, [router]);

  return null; // Ce composant ne rend rien visuellement
}