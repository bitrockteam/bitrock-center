import { fetchTeam } from "@/api/server/user/fetchMyTeam";
import { fetchMyTeam } from "@/api/server/user/fetchTeam";
import { TeamMemberContainer } from "@/components/team/team-member-container";
import { getUserInfoFromCookie } from "@/utils/supabase/server";
import { Metadata } from "next";

// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Consuntivazione | Bitrock Hours",
  description: "Gestione delle ore lavorate",
};

export default async function Team() {
  const user = await getUserInfoFromCookie();
  const team = await fetchTeam();
  const myTeam = await fetchMyTeam();
  return (
    <TeamMemberContainer
      myTeam={myTeam}
      team={team}
      isOwner={team.length > 0}
      user={user}
    />
  );
}
