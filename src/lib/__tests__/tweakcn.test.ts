import { describe, it, expect } from "vitest";
import { applyPreset, getPreset, setPreset } from "@/lib/tweakcn";

describe("tweakcn theme presets", () => {
  it("stores and applies preset", () => {
    setPreset("clinic");
    expect(getPreset()).toBe("clinic");
    applyPreset("clinic");
    expect(document.documentElement.dataset.theme).toBe("clinic");
  });
});

