"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Trash2, Calendar as CalendarIcon, ClipboardList } from "lucide-react";
import { useDeleteReservation, useReservations } from "@/lib/useReservation";
import { ensureDefaultReservations } from "@/lib/storage";

export default function ReservationsAdminPage() {
  const { data: reservations = [], refetch, isLoading } = useReservations();
  const del = useDeleteReservation();
  const [dateFilter, setDateFilter] = useState<string>("");

  useEffect(() => {
    ensureDefaultReservations();
    refetch();
  }, [refetch]);

  const onDelete = async (id: string) => {
    if (!confirm("정말로 이 예약을 삭제하시겠습니까?")) return;
    await del.mutateAsync(id);
    await refetch();
  };

  const filtered = useMemo(() => {
    if (!dateFilter) return reservations;
    return reservations.filter((r) => r.date === dateFilter);
  }, [reservations, dateFilter]);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>예약 목록</CardTitle>
            <CardDescription>등록된 예약을 확인하고 삭제할 수 있습니다.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-auto"
              aria-label="날짜 필터"
            />
            {dateFilter && (
              <Button variant="ghost" size="sm" onClick={() => setDateFilter("")}>필터 초기화</Button>
            )}
            <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> 새로고침
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-8 text-center">
              <ClipboardList className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">조건에 맞는 예약이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((r) => (
                <div key={r.reservationId} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{r.name}</div>
                        <Badge variant="outline">{r.patientId}</Badge>
                        <Badge variant="secondary">{r.phone}</Badge>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        <CalendarIcon className="mr-1 inline h-4 w-4" /> {r.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{r.service}</Badge>
                      <Badge variant="outline">예상 {r.estimatedWaitTime}분</Badge>
                      <Button variant="outline" size="sm" onClick={() => onDelete(r.reservationId)}>
                        <Trash2 className="mr-1 h-4 w-4" /> 삭제
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
