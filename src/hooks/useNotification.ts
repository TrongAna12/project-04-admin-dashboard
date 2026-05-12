"use client";

import { useState, useCallback } from "react";
import { useUIStore } from "@/store/uiStore";
import type { Notification } from "@/types";
import { generateId } from "@/lib/utils";

export function useNotification() {
  const { addNotification, removeNotification } = useUIStore();

  const notify = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info",
      duration = 3000
    ) => {
      const id = generateId();
      const notification: Notification = {
        id,
        title: type.charAt(0).toUpperCase() + type.slice(1),
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false,
      };

      addNotification(notification);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    [addNotification, removeNotification]
  );

  return {
    notify,
    success: (message: string) => notify(message, "success"),
    error: (message: string) => notify(message, "error"),
    warning: (message: string) => notify(message, "warning"),
    info: (message: string) => notify(message, "info"),
  };
}
