import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

const CollectionGrid = ({ heading, collections }) => {
  return (
    <section className="w-full relative pt-24 pb-24">
      <header className="grid">
        <h3 className="grid-end-12 mb-12 f3">{heading}</h3>
      </header>

      {collections?.[0] && (
        <section className="w-full relative">
          <ul className="grid">
            {collections.map((collection, collectionIndex) => {
              const key = `collection-${collectionIndex}`;

              return (
                <li key={key} className="grid-end-4 relative block">
                  <Link to={collection.fields.slug}>
                    <figure className="square border">
                      <img
                        className="w-full absolute transform-center opacity-0"
                        src="/images/site-image.svg"
                        alt="Placeholder"
                      />
                    </figure>

                    <h2 className="mt-4 f5">{collection.frontmatter.title}</h2>
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

CollectionGrid.defaultProps = {
  heading: `Collections`
};

CollectionGrid.propTypes = {
  heading: PropTypes.string,
  collections: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default CollectionGrid;
