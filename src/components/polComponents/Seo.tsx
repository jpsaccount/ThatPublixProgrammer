import { useContext, type FC, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import { NavContext } from "@/contexts/NavContext";
import { useRouter } from "@tanstack/react-router";

interface SeoProps {
  title?: string;
  description?: string;
}

export const Seo: FC<SeoProps> = (props) => {
  const { title, description } = props;

  const context = useContext(NavContext);
  const router = useRouter();

  useEffect(() => {
    context.setCurrentPage(title, router.latestLocation.pathname);
  }, [title, router.latestLocation.pathname]);

  const fullTitle = title ? title + " | POL Portal One" : "POL Portal One";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

Seo.propTypes = {
  title: PropTypes.string,
};
