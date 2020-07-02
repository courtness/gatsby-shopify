import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

const ArticleGrid = ({ articles, heading }) => {
  return (
    <section className="w-full relative pt-24 pb-24">
      <header className="grid">
        <h3 className="grid-end-12 mb-12 f3">{heading}</h3>
      </header>

      {articles?.[0] && (
        <section className="w-full relative">
          <ul className="grid">
            {articles.map((article, articleIndex) => {
              const key = `article-${articleIndex}`;

              return (
                <li key={key} className="grid-end-4 relative block">
                  <Link to={article.fields.slug}>
                    <figure className="square border">
                      <img
                        className="w-full absolute transform-center opacity-0"
                        src="/images/site-image.svg"
                        alt="Placeholder"
                      />
                    </figure>

                    <h2 className="mt-4 f5">{article.frontmatter.title}</h2>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </section>
  );
};

ArticleGrid.defaultProps = {
  heading: `Blog`
};

ArticleGrid.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  heading: PropTypes.string
};

export default ArticleGrid;
