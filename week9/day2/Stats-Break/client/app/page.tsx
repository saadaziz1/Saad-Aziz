"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrate } from "@/features/auth/authSlice";
import ChatBox from "@/components/Chatbox";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-main overflow-hidden">
      <ChatBox />
    </div>
  );
}
