import { IStatus } from "./status.types";

export interface IProject {
  id: string;
  created_at: Date;
  name: string;
  client: string;
  description: string;
  start_date: Date;
  end_date?: Date;
  status: IStatus;
}

export interface IProjectUpsert {
  name: string;
  client: string;
  description: string;
  start_date: Date;
  end_date?: Date;
  status_id: IStatus["id"];
}
