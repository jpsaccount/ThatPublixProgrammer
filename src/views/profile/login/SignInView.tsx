import { PolButton } from "@/components/polComponents/PolButton";
import PolInput from "@/components/polComponents/PolInput";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { useState } from "react";

interface Props {
  errorMessage: string;
  onSignIn: (userName: string, password: string) => Promise<void>;
}

export default function SignInView({ onSignIn }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  var navigate = usePolNavigate();

  async function signIn() {
    if (isUsable(onSignIn) === false) return;
    setIsLoading(true);
    await onSignIn(username, password);
    setIsLoading(false);
  }
  return (
    <>
      <PolInput
        data-testid="email"
        id="email"
        label="Email"
        placeholder="name@company.com"
        type="email"
        value={username}
        onValueChanged={setUsername}
      />
      <PolInput
        id="password"
        label="Password"
        placeholder="••••••••"
        data-testid="password"
        type="password"
        value={password}
        onKeyUp={(e) => e.key === "Enter" && signIn()}
        onValueChanged={setPassword}
      />

      {/* <PolCheckbox className="w-full" aria-describedby="terms-description">
          <PolText type="muted" className="text-gray-500 dark:text-gray-300 text-wrap flex flex-wrap">
          By signing up, you are creating a Flowbite account, and you agree to Flowbite’s&nbsp;
          <a className=" text-primary-600 hover:underline dark:text-primary-500" href="#">
              Terms of Use
              </a>
              &nbsp;and&nbsp;
              <a className=" text-primary-600 hover:underline dark:text-primary-500" href="#">
              Privacy Policy
              </a>
              .
              </PolText>
            </PolCheckbox> */}

      <PolButton data-testid="loginButton" isLoading={isLoading} className="w-full" onClick={signIn}>
        Login
      </PolButton>
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        Need an account?&nbsp;
        <a
          onClick={() => navigate({ to: "/auth/register" })}
          className="cursor-pointer font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Sign up
        </a>
      </p>
    </>
  );
}
