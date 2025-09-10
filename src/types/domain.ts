export type ServiceItem = {
  id: string;
  value: string;
  label: string;
  waitTime: number;
  isActive: boolean;
};

export type DoctorItem = {
  id: string;
  name: string;
  specialty: string;
  room: string;
  isActive: boolean;
  phone?: string;
  email?: string;
};

export type PatientItem = {
  id: string;
  name: string;
  age: number;
  phone: string;
  lastVisit: string;
  isActive: boolean;
  notes?: string;
};

export type ReservationData = {
  reservationId: string;
  name: string;
  patientId: string;
  phone: string;
  service: string;
  date: string; // yyyy-mm-dd
  estimatedWaitTime: number;
  createdAt: number; // epoch ms
};
