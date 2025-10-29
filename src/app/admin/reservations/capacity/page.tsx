"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Trash2, PencilLine, RefreshCw, Info } from "lucide-react";
import {
  ensureDefaultReservationCapacity,
  ensureDefaultServices,
  getActiveServices,
  getReservationCapacityRules,
  setReservationCapacityRules,
} from "@/lib/storage";
import { WEEKDAYS } from "@/lib/constants";
import type { ReservationCapacityRule, WeekdayToken } from "@/types/domain";

type CapacityFormState = {
  service: string;
  dayOfWeek: WeekdayToken;
  perSlot: string;
  perDay: string;
  note: string;
  isActive: boolean;
};

const DEFAULT_FORM: CapacityFormState = {
  service: "ALL",
  dayOfWeek: "ALL",
  perSlot: "",
  perDay: "",
  note: "",
  isActive: true,
};

export default function ReservationCapacityPage() {
  const [rules, setRules] = useState<ReservationCapacityRule[]>([]);
  const [services, setServices] = useState<{ value: string; label: string }[]>([]);
  const [formData, setFormData] = useState<CapacityFormState>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const weekdayLabels = useMemo(
    () => Object.fromEntries(WEEKDAYS.map((item) => [item.value, item.label])),
    []
  );

  const loadServices = useCallback(() => {
    ensureDefaultServices();
    const active = getActiveServices();
    setServices([{ value: "ALL", label: "모든 서비스" }, ...active]);
  }, []);

  const loadRules = useCallback(() => {
    ensureDefaultReservationCapacity();
    setRules(getReservationCapacityRules());
  }, []);

  useEffect(() => {
    loadServices();
    loadRules();
  }, [loadServices, loadRules]);

  const resetForm = () => {
    setFormData(DEFAULT_FORM);
    setEditingId(null);
  };

  const handleChange =
    <Key extends keyof CapacityFormState>(key: Key) =>
    (value: CapacityFormState[Key]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    };

  const upsertRule = () => {
    const perSlot = formData.perSlot.trim() ? Number(formData.perSlot) : null;
    const perDay = formData.perDay.trim() ? Number(formData.perDay) : null;

    if (perSlot !== null && (Number.isNaN(perSlot) || perSlot <= 0)) {
      alert("시간대 정원은 1 이상의 숫자여야 합니다.");
      return;
    }
    if (perDay !== null && (Number.isNaN(perDay) || perDay <= 0)) {
      alert("일일 정원은 1 이상의 숫자여야 합니다.");
      return;
    }

    const nextRule: ReservationCapacityRule = {
      id: editingId ?? crypto.randomUUID(),
      service: formData.service,
      dayOfWeek: formData.dayOfWeek,
      perSlot,
      perDay,
      note: formData.note.trim() || undefined,
      isActive: formData.isActive,
    };

    const nextRules = editingId
      ? rules.map((rule) => (rule.id === editingId ? nextRule : rule))
      : [...rules, nextRule];

    setReservationCapacityRules(nextRules);
    setRules(nextRules);
    resetForm();
  };

  const handleEdit = (rule: ReservationCapacityRule) => {
    setEditingId(rule.id);
    setFormData({
      service: rule.service,
      dayOfWeek: rule.dayOfWeek,
      perSlot: rule.perSlot != null ? String(rule.perSlot) : "",
      perDay: rule.perDay != null ? String(rule.perDay) : "",
      note: rule.note ?? "",
      isActive: rule.isActive,
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("해당 설정을 삭제하시겠습니까?")) return;
    const nextRules = rules.filter((rule) => rule.id !== id);
    setReservationCapacityRules(nextRules);
    setRules(nextRules);
    if (editingId === id) {
      resetForm();
    }
  };

  const handleToggleActive = (id: string, value: boolean) => {
    const nextRules = rules.map((rule) =>
      rule.id === id ? { ...rule, isActive: value } : rule
    );
    setReservationCapacityRules(nextRules);
    setRules(nextRules);
  };

  const serviceLabelMap = useMemo(
    () => Object.fromEntries(services.map((service) => [service.value, service.label])),
    [services]
  );

  const sortedRules = useMemo(
    () =>
      [...rules].sort((a, b) => {
        if (a.service === b.service) {
          return a.dayOfWeek.localeCompare(b.dayOfWeek);
        }
        if (a.service === "ALL") return -1;
        if (b.service === "ALL") return 1;
        return a.service.localeCompare(b.service);
      }),
    [rules]
  );

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>예약 정원 설정</CardTitle>
          <CardDescription>
            서비스/요일 별로 시간대 및 일일 예약 정원을 정의합니다. 비워두면 기본 환경 변수 값을
            따릅니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              기본 정원은 환경 변수 `NEXT_PUBLIC_RESERVATION_MAX_PER_SLOT`,{" "}
              `NEXT_PUBLIC_RESERVATION_MAX_PER_DAY`를 사용합니다. 특정 서비스나 요일에 대해
              정원을 덮어쓰려면 아래에서 규칙을 추가하세요.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>서비스</Label>
              <Select value={formData.service} onValueChange={handleChange("service")}>
                <SelectTrigger>
                  <SelectValue placeholder="서비스를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>요일</Label>
              <Select
                value={formData.dayOfWeek}
                onValueChange={(value: WeekdayToken) => handleChange("dayOfWeek")(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="요일을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {WEEKDAYS.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="perSlot">시간대 정원</Label>
              <Input
                id="perSlot"
                type="number"
                min={1}
                placeholder="미입력 시 기본 적용"
                value={formData.perSlot}
                onChange={(e) => handleChange("perSlot")(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perDay">일일 정원</Label>
              <Input
                id="perDay"
                type="number"
                min={1}
                placeholder="미입력 시 기본 적용"
                value={formData.perDay}
                onChange={(e) => handleChange("perDay")(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="note">메모</Label>
              <Input
                id="note"
                placeholder="내부 메모가 필요하다면 입력하세요"
                value={formData.note}
                onChange={(e) => handleChange("note")(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between md:col-span-2">
              <div className="space-y-1">
                <Label htmlFor="isActive">활성화</Label>
                <p className="text-muted-foreground text-xs">
                  비활성화 하면 해당 규칙은 적용되지 않습니다.
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange("isActive")(checked)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                취소
              </Button>
            )}
            <Button onClick={upsertRule}>{editingId ? "설정 저장" : "규칙 추가"}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>정원 규칙 목록</CardTitle>
            <CardDescription>적용 순서는 서비스/요일 특이 규칙이 일반 규칙보다 우선합니다.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadServices}>
              <RefreshCw className="mr-2 h-4 w-4" />
              서비스 새로고침
            </Button>
            <Button variant="outline" size="sm" onClick={loadRules}>
              <RefreshCw className="mr-2 h-4 w-4" />
              규칙 새로고침
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedRules.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">등록된 정원 규칙이 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {sortedRules.map((rule) => (
                <div key={rule.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">
                          {serviceLabelMap[rule.service] ?? rule.service}
                        </Badge>
                        <Badge variant="secondary">
                          {weekdayLabels[rule.dayOfWeek] ?? rule.dayOfWeek}
                        </Badge>
                        <Badge variant={rule.isActive ? "default" : "outline"}>
                          {rule.isActive ? "활성" : "비활성"}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        시간대 정원: {rule.perSlot ?? "기본"} · 일일 정원: {rule.perDay ?? "기본"}
                        {rule.note ? ` · ${rule.note}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">활성화</Label>
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={(checked) => handleToggleActive(rule.id, checked)}
                          aria-label="활성화 토글"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(rule)}
                        aria-label="편집"
                      >
                        <PencilLine className="mr-1 h-4 w-4" />
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(rule.id)}
                        aria-label="삭제"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        삭제
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
