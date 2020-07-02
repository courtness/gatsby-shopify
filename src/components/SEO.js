import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        description
        keywords
        title
        titleTemplate
        twitterUsername
        url
      }
    }
  }
`;

const SEO = ({
  customDescription,
  customKeywords,
  customTitle,
  noindex,
  path
}) => {
  if (noindex) {
    return (
      <Helmet>
        <html lang="en" />
        <meta name="robots" content="noindex" />
      </Helmet>
    );
  }

  return (
    <StaticQuery
      query={query}
      render={({
        site: {
          siteMetadata: {
            description,
            image,
            keywords,
            title,
            titleTemplate,
            twitterUsername,
            url
          }
        }
      }) => {
        const seo = {
          description:
            customDescription && customDescription !== ``
              ? customDescription
              : description,
          keywords:
            customKeywords && customKeywords !== `` ? customKeywords : keywords,
          image: `${url}${image}`,
          title: customTitle || title,
          url: `${url}/${path || ``}`
        };

        return (
          <Helmet title={seo.title} titleTemplate={titleTemplate}>
            <html lang="en" />

            <meta name="description" content={seo.description} />

            <meta name="image" content={seo.image} />

            {seo.keywords && <meta name="keywords" content={seo.keywords} />}

            {seo.url && <meta property="og:url" content={seo.url} />}

            {seo.title && <meta property="og:title" content={seo.title} />}

            {seo.description && (
              <meta property="og:description" content={seo.description} />
            )}

            {seo.image && <meta property="og:image" content={seo.image} />}

            <meta name="twitter:card" content="summary_large_image" />

            {twitterUsername && (
              <meta name="twitter:creator" content={twitterUsername} />
            )}

            {seo.title && <meta name="twitter:title" content={seo.title} />}

            {seo.description && (
              <meta name="twitter:description" content={seo.description} />
            )}

            {seo.image && <meta name="twitter:image" content={seo.image} />}
          </Helmet>
        );
      }}
    />
  );
};

SEO.defaultProps = {
  customDescription: null,
  customKeywords: null,
  customTitle: null,
  noindex: false,
  path: null
};

SEO.propTypes = {
  customDescription: PropTypes.string,
  customKeywords: PropTypes.string,
  customTitle: PropTypes.string,
  noindex: PropTypes.bool,
  path: PropTypes.string
};

export default SEO;
