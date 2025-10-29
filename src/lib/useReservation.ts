// lib/useReservation.ts
"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getJSON, setJSON } from "@/lib/storage";
import { LS_KEYS } from "@/lib/constants";
import type { ReservationData } from "@/types/domain";

export type VisitHistoryCheck = {
  patientId: string;
  phone: string;
  hasHistory: boolean;
};

export type ReservationLimits = {
  perSlot: number;
  perDay: number;
};

export type ReservationMessageChannel = "sms" | "push" | "clipboard";

export type ReservationMessageOptions = {
  channel?: ReservationMessageChannel;
  hospitalName?: string;
  contact?: string;
};

export type ReservationLimitErrorCode = "SLOT_LIMIT" | "DAY_LIMIT";

const DEFAULT_HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME ?? "올바른정형외과";
const DEFAULT_HOSPITAL_CONTACT =
  process.env.NEXT_PUBLIC_HOSPITAL_CONTACT ?? "문의: 02-0000-0000";

const DEFAULT_SLOT_LIMIT = 4;
const DEFAULT_DAY_LIMIT = 40;

const ERROR_MESSAGES: Record<ReservationLimitErrorCode, string> = {
  SLOT_LIMIT: "선택한 시간대의 예약 가능 인원이 모두 찼습니다. 다른 시간을 선택해주세요.",
  DAY_LIMIT: "해당 날짜의 예약이 마감되었습니다. 다른 날짜를 선택해주세요.",
};

function parseLimit(value: string | undefined, fallback: number): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : fallback;
}

function readReservations(): ReservationData[] {
  return getJSON<ReservationData[]>(LS_KEYS.reservations) ?? [];
}

function writeReservations(reservations: ReservationData[]): void {
  setJSON(LS_KEYS.reservations, reservations);
}

export class ReservationLimitError extends Error {
  code: ReservationLimitErrorCode;

  constructor(code: ReservationLimitErrorCode, message?: string) {
    super(message ?? ERROR_MESSAGES[code]);
    this.name = "ReservationLimitError";
    this.code = code;
  }
}

export function getReservationLimits(): ReservationLimits {
  return {
    perSlot: parseLimit(process.env.NEXT_PUBLIC_RESERVATION_MAX_PER_SLOT, DEFAULT_SLOT_LIMIT),
    perDay: parseLimit(process.env.NEXT_PUBLIC_RESERVATION_MAX_PER_DAY, DEFAULT_DAY_LIMIT),
  };
}

export function assertReservationCapacity(
  date: string,
  timeSlot: string,
  reservations: ReservationData[],
  limits: ReservationLimits
): void {
  const reservationsForDay = reservations.filter((reservation) => reservation.date === date);
  if (reservationsForDay.length >= limits.perDay) {
    throw new ReservationLimitError("DAY_LIMIT");
  }

  const reservationsForSlot = reservationsForDay.filter(
    (reservation) => reservation.timeSlot === timeSlot
  );

  if (reservationsForSlot.length >= limits.perSlot) {
    throw new ReservationLimitError("SLOT_LIMIT");
  }
}

export function getReservationsByDate(date: string): ReservationData[] {
  return readReservations().filter((reservation) => reservation.date === date);
}

export function calculateSlotUsage(reservations: ReservationData[]): Record<string, number> {
  return reservations.reduce<Record<string, number>>((acc, reservation) => {
    acc[reservation.timeSlot] = (acc[reservation.timeSlot] ?? 0) + 1;
    return acc;
  }, {});
}

export function buildReservationMessage(
  reservation: ReservationData,
  options: ReservationMessageOptions = {}
): { title: string; body: string } {
  const channel = options.channel ?? "clipboard";
  const hospitalName = options.hospitalName ?? DEFAULT_HOSPITAL_NAME;
  const contact = options.contact ?? DEFAULT_HOSPITAL_CONTACT;

  const title =
    channel === "sms" || channel === "push"
      ? `[${hospitalName}] 예약 안내`
      : `${hospitalName} 예약 안내`;

  const bodyLines = [
    title,
    `예약번호: ${reservation.reservationId}`,
    `환자명: ${reservation.name}`,
    `진료항목: ${reservation.service}`,
    `예약일시: ${reservation.date} ${reservation.timeSlot}`,
    `예상 대기시간: 약 ${reservation.estimatedWaitTime}분`,
    "",
    "내원 시 접수 데스크에 예약번호를 제시해주세요.",
    contact,
  ];

  return {
    title,
    body: bodyLines.join("\n"),
  };
}

// 방문 이력 확인 훅
export function useCheckVisitHistory(patientId: string, phone: string) {
  return useQuery<VisitHistoryCheck>({
    queryKey: ["visitHistory", patientId, phone],
    queryFn: async () => {
      // 실제로는 API 호출로 방문 이력을 확인해야 함
      // 현재는 임시로 localStorage에서 확인
      const storedQueues = localStorage.getItem("queueData");
      let hasVisited = false;

      if (storedQueues) {
        const queues = JSON.parse(storedQueues);
        hasVisited = queues.some(
          (queue: { patientId: string; phone: string }) =>
            queue.patientId === patientId || queue.phone === phone
        );
      }

      // 임시 로직: 환자 ID가 "P"로 시작하면 기존 환자로 간주
      hasVisited = patientId.startsWith("P");

      return {
        patientId,
        phone,
        hasHistory: hasVisited,
      };
    },
    enabled: !!patientId && !!phone,
  });
}

// 예약 생성 훅
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      patientId: string;
      phone: string;
      service: string;
      date: string;
      timeSlot: string;
    }) => {
      const limits = getReservationLimits();
      const reservations = readReservations();
      assertReservationCapacity(data.date, data.timeSlot, reservations, limits);

      const reservationData = createReservationRecord(data);
      reservations.push(reservationData);
      writeReservations(reservations);

      return reservationData;
    },
    onSuccess: () => {
      // 성공 시 예약 목록 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

// 예약 목록 조회 훅
export function useReservations() {
  return useQuery<ReservationData[]>({
    queryKey: ["reservations"],
    queryFn: async () => readReservations(),
  });
}

// 예약 삭제 훅
export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: string) => {
      const reservations = readReservations();
      const updatedReservations = reservations.filter(
        (reservation) => reservation.reservationId !== reservationId
      );
      writeReservations(updatedReservations);

      return { success: true };
    },
    onSuccess: () => {
      // 성공 시 예약 목록 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}

// Pure helper for testing
export function createReservationRecord(data: {
  name: string;
  patientId: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
}): ReservationData {
  const reservationId = `R-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
  const estimatedWaitTime = 10; // default; could map from service in future
  return {
    reservationId,
    name: data.name,
    patientId: data.patientId,
    phone: data.phone,
    service: data.service,
    date: data.date,
    timeSlot: data.timeSlot,
    estimatedWaitTime,
    createdAt: Date.now(),
  };
}
