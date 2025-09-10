export function formatMinutesCompact(minutes: number): string {
  if (minutes <= 0) return "완료";
  if (minutes < 60) return `${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}시간 ${m}분`;
}

export function formatTimeHM(ts: number): string {
  return new Date(ts).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}
