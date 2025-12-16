"use client";

import { useRef } from "react";

import { JobConfig } from "@/types";
import { useStore } from "@/store";

export function StoreInitializer({ jobs }: { jobs: JobConfig[] }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useStore.setState({ jobs });
    useStore.getState().hydrate();
    initialized.current = true;
  }
  return null;
}
