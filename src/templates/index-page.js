/* eslint-disable react/prop-types */
// import { PropTypes } from "prop-types";

import React from "react";
import { graphql } from "gatsby";
import BlogCTA from "~components/BlogCTA";
import DummyImage from "~components/DummyImage";
import Footer from "~components/Footer";
import ImageCTA from "~components/ImageCTA";
import Layout from "~components/Layout";
import Newsletter from "~components/Newsletter";
import ProductGrid from "~components/ProductGrid";
import SEO from "~components/SEO";
import { parseProducts } from "~utils/shopify";

const IndexPage = ({ data, location }) => {
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

      <Layout className="index-page w-full relative">
        <DummyImage />

        <section className="w-full relative flex items-center justify-center pt-32 pb-32">
          <article className="text-center">
            <h2 className="f2">such brand</h2>
            <p className="mt-12 f5">so content, much words.</p>
          </article>
        </section>

        <ImageCTA content="very image" />
        <ImageCTA align="right" content="what a moment" />
        <ImageCTA content="wow still going" />

        <ProductGrid max={3} products={products} />

        <BlogCTA content="blogs are still good right" />

        <DummyImage />

        <Newsletter />
      </Layout>

      <Footer />
    </>
  );
};

export default IndexPage;

export const query = graphql`
  query IndexPage($id: String!) {
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
