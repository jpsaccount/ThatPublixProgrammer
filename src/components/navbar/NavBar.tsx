/* eslint-disable jsx-a11y/anchor-is-valid */
import { useSidebarContext } from "@/contexts/SidebarContext";
import { useAuth } from "@/customHooks/auth";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import useDevice from "@/customHooks/useDevice";
import usePolNavigate from "@/customHooks/usePOLNavigate";
import useThemeDetector from "@/customHooks/useThemeDetector";
import { cn } from "@/lib/utils";
import { AuthService } from "@/sdk";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import { getService } from "@/sdk/services/serviceProvider";
import { groupBy, sortBy } from "@/sdk/utils/arrayUtils";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { Notification } from "@sdk/entities/core/Notification";
import { Dropdown, Navbar } from "flowbite-react";
import { useCallback, useMemo, useState, type FC, useEffect } from "react";
import {
  HiArchive,
  HiBell,
  HiCog,
  HiCurrencyDollar,
  HiEye,
  HiInbox,
  HiLogout,
  HiOutlineTicket,
  HiShoppingBag,
  HiUserCircle,
  HiUsers,
  HiViewGrid,
} from "react-icons/hi";
import PolIcon from "../PolIcon";
import Scanner from "../Scanner";
import { PolRequestPresenter } from "../polComponents/PolRequestPresenter";
import PolText from "../polComponents/PolText";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { MenuToggle } from "./MenuToggle";
import NavBarPageItem from "./NavBarPageItem";
import UserProfilePicture from "./UserProfilePicture";
import polLogoDark from "@/assets/images/pol-logo-horizontal-dark.png";
import polLogo from "@/assets/images/pol-logo-horizontal-light.png";
import { Badge } from "@nextui-org/react";
import { useDbUpsert } from "@/customHooks/sdkHooks/useDbUpsert";
import moment from "moment";
import { hasCameraAsync } from "@/utilities/deviceUtils";

export default function PolNavbar({ className }: { className?: string }) {
  const { isOpen, isPageWithSidebar, setOpen } = useSidebarContext();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const navigate = usePolNavigate();

  const onScannerSuccess = useCallback((url: string) => {
    if (url) {
      var result = new URL(url);
      navigate({ to: result.pathname });
      setIsScannerOpen(false);
    }
  }, []);

  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    hasCameraAsync().then((hasCamera) => setHasCamera(hasCamera));
  }, []);
  const isSystemDarkTheme = useThemeDetector();

  return (
    <Navbar fluid className={cn(" w-[100dvw] bg-background-t-50 backdrop-blur-md", className)}>
      <div className="grid h-12 w-full px-5 pl-2 pr-2 md:pl-3 md:pr-7 ">
        <div className="my-auto flex h-[inherit]  items-center justify-between">
          <div className="flex h-[inherit] items-center">
            {isPageWithSidebar && <MenuToggle isOpen={isOpen} toggle={() => setOpen((x) => !x)} />}
            <Navbar.Brand className="h-full">
              <img alt="" src={isSystemDarkTheme ? polLogoDark : polLogo} className=" mr-auto max-h-full" />
            </Navbar.Brand>
            {/* <ScrollArea className="my-auto h-auto">
              <div className="flex flex-nowrap">
                {Array.from(navContext.currentCallStack).map((x, index) => {
                  return (
                    <>
                      {index > 0 && <span className="mx-1 my-auto">/</span>}
                      <a
                        className="hover:text-blue-900 cursor-pointer hover:drop-shadow-sm whitespace-nowrap my-auto"
                        onClick={() => navigate(x[0])}
                      >
                        {x[1]}
                      </a>
                    </>
                  );
                })}
              </div>
            </ScrollArea> */}
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              {hasCamera && (
                <button
                  onClick={() => setIsScannerOpen(!isOpen)}
                  className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
                >
                  <span className="sr-only">Search</span>
                  <PolIcon name="QrCode" className="h-6 w-6" />
                </button>
              )}
              <Notifications />
              {/* <AppDrawerDropdown /> */}
            </div>
            <UserDropdown />
          </div>
        </div>
      </div>
      <Scanner isOpen={isScannerOpen} onOpenChange={setIsScannerOpen} onSuccess={onScannerSuccess} />
    </Navbar>
  );
}

