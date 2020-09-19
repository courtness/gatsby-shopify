import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image";
import PropTypes from "prop-types";

const ProductGrid = ({ max, products }) => {
  let renderedProducts = JSON.parse(JSON.stringify(products));

  if (max) {
    renderedProducts = products.slice(0, max);
  }

  return (
    <section className="product-grid w-full relative pt-12 pb-12">
      {renderedProducts?.[0] && (
        <ul className="grid">
          {renderedProducts.map(product => {
            let image = product.images[0].originalSrc;

            if (product?.frontmatter?.image.childImageSharp) {
              image = product.frontmatter.image.childImageSharp;
            }

            return (
              <li
                key={product.handle}
                className="grid-end-4 xs:grid-end-12 mb-8"
              >
                <Link to={product.slug}>
                  <div className="square overflow-hidden">
                    {(image?.fluid && (
                      <figure className="w-full absolute transform-center">
                        <Img
                          className="w-full relative block"
                          fluid={image.fluid}
                          alt={product.frontmatter.title}
                        />
                      </figure>
                    )) || (
                      <figure className="w-full absolute transform-center">
                        <img
                          className="w-full relative block"
                          src={product.images[0].originalSrc}
                          alt={product.handle}
                        />
                      </figure>
                    )}
                  </div>

                  <div className="p-3">
                    <h2 className="f5">{product.frontmatter.title}</h2>
                    <h2 className="f5">${product.variants[0].price}</h2>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

ProductGrid.defaultProps = {
  max: null
};

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  max: PropTypes.number
};

export default ProductGrid;
