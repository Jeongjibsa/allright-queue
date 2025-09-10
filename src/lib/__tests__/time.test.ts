import { describe, it, expect } from "vitest";
import { formatMinutesCompact, formatTimeHM } from "@/lib/time";

describe("time utils", () => {
  it("formats minutes compactly", () => {
    expect(formatMinutesCompact(-1)).toBe("완료");
    expect(formatMinutesCompact(0)).toBe("완료");
    expect(formatMinutesCompact(5)).toBe("5분");
    expect(formatMinutesCompact(65)).toBe("1시간 5분");
  });

  it("formats time to HH:MM (ko-KR)", () => {
    const ts = new Date("2024-01-01T10:15:00.000Z").getTime();
    // We can't assert exact string due to timezone, but ensure it's a string with ':'
    expect(formatTimeHM(ts)).toMatch(/\d{2}:\d{2}/);
  });
});

