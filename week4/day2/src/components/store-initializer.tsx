"use client";

import { useEffect, useRef } from "react";

import { JobConfig } from "@/types";
import { useStore } from "@/store";

export function StoreInitializer({ jobs }: { jobs: JobConfig[] }) {
  const initialized = useRef(false);
  
  useEffect(() => {
    if (!initialized.current) {
      useStore.setState({ jobs });
      useStore.getState().hydrate();
      initialized.current = true;
    }
  }, [jobs]);
  
  return null;
}
