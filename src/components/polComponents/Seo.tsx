import { useContext, type FC, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
interface SeoProps {
  title?: string;
  description?: string;
}

export const Seo: FC<SeoProps> = (props) => {
  const { title, description } = props;

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
