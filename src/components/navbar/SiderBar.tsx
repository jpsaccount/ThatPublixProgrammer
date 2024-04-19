/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from "classnames";
import { Sidebar } from "flowbite-react";

import { useSidebarContext } from "@/contexts/SidebarContext";
import { AccessKeys } from "@/sdk/enums/AccessKeys";
import BottomMenu from "./BottomMenu";
import NavBarPageItem from "./NavBarPageItem";

export default function PolSidebar({ className }: { className?: string }) {
  const { isOpen } = useSidebarContext();

  return (
    <div
      className={classNames("lg:!block", {
        hidden: !isOpen,
      })}
    >
      <Sidebar className="h-full" aria-label="Sidebar with multi-level dropdown example" collapsed={!isOpen}>
        <div className="flex h-full flex-col justify-between py-2">
          <div>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <NavBarPageItem url="/" title="Home" icon="Globe" userAccess={AccessKeys.User} />

                <NavBarPageItem url="/clients" title="Clients" icon={"Users"} userAccess={AccessKeys.ProjectAdmin} />
                <NavBarPageItem
                  url="/projects"
                  title="Projects"
                  icon={"FolderKanban"}
                  userAccess={AccessKeys.ProjectAdmin}
                />
                <NavBarPageItem
                  url="/fixtures"
                  title="Fixtures"
                  icon={"GalleryVerticalEnd"}
                  userAccess={AccessKeys.FixtureCatalog}
                />
                <NavBarPageItem
                  url="/project-databases"
                  title="Project Database"
                  icon={"Database"}
                  userAccess={AccessKeys.ProjectDatabase}
                />

                <NavBarPageItem title="Timesheet" icon="Calendar" url="/timesheet" userAccess={AccessKeys.Timesheet} />
                <NavBarPageItem
                  title="Expense Reports"
                  icon="Receipt"
                  url="/expense"
                  userAccess={AccessKeys.ExpenseReport}
                />
                <NavBarPageItem title="Invoices" icon="DollarSign" url="/invoices" userAccess={AccessKeys.Invoicing} />
                <NavBarPageItem title="Location" icon="LocateFixed" url="/location" userAccess={AccessKeys.Owner} />
              </Sidebar.ItemGroup>

              {/* <Sidebar.ItemGroup>
                <Sidebar.Item href="https://github.com/themesberg/flowbite-react/" icon={HiClipboard}>
                  Docs
                </Sidebar.Item>
                <Sidebar.Item href="https://flowbite-react.com/" icon={HiCollection}>
                  Components
                </Sidebar.Item>
                <Sidebar.Item href="https://github.com/themesberg/flowbite-react/issues" icon={HiInformationCircle}>
                  Help
                </Sidebar.Item>
              </Sidebar.ItemGroup> */}
            </Sidebar.Items>
          </div>
          <BottomMenu />
        </div>
      </Sidebar>
    </div>
  );
}
