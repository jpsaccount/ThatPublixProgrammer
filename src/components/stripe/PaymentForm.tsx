import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { PaymentMethod } from "@stripe/stripe-js";
import { PolButton } from "../polComponents/PolButton";
import { stripePromise } from "@/sdk/stripe";

interface Props {
  onPaymentMethodFound: (paymentMethod: PaymentMethod) => any;
}

export default function PaymentForm({ ...props }: Props) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner {...props} />
    </Elements>
  );
}
function PaymentFormInner({ onPaymentMethodFound }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      // You can now use paymentMethod.id to handle the payment method on the server
    }
    if (onPaymentMethodFound) {
      var result = onPaymentMethodFound(paymentMethod);
      await Promise.resolve(result);
    }
  };

  return (
    <div>
      <CardElement />
      <PolButton type="button" onClick={handleSubmit} disabled={!stripe}>
        Subscribe
      </PolButton>
    </div>
  );
}
