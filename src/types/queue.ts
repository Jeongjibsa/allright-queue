export type QueueData = {
  token: string;
  name: string;
  age: number;
  service: string;
  room?: string;
  doctor?: string;
  estimatedWaitTime: number; // minutes
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
};

export type QueueState = QueueData & {
  eta: number; // remaining minutes
};
