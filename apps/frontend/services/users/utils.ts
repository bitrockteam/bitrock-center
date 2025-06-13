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
}) => {
  console.log({
    currentUser,
    user,
    cond1: currentUser?.role.label === "Admin",
    cond2: currentUser?.role.label === "Super Admin",
    cond3: user?.role.label !== "Super Admin",
    cond4:
      (currentUser?.role.label === "Admin" ||
        currentUser?.role.label === "Super Admin") &&
      currentUser?.role.label === "Admin" &&
      user?.role.label !== "Super Admin",
  });

  return (
    (currentUser?.role.label === "Admin" ||
      currentUser?.role.label === "Super Admin") &&
    currentUser?.role.label === "Admin" &&
    user?.role.label !== "Super Admin" &&
    currentUser.role.label !== user?.role.label
  );
};
