import { describe, it, expect } from "vitest";
import { TWEAKCN_PRESETS } from "@/lib/tweakcn";

describe("TWEAKCN presets list", () => {
  it("contains required preset names", () => {
    const required = [
      "supabase",
      "vercel",
      "twitter",
      "catppuccin",
      "neo-brutalism",
      "vintage-paper",
    ];
    for (const name of required) {
      expect(TWEAKCN_PRESETS).toContain(name);
    }
  });
});

