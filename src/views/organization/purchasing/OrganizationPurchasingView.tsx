import PolText from "@/components/polComponents/PolText";
import PaymentForm from "@/components/stripe/PaymentForm";
import { useAuth } from "@/customHooks/auth";
import { HttpRequestHandler } from "@/sdk/services/Http/HttpRequestHandler";
import { getService } from "@/sdk/services/serviceProvider";
import { PaymentMethod } from "@stripe/stripe-js";
import { useState } from "react";

interface Props {
  goBack: () => void | Promise<void>;
}

export default function OrganizationPurchasingView({ goBack }: Props) {
  const { identity } = useAuth();

  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribe = async (paymentMethod: PaymentMethod) => {
    const httpHandler = getService(HttpRequestHandler);
    var result = await httpHandler.postAsync("subscription/register", {
      Email: identity.email,
      PaymentMethodId: paymentMethod.id,
    });
    if (result.isSuccess()) {
      setIsSubscribed(true);
    }
  };
  return isSubscribed ? (
    <div className="grid grid-flow-row">
      <PolText>
        Your organization is now active! Go <a ref="/">Home</a>
      </PolText>
    </div>
  ) : (
    <div>
      <PaymentForm onPaymentMethodFound={subscribe} />
    </div>
  );
}
