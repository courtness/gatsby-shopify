/* eslint-disable react/prop-types */
// import { PropTypes } from "prop-types";

import React from "react";
import { graphql } from "gatsby";
import CollectionGrid from "~components/CollectionGrid";
import DummyImage from "~components/DummyImage";
import Footer from "~components/Footer";
import Layout from "~components/Layout";
import Newsletter from "~components/Newsletter";
import SEO from "~components/SEO";

const CollectionsPage = ({ data, location }) => {
  const { markdownRemark, allMarkdownRemark } = data;
  const { frontmatter } = markdownRemark;

  const collections = [];

  allMarkdownRemark.edges.forEach(({ node }) => {
    // processing...

    collections.push(node);
  });

  return (
    <>
      <SEO
        customTitle={frontmatter.title}
        customDescription={frontmatter.seoDescription}
        customKeywords={frontmatter.seoKeywords}
        path={location.pathname}
      />

      <Layout className="collections-page w-full relative">
        <DummyImage />

        <CollectionGrid collections={collections} />

        <Newsletter />
      </Layout>

      <Footer />
    </>
  );
};

export default CollectionsPage;

export const query = graphql`
  query CollectionsPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        seoDescription
        seoKeywords
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { templateKey: { eq: "collection-page" } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
