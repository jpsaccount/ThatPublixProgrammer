import { PolButton } from "@/components/polComponents/PolButton";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import type { FC } from "react";

export default function NotFoundView() {
  const navigate = usePolNavigate();
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="pFx-4 mx-auto max-w-screen-xl py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary-600 dark:text-primary-500 lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            Something's missing.
          </p>
          <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">
            Sorry, we can't find that page. You'll find lots to explore on the home page.
          </p>
          <PolButton variant="ghost" className=" inline-flex" onClick={() => navigate({ to: "/" })}>
            Back to Homepage
          </PolButton>
        </div>
      </div>
    </section>
  );
}
