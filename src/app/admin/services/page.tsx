"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Save, X, AlertTriangle } from "lucide-react";
import { Collapse } from "@/components/ui/collapse";

type ServiceItem = {
  id: string;
  value: string;
  label: string;
  waitTime: number;
  isActive: boolean;
};

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    value: "",
    label: "",
    waitTime: "",
  });

  // 진료항목 목록 조회
  const fetchServices = async () => {
    try {
      // 로컬 스토리지에서 진료항목 데이터 가져오기
      const storedServices = localStorage.getItem("services");
      if (storedServices) {
        setServices(JSON.parse(storedServices));
      } else {
        // 기본 진료항목 설정
        const defaultServices: ServiceItem[] = [
          { id: "1", value: "일반진료", label: "일반진료", waitTime: 10, isActive: true },
          { id: "2", value: "재진", label: "재진", waitTime: 5, isActive: true },
          { id: "3", value: "검사", label: "검사", waitTime: 15, isActive: true },
          { id: "4", value: "처방", label: "처방", waitTime: 3, isActive: true },
        ];
        setServices(defaultServices);
        localStorage.setItem("services", JSON.stringify(defaultServices));
      }
    } catch (error) {
      console.error("진료항목 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 진료항목 저장
  const saveServices = (newServices: ServiceItem[]) => {
    localStorage.setItem("services", JSON.stringify(newServices));
    setServices(newServices);
  };

  // 진료항목 추가
  const addService = () => {
    if (!formData.value || !formData.label || !formData.waitTime) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const newService: ServiceItem = {
      id: Date.now().toString(),
      value: formData.value,
      label: formData.label,
      waitTime: parseInt(formData.waitTime),
      isActive: true,
    };

    const updatedServices = [...services, newService];
    saveServices(updatedServices);

    // 폼 초기화
    setFormData({ value: "", label: "", waitTime: "" });
    setIsAdding(false);
  };

  // 진료항목 수정
  const updateService = () => {
    if (!editingService || !formData.value || !formData.label || !formData.waitTime) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const updatedServices = services.map((service) =>
      service.id === editingService.id
        ? {
            ...service,
            value: formData.value,
            label: formData.label,
            waitTime: parseInt(formData.waitTime),
          }
        : service
    );

    saveServices(updatedServices);

    // 편집 모드 종료
    setEditingService(null);
    setFormData({ value: "", label: "", waitTime: "" });
  };

  // 진료항목 삭제
  const deleteService = (id: string) => {
    if (!confirm("정말로 이 진료항목을 삭제하시겠습니까?")) return;

    const updatedServices = services.filter((service) => service.id !== id);
    saveServices(updatedServices);
  };

  // 진료항목 활성화/비활성화 토글
  const toggleServiceStatus = (id: string) => {
    const updatedServices = services.map((service) =>
      service.id === id ? { ...service, isActive: !service.isActive } : service
    );
    saveServices(updatedServices);
  };

  // 편집 모드 시작
  const startEdit = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      value: service.value,
      label: service.label,
      waitTime: service.waitTime.toString(),
    });
    setIsAdding(false);
  };

  // 편집 취소
  const cancelEdit = () => {
    setEditingService(null);
    setFormData({ value: "", label: "", waitTime: "" });
    setIsAdding(false);
  };

  // 추가 모드 시작
  const startAdd = () => {
    setIsAdding(true);
    setEditingService(null);
    setFormData({ value: "", label: "", waitTime: "" });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p>진료항목 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* 알림 */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          진료항목을 수정하면 기존 대기열의 예상 대기시간에 영향을 줄 수 있습니다.
        </AlertDescription>
      </Alert>

      {/* 진료항목 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>진료항목 목록</CardTitle>
              <CardDescription>
                현재 등록된 진료항목들입니다. 수정하거나 삭제할 수 있습니다.
              </CardDescription>
            </div>
            <Button onClick={startAdd}>
              <Plus className="mr-2 h-4 w-4" />
              진료항목 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">등록된 진료항목이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`rounded-lg border ${!service.isActive ? "opacity-60" : ""}`}
                >
                  {/* 서비스 정보 표시 */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-4">
                          <div className="font-medium">{service.label}</div>
                          <Badge variant="outline">{service.value}</Badge>
                          <Badge variant="secondary">{service.waitTime}분</Badge>
                          {!service.isActive && <Badge variant="destructive">비활성</Badge>}
                        </div>
                        <div className="text-muted-foreground text-sm">ID: {service.id}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => toggleServiceStatus(service.id)}
                          variant="outline"
                          size="sm"
                        >
                          {service.isActive ? "비활성화" : "활성화"}
                        </Button>
                        <Button
                          id={`edit-trigger-${service.id}`}
                          onClick={() => startEdit(service)}
                          variant="outline"
                          size="sm"
                          aria-expanded={editingService?.id === service.id}
                          aria-controls={`edit-panel-${service.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => deleteService(service.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 편집 폼 (접을 수 있는 스타일) */}
                  <Collapse open={editingService?.id === service.id} className="bg-white">
                    <div
                      id={`edit-panel-${service.id}`}
                      className="transform space-y-4 px-4 pt-2 pb-4"
                      role="region"
                      aria-labelledby={`edit-trigger-${service.id}`}
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`value-${service.id}`} className="text-sm font-medium">
                            항목 코드
                          </Label>
                          <Input
                            id={`value-${service.id}`}
                            placeholder="예: general"
                            value={formData.value}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, value: e.target.value }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`label-${service.id}`} className="text-sm font-medium">
                            항목명
                          </Label>
                          <Input
                            id={`label-${service.id}`}
                            placeholder="예: 일반진료"
                            value={formData.label}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, label: e.target.value }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`waitTime-${service.id}`} className="text-sm font-medium">
                            예상 대기시간 (분)
                          </Label>
                          <Input
                            id={`waitTime-${service.id}`}
                            type="number"
                            placeholder="예: 10"
                            value={formData.waitTime}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, waitTime: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <Button onClick={cancelEdit} variant="outline" size="sm">
                          <X className="mr-2 h-4 w-4" />
                          취소
                        </Button>
                        <Button onClick={updateService} size="sm">
                          <Save className="mr-2 h-4 w-4" />
                          저장
                        </Button>
                      </div>
                    </div>
                  </Collapse>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 추가 폼 */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>진료항목 추가</CardTitle>
            <CardDescription>새로운 진료항목을 추가합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="value" className="text-sm font-medium">
                    항목 코드
                  </Label>
                  <Input
                    id="value"
                    placeholder="예: general"
                    value={formData.value}
                    onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label" className="text-sm font-medium">
                    항목명
                  </Label>
                  <Input
                    id="label"
                    placeholder="예: 일반진료"
                    value={formData.label}
                    onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waitTime" className="text-sm font-medium">
                    예상 대기시간 (분)
                  </Label>
                  <Input
                    id="waitTime"
                    type="number"
                    placeholder="예: 10"
                    value={formData.waitTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, waitTime: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button onClick={cancelEdit} variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  취소
                </Button>
                <Button onClick={addService}>
                  <Save className="mr-2 h-4 w-4" />
                  추가
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
