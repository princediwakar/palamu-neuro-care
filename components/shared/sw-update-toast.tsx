"use client";

import { useEffect, useState } from "react";

export function SWUpdateToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleUpdate = (registration: ServiceWorkerRegistration) => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          setShow(true);
        }
      });
    };

    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener("updatefound", () =>
        handleUpdate(registration),
      );
    });
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] rounded-lg bg-primary px-4 py-3 text-primary-foreground shadow-lg">
      <p className="text-sm">
        A new version of the site is available.{" "}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="underline font-bold"
        >
          Refresh
        </button>
      </p>
    </div>
  );
}
