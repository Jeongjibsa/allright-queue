// lib/useReservation.ts
"use client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export type ReservationData = {
  reservationId: string;
  name: string;
  patientId: string;
  phone: string;
  service: string;
  date: string;
  estimatedWaitTime: number;
  createdAt: number;
};

export type VisitHistoryCheck = {
  patientId: string;
  phone: string;
  hasHistory: boolean;
};

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
    }) => {
      // 실제로는 API 호출
      // 현재는 localStorage에 저장
      const reservationId =
        `R-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();

      const reservationData: ReservationData = {
        reservationId,
        name: data.name,
        patientId: data.patientId,
        phone: data.phone,
        service: data.service,
        date: data.date,
        estimatedWaitTime: 10, // 기본값, 실제로는 서비스별로 다름
        createdAt: Date.now(),
      };

      // localStorage에 예약 정보 저장
      const existingReservations = JSON.parse(localStorage.getItem("reservations") || "[]");
      existingReservations.push(reservationData);
      localStorage.setItem("reservations", JSON.stringify(existingReservations));

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
    queryFn: async () => {
      // localStorage에서 예약 목록 조회
      const storedReservations = localStorage.getItem("reservations");
      if (storedReservations) {
        return JSON.parse(storedReservations);
      }
      return [];
    },
  });
}

// 예약 삭제 훅
export function useDeleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: string) => {
      // localStorage에서 예약 삭제
      const storedReservations = JSON.parse(localStorage.getItem("reservations") || "[]");
      const updatedReservations = storedReservations.filter(
        (reservation: ReservationData) => reservation.reservationId !== reservationId
      );
      localStorage.setItem("reservations", JSON.stringify(updatedReservations));

      return { success: true };
    },
    onSuccess: () => {
      // 성공 시 예약 목록 쿼리를 무효화
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}