const Notifications: FC = function () {
  const { user } = useAuth();
  const upsertNotification = useDbUpsert(Notification);
  const notificationRequest = useDbQuery(
    Notification,
    `WHERE c.RecipientUserId = "${user?.id}" OFFSET 0 LIMIT 100 ORDER BY c.CreatedDateTime DESC`,
    {
      enabled: isUsable(user),
      staleTime: 0,
      refetchInterval: 10000,
    },
  );

  const setNotificationsAsRead = () => {
    notificationRequest.data.map((x) => {
      upsertNotification.mutateAsync({ ...x, ReadOn: moment.utc() });
    });
  };

  const groupedNotifications = useMemo(
    () =>
      notificationRequest.data
        ? groupBy(sortBy(notificationRequest.data, "CreatedDateTime", true), "Topic")
        : new Map<any, Notification[]>(),
    [notificationRequest.data],
  );

  const amountUnread = useMemo(
    () => notificationRequest.data?.filter((x) => isUsable(x.ReadOn) === false).length,
    [notificationRequest.data],
  );

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="grid rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={setNotificationsAsRead}>
          <Badge isInvisible={amountUnread === 0} content={amountUnread} color="danger" className="mb-0">
            <PolIcon name="Bell" fill="black" />
          </Badge>
        </span>
      }
    >
      <div className="w-[24rem]">
        <div className="block rounded-t-xl px-4 py-2 text-center text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          Notifications
        </div>
        <div>
          <PolRequestPresenter
            request={notificationRequest}
            onFailure={() => (
              <div className="text-center">
                <PolText>No notifications loaded</PolText>
              </div>
            )}
            onLoading={() => <></>}
            onSuccess={() => (
              <div className="my-2 grid grid-flow-row">
                <Accordion collapsible type="single">
                  {notificationRequest.data.length === 0 ? (
                    <PolText className="text-center">No notifications loaded</PolText>
                  ) : (
                    Array.from(groupedNotifications.keys()).map((x) => {
                      return (
                        <AccordionItem key={x} value={x} className="grid grid-flow-row">
                          <AccordionTrigger className="px-5 text-left">
                            <PolText type="bold">
                              {groupedNotifications.get(x)[0].Title + ` (${groupedNotifications.get(x).length})`}
                            </PolText>
                          </AccordionTrigger>
                          <AccordionContent>
                            {groupedNotifications.get(x).map((noti) => (
                              <div className="grid cursor-pointer grid-flow-col space-x-5 border-b border-primary-500 bg-background-50 p-2 first:border-t hover:bg-background-100">
                                <PolText>{noti.Description}</PolText>
                                <PolText>{noti.CreatedDateTime.fromNow()}</PolText>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })
                  )}
                </Accordion>
              </div>
            )}
          />
        </div>
        <a
          href="#"
          className="block rounded-b-xl py-2 text-center text-base font-normal text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:underline"
        >
          <div className="inline-flex items-center gap-x-2">
            <HiEye className="h-6 w-6" />
            <span>View all</span>
          </div>
        </a>
      </div>
    </Dropdown>
  );
};

const NewMessageIcon: FC = function () {
  return (
    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
      <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
    </svg>
  );
};

const NewFollowIcon: FC = function () {
  return (
    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
    </svg>
  );
};

const NewLoveIcon: FC = function () {
  return (
    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

const NewMentionIcon: FC = function () {
  return (
    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

const NewVideoIcon: FC = function () {
  return (
    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
    </svg>
  );
};

const AppDrawerDropdown: FC = function () {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">Apps</span>
          <HiViewGrid className="text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
        </span>
      }
    >
      <div className="block rounded-t-lg border-b bg-background-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:border-b-gray-600 dark:bg-gray-700 dark:text-white">
        Apps
      </div>
      <div className="grid grid-cols-3 gap-4 p-4">
        <NavBarPageItem url="/projects" title="Projects" icon="Folder" />
        <a href="#" className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiShoppingBag className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Sales</div>
        </a>
        <a href="#" className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiUsers className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Users</div>
        </a>
        <a href="#" className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiInbox className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Inbox</div>
        </a>
        <a href="#" className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiUserCircle className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Profile</div>
        </a>
        <a href="#" className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiCog className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Settings</div>
        </a>
        <a href="#" className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiArchive className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Products</div>
        </a>
        <a href="#" className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiCurrencyDollar className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Pricing</div>
        </a>
        <a href="#" className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiOutlineTicket className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Billing</div>
        </a>
        <a href="#" className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600">
          <HiLogout className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-white" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">Logout</div>
        </a>
      </div>
    </Dropdown>
  );
};

const UserDropdown: FC = function () {
  const { user, hasAccess } = useAuth();
  const navigate = usePolNavigate();
  const authService = getService(AuthService);
  function Signout() {
    authService.signOutAsync().then(() => navigate({ to: "/auth/login" }));
  }

  function changeOrganization() {
    navigate({ to: "/auth/active-organization" });
  }

  function goToOrganization() {
    navigate({ to: "/organization" });
  }
  return (
    <>
      <style>
        {`
      .rounded-button{
        border-radius: 0 0 .75rem .75rem;
      }`}
      </style>
      <Dropdown
        className="z-[10000]"
        arrowIcon={false}
        inline
        label={
          <span>
            <span className="sr-only">User menu</span>
            <UserProfilePicture userId={user?.id} className="h-8 w-8" size="1rem" />
          </span>
        }
      >
        <Dropdown.Header>
          <span className="block text-sm">{getFullName(user?.Person)}</span>
          <span className="block truncate text-sm font-medium">{user?.Person.Emails[0]}</span>
        </Dropdown.Header>
        {hasAccess(AccessKeys.Owner) && <Dropdown.Item onClick={goToOrganization}>Your Organization</Dropdown.Item>}
        <Dropdown.Item>Dashboard</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={changeOrganization}>Change Organization</Dropdown.Item>
        <Dropdown.Item className="rounded-button" onClick={Signout}>
          Sign out
        </Dropdown.Item>
      </Dropdown>
    </>
  );
};
