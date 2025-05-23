export interface ITimesheet {
  projectId: string;
  hours: number;
  date: string;
  description: string;
  type: string;
}

export interface ITimesheetUpsert extends  ITimesheet {
  userId: string;
  endDate?: Date;
}
