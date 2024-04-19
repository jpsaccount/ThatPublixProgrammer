import PolHeading from "@/components/polComponents/PolHeading";
import PolText from "@/components/polComponents/PolText";
import { Card, CardHeader } from "@/components/ui/card";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { AuthService } from "@/sdk";
import { getService } from "@/sdk/services/serviceProvider";

export default function NoTenantAccess() {
  const navigate = usePolNavigate();
  const authService = getService(AuthService);
  function Signout() {
    authService.signOutAsync().then(() => navigate({ to: "/auth/login" }));
  }
  return (
    <div className="h-full w-full">
      <div className="m-auto w-fit">
        <Card className="p-5">
          <CardHeader>
            <PolHeading size={1} className="mt-5">
              Ooops...
            </PolHeading>
          </CardHeader>
          <PolText>
            This orgnanization did not give you access. Please contact to an administrator or{" "}
            <a onClick={Signout} className="cursor-pointer text-blue-500">
              sign out
            </a>
            .
          </PolText>
        </Card>
      </div>
    </div>
  );
}
