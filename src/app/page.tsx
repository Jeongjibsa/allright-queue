"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Users, Settings } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-gradient-to-b from-white to-slate-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="w-full max-w-2xl space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">올바른정형외과</h1>
          <p className="text-muted-foreground mt-2 text-lg">대기열 관리 시스템</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 환자 접수 */}
          <Card className="rounded-2xl shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                환자 접수
              </CardTitle>
              <CardDescription>
                새로운 환자를 대기열에 등록하고 고유한 대기열 링크를 생성합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-muted-foreground space-y-2 text-sm">
                <p>• 환자 기본 정보 입력</p>
                <p>• 진료 항목 선택</p>
                <p>• 예상 대기 시간 안내</p>
                <p>• 고유 대기열 링크 생성</p>
              </div>
              <Button className="w-full" onClick={() => window.open("/register", "_blank")}>
                접수 시작
              </Button>
            </CardContent>
          </Card>

          {/* 관리자 대시보드 */}
          <Card className="rounded-2xl shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                관리자 대시보드
              </CardTitle>
              <CardDescription>현재 대기열 현황을 확인하고 환자 정보를 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-muted-foreground space-y-2 text-sm">
                <p>• 실시간 대기열 현황</p>
                <p>• 환자 정보 수정</p>
                <p>• 대기열 삭제</p>
                <p>• 통계 및 분석</p>
              </div>
              <Link href="/admin" className="block">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.open("/admin", "_blank")}
                >
                  대시보드 열기
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* 시스템 정보 */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              시스템 정보
            </CardTitle>
            <CardDescription>대기열 관리 시스템의 주요 기능과 특징을 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold">환자용 기능</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• 실시간 대기 시간 확인</li>
                  <li>• 3분마다 자동 업데이트</li>
                  <li>• 진행률 표시</li>
                  <li>• 모바일 최적화</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">관리자 기능</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• 실시간 대기열 모니터링</li>
                  <li>• 환자 정보 편집</li>
                  <li>• 진료 항목별 대기 시간 설정</li>
                  <li>• 통계 및 분석</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <footer className="text-muted-foreground pt-4 text-center text-sm">
          © {new Date().getFullYear()} 올바른정형외과 · 대기열 관리 시스템
        </footer>
      </div>
    </div>
  );
}
