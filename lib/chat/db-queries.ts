"use server";

import type { UserInfo } from "@/app/server-actions/user/getUserInfo";
import { createClient } from "@/utils/supabase/server";

export const queryUsers = async (_userInfo: UserInfo, search?: string) => {
  const supabase = await createClient();
  let query = supabase.from("user").select("*");

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error querying users: ${error.message}`);
  }

  return data || [];
};

export const queryProjects = async (userInfo: UserInfo, search?: string) => {
  const supabase = await createClient();

  // Check if user has permission to see all projects
  const canSeeAllProjects =
    userInfo.role === "Admin" ||
    userInfo.role === "Super Admin" ||
    userInfo.permissions.includes("CAN_SEE_WORK_ITEM");

  let query = supabase.from("project").select("*, client(*)");

  if (!canSeeAllProjects) {
    // For regular users, only show projects they're allocated to
    const { data: allocations } = await supabase
      .from("allocation")
      .select("project_id")
      .eq("user_id", userInfo.id);

    const projectIds = allocations?.map((a) => a.project_id) || [];
    if (projectIds.length === 0) {
      return [];
    }
    query = query.in("id", projectIds);
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error querying projects: ${error.message}`);
  }

  return data || [];
};

export const queryTimesheets = async (userInfo: UserInfo, userId?: string) => {
  const supabase = await createClient();

  // Users can only see their own timesheets unless they have permission
  const canSeeOthersTimesheets = userInfo.permissions.includes("CAN_SEE_OTHERS_TIMESHEET");
  const targetUserId = userId && canSeeOthersTimesheets ? userId : userInfo.id;

  const { data, error } = await supabase
    .from("timesheet")
    .select("*, user(*), work_items(*)")
    .eq("user_id", targetUserId)
    .order("date", { ascending: false });

  if (error) {
    throw new Error(`Error querying timesheets: ${error.message}`);
  }

  return data || [];
};

export const queryPermits = async (userInfo: UserInfo, userId?: string) => {
  const supabase = await createClient();

  // Users can only see their own permits unless they have permission to approve
  const canApprovePermits = userInfo.permissions.includes("CAN_APPROVE_PERMIT");
  const targetUserId = userId && canApprovePermits ? userId : userInfo.id;

  const { data, error } = await supabase
    .from("permit")
    .select("*")
    .eq("user_id", targetUserId)
    .order("date", { ascending: false });

  if (error) {
    throw new Error(`Error querying permits: ${error.message}`);
  }

  return data || [];
};

export const queryWorkItems = async (userInfo: UserInfo, search?: string) => {
  const supabase = await createClient();

  // Check if user has permission to see all work items
  const canSeeAllWorkItems = userInfo.permissions.includes("CAN_SEE_WORK_ITEM");

  let query = supabase.from("work_items").select("*, client(*), project(*)");

  if (!canSeeAllWorkItems) {
    // For regular users, only show work items they're allocated to
    const { data: allocatedItems } = await supabase
      .from("allocation")
      .select("work_item_id")
      .eq("user_id", userInfo.id);

    const workItemIds = allocatedItems?.map((e) => e.work_item_id) || [];
    if (workItemIds.length === 0) {
      return [];
    }
    query = query.in("id", workItemIds);
  }

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error querying work items: ${error.message}`);
  }

  return data || [];
};

export const queryAllocations = async (userInfo: UserInfo, userId?: string) => {
  const supabase = await createClient();

  // Users can only see their own allocations unless they have permission
  const canAllocateResources = userInfo.permissions.includes("CAN_ALLOCATE_RESOURCE");
  const targetUserId = userId && canAllocateResources ? userId : userInfo.id;

  // Get allocations with project info
  const { data: allocations, error: allocationError } = await supabase
    .from("allocation")
    .select("*, project(*)")
    .eq("user_id", targetUserId)
    .order("start_date", { ascending: false });

  if (allocationError) {
    throw new Error(`Error querying allocations: ${allocationError.message}`);
  }

  // Get client info for each project
  if (allocations && allocations.length > 0) {
    const projectIds = allocations
      .map((a) => a.project?.id)
      .filter((id): id is string => Boolean(id));

    if (projectIds.length > 0) {
      const { data: projects, error: projectError } = await supabase
        .from("project")
        .select("id, client(*)")
        .in("id", projectIds);

      if (!projectError && projects) {
        // Merge client data into allocations
        allocations.forEach((alloc) => {
          const project = projects.find((p) => p.id === alloc.project?.id);
          if (project && alloc.project) {
            alloc.project.client = project.client;
          }
        });
      }
    }
  }

  return allocations || [];
};

export const queryUserStats = async (userInfo: UserInfo, userId?: string) => {
  const supabase = await createClient();

  // Users can only see their own stats unless they have permission
  const canSeeOthersTimesheets = userInfo.permissions.includes("CAN_SEE_OTHERS_TIMESHEET");
  const targetUserId = userId && canSeeOthersTimesheets ? userId : userInfo.id;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Get hours worked this month
  const { data: timesheets, error: timesheetError } = await supabase
    .from("timesheet")
    .select("hours")
    .eq("user_id", targetUserId)
    .gte("date", startOfMonth.toISOString().split("T")[0]);

  if (timesheetError) {
    throw new Error(`Error querying timesheets for stats: ${timesheetError.message}`);
  }

  const hoursWorked = timesheets?.reduce((sum, t) => sum + (t.hours || 0), 0) || 0;

  // Get active projects count
  const { count: activeProjectsCount, error: activeProjectsError } = await supabase
    .from("allocation")
    .select("*", { count: "exact", head: true })
    .eq("user_id", targetUserId)
    .lte("start_date", now.toISOString())
    .or(`end_date.is.null,end_date.gte.${now.toISOString()}`);

  if (activeProjectsError) {
    throw new Error(`Error querying active projects: ${activeProjectsError.message}`);
  }

  // Get total projects count
  const { count: totalProjectsCount, error: totalProjectsError } = await supabase
    .from("allocation")
    .select("*", { count: "exact", head: true })
    .eq("user_id", targetUserId);

  if (totalProjectsError) {
    throw new Error(`Error querying total projects: ${totalProjectsError.message}`);
  }

  // Get vacation days used this year
  const { data: permits, error: permitsError } = await supabase
    .from("permit")
    .select("duration")
    .eq("user_id", targetUserId)
    .eq("type", "VACATION")
    .eq("status", "APPROVED")
    .gte("date", startOfYear.toISOString().split("T")[0]);

  if (permitsError) {
    throw new Error(`Error querying permits for stats: ${permitsError.message}`);
  }

  const vacationDaysUsed = permits?.reduce((sum, p) => sum + (p.duration || 0), 0) || 0;
  const totalVacationDays = 25; // Default, could be configurable
  const vacationDaysLeft = totalVacationDays - vacationDaysUsed;

  // Get pending requests
  const { count: pendingRequests, error: pendingError } = await supabase
    .from("permit")
    .select("*", { count: "exact", head: true })
    .eq("user_id", targetUserId)
    .eq("status", "PENDING");

  if (pendingError) {
    throw new Error(`Error querying pending requests: ${pendingError.message}`);
  }

  return {
    hoursWorked,
    vacationDaysLeft,
    vacationDaysTotal: totalVacationDays,
    activeProjects: activeProjectsCount || 0,
    totalProjects: totalProjectsCount || 0,
    pendingRequests: pendingRequests || 0,
  };
};
