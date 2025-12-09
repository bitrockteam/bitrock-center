import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiResponse, MyTeamData, TeamMember, User } from "@/components/team/types";
import { useApi } from "@/hooks/useApi";

export const useTeamApi = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: teamMembers,
    loading: teamMembersLoading,
    error: teamMembersError,
    callApi: callTeamMembers,
  } = useApi<TeamMember[]>();

  const {
    data: myTeamData,
    loading: myTeamLoading,
    error: myTeamError,
    callApi: callMyTeam,
  } = useApi<MyTeamData>();

  const {
    data: users,
    loading: usersLoading,
    error: usersError,
    callApi: callUsers,
  } = useApi<User[]>();

  // Track if we're currently refreshing to avoid unnecessary calls
  const isRefreshing = useRef(false);

  const fetchTeamMembers = useCallback(async () => {
    if (isRefreshing.current) return;

    try {
      isRefreshing.current = true;
      await callTeamMembers("/api/team/members");
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      isRefreshing.current = false;
    }
  }, [callTeamMembers]);

  const fetchMyTeam = useCallback(async () => {
    if (isRefreshing.current) return;

    try {
      isRefreshing.current = true;
      await callMyTeam("/api/team/my-team");
    } catch (error) {
      console.error("Error fetching my team:", error);
    } finally {
      isRefreshing.current = false;
    }
  }, [callMyTeam]);

  const fetchUsers = useCallback(async () => {
    try {
      await callUsers("/api/users/search");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [callUsers]);

  const refreshTeamData = useCallback(async () => {
    setIsUpdating(true);
    try {
      // Refresh both team data simultaneously
      await Promise.all([fetchTeamMembers(), fetchMyTeam()]);
    } finally {
      // Small delay to show the update indicator
      setTimeout(() => {
        setIsUpdating(false);
      }, 1000);
    }
  }, [fetchTeamMembers, fetchMyTeam]);

  const addTeamMember = async (userId: string): Promise<ApiResponse<TeamMember>> => {
    try {
      const response = await fetch("/api/team/add-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result: ApiResponse<TeamMember> = await response.json();

      if (result.success) {
        // Small delay to show the user that something happened
        setTimeout(() => {
          refreshTeamData();
        }, 500);
      }

      return result;
    } catch (error) {
      console.error("Error adding team member:", error);
      return {
        success: false,
        error: "Errore di rete nell'aggiunta del membro",
      };
    }
  };

  const removeTeamMember = async (userId: string): Promise<ApiResponse<TeamMember>> => {
    try {
      const response = await fetch("/api/team/remove-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result: ApiResponse<TeamMember> = await response.json();

      if (result.success) {
        // Small delay to show the user that something happened
        setTimeout(() => {
          refreshTeamData();
        }, 500);
      }

      return result;
    } catch (error) {
      console.error("Error removing team member:", error);
      return {
        success: false,
        error: "Errore di rete nella rimozione del membro",
      };
    }
  };

  // Auto-fetch data on mount
  useEffect(() => {
    fetchTeamMembers();
    fetchMyTeam();
    fetchUsers();
  }, [fetchTeamMembers, fetchMyTeam, fetchUsers]);

  return {
    // Team members data
    teamMembers: teamMembers || [],
    teamMembersLoading,
    teamMembersError,
    refetchTeamMembers: fetchTeamMembers,

    // My team data
    myTeamData: myTeamData || { referent: null, members: [] },
    myTeamLoading,
    myTeamError,
    refetchMyTeam: fetchMyTeam,

    // Users data
    users: users || [],
    usersLoading,
    usersError,
    refetchUsers: fetchUsers,

    // Update state
    isUpdating,

    // Actions
    addTeamMember,
    removeTeamMember,
    refreshTeamData,
  };
};
