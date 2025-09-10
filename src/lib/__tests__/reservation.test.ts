import { describe, it, expect, vi } from "vitest";
import { createReservationRecord } from "@/lib/useReservation";

describe("reservation creation", () => {
  it("creates a reservation record with defaults", () => {
    vi.useFakeTimers();
    const now = new Date("2025-01-01T00:00:00Z").getTime();
    vi.setSystemTime(now);
    const rec = createReservationRecord({
      name: "홍길동",
      patientId: "P123",
      phone: "010-0000-0000",
      service: "일반진료",
      date: "2025-01-10",
    });
    expect(rec.name).toBe("홍길동");
    expect(rec.patientId).toBe("P123");
    expect(rec.estimatedWaitTime).toBe(10);
    expect(rec.createdAt).toBe(now);
    expect(rec.reservationId).toMatch(/^R-/);
    vi.useRealTimers();
  });
});

