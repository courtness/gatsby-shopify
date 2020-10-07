/* eslint-disable react/prop-types */
// import { PropTypes } from "prop-types";

import React from "react";
import { graphql } from "gatsby";
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

        <section className="grid pt-12 pb-24">
          <header className="grid-end-10">
            <h2 className="f2">A branded headline with on-point messaging</h2>
            <p className="mt-12 mb-16 f5">
              Digital branding is about finding the balance between
              forward-thinking and real-time reaction.
            </p>
          </header>

          <article className="grid-end-6">
            <h4 className="mb-3 f5">KEY MESSAGING 1</h4>
            <p className="b1">
              Just like your business, we see brands as a constant work in
              progress. Always testing. Always building. Always evolving. Always
              Beta. Ours is a constant, iterative and collaborative process of
              research, creation, building, testing, and improving. Investing
              enough time, energy, love and money to make sure you’re ready to
              grow.
            </p>
          </article>

          <article className="grid-end-6">
            <h4 className="mb-3 f5">KEY MESSAGING 2</h4>
            <p className="b1">
              Just like your business, we see brands as a constant work in
              progress. Always testing. Always building. Always evolving. Always
              Beta. Ours is a constant, iterative and collaborative process of
              research, creation, building, testing, and improving. Investing
              enough time, energy, love and money to make sure you’re ready to
              grow.
            </p>
          </article>
        </section>

        <ImageCTA heading="Product Category" subheading="Description copy" />
        <ImageCTA
          align="right"
          heading="Product Category"
          subheading="Description copy"
        />
        <ImageCTA heading="Product Category" subheading="Description copy" />

        <ProductGrid max={3} products={products} />

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
            image {
              childImageSharp {
                fluid(maxWidth: 1280, quality: 75) {
                  ...GatsbyImageSharpFluid_withWebp_noBase64
                }
              }
            }
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
