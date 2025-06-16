import { IUser } from "@bitrock/types";

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
  currentUser?: IUser;
  user?: IUser;
}) =>
  (currentUser?.role.label === "Admin" ||
    currentUser?.role.label === "Super Admin") &&
  currentUser?.role.label === "Admin" &&
  user?.role.label !== "Super Admin" &&
  currentUser.role.label !== user?.role.label;

export const canUserDealProjects = (user?: IUser) =>
  user?.role.label === "Admin" || user?.role.label === "Super Admin";

export const canUserAllocateResources = (user?: IUser) =>
  user?.role.label === "Admin" ||
  user?.role.label === "Super Admin" ||
  user?.role.label === "Key Client";
