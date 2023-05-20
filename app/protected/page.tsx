"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

/**
 * サインインしていないと表示されないページ
 */
export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [content, setContent] = useState();

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/example/protected");
      const json = await res.json();
      if (json.content) {
        setContent(json.content);
      }
    };
    fetchData();
  }, [session]);

  // if (typeof window !== "undefined" && loading) return null; // 必要なし

  // If no session exists, display access denied message
  if (!session) {
    return (
      <div>
        <p>access denied</p>
      </div>
    );
  }

  // If session exists, display content
  return (
    <div>
      <h1>Protected Page</h1>
      <p>
        <strong>{content ?? "\u00a0"}</strong>
      </p>
    </div>
  );
}