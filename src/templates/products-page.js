/* eslint-disable react/prop-types */
// import { PropTypes } from "prop-types";

import React from "react";
import { graphql } from "gatsby";
import DummyImage from "~components/DummyImage";
import Footer from "~components/Footer";
import Layout from "~components/Layout";
import Newsletter from "~components/Newsletter";
import ProductGrid from "~components/ProductGrid";
import SEO from "~components/SEO";
import { parseProducts } from "~utils/shopify";

const ProductsPage = ({ data, location }) => {
  const { frontmatter } = data.markdownRemark;

  const products = parseProducts(data);

  return (
    <>
      <SEO
        customTitle={frontmatter.title}
        customDescription={frontmatter.seoDescription}
        customKeywords={frontmatter.seoKeywords}
        path={location.pathname}
      />

      <Layout className="products-page w-full relative">
        <DummyImage />

        <ProductGrid heading="All Products" products={products} />

        <Newsletter />
      </Layout>

      <Footer />
    </>
  );
};

export default ProductsPage;

export const query = graphql`
  query ProductsPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
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
      }
    }
    allShopifyAdminProduct {
      edges {
        node {
          products {
            handle
            variants {
              alternative_id
              inventory_item_id
              title
            }
          }
        }
      }
    }
  }
`;
