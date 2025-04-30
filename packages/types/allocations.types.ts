import { IRole } from "./roles.types";

export interface ICreateAllocation {
  user_id: string;
  project_id: string;
  start_date?: string;
  end_date?: string;
  percentage?: number;
}

export interface IAllocation {
  user_id: string;
  project_id: string;
  start_date?: string;
  end_date?: string;
  percentage?: number;
  user_name: string;
  user_avatar_url?: string;
  user_role: IRole;
}
