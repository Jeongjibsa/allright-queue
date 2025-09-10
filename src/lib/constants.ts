export const SERVICE_WAIT_TIMES: Record<string, number> = {
  일반진료: 10,
  재진: 5,
  검사: 15,
  처방: 3,
};

export const DEFAULT_SERVICE_OPTIONS = [
  { value: "일반진료", label: "일반진료", waitTime: SERVICE_WAIT_TIMES["일반진료"] },
  { value: "재진", label: "재진", waitTime: SERVICE_WAIT_TIMES["재진"] },
  { value: "검사", label: "검사", waitTime: SERVICE_WAIT_TIMES["검사"] },
  { value: "처방", label: "처방", waitTime: SERVICE_WAIT_TIMES["처방"] },
] as const;

export const LS_KEYS = {
  services: "services",
  doctors: "doctors",
  patients: "patients",
  reservations: "reservations",
} as const;
