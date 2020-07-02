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
import {
  getCheckoutIdByVariantTitle,
  getProductByHandle,
  parseProducts
} from "~utils/shopify";

const ProductPage = ({ data, location }) => {
  const { addToCart } = useContext(AppContext);
  const { allShopifyAdminProduct, markdownRemark } = data;
  const { frontmatter } = markdownRemark;
  const [product, setProduct] = useState(null);
  const products = parseProducts(data);

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

    setProduct(productClone);
  };

  //

  useEffect(() => {
    const parsedProduct = getProductByHandle(
      frontmatter.shopifyHandle,
      parseProducts(data)
    );
    const defaultVariant = parsedProduct.variants[0];

    parsedProduct.variant = defaultVariant;

    setProduct(parsedProduct);
  }, []);

  useEffect(() => {
    if (!product || product.checkoutId) {
      return;
    }

    setCheckoutId(product.variant);
  }, [product]);

  const onSelectChange = e => {
    if (!e?.target?.value) {
      return;
    }

    setCheckoutId(JSON.parse(e.target.value));
  };

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
            <div className="animation-appear-left animation-delay-2 grid-end-4 grid-start-2 h-screen sticky top-0 left-0 flex items-center justify-center">
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

                <p className="w-full mt-8 b1">{product.description}</p>

                <select
                  className="w-full mt-4 border"
                  onChange={onSelectChange}
                >
                  {product.variants.map(variant => (
                    <option key={variant.id} value={JSON.stringify(variant)}>
                      {variant.title}
                    </option>
                  ))}
                </select>

                <Button
                  className="mt-12 px-20"
                  color="black"
                  onClick={() => addToCart(product, 1)}
                  text="Add to cart"
                />
              </article>
            </div>
          )}

          {product && (
            <article className="animation-appear-right animation-delay-2 grid-end-6 grid-start-7">
              <figure className="square overflow-hidden border">
                <img
                  className="w-full absolute transform-center"
                  src={product.images[0].originalSrc}
                  alt={product.handle}
                />
              </figure>
              <figure className="square overflow-hidden border">
                <img
                  className="w-full absolute transform-center"
                  src={product.images[0].originalSrc}
                  alt={product.handle}
                />
              </figure>
              <figure className="square overflow-hidden border">
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
      title
      description
      handle
      images {
        originalSrc
      }
      productType
      vendor
      variants {
        id
        title
        image {
          originalSrc
        }
        price
        selectedOptions {
          name
          value
        }
        sku
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
            title
            image {
              originalSrc
            }
            price
            selectedOptions {
              name
              value
            }
            sku
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
