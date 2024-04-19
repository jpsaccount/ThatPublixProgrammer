import PolInput from "@/components/polComponents/PolInput";
import { Checkbox, Label } from "flowbite-react";
import { UserRegistration } from "./RegisterationPage";

export default function PersonalInfoView({
  userRegistration,
  setUserRegistration,
}: {
  userRegistration: UserRegistration;
  setUserRegistration: React.Dispatch<React.SetStateAction<UserRegistration>>;
}) {
  return (
    <div>
      <div className="my-6 grid gap-5 sm:grid-cols-2">
        <PolInput
          data-testid="firstNameInput"
          label="First Name"
          placeholder="Tim"
          value={userRegistration.firstName}
          onValueChanged={(value) => setUserRegistration((x) => ({ ...x, firstName: value }))}
        />
        <PolInput
          data-testid="lastNameInput"
          label="Last Name"
          placeholder="Linamen"
          value={userRegistration.lastName}
          onValueChanged={(value) => setUserRegistration((x) => ({ ...x, lastName: value }))}
        />
        <PolInput
          data-testid="emailInput"
          label="Email"
          placeholder="tim@polstudios.com"
          value={userRegistration.email}
          onValueChanged={(value) => setUserRegistration((x) => ({ ...x, email: value }))}
        />
        <PolInput
          data-testid="passwordInput"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={userRegistration.password}
          onValueChanged={(value) => setUserRegistration((x) => ({ ...x, password: value }))}
        />
        <PolInput
          data-testid="confirmPasswordInput"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          value={userRegistration.confirmPassword}
          onValueChanged={(value) => setUserRegistration((x) => ({ ...x, confirmPassword: value }))}
        />

        <PolInput
          data-testid="phoneNumberInput"
          label="Phone Number"
          type="tel"
          placeholder="+123 567 890"
          value={userRegistration.phoneNumber}
          onValueChanged={(value) => setUserRegistration((x) => ({ ...x, phoneNumber: value }))}
        />
      </div>
      <div className="mb-6 space-y-3">
        <div className="flex items-start">
          <div className="flex items-center gap-3">
            <Checkbox
              id="terms"
              checked={userRegistration.confirmAgreement}
              onClick={() =>
                setUserRegistration((x) => ({ ...x, confirmAgreement: !userRegistration.confirmAgreement }))
              }
            />
            <Label htmlFor="terms" className="text-gray-500 dark:text-gray-300">
              By signing up, you are creating a Portal One account, and you agree to Point of Light’s&nbsp;
              <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">
                Terms of Use
              </a>
              &nbsp;and&nbsp;
              <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">
                Privacy Policy
              </a>
              .
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
