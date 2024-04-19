import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

export function HistoryBreadcrumbs() {
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb className="text-left">
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to="/">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <BreadcrumbItem key={name} isCurrentPage={isLast}>
            <BreadcrumbLink as={Link} to={routeTo}>
              {capitalizedName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
