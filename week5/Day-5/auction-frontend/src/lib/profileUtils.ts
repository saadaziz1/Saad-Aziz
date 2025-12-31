// profileUtils.ts

// Helper to extract id from various object shapes
export function extractId(obj: any): string | undefined {
  if (!obj) return undefined;
  if (typeof obj === "string") return obj;
  return obj?._id || obj?.id;
}

// Add more shared profile utilities here as needed
