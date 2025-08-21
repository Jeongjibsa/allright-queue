"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Bell, Smartphone, RefreshCw, Info, ClipboardList, User2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 사용자 대기열 화면 (프로토타입)
 * - Next.js (App Router): app/wait/page.tsx
 * - React 자동 JSX 런타임 사용 → `import React from "react"` 생략
 */
export default function QueuePrototype() {
  // URL 쿼리에서 초기 상태 읽기 (미존재 시 기본값)
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const initial = useMemo(
    () => ({
      ticket: params?.get("ticket") ?? "Q-104",
      position: Number(params?.get("pos") ?? 7),
      eta: Number(params?.get("eta") ?? 25), // 분
      service: params?.get("svc") ?? "일반진료",
      name: params?.get("name") ?? "홍길동",
    }),
    [params]
  );

  const [position, setPosition] = useState(initial.position);
  const [eta, setEta] = useState(initial.eta);
  const [notify, setNotify] = useState<"off" | "ready" | "sent">("off");
  const [phone, setPhone] = useState("");

  // 데모용: 30초마다 1명씩 진료 진행되는 것처럼 포지션 감소 & ETA 감소
  useEffect(() => {
    const id = setInterval(() => {
      setPosition((p) => (p > 0 ? p - 1 : 0));
      setEta((e) => (e > 0 ? Math.max(e - 3, 0) : 0));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const progress = useMemo(() => {
    const start = initial.position || 1;
    const done = Math.max(start - position, 0);
    return Math.min(Math.round((done / start) * 100), 100);
  }, [initial.position, position]);

  const status: { label: string; tone: "default" | "warning" | "success" } = useMemo(() => {
    if (position === 0) return { label: "곧 호출됩니다", tone: "success" };
    if (position <= 3) return { label: "잠시만 기다려 주세요", tone: "warning" };
    return { label: "대기 중", tone: "default" };
  }, [position]);

  const formattedEta = useMemo(() => {
    if (eta <= 0) return "곧 입장";
    if (eta < 60) return `${eta}분`;
    const h = Math.floor(eta / 60);
    const m = eta % 60;
    return `${h}시간 ${m}분`;
  }, [eta]);

  return (
    <div className="flex min-h-[100dvh] w-full items-start justify-center bg-gradient-to-b from-white to-slate-50 px-4 py-6">
      <div className="w-full max-w-md space-y-4">
        <header className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight">올바른정형외과 대기 현황</h1>
            <p className="text-muted-foreground text-sm">
              접수 후 발송된 고유 링크에서 실시간 현황을 확인하세요.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.reload()}
            aria-label="새로고침"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </header>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5" /> 대기표
            </CardTitle>
            <CardDescription>아래의 번호로 안내해 드립니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-xs">티켓 번호</div>
                <div className="text-3xl font-bold tracking-tight">{initial.ticket}</div>
              </div>
              <Badge
                className="rounded-xl px-3 py-1.5 text-base"
                variant={status.tone === "success" ? "default" : undefined}
              >
                {status.label}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-muted-foreground text-xs">대기 순번</div>
                <div className="text-2xl font-semibold">{Math.max(position, 0)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-muted-foreground text-xs">예상 대기</div>
                <div className="flex items-center justify-center gap-1 text-2xl font-semibold">
                  <Clock className="h-5 w-5" />
                  {formattedEta}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-muted-foreground text-xs">진료 항목</div>
                <div className="truncate text-2xl font-semibold" title={initial.service}>
                  {initial.service}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">진행률</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <AnimatePresence initial={false}>
              {position <= 3 && position > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <Alert>
                    <Bell className="h-4 w-4" />
                    <AlertTitle>곧 호출 예정</AlertTitle>
                    <AlertDescription>
                      잠시 자리를 비우셨다면 안내데스크에 미리 알려주세요.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <Tabs defaultValue="notice" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl">
                <TabsTrigger value="notice">알림 설정</TabsTrigger>
                <TabsTrigger value="info">안내</TabsTrigger>
              </TabsList>
              <TabsContent value="notice" className="space-y-3 pt-3">
                {notify === "off" && (
                  <div className="space-y-3">
                    <div className="text-muted-foreground text-sm">
                      문자 알림을 원하시면 연락처를 확인해 주세요.
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        inputMode="tel"
                        placeholder="휴대폰 번호 (숫자만)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                        className="rounded-xl"
                        aria-label="휴대폰 번호"
                      />
                      <Button className="rounded-xl" onClick={() => setNotify("ready")}>
                        확인
                      </Button>
                    </div>
                  </div>
                )}

                {notify === "ready" && (
                  <div className="space-y-3">
                    <div className="text-sm">입력된 번호로 진료 전 안내를 보내드릴까요?</div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        className="rounded-xl"
                        onClick={() => setNotify("off")}
                      >
                        수정
                      </Button>
                      <Button className="rounded-xl" onClick={() => setNotify("sent")}>
                        알림 받기
                      </Button>
                    </div>
                  </div>
                )}

                {notify === "sent" && (
                  <Alert>
                    <Smartphone className="h-4 w-4" />
                    <AlertTitle>알림이 설정되었습니다</AlertTitle>
                    <AlertDescription>
                      호출 1~2팀 전에 문자로 알려드립니다. {phone ? `(${phone})` : "등록된 번호"}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="info" className="space-y-3 pt-3">
                <div className="text-muted-foreground flex items-start gap-2 text-sm">
                  <Info className="mt-0.5 h-4 w-4" />
                  <ul className="list-disc space-y-1 pl-4">
                    <li>예상 대기시간은 진료 상황에 따라 달라질 수 있습니다.</li>
                    <li>호출 시 부재 중이면 순번이 뒤로 밀릴 수 있습니다.</li>
                    <li>문의: 안내데스크 (내선 0)</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <User2 className="h-5 w-5" /> 내 정보
            </CardTitle>
            <CardDescription>예약자/접수자 성명 확인</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-sm">
              <div className="text-muted-foreground">이름</div>
              <div className="font-medium">{initial.name}</div>
            </div>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => alert("본인정보 확인 절차 (데모)")}
            >
              정보 변경
            </Button>
          </CardContent>
        </Card>

        <footer className="text-muted-foreground pt-2 text-center text-xs">
          © {new Date().getFullYear()} 올바른정형외과 · 대기열 시스템 프로토타입
        </footer>
      </div>
    </div>
  );
}
