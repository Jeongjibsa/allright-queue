import { describe, it, expect } from "vitest";
import { SERVICE_WAIT_TIMES, DEFAULT_SERVICE_OPTIONS, LS_KEYS } from "@/lib/constants";

describe("constants", () => {
  it("has service wait times", () => {
    expect(SERVICE_WAIT_TIMES["일반진료"]).toBe(10);
    expect(SERVICE_WAIT_TIMES["재진"]).toBe(5);
    expect(SERVICE_WAIT_TIMES["검사"]).toBe(15);
    expect(SERVICE_WAIT_TIMES["처방"]).toBe(3);
  });

  it("default service options align with wait times", () => {
    const byValue = Object.fromEntries(DEFAULT_SERVICE_OPTIONS.map((o) => [o.value, o.waitTime]));
    for (const [k, v] of Object.entries(SERVICE_WAIT_TIMES)) {
      expect(byValue[k]).toBe(v);
    }
  });

  it("has expected localStorage keys", () => {
    expect(LS_KEYS.services).toBe("services");
    expect(LS_KEYS.doctors).toBe("doctors");
    expect(LS_KEYS.patients).toBe("patients");
    expect(LS_KEYS.reservations).toBe("reservations");
  });
});

