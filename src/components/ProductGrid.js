import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";

const ProductGrid = ({ heading, products }) => {
  return (
    <section className="w-full relative pt-24 pb-24">
      <header className="grid">
        <h3 className="grid-end-12 mb-12 f3">{heading}</h3>
      </header>

      {products?.[0] && (
        <ul className="grid">
          {products.map(product => (
            <li key={product.handle} className="grid-end-4">
              <Link to={product.slug}>
                <figure className="square overflow-hidden">
                  <img
                    className="w-full absolute transform-center border"
                    src={product.images[0].originalSrc}
                    alt={product.handle}
                  />
                </figure>

                <h2 className="mt-2 f5">{product.title}</h2>
                <h2 className="mt-2 f5">${product.variants[0].price}</h2>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

ProductGrid.defaultProps = {
  heading: `Products`
};

ProductGrid.propTypes = {
  heading: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default ProductGrid;
