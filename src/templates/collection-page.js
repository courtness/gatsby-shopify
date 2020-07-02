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

const CollectionPage = ({ data, location }) => {
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

      <Layout className="collection-page w-full relative">
        <DummyImage />

        <ProductGrid heading="Sample Collection" products={products} />

        <Newsletter />
      </Layout>

      <Footer />
    </>
  );
};

export default CollectionPage;

export const query = graphql`
  query CollectionPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
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
            }
          }
        }
      }
    }
  }
`;
