import polLogoDark from "@/assets/images/pol-logo-horizontal-dark.png";
import PolText from "@/components/polComponents/PolText";
import { useAuth } from "@/customHooks/auth";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { AuthService, AuthenticationResponse, RequestResponse } from "@/sdk";
import { isNullOrWhitespace } from "@/sdk/utils/stringUtils";
import { isUsable } from "@sdk/.//utils/usabilityUtils";
import diContainer from "@sdk/sdkconfig/SdkSetup";
import { useCallback, useEffect, useState } from "react";
import { AuthLoginBanner } from "./AuthLoginBanner";
import MultiFactorView from "./MultiFactorView";
import SignInView from "./SignInView";
import { useSearchParamState } from "@/customHooks/useSearchParamState";
import { useQueryClient } from "@tanstack/react-query";

export default function MainAuthPage() {
  const navigate = usePolNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries();
  }, []);

  const [currentPassword, setCurrentPassword] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [mfaContextId, setMfaContextId] = useState("");
  const [mfaAuthenticationType, setMfaAuthenticationType] = useState("");
  const [mfaModalIsShown, setMfaModalIsShown] = useState(false);
  const [mfaEmail, setMfaEmail] = useState("");
  const authService = diContainer.get(AuthService);
  const [redirect] = useSearchParamState("redirect", undefined);

  const [loginResponse, setLoginResponse] = useState<RequestResponse<AuthenticationResponse>>();
  const [customErrorMessage, setCustomErrorMessage] = useState("");

  const { user: auth } = useAuth();

  const onSuccessResponse = () => {
    if (redirect) navigate({ to: `/auth/active-organization`, search: { redirect } });
    else {
      navigate({ to: `/auth/active-organization` });
    }
  };
  useEffect(() => {
    if (auth) {
      onSuccessResponse();
    }
  }, []);

  const handleLoginAsync = async (email: string, password: string) => {
    if (email == "" || password == "") {
      setCustomErrorMessage("Your email or password was incorrect.");
      return;
    }
    setCurrentEmail(email);
    setCurrentPassword(password);

    setCustomErrorMessage("");

    const response = await authService.signInAsync(email, password);
    if (response.error) {
      setCustomErrorMessage(response.error.message);
      return;
    }
    onSuccessResponse();
  };

  useEffect(() => {
    const response = loginResponse?.data;
    if (isUsable(response) == false) return;

    if (!response.LoginSuccessful && response.MFAContextId === null) {
      return;
    }
    if (response.MFAContextId != null && response.MFAContextId !== mfaContextId) {
      setMfaContextId(response.MFAContextId);
      setMfaAuthenticationType(response.MfaAuthenticationType?.toString());
      setMfaEmail(response.CensoredMFAResource);
      setMfaModalIsShown(true);
    }
  }, [loginResponse]);

  const [mfaCodeIsLoading, setMfaCodeIsLoading] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const submitCode = useCallback(
    (mfaCode) => {
      setMfaCodeIsLoading(true);
      setCustomErrorMessage("");
      return authService
        .signInAsync(currentEmail, currentPassword)
        .then((response) => {
          setMfaCodeIsLoading(false);
        })
        .catch((x) => {
          setCustomErrorMessage(x.message);
        });
    },
    [
      authService,
      setCustomErrorMessage,
      setMfaCodeIsLoading,
      currentEmail,
      currentPassword,
      mfaContextId,
      mfaAuthenticationType,
    ],
  );

  let errorMessage = loginResponse?.error?.message ?? customErrorMessage;
  if (isNullOrWhitespace(errorMessage)) {
    errorMessage = loginResponse?.data?.LoginSuccessful == false ? loginResponse?.data?.Reason : "";
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="grid h-screen max-md:grid-rows-[auto_1fr_auto] lg:grid-cols-2">
        <div className="hidden  bg-primary-600 max-lg:block">
          <a href="#" className="mb-4 flex items-center text-2xl font-semibold text-white ">
            <img src={polLogoDark} className="mx-auto max-h-[10dvh]" />
          </a>
        </div>

        <div className="flex items-center justify-center px-4 py-24 sm:px-0 lg:py-0">
          <div className="grid w-1/2 min-w-96 max-w-md grid-flow-row grid-rows-[.2fr_.8fr_1fr_1fr_1fr_1fr] space-y-4 max-md:w-full md:space-y-6 xl:max-w-xl">
            <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">Portal One</h2>

            <PolText type="large" className="m-auto text-red-600 dark:text-red-900">
              {errorMessage}
            </PolText>

            {mfaModalIsShown ? (
              <MultiFactorView
                onSubmit={submitCode}
                isLoading={mfaCodeIsLoading}
                errorMessage={errorMessage}
                resourceName={mfaEmail}
              />
            ) : (
              <SignInView onSignIn={handleLoginAsync} errorMessage={errorMessage}></SignInView>
            )}
          </div>
        </div>

        <AuthLoginBanner></AuthLoginBanner>
      </div>
    </section>
  );
}
