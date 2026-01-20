"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "../lib/store";

export default function useAuthRedirect() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      router.replace("/resumelist"); 
    }
  }, [token, router]);
}
