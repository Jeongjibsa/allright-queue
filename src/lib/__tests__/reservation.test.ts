import { describe, it, expect, vi } from "vitest";
import {
  assertReservationCapacity,
  buildReservationMessage,
  createReservationRecord,
  ReservationLimitError,
} from "@/lib/useReservation";
import type { ReservationData } from "@/types/domain";

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
      timeSlot: "09:00",
    });
    expect(rec.name).toBe("홍길동");
    expect(rec.patientId).toBe("P123");
    expect(rec.estimatedWaitTime).toBe(10);
    expect(rec.createdAt).toBe(now);
    expect(rec.reservationId).toMatch(/^R-/);
    expect(rec.timeSlot).toBe("09:00");
    vi.useRealTimers();
  });

  it("formats reservation message payload consistently", () => {
    const reservation: ReservationData = {
      reservationId: "R-TEST-1234",
      name: "홍길동",
      patientId: "P123",
      phone: "010-0000-0000",
      service: "일반진료",
      date: "2025-01-10",
      timeSlot: "09:00",
      estimatedWaitTime: 10,
      createdAt: Date.now(),
    };

    const payload = buildReservationMessage(reservation, {
      hospitalName: "테스트병원",
      contact: "문의: 02-111-2222",
      channel: "sms",
    });

    expect(payload.title).toBe("[테스트병원] 예약 안내");
    expect(payload.body).toContain("예약번호: R-TEST-1234");
    expect(payload.body).toContain("문의: 02-111-2222");
  });
});

describe("reservation capacity guard", () => {
  const sampleReservation: ReservationData = {
    reservationId: "R-1",
    name: "홍길동",
    patientId: "P1",
    phone: "010-0000-0000",
    service: "일반진료",
    date: "2025-01-10",
    timeSlot: "09:00",
    estimatedWaitTime: 10,
    createdAt: Date.now(),
  };

  it("allows reservation when under limits", () => {
    expect(() =>
      assertReservationCapacity("2025-01-10", "09:30", [sampleReservation], {
        perSlot: 2,
        perDay: 5,
      })
    ).not.toThrow();
  });

  it("throws slot limit error when time slot is full", () => {
    expect(() =>
      assertReservationCapacity("2025-01-10", "09:00", [sampleReservation], {
        perSlot: 1,
        perDay: 5,
      })
    ).toThrowError(ReservationLimitError);
  });

  it("throws day limit error when daily capacity exhausted", () => {
    const reservations: ReservationData[] = [
      sampleReservation,
      { ...sampleReservation, reservationId: "R-2", timeSlot: "09:30" },
    ];

    expect(() =>
      assertReservationCapacity("2025-01-10", "10:00", reservations, {
        perSlot: 5,
        perDay: 2,
      })
    ).toThrowError(ReservationLimitError);
  });
});
