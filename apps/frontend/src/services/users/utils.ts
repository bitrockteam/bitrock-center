export const getFirstnameAndLastname = (name?: string) => {
  if (!name) {
    return { firstName: "", lastName: "" };
  }

  const nameParts = name.split(" ");
  const firstName = nameParts[0];

  const lastName =
    nameParts
      .map((n) => n.trim())
      .filter(Boolean)
      .slice(1)
      .join(" ") ?? "";

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

  if (initials) return `${firstName.charAt(0)}${lastName.charAt(0)}`;

  return `${firstName} ${lastName}`;
};
