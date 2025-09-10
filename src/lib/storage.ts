import type { ServiceItem, DoctorItem, PatientItem, ReservationData } from "@/types/domain";
import { DEFAULT_SERVICE_OPTIONS, LS_KEYS } from "@/lib/constants";

export function getJSON<T>(key: string): T | null {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (e) {
    console.error("storage:getJSON error", key, e);
    return null;
  }
}

export function setJSON<T>(key: string, value: T): void {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.error("storage:setJSON error", key, e);
  }
}

export function getActiveServices(): { value: string; label: string; waitTime: number }[] {
  const stored = getJSON<ServiceItem[]>(LS_KEYS.services);
  if (!stored) return [...DEFAULT_SERVICE_OPTIONS];
  return stored
    .filter((s) => s.isActive)
    .map((s) => ({ value: s.value, label: s.label, waitTime: s.waitTime }));
}

export function getActiveDoctors(): { value: string; label: string }[] {
  const stored = getJSON<DoctorItem[]>(LS_KEYS.doctors);
  if (!stored) return [];
  return stored
    .filter((d) => d.isActive)
    .map((d) => ({ value: d.name, label: `${d.name} (${d.specialty} - ${d.room}호)` }));
}

export function ensureDefaultServices(): void {
  const existing = getJSON<ServiceItem[]>(LS_KEYS.services);
  if (existing) return;
  const defaults: ServiceItem[] = [
    { id: "1", value: "일반진료", label: "일반진료", waitTime: 10, isActive: true },
    { id: "2", value: "재진", label: "재진", waitTime: 5, isActive: true },
    { id: "3", value: "검사", label: "검사", waitTime: 15, isActive: true },
    { id: "4", value: "처방", label: "처방", waitTime: 3, isActive: true },
  ];
  setJSON(LS_KEYS.services, defaults);
}

export function ensureDefaultDoctors(): void {
  const existing = getJSON<DoctorItem[]>(LS_KEYS.doctors);
  if (existing) return;
  const defaults: DoctorItem[] = [
    {
      id: "1",
      name: "김의사",
      specialty: "정형외과",
      room: "101",
      isActive: true,
      phone: "010-1234-5678",
      email: "kim@allright.com",
    },
    {
      id: "2",
      name: "이의사",
      specialty: "정형외과",
      room: "102",
      isActive: true,
      phone: "010-2345-6789",
      email: "lee@allright.com",
    },
    {
      id: "3",
      name: "박의사",
      specialty: "재활의학과",
      room: "103",
      isActive: true,
      phone: "010-3456-7890",
      email: "park@allright.com",
    },
  ];
  setJSON(LS_KEYS.doctors, defaults);
}

export function ensureDefaultReservations(): void {
  const existing = getJSON<ReservationData[]>(LS_KEYS.reservations);
  if (existing) return;
  const today = new Date().toISOString().split("T")[0];
  const defaults: ReservationData[] = [
    {
      reservationId: "R-20240101-AAAAAA",
      name: "김환자",
      patientId: "P001",
      phone: "010-1111-2222",
      service: "일반진료",
      date: today,
      estimatedWaitTime: 10,
      createdAt: Date.now(),
    },
    {
      reservationId: "R-20240101-BBBBBB",
      name: "이환자",
      patientId: "P002",
      phone: "010-2222-3333",
      service: "재진",
      date: today,
      estimatedWaitTime: 5,
      createdAt: Date.now(),
    },
  ];
  setJSON(LS_KEYS.reservations, defaults);
}
