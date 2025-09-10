"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarIcon, CheckCircle, AlertCircle } from "lucide-react";
import { useCreateReservation } from "@/lib/useReservation";
import { format, isBefore, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { getReservationPrefill } from "@/lib/devDefaults";
import { DEFAULT_SERVICE_OPTIONS } from "@/lib/constants";

// 서비스 옵션은 공통 상수를 사용합니다.

export default function ReservationPage() {
  const [serviceOptions] = useState(DEFAULT_SERVICE_OPTIONS);
  const prefill = getReservationPrefill();
  const [formData, setFormData] = useState({
    name: prefill?.name ?? "",
    patientId: prefill?.patientId ?? "",
    phone: prefill?.phone ?? "",
    service: prefill?.service ?? "",
    date: prefill?.date ?? "",
  });

  const [hasHistory, setHasHistory] = useState<boolean | null>(null);
  const [successData, setSuccessData] = useState<{
    reservationId: string;
    name: string;
    service: string;
    estimatedWaitTime: number;
    date: string;
  } | null>(null);

  const createReservationMutation = useCreateReservation();

  // 기존 방문 이력 확인
  const checkVisitHistory = async () => {
    if (!formData.patientId || !formData.phone) {
      alert("환자 ID와 전화번호를 입력해주세요.");
      return;
    }

    try {
      // 임시 로직: 환자 ID가 "P"로 시작하면 기존 환자로 간주
      const hasVisited = formData.patientId.startsWith("P");
      setHasHistory(hasVisited);

      if (!hasVisited) {
        alert("기존 방문 이력이 없는 환자입니다. 예약은 기존 환자만 가능합니다.");
      }
    } catch (error) {
      console.error("방문 이력 확인 실패:", error);
      alert("방문 이력 확인 중 오류가 발생했습니다.");
    }
  };

  // 예약 등록
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.patientId ||
      !formData.phone ||
      !formData.service ||
      !formData.date
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (hasHistory === null) {
      alert("먼저 방문 이력을 확인해주세요.");
      return;
    }

    if (!hasHistory) {
      alert("기존 방문 이력이 없는 환자는 예약할 수 없습니다.");
      return;
    }

    try {
      const result = await createReservationMutation.mutateAsync({
        name: formData.name,
        patientId: formData.patientId,
        phone: formData.phone,
        service: formData.service,
        date: formData.date,
      });

      setSuccessData({
        reservationId: result.reservationId,
        name: result.name,
        service: result.service,
        estimatedWaitTime: result.estimatedWaitTime,
        date: result.date,
      });

      // 폼 초기화
      setFormData({
        name: "",
        patientId: "",
        phone: "",
        service: "",
        date: "",
      });
      setHasHistory(null);
    } catch (error) {
      console.error("예약 실패:", error);
      alert("예약 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex min-h-[100dvh] w-full items-start justify-center bg-gradient-to-b from-white to-slate-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="w-full max-w-md space-y-4">
        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">예약 등록</h1>
          <p className="text-muted-foreground mt-2">기존 환자의 진료 예약을 등록하세요</p>
        </header>

        {!successData ? (
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                예약 정보 입력
              </CardTitle>
              <CardDescription>환자 정보와 진료 항목을 입력하여 예약을 등록하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="홍길동"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientId">환자 ID *</Label>
                  <Input
                    id="patientId"
                    value={formData.patientId}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, patientId: e.target.value }))
                    }
                    placeholder="P001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호 *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="010-1234-5678"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">예약 날짜 *</Label>
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const formattedDate = format(date, "yyyy-MM-dd");
                        setFormData((prev) => ({ ...prev, date: formattedDate }));
                      }
                    }}
                    disabled={(date) => {
                      const today = startOfDay(new Date());
                      return isBefore(date, today);
                    }}
                    // Show two months only on large screens; otherwise single month
                    numberOfMonths={1}
                    locale={ko}
                    className="w-full rounded-md border"
                  />

                  {formData.date && (
                    <Alert className="mt-3">
                      <CalendarIcon className="h-4 w-4" />
                      <AlertTitle>선택된 예약 날짜</AlertTitle>
                      <AlertDescription>
                        {format(new Date(formData.date), "M월 d일 (E)", { locale: ko })}에 예약이
                        등록됩니다.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">진료 항목 *</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, service: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="진료 항목을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} (예상 {option.waitTime}분)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.service && (
                  <Alert>
                    <CalendarIcon className="h-4 w-4" />
                    <AlertTitle>예상 대기 시간</AlertTitle>
                    <AlertDescription>
                      {serviceOptions.find((option) => option.value === formData.service)?.label}의
                      예상 대기 시간은{" "}
                      {serviceOptions.find((option) => option.value === formData.service)?.waitTime}
                      분입니다.
                    </AlertDescription>
                  </Alert>
                )}

                {/* 방문 이력 확인 섹션 */}
                <div className="space-y-3">
                  <Separator />
                  <div className="text-sm font-medium">방문 이력 확인</div>

                  {hasHistory === null && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>이력 확인 필요</AlertTitle>
                      <AlertDescription>
                        예약을 위해 먼저 기존 방문 이력을 확인해주세요.
                      </AlertDescription>
                    </Alert>
                  )}

                  {hasHistory === true && (
                    <Alert>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle>방문 이력 확인됨</AlertTitle>
                      <AlertDescription>
                        기존 환자로 확인되었습니다. 예약을 진행할 수 있습니다.
                      </AlertDescription>
                    </Alert>
                  )}

                  {hasHistory === false && (
                    <Alert>
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertTitle>방문 이력 없음</AlertTitle>
                      <AlertDescription>
                        기존 방문 이력이 없습니다. 예약은 기존 환자만 가능합니다.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={checkVisitHistory}
                    disabled={!formData.patientId || !formData.phone}
                    className="w-full"
                  >
                    방문 이력 확인
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    !hasHistory || hasHistory === null || createReservationMutation.isPending
                  }
                >
                  {createReservationMutation.isPending ? "예약 중..." : "예약 등록"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                예약 완료
              </CardTitle>
              <CardDescription>진료 예약이 성공적으로 등록되었습니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">환자명</span>
                  <span className="font-medium">{successData.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">진료항목</span>
                  <span className="font-medium">{successData.service}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">예약 날짜</span>
                  <span className="font-medium">{successData.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">예상 대기시간</span>
                  <span className="font-medium">{successData.estimatedWaitTime}분</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">예약번호</span>
                  <span className="font-mono font-medium">{successData.reservationId}</span>
                </div>
              </div>

              <Button onClick={() => setSuccessData(null)} className="w-full" variant="secondary">
                새로운 예약
              </Button>
            </CardContent>
          </Card>
        )}

        <footer className="text-muted-foreground pt-2 text-center text-xs">
          © {new Date().getFullYear()} 올바른정형외과 · 예약 시스템
        </footer>
      </div>
    </div>
  );
}
