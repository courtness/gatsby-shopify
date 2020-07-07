/* eslint-disable react/prop-types */

import React, { useContext, useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { graphql, Link } from "gatsby";
import { AppContext } from "~context/AppContext";
import BlogCTA from "~components/BlogCTA";
import Button from "~components/Button";
import DummyImage from "~components/DummyImage";
import Footer from "~components/Footer";
import Layout from "~components/Layout";
import ProductGrid from "~components/ProductGrid";
import Newsletter from "~components/Newsletter";
import SEO from "~components/SEO";
import Arrow from "~components/svg/Arrow";
import { pushProductEvent } from "~utils/analytics";
import {
  getCheckoutIdByVariantTitle,
  getProductByHandle,
  getSelectableOptions,
  parseProducts
} from "~utils/shopify";

const ProductPage = ({ data, location }) => {
  const { addToCart } = useContext(AppContext);

  const { allShopifyAdminProduct, markdownRemark } = data;
  const { frontmatter } = markdownRemark;
  const products = parseProducts(data);
  const product = getProductByHandle(frontmatter.shopifyHandle, products);
  const options = getSelectableOptions(product);

  const [addableProduct, setAddableProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  //

  const selectNewOption = (key, value) => {
    setSelectedOptions({
      ...selectedOptions,
      [key]: value
    });
  };

  const setCheckoutId = variant => {
    if (!product) {
      return;
    }

    const productClone = JSON.parse(JSON.stringify(product));

    productClone.checkoutId = getCheckoutIdByVariantTitle(
      allShopifyAdminProduct.edges,
      productClone.handle,
      variant.title
    );

    productClone.variant = variant;

    setAddableProduct(productClone);
  };

  //----------------------------------------------------------------------------
  //
  // onload hook

  useEffect(() => {
    const parsedProduct = getProductByHandle(
      frontmatter.shopifyHandle,
      products
    );

    const defaultVariant = parsedProduct.variants[0];
    const defaultSelectedOptions = {};

    defaultVariant.selectedOptions.forEach(option => {
      defaultSelectedOptions[option.name] = option.value;
    });
    parsedProduct.variant = defaultVariant;

    pushProductEvent(parsedProduct, `productView`);
    setSelectedOptions(defaultSelectedOptions);
    setAddableProduct(parsedProduct);
  }, []);

  //----------------------------------------------------------------------------
  //
  // product initialisation hook

  useEffect(() => {
    if (!product || product.checkoutId) {
      return;
    }

    setCheckoutId(product.variant);
  }, [product]);

  //----------------------------------------------------------------------------
  //
  // option update hook

  useEffect(() => {
    if (!product) {
      return;
    }

    let matchedVariant;

    product.variants.forEach(variant => {
      if (matchedVariant) {
        return;
      }

      const maximumOptionScore = variant.selectedOptions.length;
      let matchedOptionScore = 0;

      variant.selectedOptions.forEach(variantSelectedOption => {
        if (matchedVariant) {
          return;
        }

        Object.keys(selectedOptions).forEach(userSelectedOptionKey => {
          if (
            variantSelectedOption.name === userSelectedOptionKey &&
            variantSelectedOption.value ===
              selectedOptions[userSelectedOptionKey]
          ) {
            matchedOptionScore += 1;
          }
        });
      });

      variant.matchedOptionScore = matchedOptionScore;

      if (matchedOptionScore === maximumOptionScore) {
        matchedVariant = variant;
      }
    });

    if (!matchedVariant) {
      let fallbackVariant;
      let maxMatchedOptionScore = -1;

      product.variants.forEach(variant => {
        if (variant.matchedOptionScore > maxMatchedOptionScore) {
          maxMatchedOptionScore = variant.matchedOptionScore;
          fallbackVariant = variant;
        }
      });

      matchedVariant = fallbackVariant;
    }

    if (matchedVariant) {
      setCheckoutId(matchedVariant);
    }
  }, [selectedOptions]);

  //

  return (
    <>
      <SEO
        customTitle={frontmatter.title}
        customDescription={frontmatter.seoDescription}
        customKeywords={frontmatter.seoKeywords}
        path={location.pathname}
      />

      <Layout className="product-page w-full relative">
        <section className="grid">
          {product && (
            <div className="animation-appear-left animation-delay-2 grid-end-4 xs:grid-end-12 grid-start-2 xs:grid-start-1 h-screen sticky xs:relative top-0 xs:top-auto left-0 xs:left-auto flex items-center justify-center">
              <article className="flex flex-col items-center">
                <Link
                  to="/products"
                  className="absolute top-0 left-0 flex mt-12"
                >
                  <Arrow className="w-3 mr-4" color="black" direction="<" />
                  <span>Back</span>
                </Link>

                <h1 className="w-full f1">{frontmatter.title}</h1>

                <h3 className="w-full mt-2 f3">${product.variants[0].price}</h3>

                <p className="w-full mt-8 b1">
                  {product.description.substring(0, 100)}...
                </p>

                {options && Object.keys(options).length > 0 && (
                  <ul className="w-full relative block">
                    {Object.keys(options).map(optionKey => {
                      const optionValues = options[optionKey];

                      let heading = optionKey;

                      if (optionKey.toLowerCase() === `color`) {
                        heading = `Colour`;
                      }

                      return (
                        <li key={optionKey} className="mt-6">
                          <select
                            className="product-page__select w-full relative block mt-1 cursor-pointer b1 text-black"
                            placeholder={heading}
                            onChange={e => {
                              selectNewOption(optionKey, e.target.value);
                            }}
                          >
                            {optionValues.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <Button
                  className="w-64 mt-12"
                  color="black"
                  onClick={() => addToCart(addableProduct, quantity)}
                  text="Add to cart"
                />
              </article>
            </div>
          )}

          {product && (
            <article className="animation-appear-right animation-delay-2 grid-end-6 xs:grid-end-12 grid-start-7 xs:grid-start-1">
              <figure className="square overflow-hidden border xs:mb-4">
                <img
                  className="w-full absolute transform-center"
                  src={product.images[0].originalSrc}
                  alt={product.handle}
                />
              </figure>
              <figure className="square overflow-hidden border xs:mb-4">
                <img
                  className="w-full absolute transform-center"
                  src={product.images[0].originalSrc}
                  alt={product.handle}
                />
              </figure>
              <figure className="square overflow-hidden border xs:mb-4">
                <img
                  className="w-full absolute transform-center"
                  src={product.images[0].originalSrc}
                  alt={product.handle}
                />
              </figure>
            </article>
          )}
        </section>

        <ProductGrid heading="Related Products" products={products} />

        <BlogCTA content="blogs are still good right" />

        <DummyImage />

        <Newsletter />
      </Layout>

      <Footer />
    </>
  );
};

ProductPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.shape({})
    })
  }).isRequired,
  location: PropTypes.shape({}).isRequired
};

export default ProductPage;

export const query = graphql`
  query ProductPage($handle: String!, $markdownId: String!) {
    markdownRemark(id: { eq: $markdownId }) {
      frontmatter {
        title
        shopifyHandle
        seoDescription
        seoKeywords
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { templateKey: { eq: "product-page" } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            shopifyHandle
          }
        }
      }
    }
    shopifyProduct(handle: { eq: $handle }) {
      id
      handle
      title
      description
      images {
        originalSrc
      }
      productType
      vendor
      variants {
        id
        sku
        title
        image {
          originalSrc
        }
        price
        selectedOptions {
          name
          value
        }
      }
    }
    allShopifyProduct {
      edges {
        node {
          id
          title
          description
          handle
          images {
            originalSrc
          }
          variants {
            id
            sku
            title
            image {
              originalSrc
            }
            price
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
    allShopifyAdminProduct {
      edges {
        node {
          products {
            alternative_id
            handle
            variants {
              alternative_id
              title
            }
          }
        }
      }
    }
  }
`;
