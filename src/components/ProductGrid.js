import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

const ProductGrid = ({ heading, max, products, subheading }) => {
  let renderedProducts = products;

  if (max) {
    renderedProducts = products.slice(0, max);
  }

  return (
    <section className="w-full relative pt-24 pb-24">
      <header className="grid">
        <h3 className="grid-end-12 f5">{heading}</h3>
        <h3 className="grid-end-12 mt-1 mb-6 b1">{subheading}</h3>
      </header>

      {renderedProducts?.[0] && (
        <ul className="grid">
          {renderedProducts.map(product => (
            <li
              key={product.handle}
              className="grid-end-4 xs:grid-end-12 mb-8"
              style={{ border: `1px solid rgba(0, 0, 0, 0.25)` }}
            >
              <Link to={product.slug}>
                <figure className="square overflow-hidden">
                  <img
                    className="w-full absolute transform-center"
                    src={product.images[0].originalSrc}
                    alt={product.handle}
                  />
                </figure>

                <div className="p-3">
                  <h2 className="f5">{product.frontmatter.title}</h2>
                  <h2 className="f5">${product.variants[0].price}</h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

ProductGrid.defaultProps = {
  heading: `Product Category`,
  max: null,
  subheading: `Introductory description of the product category`
};

ProductGrid.propTypes = {
  heading: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  max: PropTypes.number,
  subheading: PropTypes.string
};

export default ProductGrid;
