import polLogoDark from "@/assets/images/pol-logo-horizontal-dark.png";
import { Avatar } from "flowbite-react";

export function AuthLoginBanner() {
  return (
    <div className="flex items-center justify-center bg-primary-600 px-4 py-6 sm:px-0 lg:py-0">
      <div className="max-w-lg lg:max-w-md xl:max-w-xl">
        <img src={polLogoDark} className="max-lg:hidden" />
        <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-white xl:text-5xl">
          Creating extrodinary stories with lights.
        </h1>
        <p className="mb-4 text-primary-200 lg:mb-8">
          Millions of lighting designers and agencies around the world could seriously benefit from this app!
        </p>
        <div className="flex items-center divide-x divide-primary-500">
          <Avatar.Group className="pr-6">
            <Avatar
              img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
              rounded
              stacked
            />
            <Avatar img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png" rounded stacked />
            <Avatar
              img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png"
              rounded
              stacked
            />
            <Avatar
              img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/thomas-lean.png"
              rounded
              stacked
            />
          </Avatar.Group>
          <a href="#" className="pl-3 text-white dark:text-white sm:pl-5">
            <span className="text-sm text-primary-200">
              Over <span className="font-medium text-white">1</span>
              &nbsp;Happy Customers
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
