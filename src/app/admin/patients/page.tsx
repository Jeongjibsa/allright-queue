"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, FileText, Clock } from "lucide-react";

export default function PatientsPage() {
  return (
    <div className="space-y-6 p-6">
      {/* 환자 관리 개요 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 환자</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground text-xs">명</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">신규 등록</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">0</div>
            <p className="text-muted-foreground text-xs">오늘</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진료 기록</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
            <p className="text-muted-foreground text-xs">건</p>
          </CardContent>
        </Card>
      </div>

      {/* 환자 관리 기능 */}
      <Card>
        <CardHeader>
          <CardTitle>환자 관리</CardTitle>
          <CardDescription>환자 정보 관리 및 진료 기록을 확인할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">환자 관리 기능은 준비 중입니다.</p>
            <p className="text-muted-foreground mt-2 text-sm">
              향후 환자 정보 조회, 진료 기록 관리 등의 기능이 추가될 예정입니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
