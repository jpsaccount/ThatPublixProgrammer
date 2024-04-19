import { connect, machine } from "@zag-js/pin-input";
import { normalizeProps, useMachine } from "@zag-js/react";
import { getAuth, reload, sendEmailVerification } from "firebase/auth";
import React, { SetStateAction, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function EmailVerificationView({
  canGoForward,
  setCanGoForward,
}: {
  canGoForward?: boolean;
  setCanGoForward?: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [state, send] = useMachine(
    machine({
      id: "1",
      otp: true,
      blurOnComplete: true,
      onValueComplete(details) {},
    }),
  );

  const [user] = useAuthState(getAuth());

  useEffect(() => {
    const checkEmailVerification = () => {
      if (user) {
        reload(user)
          .then(() => {
            if (user.emailVerified) {
              setCanGoForward && setCanGoForward(true);
            } else {
              setTimeout(checkEmailVerification, 3000); // Check again after 30 seconds
            }
          })
          .catch((error) => {});
      }
    };

    checkEmailVerification();
  }, [user]);

  useEffect(() => {
    setCanGoForward && setCanGoForward(false);

    if (user && user.emailVerified == false) sendEmailVerification(user);
  }, [user]);

  useEffect(() => {
    if (user.emailVerified) {
      setCanGoForward && setCanGoForward(true);
    }
  }, [user?.emailVerified]);

  const api = connect(state, send, normalizeProps);

  return user?.emailVerified ? (
    <div className="grid h-48 grid-flow-row">
      <h1 className="leding-tight mb-2 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Verify your email address
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        Your email &nbsp;
        <span className="font-medium text-gray-900 dark:text-white">{user.email} </span>
        has been verified
      </p>
    </div>
  ) : (
    <div className="grid h-48 grid-flow-row">
      <h1 className="leding-tight mb-2 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Verify your email address
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        We emailed you a verfication link to&nbsp;
        <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
      </p>

      <p className="bg-secondary-50dark:text-gray-400 mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500 md:mb-6">
        Make sure to keep this window open while checking your inbox.
      </p>
    </div>
  );
}
