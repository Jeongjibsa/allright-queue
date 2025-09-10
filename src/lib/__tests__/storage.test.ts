import { describe, it, expect, beforeEach } from "vitest";
import { getJSON, setJSON, getActiveDoctors, getActiveServices } from "@/lib/storage";
import { LS_KEYS } from "@/lib/constants";

describe("storage helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("getJSON/setJSON roundtrip", () => {
    setJSON("foo", { a: 1 });
    expect(getJSON<{ a: number }>("foo")).toEqual({ a: 1 });
  });

  it("getActiveServices returns defaults when none stored", () => {
    const services = getActiveServices();
    expect(services.length).toBeGreaterThan(0);
  });

  it("getActiveDoctors returns empty when none stored", () => {
    const doctors = getActiveDoctors();
    expect(doctors).toEqual([]);
  });

  it("getActiveDoctors filters by isActive", () => {
    const doctors = [
      { id: "1", name: "A", specialty: "S", room: "101", isActive: true },
      { id: "2", name: "B", specialty: "S", room: "102", isActive: false },
    ];
    setJSON(LS_KEYS.doctors, doctors);
    const active = getActiveDoctors();
    expect(active).toHaveLength(1);
    expect(active[0].value).toBe("A");
  });
});

