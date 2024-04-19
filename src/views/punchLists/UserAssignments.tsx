import UserProfilePicture from "@/components/navbar/UserProfilePicture";

export default function UserAssignments({ userIds }: { userIds: string[] }) {
  const limitedUserIds = userIds.slice(0, 4);

  return (
    <>
      {limitedUserIds.map((x) => (
        <UserProfilePicture className="m-0 -mr-2 h-6 w-6" userId={x}></UserProfilePicture>
      ))}
    </>
  );
}
