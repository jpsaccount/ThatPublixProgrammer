import { loadStripe } from "@stripe/stripe-js";
import { isDev } from "./utils/devUtils";

export const stripePromise =
  isDev() &&
  loadStripe(
    "pk_test_51O9T8wL7xawsBatYPd1RuOZjgWML2da1Xi9FBvRW7l7MZfJ1Xjh9InKMJSizi6hdJU5u5k8vxIDSdLy9A1vYQ5hE00RIizoVUL",
  );
