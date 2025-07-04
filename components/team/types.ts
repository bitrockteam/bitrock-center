import { FetchTeam } from "@/app/server-actions/user/fetchMyTeam";
import { FetchMyTeam } from "@/app/server-actions/user/fetchTeam";
import { user } from "@/db";

export type TeamMember = FetchTeam;
export type MyTeamData = FetchMyTeam;
export type CurrentUser = user;

export interface TeamMemberContainerProps {
  myTeam: MyTeamData;
  team: TeamMember[];
  isOwner?: boolean;
  user: CurrentUser;
}

export interface TeamMemberCardProps {
  teamMember?: TeamMember;
  isOwner?: boolean;
  onMemberRemoved?: () => void;
}

export interface AddMemberFormData {
  userId: string;
}

export interface RemoveMemberFormData {
  userId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
