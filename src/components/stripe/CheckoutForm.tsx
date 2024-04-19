import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { PolButton } from "../polComponents/PolButton";
import PolLoadingSection from "../polComponents/PolLoadingSection";
import PolText from "../polComponents/PolText";
import { stripePromise } from "@/sdk/stripe";

interface Props {
  clientSecret?: string;
}

const CheckoutForm = ({ clientSecret }: Props) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: clientSecret,
        // Fully customizable with appearance API.
        appearance: {
          /*...*/
        },
      }}
    >
      <CheckoutFormInner />
    </Elements>
  );
};

function CheckoutFormInner() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");

  const [isChargingPayment, setIsChargingPayment] = useState(false);
  const handleSubmit = (event) => {
    console.log("handling sumbit");
    setIsChargingPayment(true);
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const returnUrl = location.protocol + location.host + "/";

    console.log("return url", returnUrl);

    stripe
      .confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        redirect: "if_required",
      })
      .then((result) => {
        if (result.error) {
          // Show error to your customer (for example, payment details incomplete)
          setIsChargingPayment(false);

          setErrorMessage(result.error.message);
        } else {
          // Your customer will be redirected to your `return_url`. For some payment
          // methods like iDEAL, your customer will be redirected to an intermediate
          // site first to authorize the payment, then redirected to the `return_url`.
        }
      });
  };

  return (
    <PolLoadingSection isLoading={isChargingPayment}>
      <div className="grid grid-flow-row">
        <PolText className="mx-auto text-red-500">{errorMessage}</PolText>
        <PaymentElement />
        <PolButton type="button" onClick={handleSubmit} className="m-auto mt-5" disabled={!stripe}>
          Submit
        </PolButton>
      </div>
    </PolLoadingSection>
  );
}

export default CheckoutForm;
