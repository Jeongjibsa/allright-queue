// lib/useQueue.ts
"use client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { QueueState } from "@/types/queue";
export type { QueueState } from "@/types/queue";

export function useQueue(token: string) {
  return useQuery<QueueState>({
    queryKey: ["queue", token],
    queryFn: async () => {
      const r = await fetch(`/api/queue?token=${encodeURIComponent(token)}`, {
        cache: "no-store",
      });
      if (!r.ok) throw new Error("Failed to fetch queue");
      return r.json();
    },
    // 토큰이 있을 때만 쿼리 실행
    enabled: !!token,
    // 3분마다 폴링
    refetchInterval: token ? 3 * 60 * 1000 : false, // 3분
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
    retryDelay: 1000,
  });
}

// 새로운 대기열 등록 훅
export function useCreateQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      age: number;
      service: string;
      room?: string;
      doctor?: string;
    }) => {
      const response = await fetch("/api/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create queue");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // 성공 시 해당 토큰의 쿼리를 무효화하여 즉시 데이터를 가져오도록 함
      queryClient.invalidateQueries({ queryKey: ["queue", data.token] });
    },
  });
}
