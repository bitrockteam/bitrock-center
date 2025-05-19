export interface IPermit {
  id: string;
  createdAt: Date;
  userId: string;
  duration: number;
  description: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  status: string;
  reviewerId: string;
}

export interface IPermitUpsert {
  userId: string;
  duration: number;
  description: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  status: string;
  reviewerId: string;
}
