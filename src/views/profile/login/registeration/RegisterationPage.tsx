import MultiForm from "@/components/MultiForm";
import PolHeading from "@/components/polComponents/PolHeading";
import { useAuth } from "@/customHooks/auth";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { AuthService } from "@/sdk";
import diContainer from "@/sdk/sdkconfig/SdkSetup";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useEffect, useState } from "react";
import { AuthLoginBanner } from "../AuthLoginBanner";
import EmailVerificationView from "./EmailVerificationView";
import UserOrganizationView from "../../../organization/purchasing/UserOrganizationView";
import PersonalInfoView from "./PersonalInfoView";
import polLogo from "@/assets/images/pol-logo-horizontal-dark.png";

export class UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  confirmAgreement: boolean = false;
}

export default function RegisterationPage() {
  const navigate = usePolNavigate();
  const [redirect] = useSearchParamState("redirect", undefined);

  const [startingStep, setStartingStep] = useState(0);
  const { identity, user, activeTenant } = useAuth();
  const [userRegistration, setUserRegistration] = useState(new UserRegistration());

  useEffect(() => {
    if (isUsable(identity)) {
      setUserRegistration({
        firstName: "",
        lastName: "",
        email: identity.email,
        password: "",
        confirmPassword: "",
        confirmAgreement: true,
        phoneNumber: "",
      });
      if (isUsable(activeTenant)) {
        setStartingStep(identity.emailVerified ? (activeTenant.Subscriptions.length > 0 ? 2 : 1) : 0);
      } else {
        setStartingStep(identity.emailVerified ? 2 : 1);
      }
    }
  }, [identity, activeTenant]);

  const authService = diContainer.get(AuthService);

  const handleRegisterAsync = async () => {
    const response = await authService.registerAsync(
      userRegistration.email,
      userRegistration.firstName,
      userRegistration.lastName,
      userRegistration.phoneNumber,
      userRegistration.password,
    );
    if (response.error) {
      return response.error.message;
    }
    return null;
  };

  const [canGoForward, setCanGoForward] = useState(true);

  const validateSteps = async (stepIndex: number) => {
    if (stepIndex == 0) {
      if (isNullOrWhitespace(userRegistration.firstName)) {
        return "Your first name must be filled";
      }

      if (isNullOrWhitespace(userRegistration.lastName)) {
        return "Your last name must be filled";
      }
      if (isNullOrWhitespace(userRegistration.email)) {
        return "Your email must be filled";
      }
      if (isNullOrWhitespace(userRegistration.password)) {
        return "Your password must be filled";
      }

      if (userRegistration.confirmPassword != userRegistration.password) {
        return "Your password does not match";
      }

      if (userRegistration.confirmAgreement === false) {
        return "You must agree before continuing";
      }

      return await handleRegisterAsync();
    } else {
      return null;
    }
  };

  function Signout() {
    authService.signOutAsync().then(() => navigate({ to: "/auth/login" }));
  }

  return (
    <section className="h-screen bg-white dark:bg-gray-900 lg:py-0">
      <div className="grid h-screen max-md:grid-rows-[auto_1fr_auto] lg:grid-cols-2">
        <div className="hidden bg-primary-600 max-md:block">
          <a href="#" className="mb-4 flex items-center text-2xl font-semibold text-white ">
            <img src={polLogo} />
          </a>
        </div>
        <div className="mx-auto flex h-full w-full items-center md:px-8 xl:px-0">
          <div className="w-full">
            <PolHeading className="text-center">Create Account</PolHeading>
            <p className="text-center text-sm font-medium text-gray-900 dark:text-white">
              Have an account?&nbsp;
              <a
                onClick={Signout}
                className="cursor-pointer font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign In
              </a>
            </p>
            <MultiForm
              onNavigateStep={(step) => setCanGoForward(step < 1)}
              startingStepIndex={startingStep}
              canGoForward={canGoForward}
              canGoBack={false}
              validateStep={validateSteps}
              onSuccess={handleRegisterAsync}
              views={[
                [
                  "Account Info",
                  <PersonalInfoView userRegistration={userRegistration} setUserRegistration={setUserRegistration} />,
                ],
                ["Verify", <EmailVerificationView canGoForward={canGoForward} setCanGoForward={setCanGoForward} />],
                ["Organization", <UserOrganizationView />],
              ]}
            ></MultiForm>
          </div>
        </div>
        <AuthLoginBanner></AuthLoginBanner>
      </div>
    </section>
  );
}
