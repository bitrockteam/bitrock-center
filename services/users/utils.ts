import { Role, user } from "../../db";

export const getFirstnameAndLastname = (name?: string) => {
  if (!name) {
    return { firstName: "", lastName: "" };
  }

  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0];

  const lastName = nameParts
    .map((n) => n.trim())
    .filter(Boolean)
    .slice(1)
    .join(" ");

  return { firstName, lastName };
};

export const formatDisplayName = ({
  name,
  initials,
}: {
  name: string;
  initials?: boolean;
}) => {
  const { firstName, lastName } = getFirstnameAndLastname(name);

  if (initials)
    return `${firstName.charAt(0)}${lastName.charAt(0).toUpperCase()}`;

  return `${firstName} ${lastName}`;
};

export const canUserEdit = ({
  currentUser,
  user,
}: {
  currentUser?: user;
  user?: user;
}) =>
  (currentUser?.role === Role.Admin ||
    currentUser?.role === Role.Super_Admin) &&
  currentUser?.role === Role.Admin &&
  user?.role !== Role.Super_Admin &&
  currentUser.role !== user?.role;

export const canUserDealProjects = (user?: user) =>
  user?.role === Role.Admin || user?.role === Role.Super_Admin;

export const canUserAllocateResources = (user?: user) =>
  user?.role === Role.Admin ||
  user?.role === Role.Super_Admin ||
  user?.role === Role.Key_Client;

export const isAdminOrSuperAdmin = (user?: user) =>
  user?.role === "Admin" || user?.role === Role.Super_Admin;
